
class VariableNode extends Node {
    constructor() {
        super();
        this.name = "x";
    }
    
    toString() {
        return this.name;
    }
    
    clone() {
        let ret = new VariableNode();
        ret.name = this.name;
        return ret;
    }
    
    getDerivative() {
        return new ConstantNode(1);
    }
    
    getValue(x) {
        return x;
    }
}