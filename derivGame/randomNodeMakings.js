Node.NODE_TYPES = [ConstantNode, VariableNode, FuncNode, OperNode];


Node.makeMonomialNode = (coeff, k) => {
    if (k===0) return new ConstantNode(coeff);
    return new OperNode('*',
                new ConstantNode(coeff),
                new OperNode('^', new VariableNode(), new ConstantNode(k)));
};

Node.makePolynomialNode = (coeffs) => {
    let i=0;
    while (i<coeffs.length && coeffs[i]===0) i++;
    if (i===coeffs.length) return new ConstantNode(0);
    let ret = Node.makeMonomialNode(coeffs[i], i);
    for (i = i+1; i<coeffs.length; i++) {
        let c = coeffs[i];
        if (coeffs[i]!==0) {
            ret = new OperNode(c<0?'-':'+', ret, Node.makeMonomialNode(Math.abs(c), i));
        }
    }
    return ret;
};


Node.makeInnerPolyForFuncNode = (maxDeg=1) => {
    let cs = new Array(randInt(2, maxDeg+1)).fill(0).map(()=>randInt(0, 10)-5);
    if (cs.slice(1).every(c=>c===0)) cs[1] = 1;
    return Node.makePolynomialNode(cs);
};

Node.makeOperNodeOfFuncs = (op, f1Name, f2Name, maxD1, maxD2) => {
    let innerNodes = [maxD1, maxD2].map(d=>{
        return d ? Node.makeInnerPolyForFuncNode(d) : new VariableNode();
    });
    return new OperNode(op,
                        new FuncNode(f1Name, innerNodes[0]),
                        new FuncNode(f2Name, innerNodes[1])
                       );
};






/** make a random node recursively.
@param props: Properties object: {
    nodeProbs: probabilities for which node type to make,
    opProbs: probabilities for the operations to use in an OpNode
    funcProbs: probabilities for the function to use in an FuncNode
    constantGetter: function for getting a constant
    minDepth: minimum depth for the tree this node is the root of,
    maxDepth: maximum depth for the tree this node is the root of,
}
@param depth: what depth is the complete tree in the making

*/
Node.makeRandomNode = (props, depth) => {
    let sumToUse = sum(props.nodeProbs);
    let p = 0;
    let iStart = 0;
    let iEnd = Node.NODE_TYPES.length;
    if (depth<props.minDepth) {
        iStart = 2;
        sumToUse -= sum(props.nodeProbs.slice(0, iStart));
    }
    if (depth>=props.maxDepth) {
        iEnd = 2;
        sumToUse -= sum(props.nodeProbs.slice(iEnd));
    }
    let u = Math.random()*sumToUse;
    for (let i=iStart; i<iEnd; i++) {
        p+= props.nodeProbs[i];
        if (p>=u) {
            let Type = Node.NODE_TYPES[i];
            switch (Type) {
                case ConstantNode:
                    return new Type(props.constantGetter());
                    break;
                    
                case VariableNode:
                    return new Type();
                    break;
                    
                case OperNode:
                    let op = getRandFrom(Object.keys(Node.OPERS), props.opProbs);
                    let propsForFirst = {...props};
                    let propsForSecond = {...props};
                    if (op==='^') {
                        //TODO doesn't work
                        propsForSecond.nodeProbs = [0,1,1,1]; //no constant to base
                        propsForSecond.nodeProbs = [1,0,0,0]; //only constant to exponents
                    }
                    let first = Node.makeRandomNode(props, depth+1);
                    let second = Node.makeRandomNode(propsForSecond, depth+1);
                    return new Type(op, first, second);
                    break;
                    
                case FuncNode:
                    let fName = getRandFrom(Object.keys(Node.FUNCS), props.funcProbs);
                    //TODO no constants as arguments
                    let propsForArg = {...props};
                    propsForArg.nodeProbs = [0,1,1,1]; //no constant as arguments
                    let argNode = Node.makeRandomNode(propsForArg, depth+1);
                    return new Type(fName, argNode);
                    break;
            };
        }
    }
    return new VariableNode(); //shouldn't get here
};


