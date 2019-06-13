

class OperNode extends Node {
    constructor(op, first, second) {
        super();
        this.op = op;
        this.left = first;
        this.right = second;
        this.left.parent = this;
        this.right.parent = this;
        
        //swap constants always to left in products
        /* doesn't really help since the intermediate isn't simplified,
        need to check both ways in simplification (might need to check more deeply???)
        if (op==='*' && (second instanceof ConstantNode)) {
            [this.left, this.right] = [this.right, this.left];
        }
        */
    }
    
    toString() {
        return `(${this.left.toString()}${this.op}${this.right.toString()})`;
    }
    
    toMathJaxString() {
        let c1 = this.left.toMathJaxString();
        let c2 = this.right.toMathJaxString();
        
        switch (this.op) {
            case '+':
                return `${c1}${this.op}${c2}`;
            case '-':
                if (Node.needsParanthesisForSub(this.right)) {
                    return `${c1}${this.op}(${c2})`;
                } else {
                    return `${c1}${this.op}${c2}`;
                }
            case '*':
                if (this.left instanceof ConstantNode) {
                    if (this.left.value === 1) return c2;
                    if (this.left.value === -1) {
                        return "-" + (Node.needsParanthesisForMinus(c2) ? "("+c2+")" : c2);
                    }
                }
                let parants1 = Node.needsParanthesisForMul(this.left);
                let parants2 = Node.needsParanthesisForMul(this.right, true);
                let part1 = parants1 ? `(${c1})` : c1;
                let part2 = parants2 ? `(${c2})` : c2;
                if ((!(parants1&&parants2)) && Node.needsMultSign(this.left, this.right)) {
                    return `${part1}${this.op}${part2}`;
                } else {
                    return `${part1}${part2}`;
                }
            case '/':
                return `\\frac{${c1}}{${c2}}`;
            case '^':
                if (Node.needsBracesForBase(this.left)) {
                    return `(${c1})^{${c2}}`;
                } else {
                    return `${c1}^{${c2}}`;
                }
                
        };
    }
    
    replaceChild(oldNode, newNode) {
        for (let cName of ["left", "right"]) {
            if (this[cName]===oldNode) {
                this[cName].parent = null;
                this[cName] = newNode;
                newNode.parent = this;
            }
        }
    }
    
    
    simplifyProd() {
        let hadChanges = false;
        let leftIsConst = this.left instanceof ConstantNode;
        let rightIsConst = this.right instanceof ConstantNode;
        
         if (leftIsConst && this.left.value === 1) {
            this.parent.replaceChild(this, this.right);
            hadChanges = true;
        } else if (rightIsConst && this.right.value === 1) {
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        } else if (((leftIsConst && this.left.value === 0)
                    ||(rightIsConst && this.right.value === 0))) { //0*a=a*0 = 0
            this.parent.replaceChild(this, new ConstantNode(0));
            hadChanges = true;
        } else if (leftIsConst && (this.right instanceof OperNode) && this.right.op === '*'
                   && (this.right.left instanceof ConstantNode)) {
            let newFactor = new ConstantNode(this.left.value * this.right.left.value);
            this.parent.replaceChild(this, new OperNode('*', newFactor, this.right.right));
        } else if (leftIsConst && (this.right instanceof OperNode) && this.right.op === '*'
                   && (this.right.right instanceof ConstantNode)) {
            let newFactor = new ConstantNode(this.left.value * this.right.right.value);
            this.parent.replaceChild(this, new OperNode('*', newFactor, this.right.left));
        } else if (rightIsConst && (this.left instanceof OperNode) && this.left.op === '*'
                   && (this.left.left instanceof ConstantNode)) {
            let newFactor = new ConstantNode(this.right.value * this.left.left.value);
            this.parent.replaceChild(this, new OperNode('*', newFactor, this.left.right));
        } else if (rightIsConst && (this.left instanceof OperNode) && this.left.op === '*'
                   && (this.left.right instanceof ConstantNode)) {
            let newFactor = new ConstantNode(this.right.value * this.left.right.value);
            this.parent.replaceChild(this, new OperNode('*', newFactor, this.left.left));
        }
        
        return hadChanges;
    }
    
    simplify() {
        let hadChanges = false;
        for (let cName of ["left", "right"]) {
            if (this[cName].simplify()) hadChanges = true;
        }
        
        let leftIsConst = this.left instanceof ConstantNode;
        let rightIsConst = this.right instanceof ConstantNode;
        
        
        if ((this.left instanceof ConstantNode) && (this.right instanceof ConstantNode)) {
            let opFunc = Node.OPERS[this.op];
            let newNode = new ConstantNode(opFunc(this.left.value, this.right.value));
            this.parent.replaceChild(this, newNode);
            hadChanges = true;
        } else if (this.op==='*') {
            if (this.simplifyProd()) hadChanges = true;
        } else if (this.op==='+' && leftIsConst && this.left.value === 0) {
            this.parent.replaceChild(this, this.right);
            hadChanges = true;
        } else if (this.op==='+' && rightIsConst && this.right.value === 0) {
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        } else if (this.op==='-' && leftIsConst && this.left.value === 0) {
            this.parent.replaceChild(this, new OperNode('*', new ConstantNode(-1), this.right));
            hadChanges = true;
        } else if (this.op==='-' && rightIsConst && this.right.value === 0) {
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        } else if (this.op==='/' && rightIsConst && this.right.value === 1) {
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        } else if (this.op==='^' && leftIsConst
                   && (this.left.value === 0 || this.left.value === 1)) { //0^a = 0, 1^a = 1
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        } else if (this.op==='^' && rightIsConst && this.right.value === 0) { //a^0 = 1
            this.parent.replaceChild(this, new ConstantNode(1));
            hadChanges = true;
        } else if (this.op==='^' && rightIsConst && this.right.value === 1) { //a^1 = a
            this.parent.replaceChild(this, this.left);
            hadChanges = true;
        }
        
        return hadChanges;
    }
    
    clone() {
        return new OperNode(this.op, this.left.clone(), this.right.clone());
    }
    
    getDerivative() {
        let leftD = this.left.getDerivative();
        let rightD = this.right.getDerivative();
        let part1, part2;
        switch (this.op) {
            case '+':
                if (leftD instanceof ConstantNode && leftD.value===0) return rightD;
                if (rightD instanceof ConstantNode && rightD.value===0) return leftD;
                return new OperNode(this.op, leftD, rightD);
            case '-':
                if (leftD instanceof ConstantNode && leftD.value===0) {
                    return new OperNode('*', new ConstantNode(-1), rightD);
                }
                if (rightD instanceof ConstantNode && rightD.value===0) return leftD;
                return new OperNode(this.op, leftD, rightD);
            case '*':
                part1 = new OperNode('*', leftD, this.right.clone());
                part2 = new OperNode('*', this.left.clone(), rightD);
                return new OperNode('+', part1, part2);
            case '/':
                part1 = new OperNode('*', leftD, this.right.clone());
                part2 = new OperNode('*', this.left.clone(), rightD);
                let numerator = new OperNode('-', part1, part2);
                let denom = new OperNode('^', this.right.clone(), new ConstantNode(2));
                return new OperNode('/', numerator, denom);
            case '^':
                if (!(this.right instanceof ConstantNode)) {
                    throw "Derivation unsupported for power "+this.right;
                }
                let innerD = this.left.getDerivative();
                let newPower = new ConstantNode(this.right.value-1);
                let pFactor = new ConstantNode(this.right.value);
                let outer = new OperNode('^', this.left.clone(), newPower);
                return new OperNode('*', pFactor, new OperNode('*', outer, innerD));
        }
    }
    
    getValue(x) {
        return Node.OPERS[this.op](this.left.getValue(x), this.right.getValue(x));
    }
    
    traverse(callback, order=Node.POST_ORDER) {
        let parentFirst = order===Node.PRE_ORDER;
        let parentMiddle = order===Node.IN_ORDER;
        let parentLast = !parentFirst && !parentMiddle;
        if (parentFirst) callback(this);
        this.left.traverse(callback, order);
        if (parentMiddle) callback(this);
        this.right.traverse(callback, order);
        if (parentLast) callback(this);
    }
    
    
}
