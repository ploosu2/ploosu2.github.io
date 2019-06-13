
class ConstantNode extends Node {
    constructor(val) {
        super();
        this.value = val;
    }
    
    toString() {
        return this.value.toString(10);
    }
    
    clone() {
        return new ConstantNode(this.value);
    }
    
    getDerivative() {
        return new ConstantNode(0);
    }
    
    getValue(x) {
        return this.value;
    }
}