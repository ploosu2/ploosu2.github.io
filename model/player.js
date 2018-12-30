

var Player = function() {
    this.pieces = [];
    for (let i=0; i<PIECES_PER_PLAYER; i++) {
        this.pieces.push(new Piece());
    }
    
    this.points = START_POINTS;
    this.wasps = 0;
    this.vases = [];
    this.pointFarms = [];
    this.waspFarms = [];
    this.bombs = [];
    this.bombsMade = 0;
    this.baseDefence = BASE_DEFENCE;
    this.dead = false;
    
    this.inGameStats = {};
    this.resetInGameStats();
};

Player.prototype.reset = function() {
    for (let piece of this.pieces) {
        piece.reset();
    }
    this.points = START_POINTS;
    this.wasps = 0;
    this.vases = [];
    this.pointFarms = [];
    this.waspFarms = [];
    this.bombs = [];
    this.bombsMade = 0;
    this.baseDefence = BASE_DEFENCE;
    this.dead = false;
};

Player.prototype.resetInGameStats = function() {
    this.inGameStats = {
        accuPoints: 0, accuWasps: 0,
        accuPFarms: 0, accuWFarms: 0,
        baseAttacks: 0,
        accuMoves: 0, accuMoveDist: 0
    };
};


Player.prototype.countVaseRoom = function() {
    return sum(this.vases.map(v=>v.volume));
};


Player.prototype.countWasps = function() {
    return this.wasps;
};

Player.prototype.getPointIncomeForFarms = function(farmsNum) {
    return Math.round((1+2*farmsNum**0.7)*farmsNum);
};

Player.prototype.getWaspIncomeForFarms = function(farmsNum) {
    return farmsNum;
};

/** Give the player points and wasps generated that turn. Call once in the beginning of turn */
Player.prototype.generateIncome = function() {
    var pBefore = this.points;
    var wBefore = this.wasps;
    this.points += 1 + this.getPointIncomeForFarms(this.pointFarms.length);
    var waspsToBe = this.wasps+this.getWaspIncomeForFarms(this.waspFarms.length);
    this.wasps = Math.min(this.countVaseRoom(), waspsToBe);
    this.inGameStats.accuPoints += this.points-pBefore;
    this.inGameStats.accuWasps += this.wasps-wBefore;
    /*
    for (let f of this.pointFarms) {
        this.points += 1; //TODO more increment per more farms??
    }
    
    for (let f of this.waspFarms) {
        var incr = 1; //TODO more increment per more farms??
        if (this.wasps+incr <= this.countVaseRoom()) {
            this.wasps += incr;
        }
    }
    */
};

Player.prototype.getPFarmCost = function() {
    return P_FARM_COST + this.pointFarms.length * P_FARM_ADD_COST;
};

Player.prototype.buildPFarm = function(byPiece) {
    var cost = this.getPFarmCost();
    console.assert(this.points>=cost,
                   "Not enough points for building a point farm, points="+this.points
                    +", cost="+cost);
    console.assert(!byPiece.dead, "Can't build with dead piece");
    console.assert(this.pointFarms.length<MAX_P_FARMS, "Point farm limit reached");
    if (this.points>=cost && !byPiece.dead && this.pointFarms.length<MAX_P_FARMS) {
        this.points -= cost;
        this.pointFarms.push(new PointFarm(byPiece.cell));
        this.inGameStats.accuPFarms += 1;
    } //else debugger;
};


Player.prototype.getWFarmCost = function() {
    return W_FARM_COST + this.waspFarms.length * W_FARM_ADD_COST;
};

Player.prototype.buildWFarm = function(byPiece) {
    var cost = this.getWFarmCost();
    console.assert(this.points>=cost, "Not enough points for building a wasp farm");
    console.assert(!byPiece.dead, "Can't build with dead piece");
    console.assert(this.waspFarms.length<MAX_W_FARMS, "Point farm limit reached");
    if (this.points>=cost && !byPiece.dead && this.waspFarms.length<MAX_W_FARMS) {
        this.points -= cost;
        this.waspFarms.push(new WaspFarm(byPiece.cell));
        this.inGameStats.accuWFarms += 1;
    }
};


Player.prototype.destroyPFarm = function(farm) {
    var i = this.pointFarms.indexOf(farm);
    console.assert(i>=0, "Trying to destroy a non-existing farm");
    if (i>=0) this.pointFarms.splice(i, 1);
};

Player.prototype.destroyWFarm = function(farm) {
    var i = this.waspFarms.indexOf(farm);
    console.assert(i>=0, "Trying to destroy a non-existing farm");
    if (i>=0) this.waspFarms.splice(i, 1);
};

Player.prototype.getMoveCost = function(dist) {
    if (dist<2) return 0;
    return 3*(dist-1)**2-2;
};

Player.prototype.getMaxMoveDistWithPoints = function(pnts) {
    return (Math.sqrt((pnts+2)/3)+1)|0;
};

Player.prototype.getBombCost = function() {
    return BOMB_COST + this.bombsMade * BOMB_ADD_COST;
};

Player.prototype.setBomb = function(byPiece) {
    var cost = this.getBombCost();
    console.assert(this.wasps>=cost, "Not enough wasps for setting a bomb");
    console.assert(!byPiece.dead, "Can't set bomb with dead piece");
    if (this.countWasps()>=cost && !byPiece.dead) {
        this.wasps -= cost;
        this.bombs.push(byPiece.getBomb());
        this.bombsMade += 1;
    }
};



Player.prototype.getEnergyUpgradeCost = function(forPiece) {
    if (forPiece.energy<=0) return 0; //shouldn't need this
    var cost = ENERGY_UPGRADE_COST;
    var erg = forPiece.energy-1;
    cost += (erg>PIECE_ENERGY ? erg : erg**ENERGY_UPGRADE_COST_POW) * ENERGY_UPGRADE_COST_MUL;
    return Math.round(cost);
};

Player.prototype.upgradeEnergy = function(toPiece) {
    var cost = this.getEnergyUpgradeCost(toPiece);
    console.assert(this.points>=cost, "Not enough points for energy upgrade");
    console.assert(!toPiece.dead, "Can't upgrade a dead piece");
    if (this.points>=cost && !toPiece.dead) {
        this.points -= cost;
        toPiece.energy += 1;
    }
};

Player.prototype.getAttackUpgradeCost = function(forPiece) {
    return ATTACK_UPGRADE_COST + (forPiece.attack-1) * ATTACK_UPGRADE_ADD_COST;
};

Player.prototype.upgradeAttack = function(toPiece) {
    var cost = this.getAttackUpgradeCost(toPiece);
    console.assert(this.wasps>=cost, "Not enough wasps for attack upgrade");
    console.assert(!toPiece.dead, "Can't upgrade a dead piece");
    if (this.wasps>=cost && !toPiece.dead) {
        this.wasps -= cost;
        toPiece.attack += 1;
    }
};

Player.prototype.getBombPowerUpgradeCost = function(forPiece) {
    var fact = Math.max(0, forPiece.bombPower-BOMB_POWER);
    return BOMB_UPGRADE_COST +  fact*BOMB_UPGRADE_ADD_COST;
};

Player.prototype.upgradeBombPower = function(toPiece) {
    var cost = this.getBombPowerUpgradeCost(toPiece);
    console.assert(this.wasps>=cost, "Not enough wasps for bomb power upgrade");
    console.assert(!toPiece.dead, "Can't upgrade a dead piece");
    if (this.wasps>=cost && !toPiece.dead) {
        this.wasps -= cost;
        toPiece.bombPower += 1;
    }
};

Player.prototype.getBaseUpgradeCost = function() {
    var b = this.baseDefence-BASE_DEFENCE;
    if (b<0) b=0; //shouldn't ever be, since the defence can't go down(?)
    return {
        points: BASE_UPGRADE_COST_P + b*BASE_UPGRADE_ADD_COST_P,
        wasps: BASE_UPGRADE_COST_W + b*BASE_UPGRADE_ADD_COST_W
    };
};

Player.prototype.upgradeBaseDefence = function(byPiece) {
    var cost = this.getBaseUpgradeCost();
    console.assert(this.points>=cost.points && this.wasps>=cost.wasps,
                   "Not enough points/wasps for base upgrade");
    console.assert(!byPiece.dead, "Can't upgrade with a dead piece");
    if (this.points>=cost.points && this.wasps>=cost.wasps && !byPiece.dead) {
        this.points -= cost.points;
        this.wasps -= cost.wasps;
        this.baseDefence += 1;
    }
};




Player.prototype.killPiece = function(piece) {
    piece.kill();
    this.checkDead();
};

Player.prototype.checkDead = function() {
    this.dead = this.pieces.every(pc=>pc.dead);
};

/** Crush a vase of the player. (The piece doing the crushing given as parameter.)
* If the player has no vases, nothing happens. */
Player.prototype.crushAVase = function(crusherPiece) {
    if (this.vases.length>0) {
        //assume the wasps are spread evenly among the vases, vase with most wasps is crushed
        var decr = Math.ceil(this.wasps/this.vases.length);
        this.vases.pop();
        this.wasps = Math.max(0, this.wasps-decr);
    }
};

/** Attack against the opponent's piece with base */
Player.prototype.attackWithBase = function(oppPiece) {
    oppPiece.sufferBaseAttack(this.baseDefence);
    this.inGameStats.baseAttacks += 1;
};


Player.prototype.getMove = function(game) {
    var move = {};
    
    var pointCost = 0;
    var waspCost = 0;
    
    var selfIndex = game.players.indexOf(this);
    //can move to opponent bases in new rules!
    //var oppoBases = game.board.baseCells.filter((_, i)=>i!==selfIndex);
    var bDiam = game.board.getDiameter();
    move.pieceMoves = [];
    for (let pcI=0; pcI<this.pieces.length; pcI++) {
        let piece = this.pieces[pcI]; 
        if (piece.dead) continue; //can't move a dead piece
        let moveOps = [];
        var maxDist = Math.min(this.getMaxMoveDistWithPoints(this.points-pointCost), bDiam);
        for (let d=0; d<=maxDist; d++) {
            let cellsForMove = game.board.getCellsAtDist(d, piece.cell); // oppoBases);
            for (let c of cellsForMove) {
                moveOps.push({cell: c, d: d}); //d for checking cost here
            }
        }
        if (moveOps.length>0) {
            let rndMove = randEl(moveOps);
            move.pieceMoves[pcI] = rndMove;
            pointCost += this.getMoveCost(rndMove.d);
            rndMove.d = undefined; //clear, not needed in the return value
        }
    }
    
    //Let's add farms and bombs randomly. One piece can act multiple times, but
    //for this random function, let's just try each once.
    move.buildPFarms = [];
    move.buildWFarms = [];
    for (let piece of this.pieces) {
        if (piece.dead) continue; //dead can't build
        if (game.board.isBuildable(piece.cell)) {
            let pFarmsToHave = this.pointFarms.length+move.buildPFarms.length;
            let fCost = P_FARM_COST + (pFarmsToHave)*P_FARM_ADD_COST;
            let pFarmsFull = pFarmsToHave >= MAX_P_FARMS;
            if (randBool(0.1) && this.points >= pointCost+fCost && !pFarmsFull) {
                //if (this.pointFarms.length + move.buildPFarms.length>0) debugger;
                move.buildPFarms.push(piece);
                pointCost += fCost;
            }
            let wFarmsToHave = this.waspFarms.length + move.buildWFarms.length
            fCost = W_FARM_COST + (wFarmsToHave)*W_FARM_ADD_COST;
            let wFarmsFull = wFarmsToHave >= MAX_W_FARMS;
            if (randBool(0.1) && this.points >= pointCost+fCost && !wFarmsFull) {
                //if (this.waspFarms.length + move.buildWFarms.length>0) debugger;
                move.buildWFarms.push(piece);
                pointCost += fCost;
            }
        }
    }
    
    move.bombs = [];
    for (let piece of this.pieces) {
        if (piece.dead) continue; //dead can't set bombs
        let bCost = BOMB_COST + (this.bombsMade+move.bombs.length)*BOMB_ADD_COST;
        if (randBool(0.05) && game.board.isBuildable(piece.cell)
           && this.wasps>=waspCost+bCost) {
            move.bombs.push(piece);
            waspCost += bCost;
        }
    }
    
    //multiple upgrades can also be purchaced for one piece, but for simplicity
    //let's again only try once for each piece
    move.upgrades = {"energy": [], "attack": [], "bombPower": [], "base": []};
    var ownBase = game.board.baseCells[selfIndex];
    for (let piece of this.pieces) {
        if (piece.dead) continue; //dead can't upgrade
        if (piece.cell!==ownBase) continue; //can only upgrade at the base
        let upECost = this.getEnergyUpgradeCost(piece);
        if (randBool(0.05) && this.points>=pointCost+upECost) {
            move.upgrades.energy.push(piece);
            pointCost += upECost;
        }
        
        let upACost = this.getAttackUpgradeCost(piece);
        if (randBool(0.05) && this.wasps>=waspCost+upACost) {
            move.upgrades.attack.push(piece);
            waspCost += upACost;
        }
        
        let upBCost = this.getBombPowerUpgradeCost(piece);
        if (randBool(0.05) && this.wasps>=waspCost+upBCost) {
            move.upgrades.bombPower.push(piece);
            waspCost += upBCost;
        }
        if (move.upgrades.base.length===0) {
            let upBaseCost = this.getBaseUpgradeCost();
            if (randBool(0.05) && this.points>=upBaseCost.points && this.wasps>=upBaseCost.wasps) {
                move.upgrades.base.push(piece);
                pointCost += upBaseCost.points;
                waspCost += upBaseCost.wasps;
            }
        } 
    }
    
    return move;
};