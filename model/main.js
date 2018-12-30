


playVisualGame([new Player(), new Player(), new Player(), new Player()], [1,0,0,0]);


game.players.forEach(p=>{
    p.points += 1000;
    for (let i of [0,1,2,3,4]) p.vases.push(new Vase());
    p.wasps += 49;
});


/*
//TODO all player bots here and give them names
var allPlayers = [new Player(), new Player(), new Player(), new Player(), new Player()];

allPlayers.forEach((p, i)=>{
    p.name = "Player "+i;
    p.stats = {};
    p.stats.games = 0;
    p.stats.finisheds = [0, 0, 0, 0]; //number of times came [1st, 2nd, 3rd, 4th]
    p.stats.wonByWasps = 0;
    p.stats.died = 0;
    //TODO p.stats.accuPoints
});

var plComparator = (a, b) => {
    if (a.countWasps()<b.countWasps()) return 1;
    if (a.countWasps()>b.countWasps()) return -1;
    
    if (a.points<b.points) return 1;
    if (a.points>b.points) return -1;
    
    if (a.waspFarms.length<b.waspFarms.length) return 1;
    if (a.waspFarms.length>b.waspFarms.length) return -1;
    return 0;
};

var collectStats = function(pls) {
    var ordPls = pls.slice().sort(plComparator);
    ordPls.forEach((p, i)=>{
        p.stats.games += 1;
        p.stats.finisheds[i] += 1;
        if (p.countWasps()>=WASPS_TO_WIN) p.stats.wonByWasps += 1;
        if (p.dead) p.stats.died += 1;
    });
};

var totalGames = 0;
var endI1 = allPlayers.length-3;
var endI2 = allPlayers.length-2;
var endI3 = allPlayers.length-1;
var endI4 = allPlayers.length-0;
for (let i1=0; i1<endI1; i1++) {
    for (let i2=i1+1; i2<endI2; i2++) {
        for (let i3=i2+1; i3<endI3; i3++) {
            for (let i4=i3+1; i4<endI4; i4++) {
                let toPlay = [i1, i2, i3, i4].map(j=>allPlayers[j]);
                for (let rot=0; rot<4; rot++) {
                    toPlay = toPlay.concat(toPlay.splice(0, 1));
                    game.playGame(toPlay);
                    totalGames += 1;
                    collectStats(toPlay);
                }
            }
        }
    }
}

console.log("Played "+totalGames+" games. Player stats: ");
var ordAllPs = allPlayers.slice(0).sort((a,b)=>b.stats.finisheds[0]-a.stats.finisheds[0]);
console.table(
    [["name", "1st", "2nd", "3rd", "4th", "won by wasps", "died", "games played"]]
    .concat(new Array(ordAllPs.length).fill(0).map((_,i)=>{
    var p = ordAllPs[i];
    var s = p.stats;
    return [p.name].concat(s.finisheds).concat([s.wonByWasps, s.died, s.games]);
})));
*/