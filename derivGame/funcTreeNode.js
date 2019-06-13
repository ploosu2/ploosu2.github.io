
class Node {
    constructor() {
        this.parent = null;
    }
    
    /**The MathJax code for this node*/
    toMathJaxString() {
        //by default the same as toString()
        return this.toString();
    }
    
    simplify() {
        //nothing by default
    }
    
    /** Go through this node and all its children
    * @param order: in which order should the parent and children be handled
    */
    traverse(callback, order=Node.POST_ORDER) {
        callback(this);
    }
    
}

Node.PRE_ORDER = 1;
Node.IN_ORDER = 2;
Node.POST_ORDER = 3;

Node.OPERS = {
    '+': (a,b)=>a+b,
    '-': (a,b)=>a-b,
    '*': (a,b)=>a*b,
    '/': (a,b)=>a/b,
    '^': (a,b)=>a**b,
};
Node.OPER_NAMES = Object.keys(Node.OPERS);

Node.FUNCS = {
    'exp': x=>Math.exp(x),
    'ln': x=>Math.log(x),
    'cos': x=>Math.cos(x),
    'sin': x=>Math.sin(x),
    'tan': x=>Math.tan(x),
};
Node.FUNC_NAMES = Object.keys(Node.FUNCS);

Node.needsParanthesisForSub = node => {
    if (node instanceof ConstantNode && node.value<0) return true;
    let isOper = node instanceof OperNode;
    if ( isOper && (node.op==='+' || node.op==='-')) return true;
    if ( isOper && (node.op==='*'
                && ((node.left instanceof ConstantNode) && node.left.value<0 )
                   ||((node.right instanceof ConstantNode) && node.right.value<0 ) ) ) {
        return true;
    }
    
    return false;
};

Node.needsParanthesisForMinus = node => {
    return ( (node instanceof OperNode) && (node.op==='+' || node.op==='-'));
};

Node.needsParanthesisForMul = (a, onRight=false) => {
    if ( (a instanceof OperNode) && (a.op==='+' || a.op==='-')) return true;
    if (onRight && (a instanceof ConstantNode) && a.value<0) return true;
    if (onRight && (a instanceof OperNode) &&
        (a.left instanceof ConstantNode) && a.left.value<0) return true;
    return false;
};

Node.needsMultSign = (a, b) => {
    return ( (b instanceof ConstantNode)
            || ((b instanceof OperNode) && b.op==='*' && (b.left instanceof ConstantNode)) );
};

Node.needsBracesForBase = (a) => {
    return !( ((a instanceof ConstantNode)&&a.value>=0) || (a instanceof VariableNode) );
};





Node.isOperSymbol = symb => Node.OPER_NAMES.indexOf(symb)>=0;
//symb!=='+' && symb!=='-' && symb!=='*' && symb!=='/' && symb!=='^';

/** Index of the last occuring operation symbol not inside any paranthesis or -1 if not found
* @param s: the string where to search
* @param operList: array of symbols to search for (they are all considered and the first found
*                  (reading from end of s)
*/
Node.getIndOfLastOper = (s, operList) => {
    let paran = 0;
    for (let i=s.length-1; i>=1; i--) {
        let c = s[i];
        if (c==='(') {
            paran++;
        } else if (c===')') {
            paran--;
        } else {
            if (paran!==0) continue;
            for (let symb of operList) {
                if (c===symb) {
                    if (!Node.isOperSymbol(s[i-1])) return i;
                    break;
                }
            }
        }
    }
    return -1;
};

/** Does the string have paranthesis that match each other around it
* For example (1+2)*3^(7-1) doesn't have matching paranthesis, but ((3+4)-2*(1)) does.
*/
Node.hasOuterParans = s => {
    if (s[0]!=='(' || s[s.length-1]!==')') return false;
    let parans = 1; //count the first paranthesis
    for (let i=1; i<s.length-1; i++) {
        switch(s[i]) {
            case '(':
                parans++;
                break;
            case ')':
                parans--;
                if (parans===0) return false; //the first found its match before end
                break;
        }
    }
    return true;
};


/** Index of last non-whitespace character starting from i (including) and reading left */
Node.getLastNonWhiteSpaceInd = (s, i) => {
    for (let k=i; k>=0; k--) {
        if (s[k]!==' ') return k; //TODO also other whitespace characters, /^\s*$/.test ??
    }
    return -1;
};


/** If the string s has a function name ending at the index i, that is returned;
otherwise null. */
Node.getFuncNameEnding = (s, i) => {
    for (let fName of Node.FUNC_NAMES) {
        if (s.substring(i-fName.length+1, i+1)===fName) return fName;
    }
    return null;
};

/** If the string s has a function name starting at the index i (default 0), that is returned;
otherwise null. */
Node.getFuncNameStarting = (s, i=0) => {
    for (let fName of Node.FUNC_NAMES) {
        if (s.substring(i, i+fName.length)===fName) return fName;
    }
    return null;
};

/** The index where an implied '*'-symbol would be if it were present
* Musn't be inside any paranthesis.
*/
Node.getIndexOfImplicitMult = (s) => {
    let paran = 0;
    for (let i=s.length-1; i>=1; i--) {
        let c = s[i];
        if (c==='(') {
            paran++;
        } else if (c===')') {
            paran--;
        }
        if (paran===0 && c!==' ') {
            //TODO
            let prevI = Node.getLastNonWhiteSpaceInd(s, i-1);
            let iIsOper = Node.isOperSymbol(s[i]);
            let prevIsOper = Node.isOperSymbol(s[prevI])
            if (s[prevI]===')' && !iIsOper) return i;
            if (s[i]==='(' && !prevIsOper && !Node.getFuncNameEnding(s, prevI)) return i;
            if (isNumber(s[i-1]) && s[i]==='x') return i;
            //if (s[i-1]==='x' && isNumber(s[i])) return i; //constant behind??
            if (s[i-1]==='x' && s[i]==='x') return i;
            if (!prevIsOper && Node.getFuncNameStarting(s, i)) return i;
        }
    }
    return -1;
};

Node.parseFrom = s => {
    s = s.trim();
    while (Node.hasOuterParans(s)) {
        s = s.substring(1, s.length-1).trim();
    }
    
    let indPM = Node.getIndOfLastOper(s, ['+', '-']);
    if (indPM>=0) {
        return new OperNode(s[indPM],
                            Node.parseFrom(s.substring(0, indPM)),
                            Node.parseFrom(s.substring(indPM+1)));
    }
    let indMD = Node.getIndOfLastOper(s, ['*', '/']);
    if (indMD>=0) {
        return new OperNode(s[indMD],
                            Node.parseFrom(s.substring(0, indMD)),
                            Node.parseFrom(s.substring(indMD+1)));
    }
    
    //TODO the implicit multiplication without '*'-symbol
    let indImplMul = Node.getIndexOfImplicitMult(s);
    if (indImplMul>=0) {
        return new OperNode('*',
                            Node.parseFrom(s.substring(0, indImplMul)),
                            Node.parseFrom(s.substring(indImplMul)));
    }
    
    if (s[0]==='-') {
        return new OperNode('*', new ConstantNode(-1), Node.parseFrom(s.substring(1)));
    }
    
    let indPow = Node.getIndOfLastOper(s, ['^']);
    if (indPow>=0) {
        let basePart = s.substring(0, indPow);
        if (basePart.trim().toLowerCase() === "e") {
            return new FuncNode('exp', Node.parseFrom(s.substring(indPow+1)));
        }
        return new OperNode(s[indPow],
                            Node.parseFrom(basePart),
                            Node.parseFrom(s.substring(indPow+1)));
    }
    
    var fName = Node.getFuncNameStarting(s);
    
    if (fName) {
        let firstParanInd = s.indexOf('(');
        //debugger;
        //since trimmed, the last one needs to be a paranthesis
        return new FuncNode(fName, Node.parseFrom(s.substring(firstParanInd+1, s.length-1)));
    }
    
    if (s==="x") return new VariableNode();
    return new ConstantNode(+s);
};



