
"use strict";

const yaml = require('js-yaml');
const { Wallets, Gateway} = require('fabric-network');
const path = require("path");
const fs = require("fs");
const Violation = require('./models/violation');
var violationsDB =  process.env.VIOLATIONSDB;
var mongoose = require("mongoose");

mongoose.connect(violationsDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log(`mongoose connected to:${violationsDB}`);
});

let finished;
async function main() {
    try {
	const wallet = await Wallets.newFileSystemWallet('../identity/user/owner/wallet');

        const gateway = new Gateway();
        
        const userName = 'owner';

        let connectionProfile = yaml.safeLoad(fs.readFileSync('../labs/lab2/gateway/connection-org2.yaml', 'utf8'));

        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        await gateway.connect(connectionProfile, connectionOptions);
        const network = await gateway.getNetwork('mychannel');
        const shopContract = await network.getContract('datacontract','org.shadow.shopcontract'); 
        const listener =  async (event) => {
            if (event.eventName == 'declaring-violation-transaction'){
                console.log("####################################################################");
                console.log("look a violation was just declared! O.o");

                var transactionEvent = event.getTransactionEvent();
                var transactionDetails = transactionEvent.transactionData.actions[0];
                var transactionHeader = transactionDetails['header'];
                var MSPid = transactionHeader['creator']['mspid'];
                var transactionPayload = transactionDetails['payload'];
                var shopName = transactionPayload['chaincode_proposal_payload']['input']['chaincode_spec']['input']['args'][1].toString('utf-8');
                var shopRegistrationNumber = transactionPayload['chaincode_proposal_payload']['input']['chaincode_spec']['input']['args'][2].toString('utf-8');
                var TxID = transactionEvent['transactionId'];
                var writeSet = JSON.parse(transactionDetails["payload"]["action"]["proposal_response_payload"]["extension"]["results"]["ns_rwset"][1]["rwset"]["writes"][0]["value"].toString());
                var smartContract = event.chaincodeId;
                var eventName = event.eventName;
                var assetID = {shopName:shopName,shopRegistrationNumber:shopRegistrationNumber};

                const viol = new Violation({
                    TxID:TxID,
                    eventName:eventName,
                    smartContract:smartContract,
                    assetID:assetID,
                    creator:MSPid,
                    blockchainWriteSet:writeSet
                });
                await viol.save(function(err,doc){
                    if (err){
                        console.log(err);
                    }
                    console.log("Entry inserted successefully.");
                });
                console.log(viol);
            }
        };
        await shopContract.addContractListener(listener);
        finished = false;
        while (!finished){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        gateway.disconnect();
    }
    catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
}
void main();