// signing the smart contract :
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const researcher = require('../../../labs/lab1/smartContracts/lib/utils/researcher');

async function signForm(researcherName,labid){

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
        const signResponse = await formSignContract.submitTransaction('signForm',researcherName,labid);
        console.log(signResponse);
        let signedResearcher = researcher.fromBuffer(signResponse);
        console.log(signedResearcher);
        return signedResearcher;


}catch(error){
    console.log(`Error. ${error}`);
    console.log(error.stack);
}finally {
    console.log('Disconnect from Fabric gateway.');
    gateway.disconnect();
}
}

// GET

module.exports.sign_get = (req, res) => {
    res.render('sign');
}

// POST

module.exports.sign_post = async (req, res) => {
    let signature = await signForm('monta','1234');
    console.log(signature);
    res.send(signature);
}