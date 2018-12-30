
var Game = function() {
    this.board = new Board();
    this.players = [];
    this.turn = -1;
    this.turnCount = 0;
};


Game.prototype.setPlayers = function(players) {
    this.players = players;
    this.turn = 0;
    this.turnCount = 0;
};


Game.prototype.reset = function() {
    for (let i=0; i<this.players.length; i++) {
        let p = this.players[i];
        p.reset();
        for (let piece of p.pieces) {
            piece.moveTo(this.board.baseCells[i]);
        }
    }
    this.turn = 0;
    this.turnCount = 0;
};

/** Shortest distance for the player p to get from cell c1 to cell c2.  */
Game.prototype.calcDistForPlayer = function(p, c1, c2) {
    //In new rules, can move to opponent bases.
    //var selfIndex = this.players.indexOf(p);
    //var oppoBases = this.board.baseCells.filter((_, i)=>i!==selfIndex);
    return this.board.calcDist(c1, c2); // oppoBases);
};

Game.prototype.currentPlayerHasWinWasps = function() {
    return this.players[this.turn].countWasps() >= WASPS_TO_WIN;
};


Game.prototype.changeTurn = function() {
    this.turn += 1;
    this.turn %= this.players.length;
};


Game.prototype.startTurn = function() {
    var p = this.players[this.turn];
    p.generateIncome();
    
};


Game.prototype.makeMove = function(p, piece, toCell) {
    var d = this.calcDistForPlayer(p, piece.cell, toCell);
    var cost = p.getMoveCost(d);
    console.assert(p.points>=cost, "Trying to move with insufficient funds");
    if (p.points>=cost) {
        piece.moveTo(toCell);
        p.points -= cost;
        p.inGameStats.accuMoveDist += d;
        p.inGameStats.accuMoves += 1;
    }
};

/** Move the player's pieces to cells given
 * in the array pieceMoves as objects {cell: target cell}
 */
Game.prototype.makePieceMoves = function(p, pieceMoves) {
    for (let i=0; i<p.pieces.length; i++) {
        if (!pieceMoves[i]) continue;
        let toCell = pieceMoves[i].cell;
        if (toCell) {
            this.makeMove(p, p.pieces[i], toCell);
        }
    }
};


Game.prototype.playTurn = function() {
    var p = this.players[this.turn];
    var move = p.getMove(this);
    //console.log("Player "+this.turn+" makes move", move);
    if (!move) return;
    
    if (move.buildPFarms) {
        for (let fPiece of move.buildPFarms) {
            if (this.board.cells.indexOf(fPiece.cell)>=0 && this.board.isBuildable(fPiece.cell)) {
                p.buildPFarm(fPiece); //(if piece dead checked in the player method)
            }
        }
    }
    if (move.buildWFarms) {
        for (let fPiece of move.buildWFarms) {
            if (this.board.cells.indexOf(fPiece.cell)>=0 && this.board.isBuildable(fPiece.cell)) {
                p.buildWFarm(fPiece);
            }
        }
    }
    if (move.bombs) {
        for (let bPiece of move.bombs) {
            if (this.board.cells.indexOf(bPiece.cell)>=0 && this.board.isBuildable(bPiece.cell)) {
                p.setBomb(bPiece);
            }
        }
    }
    
    
    //It would probably make sense to give the player its base cell as attribute
    //so it could do these checkings. Well, buildability (in the above) has to asked from the board anyhow.
    var ownBase = this.board.baseCells[this.turn];
    if (move.upgrades) {
        if (move.upgrades.energy) {
            for (let piece of move.upgrades.energy) {
                if (piece.cell===ownBase) {
                    p.upgradeEnergy(piece);
                }
            }
        }
        if (move.upgrades.attack) {
            for (let piece of move.upgrades.attack) {
                if (piece.cell===ownBase) {
                    p.upgradeAttack(piece);
                }
            }
        }
        if (move.upgrades.bombPower) {
            for (let piece of move.upgrades.bombPower) {
                if (piece.cell===ownBase) {
                    p.upgradeBombPower(piece);
                }
            }
        }
        
    
        if (move.upgrades.base) {
            for (let piece of move.upgrades.base) {
                if (piece.cell===ownBase) {
                    p.upgradeBaseDefence(piece);
                }
            }
        }
    }
    
    if (Array.isArray(move.pieceMoves)) {
        this.makePieceMoves(p, move.pieceMoves);
    }
    
};

/** List of pieces of all other players (except the owner) that the bomb will explode upon */
Game.prototype.getPiecesEffectedByBomb = function(bomb, owner) {
    var ret = [];
    for (let pl of this.players) {
        if (pl===owner) continue;
        for (let pc of pl.pieces) {
            if (pc.dead) continue;
            if (pc.cell===bomb.cell) ret.push(pc);
        }
    }
    return ret;
};

Game.prototype.endTurn = function() {
    var p = this.players[this.turn];
    
    //attack oppo pieces
    for (let opp of this.players) {
        let oppI = this.players.indexOf(opp);
        if (opp===p) continue;
        for (let piece of p.pieces) {
            if (piece.dead) continue; //Dead pieces can't do anything
            for (let oppPiece of opp.pieces) {
                if (oppPiece.dead) continue; //Don't attack against dead pieces
                if (piece.cell===oppPiece.cell) {
                    piece.attackAgainst(oppPiece);
                    /* checking if dies done in attackAgainst
                    if (oppPiece.energy<=0) {
                        //oppPiece.cell = game.board.baseCells[oppI];
                        //TODO or kill the piece permanently?
                        
                    }*/
                }
            }
            var pFarmsToDestroy = [];
            for (let oppPFarm of opp.pointFarms) {
                if (piece.cell===oppPFarm.cell) {
                    pFarmsToDestroy.push(oppPFarm);
                }
            }
            for (let f of pFarmsToDestroy) opp.destroyPFarm(f);
            var wFarmsToDestroy = [];
            for (let oppWFarm of opp.waspFarms) {
                if (piece.cell===oppWFarm.cell) {
                    wFarmsToDestroy.push(oppWFarm);
                }
            }
            for (let f of wFarmsToDestroy) opp.destroyWFarm(f);
        }
        
        
    }
    
    //crush oppo vases
    for (let piece of p.pieces) {
        if (piece.dead) continue;
        for (let oppI=0; oppI<this.players.length; oppI++) {
            if (oppI===this.turn) continue;
            if (piece.cell === this.board.baseCells[oppI]) {
                this.players[oppI].crushAVase(piece);
            }
        }
    }
    
    //bomb explosions
    for (let piece of p.pieces) {
        if (piece.dead) continue; //Dead pieces can't do anything
        for (let opp of this.players) {
            if (opp===p) continue;
            let bombsToRemove = [];
            for (let oppBomb of opp.bombs) {
                if (piece.cell===oppBomb.cell) {
                    let effPcs = this.getPiecesEffectedByBomb(oppBomb, opp);
                    for (let pcToSuffer of effPcs) {
                        pcToSuffer.sufferExplosion(oppBomb);
                    }
                    //piece.energy -= oppBomb.power;
                    bombsToRemove.push(oppBomb);
                }
            }
            for (let rB of bombsToRemove) {
                opp.bombs.splice(opp.bombs.indexOf(rB), 1);
            }
        }
    }
    
    
    //defend base against oppo pieces
    var pBase = this.board.baseCells[this.turn];
    for (let opp of this.players) {
        if (opp===p) continue;
        for (let oppPiece of opp.pieces) {
            if (oppPiece.dead) continue;
            if (oppPiece.cell===pBase) {
                p.attackWithBase(oppPiece);
            }
        }
    }
    
    //vase carrying
    for (let piece of p.pieces) {
        if (piece.dead) continue; //Dead pieces can't do anything
        if (!piece.carry && piece.cell===game.board.center) {
            piece.carry = new Vase();
        }
        if (piece.carry && piece.cell===game.board.baseCells[this.turn]) {
            p.vases.push(piece.carry);
            piece.carry = null;
        }
    }
    
    for (let pl of this.players) { //check each player, since any one's piece could die
        pl.checkDead();
    }
};


Game.prototype.playGame = function(players) {
    this.setPlayers(players);
    this.reset();
    this.turnCount = 0;
    var maxTurns = MAX_ROUNDS*this.players.length;
    while (this.turnCount<maxTurns) {
        this.startTurn();
        if (this.currentPlayerHasWinWasps()) {
            break;
        }
        this.playTurn();
        this.endTurn();
        if (this.players.every(pl=>pl.dead)) {
            break;
        }
        var skipping = false;
        do {
            //TODO still give income from farms to dead player??
            //and still defend the base??? (the wasps defend it?)
            this.changeTurn();
            this.turnCount++;
            var skipping = true;
        } while (this.players[this.turn].dead);
    }
};

