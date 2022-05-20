'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');


async function enrollUser(userName, caAdd,MSP, gatewayAdd) {
    try {
        // load the network configuration
        let connectionProfile = yaml.safeLoad(fs.readFileSync(gatewayAdd, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities[caAdd];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const userWalletPath = '../identity/user/'+userName+'/wallet';
        const walletPath = path.join(process.cwd(), userWalletPath);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const userExists = await wallet.get(userName);
        if (userExists) {
            console.log('An identity for this user already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSP,
            type: 'X.509',
        };
        await wallet.put(userName, x509Identity);
        console.log('Successfully enrolled the user and imported credentials into the wallet');
        return x509Identity;
        

    } catch (error) {
        console.error(`Failed to enroll user : ${error}`);
        process.exit(1);
    }
}
// GET

module.exports.root_get = (req, res) => {
    res.render('root');
}

module.exports.enroll_get = (req, res) => {
    res.render('enroll');
}


module.exports.enroll_post = async (req, res) => {

    try {
        console.log(req.body);
        
        if (req.body.ca == 'ca1'){
            let enrollment = await enrollUser(req.body.username,'ca.org1.example.com','Org1MSP','../../labs/lab1/gateway/connection-org1.yaml');
            console.log(enrollment);
            res.render('enrollSuccess',{username:req.body.username, labid:req.body.labid,msp:enrollment.mspId,pubKey:enrollment.credentialscertificate});
                }

        if (req.body.ca == 'ca2'){
            let enrollment = await enrollUser(req.body.username,'ca.org2.example.com','Org2MSP','../../labs/lab2/gateway/connection-org2.yaml');
            console.log(enrollment);
            const message = 'test';
            res.render('enrollSuccess',{username:req.body.username, labid:req.body.labid,msp:enrollment.mspId,pubKey:enrollment.credentials.certificate,message:message});
        }        

    }catch(error){
        res.render('enroll',{errorMessage:"Failed to register user. Try again."});
        console.error(`Failed to enroll user : ${error}`);
        process.exit(1);
    }

    
}

