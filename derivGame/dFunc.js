

class DFunc {
    constructor(root) {
        if (root instanceof OpTree) {
            this.tree = root;
        } else if (root instanceof Node) {
            this.tree = new OpTree(root);
        } else {
            throw "Can't instanciate a DFunc with "+root;
        }
    }
    
    toString() {
        if (!this.tree) return "";
        return this.tree.toString();
    }
    
    toMathJaxString() {
        if (!this.tree) return "";
        return this.tree.toMathJaxString();
    }
    
    simplify() {
        if (this.tree) this.tree.simplify();
    }
    
    getDerivative() {
        if (this.tree) return new DFunc(this.tree.getDerivative());
    }

    getName() {
        if (!this.tree) return "";
        if (!this.tree || !this.tree.root
            || !this.tree.root.child
            || typeof this.tree.root.child.name !== "string") return "";
        return this.tree.root.child.name;
    }
    
    
    getValue(x) {
        if (this.tree) return this.tree.getValue(x);
    }
    
    clone() {
        if (!this.tree) return undefined;
        return new DFunc(this.tree.clone());
    }
}


DFunc.randomFuncName = ps=>getRandFrom(Node.FUNC_NAMES, ps);




DFunc.makeRandomPolyCoeffs = (maxDeg) => {
    let cs = new Array(randInt(2, maxDeg+1)).fill(0).map(()=>randInt(0, 10)-5);
    if (cs.slice(1).every(c=>c===0)) cs[1] = 1;
    return cs;
};

DFunc.makeRandPolynomial = (maxDeg) => {
    return new DFunc(Node.makePolynomialNode(DFunc.makeRandomPolyCoeffs(maxDeg)));
};

/** @param ps: probabilities for the base functions, as in list Node.FUNC_NAMES*/
DFunc.makeRandBaseFunction = (ps) => {
    return new DFunc(new FuncNode(DFunc.randomFuncName(ps), new VariableNode()));
};

DFunc.makeOperOfFuncs = (op, f1Name, f2Name, maxD1, maxD2) => {
    return new DFunc(Node.makeOperNodeOfFuncs(op, f1Name, f2Name, maxD1, maxD2));
};

DFunc.makePolyPower = (maxDeg, minPow=1, maxPow=1) => {
    let polyNode = Node.makePolynomialNode(DFunc.makeRandomPolyCoeffs(maxDeg));
    let ppNode = new OperNode('^', polyNode, new ConstantNode(randInt(minPow, maxPow)));
    return new DFunc(ppNode);
};

DFunc.makeCompoundFunc = (f1Name, f2Name) => {
    return new DFunc(new FuncNode(f1Name, new FuncNode(f2Name, new VariableNode())));
};

DFunc.makeCompoundWithPoly = (fName, maxDeg) => {
    let polyNode = Node.makePolynomialNode(DFunc.makeRandomPolyCoeffs(maxDeg));
    return new DFunc(new FuncNode(fName, polyNode));
};



/** Check if two functions are the same by first comparing their formulas (with toString())
and if that is indecive, then comparing their values at test points. */
DFunc.testEquality = (f1, f2, testN=20, tol=1e-6) => {
    if (f1.toString() === f2.toString()) return true;
    let goodTries = 0;
    let hadSameBadValues = 0; //for bad tries, were they similarly bad?!!
    let diff = 0;
    let [a, b] = [-5, 5]; //interval for test points
    for (let i=0; i<testN; i++) {
        let x = a+Math.random()*(b-a);
        let val1 = f1.getValue(x);
        let val2 = f2.getValue(x);
        let valDiff = val1-val2;
        if ((!Number.isNaN(valDiff))) {
            let absVal1 = Math.abs(val1);
            let absVal2 = Math.abs(val2);
            let diffAtX = Math.abs(valDiff);
            let relVal = Math.max(absVal1, absVal2);
            let diffIncr = relVal>1 ? diffAtX/relVal : diffAtX;
            diff += diffIncr;
            goodTries += 1;
        } else {
            //TODO how to move the interval to find where funcs defined
            if (val1===val2 || [val1, val2].every(v=>(Number.isNaN(v)))) {
                hadSameBadValues += 1;
            }
        }
    }
    if (goodTries>0) return diff/goodTries < tol;
};




DFunc.makeRandom = () => {
    let props = {
        nodeProbs: [1,1,1,1],
        opProbs: [1,1,1,1,1],
        funcProbs: [1,1,1,1],
        constantGetter: ()=>randInt(1, 9),
        minDepth: 2,
        maxDepth: 4,
    };
    return new DFunc(Node.makeRandomNode(props, 0));
};

/*
var a = new DFunc(new OperNode('^', Node.makePolynomialNode([4, -666]), new ConstantNode(2)));
//a.simplify();
console.log("a = "+a.toString());
var da = a.getDerivative();
da.simplify();
console.log("da = "+da.toString());
*/


