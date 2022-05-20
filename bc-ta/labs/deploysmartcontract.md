# deploySmartContract

To deploy the smart contracts, do these steps for each peer, peers are identified as following : lab\_i.

cd lab\_i (i.e cd lab1) source lab\_i.sh (i.e source lab2.sh)

## package the chaincode

peer lifecycle chaincode package cc.tar.gz --lang node --path ./smartContracts --label cc\_0

## install the chaincode

peer lifecycle chaincode install cc.tar.gz

\--> the response from last command is the chaincode package ID, copy it.

## define package id

export PACKAGE\_ID=

## approve the chaincode deployument for this peer

peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name application -v 0 --package-id $PACKAGE\_ID --sequence j --tls --cafile $ORDERER\_CA

j : sequence depends on the deployment. for a first deployment it starts from 1, and increments. Do these steps for each peer. After the majority/all peers agreee and approve the chaincode (depends on the endorsment policy), commit the chaincode and deploy it :

## commit and deploy chaincode on peers

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0\_ORG1\_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0\_ORG2\_CA} --channelID mychannel --name application -v 0 --sequence j --tls --cafile $ORDERER\_CA --waitForEvent
