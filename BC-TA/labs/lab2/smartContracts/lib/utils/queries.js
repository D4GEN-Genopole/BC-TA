class QueryUtils {

    constructor(ctx,listName){
        this.ctx = ctx;
        this.name = listName;
    }
    async getresearcher(name,labID){
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [name, labID]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let result = await this.getAllResults(resultsIterator, true);

        return result;
    }
}

module.exports = QueryUtils;