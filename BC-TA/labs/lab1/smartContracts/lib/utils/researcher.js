'use-strict'
const State = require('../../ledger-api/state');

const researcherState = {

    SIGNED:1,
    NOTSIGNED:2

}

class Researcher extends State{

    constructor(obj){
        super(Researcher.getClass(), [obj.name,obj.labid]);
        Object.assign(this,obj);
    }

    // getters

    getResearcherUsername(){
        return this.name;
    }
    getLabid(){
        return this.labid;
    }

    // setters

    setSigned(){
        this.currentState = researcherState.SIGNED;
    }
    setNotSigned(){
        this.currentState = researcherState.NOTSIGNED;
    }

    // determine state

    isSigned(){
        this.currentState === researcherState.SIGNED;
    }
    isNotSigned(){
        this.currentState === researcherState.NOTSIGNED;
    }

    
    static fromBuffer(buffer){

        return Researcher.deserialize(buffer);
    }
    toBuffer(){

        return Buffer.from(JSON.stringify(this));
    }
    static deserialize(data){
        return State.deserializeClass(data, Researcher);
    }
    static createInstance(name,labid){
        return new Researcher({name,labid});
    }
    static getClass(){
        return 'formsignature';
    }

}

module.exports = Researcher;
