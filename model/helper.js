var sum = function(arr) {return arr.reduce((a,b)=>a+b, 0)};
var randBool = function(prob) {return Math.random()<prob;};
var randInt = function(low, up) {return low+((Math.random()*(up-low+1))|0)};
var randEl = function(arr) {return arr[randInt(0, arr.length-1)];};

/** Inherit A from B */
var inheritFrom = function(A, B) {
    A.prototype = Object.create(B.prototype);
    A.prototype.constructor = A;
};

/**
example:
async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
}
*/
var sleep = function(ms) {return new Promise(resolve => setTimeout(resolve, ms));};