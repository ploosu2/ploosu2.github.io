

class RootNode extends Node {
    constructor(node) {
        super();
        this.child = node;
        this.child.parent = this;
    }
    
    toString() {
        return this.child.toString();
    }
    
    toMathJaxString() {
        return this.child.toMathJaxString();
    }
    
    simplify() {
        let counter = 0;
        while(this.child.simplify() && ++counter<100);
        if (counter>=100) console.warn("iteration limit reached in simplification of "+this);
    }
    
    replaceChild(oldNode, newNode) {
        if (this.child===oldNode) {
            this.child.parent = null;
            this.child = newNode;
            this.child.parent = this;
        }
    }
    
    getDerivative() {
        if (this.child) return this.child.getDerivative();
    }
    
    getValue(x) {
        if (this.child) return this.child.getValue(x);
    }
    
    clone() {
        return this.child.clone();
    }
    
    traverse(callback, order=Node.POST_ORDER) {
        this.child.traverse(callback, order);
    }
}




class OpTree {
    constructor(node) {
        this.root = new RootNode(node);
    }
    
    toString() {
        return this.root.toString();
    }
    
    toMathJaxString() {
        return this.root.toMathJaxString();
    }
    
    simplify() {
        if (this.root) this.root.simplify();
    }
    
    getDerivative() {
        if (this.root) return this.root.getDerivative();
    }
    
    getValue(x) {
        if (this.root) return this.root.getValue(x);
    }
    
    clone() {
        return this.root.clone();
    }
    
    traverse(callback, order=Node.POST_ORDER) {
        this.root.traverse(callback, order);
    }
}








