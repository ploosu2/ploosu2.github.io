
const randBool = prob => Math.random()<prob;
const randInt = (l, h) => l+Math.floor(Math.random()*(h-l+1));
const sum = a => a.reduce((c, x)=>c+x, 0);

const getRandFrom = (a, ps) => {
    if (!ps) return a[randInt(0, a.length-1)];
    let u = Math.random()*sum(ps);
    let p = 0;
    for (let i=0; i<a.length; i++) {
        p += ps[i];
        if (p>=u) return a[i];  
    }
    console.warn("ran out of elements in getRandFrom");
    return a[a.length-1]; //shouldn't get here
};

const isNumber = s=>!Number.isNaN(+s);

const makeHiddenString = val => {
    if (val===undefined || val===null) return val;
    let len = val.toString().length;
    return new Array(len).fill('?').join("");
};

