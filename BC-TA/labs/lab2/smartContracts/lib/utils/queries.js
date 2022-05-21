class QueryUtils {

    constructor(ctx,listName){
        this.ctx = ctx;
        this.name = listName;
    }
    async getResearcher(name,labID){
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [name, labID]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let result = await this.getAllResults(resultsIterator, true);

        return result;
    }
    async queryByAdhoc(queryString){

        if (arguments.length < 1){
            throw new Error('Incorrect number of arguments, expecting a query string');
        }
        let self = this ;
        if (!queryString){
            throw new Error('A query string is required, empty query is not supported.')
        }
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }
    async getQueryResultForQueryString(ctx,self,queryString){

        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await self.getAllResults(resultsIterator, false);

        return results;
    }
    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {

                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);

                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } 
                    else {
                        try {
                            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                            switch (jsonRes.Value.currentState) {
                                case 1:
                                    jsonRes.Value.currentState = 'SIGNED';
                                    break;
                                case 2:
                                    jsonRes.Value.currentState = 'NOTSIGNED';
                                    break;
                                default:
                                    jsonRes.Value.currentState = 'UNKNOWN';
                            }

                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('iterator is done');
                await iterator.close();
                return allResults;
            }

        }  
    }
}

module.exports = QueryUtils;