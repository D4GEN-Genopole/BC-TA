const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const researcher = require('../../../labs/lab1/smartContracts/lib/utils/researcher');

async function getResearcherState(researcherName,labid){

    const wallet = await Wallets.newFileSystemWallet('../identity/user/test/wallet');
    const gateway = new Gateway();
    try{

        const userName = 'test';
        console.log('getting blockchain endpoints');
        console.log(process.cwd());
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../labs/lab1/gateway/connection-org1.yaml', 'utf8'));
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);
        console.log('Connect to channel.');
        const network = await gateway.getNetwork('mychannel');
        const formSignContract = await network.getContract('application','formsignatureContract');
        console.log('got contract');
        const queryResponse = await formSignContract.evaluateTransaction('getResearcherState',researcherName,labid);
        let researcherStateHistory = researcher.fromBuffer(queryResponse);
        let researcherState = researcherStateHistory[0].Value.currentState;
        return researcherState;
    }catch(error){
        console.log(`Error. ${error}`);
        console.log(error.stack);
        if (error == `TypeError: Cannot read property 'Value' of undefined`){
            return "BADID";
        }else{
            return "NOTSIGNED";
        }
    }finally {
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
    }

    async function getAuthDec(researcherName,labid){

        const wallet = await Wallets.newFileSystemWallet('../identity/user/test/wallet');
        const gateway = new Gateway();
        try{
    
            const userName = 'test';
            console.log('getting blockchain endpoints');
            console.log(process.cwd());
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../../labs/lab1/gateway/connection-org1.yaml', 'utf8'));
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled: true, asLocalhost: true }
    
            };
            console.log('Connect to Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);
            console.log('Connect to channel.');
            const network = await gateway.getNetwork('mychannel');
            const formSignContract = await network.getContract('application','formsignatureContract');
            console.log('got contract');
            const authResponse = await formSignContract.submitTransaction('authorizationDecision',researcherName,labid);
            console.log(authResponse);
            return authResponse;}
            catch(error){
                console.log(`Error. ${error}`);
                console.log(error.stack);
            }finally {
                console.log('Disconnect from Fabric gateway.');
                gateway.disconnect();
            }
            }

// GET

module.exports.data_access_get = (req, res) => {
    let authdec = 'approve';
    res.render('dataAccess', {authdec});
}


// POST

module.exports.data_access_post = async (req, res) => {
    // function to invoke authorization sc => authdec
    let authdec = '';
    let state = await getResearcherState('monta','0001234');
    //let auth = await getAuthDec('monta','1234');
    //console.log(auth);
    console.log(state);
    if (state == 'SIGNED'){
        authdec = 'approve';
    } 
    if (state == 'NOTSIGNED'){
        authdec = 'not_signed';
    }
    if (state == 'BADID'){
        authdec = 'bad_id';
    }
    
    res.render('dataAccess', {authdec});
}