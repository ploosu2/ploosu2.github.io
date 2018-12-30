var gameArea = document.getElementById("gameArea");

var canvas = document.getElementById("gameCanvas");
canvas.width = 860;
canvas.height = 480;


/** flags whether the player's bombs are drawn */
var showBombs = [1,1,1,1];
var COMPUTER_PLAYER_TIME_MS = 120;
var pColors = ["blue", "red", "green", "yellow"];
var vaseColor = "#825201";
var locs; // = game.board.cells.map(_=>{return {x: NaN, y: NaN, r: 10};});
var info;

var pieceInfo;
var pieceButtons;
var moveDoneButton;

var toolTip;

var setLocs = function(w, h) {
    locs = [{"x":200,"y":119,"r":10},{"x":245,"y":119,"r":10},{"x":222,"y":152,"r":10},{"x":177,"y":152,"r":10},{"x":155,"y":119,"r":10},{"x":177,"y":85,"r":10},{"x":222,"y":85,"r":10},{"x":310,"y":138,"r":10},{"x":294,"y":163,"r":10},{"x":268,"y":180,"r":10},{"x":233,"y":199,"r":10},{"x":199,"y":196,"r":10},{"x":169,"y":200,"r":10},{"x":137,"y":192,"r":10},{"x":114,"y":173,"r":10},{"x":90,"y":146,"r":10},{"x":81,"y":106,"r":10},{"x":113,"y":76,"r":10},{"x":140,"y":57,"r":10},{"x":162,"y":35,"r":10},{"x":194,"y":36,"r":10},{"x":223,"y":45,"r":10},{"x":254,"y":44,"r":10},{"x":280,"y":74,"r":10},{"x":289,"y":104,"r":10},{"x":200,"y":374,"r":10},{"x":200,"y":335,"r":10},{"x":238,"y":354,"r":10},{"x":238,"y":393,"r":10},{"x":200,"y":412,"r":10},{"x":161,"y":393,"r":10},{"x":161,"y":354,"r":10},{"x":226,"y":293,"r":10},{"x":262,"y":318,"r":10},{"x":318,"y":338,"r":10},{"x":329,"y":368,"r":10},{"x":335,"y":405,"r":10},{"x":325,"y":433,"r":10},{"x":281,"y":441,"r":10},{"x":250,"y":447,"r":10},{"x":218,"y":461,"r":10},{"x":186,"y":456,"r":10},{"x":150,"y":447,"r":10},{"x":113,"y":416,"r":10},{"x":98,"y":395,"r":10},{"x":77,"y":376,"r":10},{"x":56,"y":347,"r":10},{"x":102,"y":323,"r":10},{"x":149,"y":300,"r":10},{"x":186,"y":288,"r":10},{"x":600,"y":374,"r":10},{"x":555,"y":374,"r":10},{"x":577,"y":340,"r":10},{"x":622,"y":340,"r":10},{"x":645,"y":374,"r":10},{"x":622,"y":407,"r":10},{"x":577,"y":407,"r":10},{"x":468,"y":368,"r":10},{"x":495,"y":340,"r":10},{"x":523,"y":317,"r":10},{"x":554,"y":300,"r":10},{"x":600,"y":289,"r":10},{"x":642,"y":287,"r":10},{"x":676,"y":295,"r":10},{"x":704,"y":323,"r":10},{"x":721,"y":358,"r":10},{"x":699,"y":393,"r":10},{"x":686,"y":416,"r":10},{"x":667,"y":451,"r":10},{"x":634,"y":458,"r":10},{"x":600,"y":459,"r":10},{"x":574,"y":452,"r":10},{"x":542,"y":438,"r":10},{"x":507,"y":431,"r":10},{"x":486,"y":404,"r":10},{"x":600,"y":119,"r":10},{"x":600,"y":149,"r":10},{"x":556,"y":129,"r":10},{"x":561,"y":99,"r":10},{"x":600,"y":80,"r":10},{"x":638,"y":99,"r":10},{"x":638,"y":138,"r":10},{"x":565,"y":173,"r":10},{"x":540,"y":162,"r":10},{"x":513,"y":154,"r":10},{"x":495,"y":132,"r":10},{"x":502,"y":102,"r":10},{"x":499,"y":75,"r":10},{"x":522,"y":51,"r":10},{"x":556,"y":38,"r":10},{"x":592,"y":31,"r":10},{"x":627,"y":36,"r":10},{"x":664,"y":45,"r":10},{"x":686,"y":76,"r":10},{"x":700,"y":100,"r":10},{"x":700,"y":119,"r":10},{"x":686,"y":161,"r":10},{"x":674,"y":179,"r":10},{"x":650,"y":192,"r":10},{"x":612,"y":187,"r":10},{"x":399,"y":249,"r":10},{"x":378,"y":209,"r":10},{"x":346,"y":223,"r":10},{"x":339,"y":258,"r":10},{"x":394,"y":293,"r":10},{"x":430,"y":280,"r":10},{"x":458,"y":258,"r":10},{"x":459,"y":226,"r":10},{"x":431,"y":203,"r":10},{"x":376,"y":158,"r":10},{"x":341,"y":175,"r":10},{"x":316,"y":208,"r":10},{"x":254,"y":228,"r":10},{"x":278,"y":272,"r":10},{"x":310,"y":298,"r":10},{"x":351,"y":320,"r":10},{"x":390,"y":330,"r":10},{"x":429,"y":329,"r":10},{"x":459,"y":311,"r":10},{"x":486,"y":288,"r":10},{"x":532,"y":264,"r":10},{"x":530,"y":229,"r":10},{"x":507,"y":204,"r":10},{"x":471,"y":180,"r":10},{"x":423,"y":161,"r":10}];
    
    /*
    var setToCircle = function(d, c, r, startAng=0, exclude=[]) {
        var indOfC = game.board.cells.indexOf(c);
        var ring = game.board.getCellsAtDist(d, c).filter(fc=>exclude.indexOf(fc)<0);
        for (let i=0; i<ring.length; i++) {
            let ang = startAng + i*2*Math.PI/ring.length;
            let iI = game.board.cells.indexOf(ring[i]);
            locs[iI].x = locs[indOfC].x + r*Math.cos(ang);
            locs[iI].y = locs[indOfC].y + r*Math.sin(ang);
        }
    };
    
    var cI = game.board.cells.indexOf(game.board.center);
    locs[cI].x = w/2;
    locs[cI].y = h/2;
    
    setToCircle(1, game.board.center, 45, -Math.PI);
    setToCircle(2, game.board.center, 75, -Math.PI);
    setToCircle(3, game.board.center, 100, -Math.PI);
    var keepInCenter = game.board.getCellsAtDist(3, game.board.center);
    
    pBLocs = [{x: w/4, y: h/4}, {x: w/4, y: 3*h/4}, {x: 3*w/4, y: 3*h/4}, {x: 3*w/4, y: h/4}];
    for (let i=0; i<pBLocs.length; i++) {
        let pBC = game.board.baseCells[i];
        let cPI = game.board.cells.indexOf(pBC);
        locs[cPI].x = pBLocs[i].x;
        locs[cPI].y = pBLocs[i].y;
        setToCircle(1, pBC, 45, -Math.PI/2*i, keepInCenter);
        setToCircle(2, pBC, 75, -Math.PI/2*i, keepInCenter);
        setToCircle(3, pBC, 100, -Math.PI/2*i, keepInCenter);
    }
    */
};

var makeInfo = function() {
    info = document.createElement("table");
    info.style.display = "inline-block";
    info.style.marginRight = "20px";
    resetInfo();
};

var resetInfo = function() {
    info.innerHTML = "";
    info.style.verticalAlign = "top";
    var hR = document.createElement("tr");
    hR.innerHTML = ("<th>Player</th><th>Points</th><th>Wasps</th>"+
                    "<th>Vases</th><th>PFarms</th><th>WFarms</th>");
    info.appendChild(hR);
    for (let i=0; i<game.players.length; i++) {
        let p = game.players[i];
        let tR = document.createElement("tr");
        let dataArr = ["Player "+i, p.points, p.countWasps(),
                       p.vases.length, p.pointFarms.length, p.waspFarms.length];
        tR.innerHTML = dataArr.map(d=>"<td>"+d+"</td>").join("");
        tR.style.background = pColors[i];
        tR.style.textAlign = "center";
        info.appendChild(tR);
    }
    
    info.update = function() {
        var rs = Array.from(this.getElementsByTagName("tr"));
        for (let i=1; i<rs.length; i++) { //forget header row
            let p = game.players[i-1];
            let tR = document.createElement("tr");
            let dataArr = ["Player "+i, p.points, p.countWasps(),
                       p.vases.length, p.pointFarms.length, p.waspFarms.length];
            rs[i].innerHTML = dataArr.map(d=>"<td>"+d+"</td>").join("");
            rs[i].style.fontWeight = game.turn===(i-1) ? "900" : "";
            rs[i].style.transform = game.turn===(i-1) ? "scale(1.05, 1.05)" : "";
            rs[i].children[0].style.textDecoration = p.dead?"line-through":"";
            
        }
    };
};

var makePieceInfo = function() {
    pieceInfo = document.createElement("div");
    pieceInfo.setAttribute("id", "pieceInfo");
    pieceInfo.style.visibility = "hidden";
    pieceInfo.style.display = "inline-block";
    
    pieceInfo.container = document.createElement("div");
    pieceInfo.appendChild(pieceInfo.container);
    
    pieceInfo.deadNote = document.createElement("div");
    pieceInfo.deadNote.setAttribute("id", "deadNote");
    pieceInfo.deadNote.innerHTML = "DEAD";
    pieceInfo.appendChild(pieceInfo.deadNote);
    
    pieceInfo.show = function(playerInd, pieceInd) {
        var piece = game.players[playerInd].pieces[pieceInd];
        pieceInfo.style.visibility = "visible";
        pieceInfo.container.innerHTML = ("<h4>Piece "+pieceInd+"</h4>"
                               +"<p>Energy: "+piece.energy+"</p>"
                               +"<p>Attack: "+piece.attack+"</p>"
                               +"<p>Bomb Power: "+piece.bombPower+"</p>"
                               +"<p>Carry: "+(piece.carry?"Vase":"")+"</p>");
        pieceInfo.deadNote.style.visibility = piece.dead?"visible":"hidden";
        pieceInfo.style.border = "2px solid "+pColors[playerInd];
    };
    
    pieceInfo.hide = function() {
        pieceInfo.style.visibility = "hidden";
        pieceInfo.deadNote.style.visibility = "hidden";
    };
};

var makePieceButtons = function() {
    pieceButtons = document.createElement("div");
    pieceButtons.setAttribute("id", "pieceButtons");
    pieceButtons.style.display = "inline-block";
    
    pieceButtons.appendChild(document.createTextNode("Build: "));
    pieceButtons.pFarm = document.createElement("button");
    pieceButtons.pFarm.innerHTML = "P Farm";
    pieceButtons.appendChild(pieceButtons.pFarm);
    pieceButtons.pFarm.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (game.board.isBuildable(selectedPiece.cell) && p.points>=p.getPFarmCost()) {
                p.buildPFarm(selectedPiece);
            } else {
                console.warn("Can't build farm");
            }
        }
        update();
        canvas.focus();
    };
    
    pieceButtons.wFarm = document.createElement("button");
    pieceButtons.wFarm.innerHTML = "W Farm";
    pieceButtons.appendChild(pieceButtons.wFarm);
    pieceButtons.wFarm.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (game.board.isBuildable(selectedPiece.cell) && p.points>=p.getWFarmCost()) {
                p.buildWFarm(selectedPiece);
            } else {
                console.warn("Can't build farm");
            }
        }
        update();
        canvas.focus();
    };
    
    pieceButtons.bomb = document.createElement("button");
    pieceButtons.bomb.innerHTML = "Bomb";
    pieceButtons.appendChild(pieceButtons.bomb);
    pieceButtons.bomb.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (game.board.isBuildable(selectedPiece.cell) && p.countWasps()>=p.getBombCost()) {
                p.setBomb(selectedPiece);
            } else {
                console.warn("Can't set bomb");
            }
        }
        update();
        canvas.focus();
    };
    
    
    pieceButtons.appendChild(document.createElement("br"));
    pieceButtons.appendChild(document.createTextNode("Upgrade: "));
    pieceButtons.upgradeEnergy = document.createElement("button");
    pieceButtons.upgradeEnergy.innerHTML = "Energy 0 (0p)";
    pieceButtons.appendChild(pieceButtons.upgradeEnergy);
    pieceButtons.upgradeEnergy.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (selectedPiece.cell===game.board.baseCells[game.turn]
               && p.points >= p.getEnergyUpgradeCost(selectedPiece)) {
                p.upgradeEnergy(selectedPiece);
            } else {
                console.warn("Can't upgrade energy");
            }
        }
        update();
        canvas.focus();
    };
    
    pieceButtons.upgradeAttack = document.createElement("button");
    pieceButtons.upgradeAttack.innerHTML = "Attack 0 (0w)";
    pieceButtons.appendChild(pieceButtons.upgradeAttack);
    pieceButtons.upgradeAttack.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (selectedPiece.cell===game.board.baseCells[game.turn]
               && p.countWasps() >= p.getAttackUpgradeCost(selectedPiece)) {
                p.upgradeAttack(selectedPiece);
            } else {
                console.warn("Can't upgrade attack");
            }
        }
        update();
        canvas.focus();
    };
    
    //pieceButtons.appendChild(document.createElement("br"));
    
    pieceButtons.upgradeBombPower = document.createElement("button");
    pieceButtons.upgradeBombPower.innerHTML = "Bomb Power 0<br>(0w)";
    pieceButtons.appendChild(pieceButtons.upgradeBombPower);
    pieceButtons.upgradeBombPower.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            if (selectedPiece.cell===game.board.baseCells[game.turn]
               && p.countWasps() >= p.getBombPowerUpgradeCost(selectedPiece)) {
                p.upgradeBombPower(selectedPiece);
            } else {
                console.warn("Can't upgrade bomb power");
            }
        }
        update();
        canvas.focus();
    };
    
    pieceButtons.upgradeBase = document.createElement("button");
    pieceButtons.upgradeBase.innerHTML = "Base Defence 0<br>(0p 0w)";
    pieceButtons.appendChild(pieceButtons.upgradeBase);
    pieceButtons.upgradeBase.onclick = function() {
        var p = game.players[game.turn];
        if (selectedPiece && !selectedPiece.dead) {
            let cost = p.getBaseUpgradeCost(selectedPiece);
            if (selectedPiece.cell===game.board.baseCells[game.turn]
                && p.points >= cost.points && p.countWasps() >= cost.wasps) {
                p.upgradeBaseDefence(selectedPiece);
            } else {
                console.warn("Can't upgrade base");
            }
        }
        update();
        canvas.focus();
    };
    
    pieceButtons.update = function() {
        var p = game.players[game.turn];
        var canBuild = (selectedPiece && !selectedPiece.dead
                        && game.board.isBuildable(selectedPiece.cell));
        var vis =  selectedPiece && !selectedPiece.dead;
        this.style.visibility = (!vis?"hidden":"visible");
        
        this.pFarm.disabled = !canBuild ||  p.points<p.getPFarmCost();
        this.pFarm.innerHTML = "P Farm ("+p.getPFarmCost()+"p)";
        
        this.wFarm.disabled = !canBuild ||  p.points<p.getWFarmCost();
        this.wFarm.innerHTML = "W Farm ("+p.getWFarmCost()+"p)";
        
        this.bomb.disabled = !canBuild ||  p.wasps<p.getBombCost();
        this.bomb.innerHTML = "Bomb ("+p.getBombCost()+"w)";
        
        
        
        var selInBase = (selectedPiece && !selectedPiece.dead &&
                              selectedPiece.cell===game.board.baseCells[game.turn]);
        
        this.upgradeEnergy.disabled = (!selInBase ||                         
                                       p.points<p.getEnergyUpgradeCost(selectedPiece));
        this.upgradeAttack.disabled = (!selInBase ||
                                        p.countWasps()<p.getAttackUpgradeCost(selectedPiece));
        this.upgradeBombPower.disabled = (!selInBase ||
                                    p.countWasps()<p.getBombPowerUpgradeCost(selectedPiece));
        let upBaseCost = p.getBaseUpgradeCost();
        this.upgradeBase.disabled = (!selInBase || p.points<upBaseCost.points ||
                                    p.countWasps()<upBaseCost.wasps);
        
        if (selectedPiece && !selectedPiece.dead) {
            this.upgradeEnergy.innerHTML = "Energy "+(selectedPiece.energy+1)
                                +"<br>("+p.getEnergyUpgradeCost(selectedPiece)+"p)";
            this.upgradeAttack.innerHTML = "Attack "+(selectedPiece.attack+1)
                                +"<br>("+p.getAttackUpgradeCost(selectedPiece)+"w)";
            this.upgradeBombPower.innerHTML = "Bomb Power "+(selectedPiece.bombPower+1)
                                +"<br>("+p.getBombPowerUpgradeCost(selectedPiece)+"w)";
            this.upgradeBase.innerHTML = "Base Defence "+(p.baseDefence+1)
                                +"<br>("+upBaseCost.points+"p, "+upBaseCost.wasps+"w)";
            
        }
    };
};

var makeToolTip = function() {
    toolTip = document.createElement("div");
    toolTip.setAttribute("id", "toolTip");
    toolTip.style.display = "none";
    toolTip.style.position = "absolute";
    
    toolTip.setPosition = function(canvasX, canvasY) {
        var bdd = canvas.getBoundingClientRect();
        toolTip.style.left = (canvasX+bdd.left)+"px";
        toolTip.style.top = (canvasY+bdd.top)+"px";
    };
    toolTip.show = function() {
        toolTip.style.display = "block";
    };
    toolTip.hide = function() {
        toolTip.style.display = "none";
    };
    toolTip.setTextLines = function(textLines) {
        toolTip.innerHTML = textLines.map(x=>"<p>"+x+"</p>").join("");
    };
    toolTip.lastOnInd = -1;
    
    toolTip.update = function() {
        if (!selectedPiece || selectedPiece.dead) {
            toolTip.hide();
            toolTip.lastOnInd = -1;
        }
    };
};

var makeMoveDoneButton = function() {
    moveDoneButton = document.createElement("button");
    moveDoneButton.setAttribute("id", "moveDoneButton");
    moveDoneButton.innerHTML = "Make Move (0p)";
    moveDoneButton.onclick = function() {
        if (!controlOb.moveMade && typeof controlOb.resolveFunc === "function") {
            deselectPiece();
            controlOb.resolveFunc();
            controlOb.moveMade = true;
        }
        update();
        canvas.focus();
    };
    
    moveDoneButton.resetButton = document.createElement("button");
    moveDoneButton.resetButton.setAttribute("id", "resetMoveButton");
    moveDoneButton.resetButton.innerHTML = "Reset";
    moveDoneButton.resetButton.onclick = function(evt) {
        controlOb.move.pieceMoves = [];
        update();
        canvas.focus();
        evt.preventDefault();
        return true;
    };
    
    moveDoneButton.update = function() {
        var p = game.players[game.turn];
        var cost = controlOb.calculateMoveCost();
        this.disabled = !p.usingControls || cost>p.points;
        var anyPcMcs = !controlOb.move.pieceMoves.every(x=>!x);
        this.resetButton.style.display = anyPcMcs?"block":"none";
        var clNm = (cost>p.points)?"cantAfford":"";
        this.innerHTML = "Make Move <span class='"+clNm+"'>("+cost+"p)</span>";
    };
};

var drawBomb = function(b, color, ctx) {
    var loc = locs[b.cell.num];
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.arc(loc.x, loc.y, 1.2*loc.r, 0, 2*Math.PI);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.arc(loc.x, loc.y, 1.2*loc.r, 0, 2*Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;
};

var drawPlayer = function(pI, ctx) {
    var p = game.players[pI];
    ctx.fillStyle = pColors[pI];
    
    if (showBombs[pI]) {
        for (let b of p.bombs) {
            drawBomb(b, pColors[pI], ctx);
        }
    }
    
    ctx.globalAlpha = 0.7;
    for (let piece of p.pieces) {
        if (piece.dead) continue; //Don't draw dead pieces //TODO maybe draw them aside?
        let cI = piece.cell.num; //game.board.cells.indexOf(piece.cell);
        let loc = locs[cI];
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, loc.r*0.65, 0, 2*Math.PI);
        ctx.fill();
        if (piece.carry) {
            ctx.font = "14px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = vaseColor;
            ctx.fillText("V", loc.x, loc.y, loc.r);
            ctx.fillStyle = pColors[pI];
        }
    }
    
    ctx.font = "30px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let pFarm of p.pointFarms) {
        let loc = locs[pFarm.cell.num];
        ctx.fillText("P", loc.x, loc.y, 2*loc.r);
    }
    for (let wFarm of p.waspFarms) {
        let loc = locs[wFarm.cell.num];
        ctx.fillText("W", loc.x, loc.y, 2*loc.r);
    }
    
    ctx.globalAlpha = 1;
};

var drawSelectedPiece = function(ctx) {
    let loc = locs[selectedPiece.cell.num];
    ctx.beginPath();
    ctx.strokeStyle = "#9df";
    ctx.lineWidth = 3;
    ctx.arc(loc.x, loc.y, 0.9*loc.r, 0, 2*Math.PI);
    ctx.stroke();
    
    var pcI = game.players[game.turn].pieces.indexOf(selectedPiece);
    let toCellOb = controlOb.move.pieceMoves[pcI];
    if (toCellOb && toCellOb.cell) {
        let toLoc = locs[toCellOb.cell.num];
        ctx.fillStyle = "#9cd";
        ctx.fillRect(toLoc.x-5, toLoc.y-5, 10, 10);
    }
};

//TODO render the board only once to off-screen canvas: var boardCanvas;
var draw = function() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    let centerLoc = locs[game.board.center.num];
    ctx.fillStyle = vaseColor;
    ctx.beginPath();
    ctx.arc(centerLoc.x, centerLoc.y, 2.3*centerLoc.r, 0, 2*Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 0.3;
    for (let i=0; i<game.players.length; i++) {
        let baseLoc = locs[game.board.baseCells[i].num];
        ctx.fillStyle = pColors[i];
        ctx.beginPath();
        ctx.arc(baseLoc.x, baseLoc.y, 2.3*baseLoc.r, 0, 2*Math.PI);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#122";
    ctx.beginPath();
    for (let i=0; i<game.board.cells.length; i++) {
        for (let nb of game.board.cells[i].nbrs) {
            let j = nb.num; //game.board.cells.indexOf(nb);
            ctx.moveTo(locs[i].x, locs[i].y);
            ctx.lineTo(locs[j].x, locs[j].y);
        }
    }
    ctx.stroke();
    
    ctx.fillStyle = "gray";
    for (let i=0; i<locs.length; i++) {
        ctx.beginPath();
        ctx.arc(locs[i].x, locs[i].y, locs[i].r, 0, 2*Math.PI);
        ctx.fill();
    }
    
    for (let pI=0; pI<game.players.length; pI++) {
       drawPlayer(pI, ctx);
    }
    
    if (selectedPiece && !selectedPiece.dead) {
        drawSelectedPiece(ctx);
    }
    
    ctx.font = "18px Helvetica";
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.fillText("Round: "+(((game.turnCount/game.players.length)|0) + 1), 5, 30);
    
};


var update = function() {
    info.update();
    if (selectedPiece) {
        //TODO what if want to show someone not in turn
        let ind = game.players[game.turn].pieces.indexOf(selectedPiece);
        if (ind>=0) pieceInfo.show(game.turn, ind);
    } else {
        pieceInfo.hide();
    }
    pieceButtons.update();
    moveDoneButton.update();
    toolTip.update();
    draw();
};

setLocs(canvas.width, canvas.height);
makeInfo();
gameArea.appendChild(info);
makePieceInfo();
gameArea.appendChild(pieceInfo);
makePieceButtons();
gameArea.appendChild(pieceButtons);
makeMoveDoneButton();
gameArea.appendChild(moveDoneButton);
gameArea.appendChild(moveDoneButton.resetButton);
makeToolTip();
gameArea.appendChild(toolTip);


var controlOb = {
    moveMade: false, resolveFunc: null, move: {pieceMoves: []},
    calculateMoveCost: function() {
        var totCost = 0;
        for (let i=0; i<controlOb.move.pieceMoves.length; i++) {
            let c = controlOb.move.pieceMoves[i];
            if (c && typeof c.cost==="number") totCost += c.cost;
        }
        return totCost;
    },
    calculateMoveCostIfAtIndIs: function(ind, val) {
        var totCost = 0;
        let endI = controlOb.move.pieceMoves.length;
        for (let i=0; i<endI; i++) {
            if (i===ind) {
                totCost += val;
            } else {
                let c = controlOb.move.pieceMoves[i];
                if (c && typeof c.cost==="number") totCost += c.cost;
            }
        }
        if (ind>=endI) totCost += val;
        return totCost;
    }
};
var selectedPiece = null;

var tillMoveWithControls = function() {
    return new Promise((resolve)=>{
        controlOb.resolveFunc = resolve;
    });
};

var playVisualGame = async function(players, controlPs=[]) {
    game.setPlayers(players);
    game.reset();
    resetInfo();
    update();
    canvas.focus();
    //players controlled by the user get their move from the controlOb
    // where it's made by UI-controls during each player's turn
    for (let i=0; i<controlPs.length; i++) {
        game.players[i].usingControls = !!controlPs[i];
        if (controlPs[i]) {
            game.players[i].getMove = _=>controlOb.move;
        }
    };
    game.turnCount = 0;
    var maxTurns = MAX_ROUNDS*game.players.length;
    while (game.turnCount<maxTurns) {
        if (controlPs[game.turn]) {
            controlOb.moveMade = false;
        }
        controlOb.move.pieceMoves = [];
        game.startTurn();
        update();
        if (game.currentPlayerHasWinWasps()) {
            console.log("Player "+game.turn+" wins!");
            break;
        }
        if (controlPs[game.turn]) {
            await tillMoveWithControls();
        } else {
            await sleep(COMPUTER_PLAYER_TIME_MS);
        }
        game.playTurn();
        game.endTurn();
        controlOb.resolveFunc = null;
        if (game.players.every(pl=>pl.dead)) {
            console.log("All players dead!");
            update();
            break;
        }
        do {
            game.changeTurn();
            game.turnCount++;
        } while (game.players[game.turn].dead);
        
        update();
    }
};




var selectPiece = function(ind) {
    selectedPiece = game.players[game.turn].pieces[ind];
    toolTip.lastOnInd = -1; //need to forget possible previous selection
    toolTip.hide();
    update();
};

var deselectPiece = function() {
    selectedPiece = null;
    update();
};


var setControlMove = function(piece, toCell) {
    var p = game.players[game.turn];
    var pcInd = p.pieces.indexOf(piece);
    if (pcInd<0) return;
    var dist = game.calcDistForPlayer(p, piece.cell, toCell);
    controlOb.move.pieceMoves[pcInd] = {cell: toCell, cost: p.getMoveCost(dist)};
    
    /*
    if (p.points>=cost) {
        controlOb.move.move = {piece: selectedPiece, toCell: game.board.cells[ind]};
        //deselectPiece();
        //controlOb.resolveFunc();
        //controlOb.moveMade = true;
    } else {
        console.warn("Can't afford move");
    }
    */
};

var clickedLoc = function(ind) {
    //console.log("clicked cell "+ind);
    var p = game.players[game.turn];
    if (selectedPiece && !selectedPiece.dead) {
        if (!controlOb.moveMade && typeof controlOb.resolveFunc === "function") {
            setControlMove(selectedPiece, game.board.cells[ind]);
        } else if (typeof controlOb.resolveFunc === "function") {
            console.warn("Not your turn");
        } else {
            console.warn("Not waiting for a move");
        }
    }
    update();
};

/** Index of cell that lies at the point (x, y) or -1 if there isn't one. */
var getCellAt = function(x, y) {
    for (let i=0; i<locs.length; i++) {
        let loc = locs[i];
        if ((loc.x-x)**2+(loc.y-y)**2 < loc.r**2) {
            return i;
            break;
        }
    }
    return -1;
};

var mousePos = {x: 0, y: 0};

canvas.onmousemove = function(evt) {
    var bdd = canvas.getBoundingClientRect();
    mousePos.x = evt.clientX-bdd.left;
    mousePos.y = evt.clientY-bdd.top;
    
    var p = game.players[game.turn];
    if (selectedPiece && !selectedPiece.dead) {
        var onInd = getCellAt(mousePos.x, mousePos.y);
        if (onInd>=0) {
            toolTip.show();
            if (toolTip.lastOnInd!==onInd) {
                let dist = game.calcDistForPlayer(p, selectedPiece.cell,
                                                  game.board.cells[onInd]);
                var costAmount = p.getMoveCost(dist);
                var selPcInd = p.pieces.indexOf(selectedPiece);
                var totCost = controlOb.calculateMoveCostIfAtIndIs(selPcInd, costAmount);
                var costClass = totCost>p.points?"cantAfford":"canAfford";
                var costLine = "<span class='"+costClass+"'> Cost: "+costAmount+"p</span>";
                toolTip.setTextLines(["Distance: "+dist, costLine]);
                toolTip.lastOnInd = onInd;
            }
            toolTip.setPosition(mousePos.x+15, mousePos.y);
        } else {
            toolTip.hide();
            toolTip.lastOnInd = -1;
        }
    } else {
        toolTip.hide();
        toolTip.lastOnInd = -1;
        //TODO show other info, piece stats?
    }
};

canvas.onmousedown = function(evt) {
    var onInd = getCellAt(mousePos.x, mousePos.y);
    if (onInd>=0) {
        clickedLoc(onInd);
    } else {
        deselectPiece();
    }
};

canvas.onkeyup = function(evt) {
    if (controlOb.moveMade) return;
    var k = evt.keyCode;
    //1=49,..., 9=57
    if (k>=49 && k<Math.min(58, 49+game.players[game.turn].pieces.length)) {
        selectPiece(k-49);
    } else if (k===48) {
        deselectPiece();
    }
};


/*
var dragged = null;

canvas.onmousedown = function(evt) {
    dragged = null;
    for (let i=0; i<locs.length; i++) {
        let loc = locs[i];
        if ((loc.x-mousePos.x)**2+(loc.y-mousePos.y)**2 < loc.r**2) {
            dragged = loc;
        }
    }
};

canvas.onmousemove = function(evt) {
    var bdd = canvas.getBoundingClientRect();
    mousePos.x = evt.clientX-bdd.left;
    mousePos.y = evt.clientY-bdd.top;
    
    if (dragged) {
        dragged.x = mousePos.x;
        dragged.y = mousePos.y;
        draw();
    }
};

canvas.onmouseup = function(evt) {
    dragged = null;
    draw();
};
*/