'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Researcher = require('./utils/researcher');
const ResearcherStateList = require('./utils/researcherStateList');
const QueryUtils = require('./utils/queries');



class ResearcherStateContext extends Context {

    constructor(){
        super();
        this.researcherStateList = new ResearcherStateList(this);
    }
}


class FormSignatureContract extends Contract {

    constructor() {
        super('formsignatureContract');
    }

    createContext(){
        return new ResearcherStateContext();
    }
    
    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
     async instantiate(ctx) {

        console.log('Instantiate the contract');
    }
    async signForm(ctx,researcherName,labID){

        let researcher = Researcher.createInstance(researcherName,labID);
        researcher.setSigned();
        await ctx.researcherStateList.addResearcherState(researcher);
        return researcher;

    }

    async getResearcherState(ctx,researcherName,labID){

        let query = new QueryUtils(ctx,'formsignature');
        let results = await query.getResearcherState(researcherName,labID);
        return results;


    }

}

module.exports = FormSignatureContract;