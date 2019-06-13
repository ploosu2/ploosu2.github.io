

class DerivativeGame {
    constructor() {
        this.score = 1; //start with 1 point
        this.func;
        this.deriv;
        this.level = 1;
        this.minLevel = 1;
        this.maxLevel = 6;
        /*are the points to be given (or already given, or solution was revealed)*/
        this.canGetPoints = false; 
        /* Information about the hint given for the solution */
        this.hintData = {
            f: null,
            showNodes: [],
            dataNames: ['name', 'value', 'op'],
            storeOrigDataOnNode: function(node) {
                for (let x of this.dataNames) node[x+'Orig'] = node[x];
            },
            hideANode: function(node) {
                for (let x of this.dataNames) node[x] = makeHiddenString(node[x]);
            },
            revealANode: function(node) {
                if (this.showNodes.includes(node)) return;
                for (let x of this.dataNames) node[x] = node[x+'Orig'];
                this.showNodes.push(node);
            },
            reset: function() {this.f = null; this.showNodes = [];},
        };
        
    }
    
    generateFunc() {
        if (this.level===1) {
            if (randBool(0.6)) {
                this.func = DFunc.makeRandPolynomial(randInt(2, 3));
            } else {
                let probs = Node.FUNC_NAMES.map(fN=>fN===this.prevBaseFuncName?0:1);
                this.func = DFunc.makeRandBaseFunction(probs);
                this.prevBaseFuncName = this.func.getName();
            }
        } else if (this.level===2) {
            if (randBool(0.6)) {
                this.func = DFunc.makeRandPolynomial(randInt(3, 5));
            } else {
                let f1Name = DFunc.randomFuncName([1,1,1,1]);
                let probs2 = Node.FUNC_NAMES.map(fN=>fN===f1Name?0:1);
                let f2Name = DFunc.randomFuncName(probs2);
                this.func = DFunc.makeOperOfFuncs(randBool(0.5) ? '+' : '-', f1Name, f2Name);
            }
        } else if (this.level===3) {
            this.func = DFunc.makePolyPower(randInt(2, 3), 2, randInt(2, 5));
        } else if (this.level===4) {
            let f1Name = DFunc.randomFuncName([1,1,1,1]);
            let probs2 = Node.FUNC_NAMES.map(fN=>(fN===f1Name||fN===this.prevBaseFuncName)?0:1);
            let f2Name = DFunc.randomFuncName(probs2);
            this.prevBaseFuncName = f2Name;
            this.func = DFunc.makeOperOfFuncs(randBool(0.5)?'*':'/', f1Name, f2Name);
        } else if (this.level===5) {
            let probs1 = Node.FUNC_NAMES.map(fN=>fN===this.prevBaseFuncName?0:1);
            let f1Name = DFunc.randomFuncName(probs1);
            this.prevBaseFuncName = f1Name;
            if (randBool(0.5)) {
                let probs2 = Node.FUNC_NAMES.map(fN=>{
                    if ((f1Name==='exp' && fN==='ln')
                       || (f1Name==='ln' && fN==='exp')) return 0;
                    return 1;
                });
                let f2Name = DFunc.randomFuncName(probs2);
                this.func = DFunc.makeCompoundFunc(f1Name, f2Name);
                
            } else {
                this.func = DFunc.makeCompoundWithPoly(f1Name, randInt(2, 5));
            }
        } else if (this.level===6) {
            this.func = DFunc.makeOperOfFuncs(randBool(0.5)?'*':'/',
                                        DFunc.randomFuncName([1,1,1,1]),
                                         DFunc.randomFuncName([1,1,1,1]),
                                             randInt(2, 3), randInt(2, 3));
            
        }
        
        
        this.func.simplify();
        this.deriv = this.func.getDerivative();
        this.deriv.simplify();
        
        this.canGetPoits = true;
    }
    
    
    onGuessCorrect() {
        if (this.canGetPoints) {
            this.score += this.level; //TODO more for more complex functions??
            this.canGetPoints = false;
        }
    }
    
    onReveal() {
        this.canGetPoints = false;
    }
    
    onNewPuzzle() {
        this.canGetPoints = true;
        this.hintData.reset();
        
    }
    
    initHint() {
        this.hintData.f = this.deriv.clone();
        //hide the data on the nodes and store originals
        this.hintData.f.tree.traverse(node=>{
            this.hintData.storeOrigDataOnNode(node);
            this.hintData.hideANode(node);
        });
    }
    
    revealHint() {
        if (!this.hintData.f) this.initHint();
        let shown = this.hintData.showNodes;
        let addProb = 0.5;
        this.hintData.f.tree.traverse(node=>{
            if (randBool(addProb)) {
                this.hintData.revealANode(node);
            }
        });
        
        this.score -= 1;
    }
    
    getHintString() {
        if (!this.hintData.f) this.initHint();
        return this.hintData.f.toString();
    }
    
    moveLevel(move) {
        this.level += move;
        if (this.level<this.minLevel) {
            this.level = this.minLevel;
        }
        if (this.level>this.maxLevel) {
            this.level = this.maxLevel;
        }
    }
}