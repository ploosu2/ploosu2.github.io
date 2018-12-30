

var Piece = function() {
    this.energy = PIECE_ENERGY;
    this.attack = PIECE_ATTACK;
    this.bombPower = BOMB_POWER;
    this.carry = null;
    this.cell = null;
    this.dead = false;
    this.inGameStats = {};
    this.resetInGameStats();
};


Piece.prototype.reset = function() {
    this.energy = PIECE_ENERGY;
    this.attack = PIECE_ATTACK;
    this.bombPower = BOMB_POWER;
    this.carry = null;
    this.dead = false;
};

Piece.prototype.resetInGameStats = function() {
    this.inGameStats = {accuAttacks: 0, accuKills: 0};
};

Piece.prototype.moveTo = function(cell) {
    this.cell = cell;
};

Piece.prototype.attackAgainst = function(opp) {
    this.inGameStats.accuAttacks += 1;
    opp.energy -= this.attack;
    if (opp.energy<=0) {
        opp.kill();
        this.inGameStats.accuKills += 1;
    }
};

Piece.prototype.getBomb = function() {
    return new Bomb(this.cell, this.bombPower);
};

Piece.prototype.sufferExplosion = function(bomb) {
    this.energy -= bomb.power;
    if (this.energy<=0) {
        this.kill();
    }
};

Piece.prototype.sufferBaseAttack = function(power) {
    this.energy -= power;
    if (this.energy<=0) {
        this.kill();
    }
};


Piece.prototype.kill = function() {
    this.energy = 0;
    this.attack = 0;
    this.bombPower = 0;
    this.carry = null;
    this.cell = null;
    this.dead = true;
};
