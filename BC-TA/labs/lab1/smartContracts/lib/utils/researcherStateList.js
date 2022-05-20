'use strict';

const StateList = require('../../ledger-api/statelist.js');
const Resarcher = require('./researcher');

class ResearcherStateList extends StateList {
    constructor(ctx){
        super(ctx,'formsignature');
        this.use(Resarcher);
    }
    async addResearcherState(researcherState){
        return this.addState(researcherState);
    }
    async getResearcherState(ResearcherStatekey){
        return this.getState(ResearcherStatekey);
    }
    async updateResearcherState(ResearcherState){
        return this.updateState(ResearcherState);
    }
}

module.exports = ResearcherStateList;