var Farm = function(cell) {
    this.cell = cell;
};


var PointFarm = function(cell) {
    Farm.call(this, cell);
};
inheritFrom(PointFarm, Farm);


var WaspFarm = function(cell) {
    Farm.call(this, cell);
};
inheritFrom(WaspFarm, Farm);