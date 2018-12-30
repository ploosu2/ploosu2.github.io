var Cell = function() {
    this.nbrs = [];
};

Cell.prototype.connect = function(c) {
    c.nbrs.push(this);
    this.nbrs.push(c);
};


var Board = function() {
    this.cells = [];
    this.baseCells = [];
    
    var makeRing = function(size) {
        var r = [];
        for (let i=0; i<size; i++) {
            r.push(new Cell());
            if (i>0) r[i].connect(r[i-1]); 
        }
        if (size>1) r[size-1].connect(r[0]);
        return r;
    };
    
    var makeBase = function(inRing, outRing) {
        var oR = makeRing(outRing);
        var iR = makeRing(inRing);
        var center = new Cell();
        var ratio = outRing/inRing;
        for (let i=0; i<inRing; i++) {
            iR[i].connect(oR[(ratio*i)|0]);
            iR[i].connect(center);
        }
        return {cells: [center].concat(iR).concat(oR), center: center, outerRing: oR};
    };
    var bOuters = [];
    for (let i=0; i<4; i++) {
        let b = makeBase(6, 18);
        for (let c of b.cells) this.cells.push(c);
        this.baseCells.push(b.center);
        bOuters.push(b.outerRing);
    }
    
    var cB = makeBase(8, 16);
    var cBOuter = cB.outerRing;
    for (let i=0; i<cBOuter.length; i++) {
        cBOuter[i].connect(bOuters[(i/4)|0][i%4]);
    }
    this.cells = this.cells.concat(cB.cells);
    this.center = cB.center;
    
    for (let i=0; i<this.cells.length; i++) {
        this.cells[i].num = i;
    }
};

Board.prototype.isBuildable = function(cell) {
    return !!cell && cell!==this.center && this.baseCells.indexOf(cell)<0;
};


/** Shortest distance between two cells. Optional: list of forbidden cells. */
Board.prototype.calcDist = function(c1, c2, exclude=[]) {
    if (c1===c2) return 0;
    var exSet = new Set(exclude);
    if (exSet.has(c2)) return Infinity;
    var currNbs = new Set([c1]);
    var seen = new Set([c1]);
    var nxtNbs = new Set();
    var d = 0;
    while (true) {
        if (currNbs.has(c2)) return d;
        for (let n of currNbs) {
            for (let nn of n.nbrs) {
                if (!seen.has(nn)) {
                    if (!exSet.has(nn)) nxtNbs.add(nn);
                    seen.add(nn);
                }
            }
        }
        if (nxtNbs.size===0) return Infinity;
        currNbs = nxtNbs;
        nxtNbs = new Set();
        d += 1;
    }
};

/** List of cells at distance d from the cell c. Optional list of forbidden cells.
//TODO make the list for all 0,1,2,...,d in one go
*/
Board.prototype.getCellsAtDist = function(d, c, exclude=[]) {
    var exSet = new Set(exclude);
    if (d===0) return exSet.has(c) ? [] : [c];
    var currNbs = new Set([c]);
    var seen = new Set([c]);
    var nxtNbs = new Set();
    for (let i=0; i<d; i++) {
        for (let n of currNbs) {
            for (let nn of n.nbrs) {
                if (!seen.has(nn)) {
                    if (!exSet.has(nn)) nxtNbs.add(nn);
                    seen.add(nn);
                }
            }
        }
        
        currNbs = nxtNbs;
        nxtNbs = new Set();
    }
    return Array.from(currNbs);
};

Board.prototype.getDiameter = function() {
    return BOARD_DIAMETER;
};