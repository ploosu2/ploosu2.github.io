
let funcText, solHolder, solText, derivInput, ownGuessBox, clueButton, skipButton, scoreText, levelText, levelUpButton, levelDownButton;

let game = new DerivativeGame();

//re typeset with this: MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

const getGuessValue = () => {
    //replace long minus-signs and weird multiplication-stars
    return (derivInput.value||"").replace(/−/g, '-').replace(/∗/g, '*');
};

const checkAnswer = () => {
    let toParse = getGuessValue();
    let corr = DFunc.testEquality(game.deriv, new DFunc(Node.parseFrom(toParse)));
    if (corr) {
        ownGuessBox.classList.add("correct");
        game.onGuessCorrect();
        buttonToNext();
        hintButton.disabled = true;
        updateInfo();
    } else {
        ownGuessBox.classList.remove("correct");
    }
};

const buttonToNext = () => {
    skipButton.innerHTML = "Seuraava";
    skipButton.classList.remove("skipButton");
    skipButton.classList.add("nextButton");
    skipButton.onclick = nextPuzzle;
};

const buttonToSkip = () => {
    skipButton.innerHTML = "Skippaa";
    skipButton.classList.remove("nextButton");
    skipButton.classList.add("skipButton");
    skipButton.onclick = skipPuzzle;
};

const showAnswer = () => {
    solHolder.style.visibility = "visible";
    solText.style.visibility = "visible";
    solText.innerHTML = " \\("+game.deriv.toMathJaxString()+"\\)";
    hintButton.disabled = true;
    updateMathJax();
    updateInfo();
};

const getHint = () => {
    game.revealHint();
    let hintStr = game.getHintString();
    solHolder.style.visibility = "visible";
    solText.style.visibility = "visible";
    solText.innerHTML = " "+hintStr.replace(/\?+/g, `<span class="hintHidden"> ? </span>`);
    
    //" \\("+hintStr+"\\)";
    //updateMathJax(); //don't turn to LaTex, better to copy the answer
    
    //TODO highlight the ??-areas
    
    hintButton.disabled = game.score<=0;
    updateInfo();
};

const skipPuzzle = () => {
    showAnswer();
    game.onReveal();
    buttonToNext();
    updateInfo();
};

const nextPuzzle = () => {
    makeNewFunc();
    solText.innerHTML = "";
    solHolder.style.visibility = "hidden";
    ownGuessBox.classList.remove("correct");
    ownGuessBox.innerHTML = "";
    derivInput.value = "";
    hintButton.disabled = game.score<=0;
    updateInfo();
};

const updateMathJax = () => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
};

const updateInfo = () => {
    levelText.innerHTML = game.level;
    scoreText.innerHTML = game.score;
};

const makeNewFunc = () => {
    game.generateFunc();
    game.onNewPuzzle();
    funcText.innerHTML = `\\(${game.func.toMathJaxString()}\\)`;
    updateMathJax();
    buttonToSkip();
};

const moveLevel = (move) => {
    game.moveLevel(move);
    levelDownButton.disabled = game.level<=game.minLevel;
    levelUpButton.disabled = game.level>=game.maxLevel;
    nextPuzzle();
};


window.onload = () => {
    funcText = document.getElementById("func");
    solHolder = document.getElementById("solutionHolder");
    solText = document.getElementById("solution");
    scoreText = document.getElementById("scoreText");
    levelText = document.getElementById("levelText");
    derivInput = document.getElementById("derivInput");
    ownGuessBox = document.getElementById("ownGuessBox");
    levelUpButton = document.getElementById("levelUpButton");
    levelDownButton = document.getElementById("levelDownButton");
    
    derivInput.addEventListener("input", (evt)=>{
        let node = Node.parseFrom(getGuessValue());
        let answFunc = new DFunc(node);
        answFunc.simplify();
        ownGuessBox.innerHTML = `$$ ${answFunc.toMathJaxString()} $$`;
        updateMathJax();
        checkAnswer(); //TODO not efficient to check on input??
    });
    
    hintButton = document.getElementById("clueButton");
    hintButton.onclick = () => {
        getHint();
    };
    
    skipButton = document.getElementById("skipButton");
    skipButton.onclick = skipPuzzle;
    
    levelUpButton.onclick = () => {moveLevel(1);};
    levelDownButton.onclick = () => {moveLevel(-1);};
    
    MathJax.Hub.Config({
      messageStyle: "none"
    });
    
    makeNewFunc();
    updateInfo();
};