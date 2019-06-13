
class FuncNode extends Node {
    constructor(fName, argNode) {
        super();
        this.name = fName;
        this.arg = argNode;
        this.arg.parent = this;
    }
    
    toString() {
        return `${this.name}(${this.arg.toString()})`;
    }
    
    toMathJaxString() {
        let argJax = this.arg.toMathJaxString();
        if (this.name==='exp') {
            return `e^{${argJax}}`;
        }
        return `\\${this.name}(${argJax})`;
    }
    
    replaceChild(oldNode, newNode) {
        if (this.arg===oldNode) {
            this.arg.parent = null;
            this.arg = newNode;
            newNode.parent = this;
        }
    }
    
    simplify() {
        return this.arg.simplify();
    }
    
    clone() {
        return new FuncNode(this.name, this.arg.clone());
    }
    
    getDerivative() {
        let inner = this.arg.getDerivative();
        if (inner instanceof ConstantNode && inner.value===0) return new ConstantNode(0);
        let argCopy = this.arg.clone();
        let outer;
        switch (this.name) {
            case 'exp':
                outer = new FuncNode('exp', argCopy);
                break;
            case 'ln':
                return new OperNode('/', inner, argCopy);
                break;
            case 'cos':
                outer = new OperNode('*', new ConstantNode(-1), new FuncNode('sin', argCopy));
                break;
            case 'sin':
                outer = new FuncNode('cos', argCopy);
                break;
            case 'tan':
                let denom = new OperNode('^', new FuncNode('cos', argCopy), new ConstantNode(2));
                return new OperNode('/', inner, denom);
                break;
        };
        return new OperNode('*', inner, outer);
    }
    
    getValue(x) {
        return Node.FUNCS[this.name](this.arg.getValue(x));
    }
    
    traverse(callback, order=Node.POST_ORDER) {
        let parentFirst = order===Node.PRE_ORDER;
        if (parentFirst) callback(this);
        this.arg.traverse(callback, order);
        if (!parentFirst) callback(this);
    }
}

