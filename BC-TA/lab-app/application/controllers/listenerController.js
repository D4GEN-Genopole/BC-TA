const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");
const fs = require("fs");

async function monitor(optionsType,firstBlock) {
    try {
        // Set up the wallet
	const wallet = await Wallets.newFileSystemWallet('../identity/user/owner/wallet');

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        
        const userName = 'owner';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../labs/lab2/gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // connect to the gateway
        await gateway.connect(connectionProfile, connectionOptions);
        // get the channel and smart contract
        const network = await gateway.getNetwork('mychannel');


        // Listen for blocks being added, display relevant contents: in particular, the transaction inputs
        var events = [];
        const listener = async (event) => {
            if (event.blockData !== undefined) {
                for (const i in event.blockData.data.data) {
                    if (event.blockData.data.data[i].payload.data.actions !== undefined) {
                        const inputArgs = event.blockData.data.data[i].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
                        const tx_id = event.blockData.data.data[i].payload.header.channel_header.tx_id;
                        const txTime = new Date(event.blockData.data.data[i].payload.header.channel_header.timestamp).toUTCString();
                        let inputData = 'Inputs: ';
                        for (let j = 0; j < inputArgs.length; j++) {
                            const inputArgPrintable = inputArgs[j].toString().replace(/[^\x20-\x7E]+/g, '');
                            inputData = inputData.concat(inputArgPrintable, ' ');
                        }
                        let keyData = 'Keys updated: ';
                        for (const l in event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes) {
                            keyData = keyData.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[l].key, ' ');
                        }
                        let endorsers = 'Endorsers: ';
                        for (const k in event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements) {
                            endorsers = endorsers.concat(event.blockData.data.data[i].payload.data.actions[0].payload.action.endorsements[k].endorser.mspid, ' ');
                        }
                        let listenerData = {
                            Block: parseInt(event.blockData.header.number),
                            TxID: tx_id,
                            TxTimeStamp: txTime,
                            TransactionData: inputData,
                            KeyUpdates: keyData,
                            Endorser: endorsers
                        };
                        events.push(listenerData);
                        //console.log(events);
                        

                        if ((event.blockData.metadata.metadata[2])[i] !== 0) {
                            console.log('INVALID TRANSACTION');
                        }
                    }
                }
            }
        };
        const options = {
            type: optionsType,
            startBlock: firstBlock
        };

        await network.addBlockListener(listener, options);
        await new Promise(resolve => setTimeout(resolve, 1000));
        gateway.disconnect();
        return events;
    }
    catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
}
module.exports.listener_get = (req,res) => {
    res.render('listener');
}

module.exports.listener_post = async (req,res) => {
    try{
        console.log(req.body);
        const blockchainEvents = await monitor('full',1);
        console.log(blockchainEvents);
        res.render('listenerT',{blockdata: blockchainEvents});
    }
    catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
}