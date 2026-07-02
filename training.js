// Additions 

// var sum = 10 + 20;
// console.log(sum);

// var MariaMus = 0;
// var lastname = "Musyoka";

// MariaMus = lastname.length;
// console.log(MariaMus)

// var firstMaria = "";
// var firstName = "Maria";

// firstMaria = firstName[0];
// console.log(firstMaria);

/* #Practice Comparing Different Values 

function compareEquality(a, b) {
    if (a == b) {
        return "Equal";
    }
    return "Not Equal";
}

console.log(compareEquality(10, "10"));

*/

 /* Comparison with the Inequality Operator 
 - created one of my own
 
 function compareInequality(a, b) {
    if (a >= b ) {
        return "More than";
    }
    return "Not more than";
 }

 console.log(compareInequality(10, 20));

 function testNotEqual(val) {
    if (val != 99) {
        return "Not Equal";
    }
    return "Equal";
 }

 console.log(testNotEqual(30)); */

 /* Comparison with the Strict Inequality Operator 
 function testStrictNotEqual(val) {
    if (val !== 39) {

        return "Not Equal";
    }
    return "Equal";
 }
 console.log(testStrictNotEqual(39)); */

 /* Comparisons with the Logical and Operator 
function testGreaterThan(val){
if (val > 20) {
    return "over 20";
 }
if (val > 10) {
    return "over 10";
 }
if (val > 5) {
    return "over 5";
 }
 
}
 
console.log(testGreaterThan(25));
console.log(testGreaterThan(15)); */

/* Comparison with the Greater Than Or Equal To Operator 

function testGreaterThanOrEqual(val){
if (val >= 20) {
    return "over 20";
 }
if (val >= 10) {
    return "over 10";
 }
if (val >= 5) {
    return "over 5";
 }
 
}

console.log(testGreaterThanOrEqual(6)); */

/* Comparisons with the Logical And Operator 
function logicalAnd(val){
if (val <= 50 && val >= 25) {
    return "Yes";
}
return "No";
}

console.log(logicalAnd(35));
console.log(logicalAnd(9)); */

/* Comparisons with the Logical Or Operator 

function logicalOr(val){

    if (val < 5 || val > 25) {
        return "Upward";
    }
    return "Downward";
}

console.log(logicalOr(36)); */

/* Else Statements 

function elseState(val) {
    var result = "";

    if (val > 5) {
        result = "more than 5";
    } else {
        result = "less than 5";
    }

    return result;
}
console.log(elseState(9)); */

/* Else If Statements 

function testElseIf(val) {
    if (val < 5 && val > 10) {
        return "Between 5 and 10";
    } else if (val < 5) {
        return "less than 5";
    } else {
        return "Its a number for sure!";
    }
}

console.log(testElseIf(1)); */

/* Chaining If Else Statements
 - else if statement needs a value
 - else doesn't need a value

function testSize(num) {
    if (num < 5) {
        return "tiny";
    } else if (num < 10) {
        return "small";
    } else if (num < 15) {
        return "medium";
    } else if (num < 20) {
        return "large";
    } else {
        return "huge";
    }
}

console.log(testSize(18)); */

/* Switch Statements 

function caseInSwitch(val) {
    var answer = " ";
    switch(val) {
        case 1: 
        answer = "alpha";
        break;
        case 2:
        answer = "beta";
        break;
        case 3:
        answer = "gamma";
        break;
    }

    return answer;
}

console.log(caseInSwitch(2)); */


/* Default Option in Switch Statements 
function defaultTest(val) {
    var answer = "";
    switch (val) {
        case "a":
            answer = "apple";
            break;
        case "b":
            answer = "bat";
            break;
        case "c":
            answer = "chain";
            break;
        default:
            answer = "stuff";
            break;
    }
        return answer;
}

console.log(defaultTest(56)); */

/* Build JavaScript Objects 
 - access data using properties

var ourDog = {
    "name": "Camper",
    "legs": 4,
    "tails": 1,
    "friends": ["4"]
}; */

/* Accessing Object Properties with Dot Notation 
var testObj = {
    "hat": "ballcap",
    "shirt": "jersey",
    "shoes": "cleats"
};

var hatValue = testObj.hat;
var shirtValue = testObj.shirt;

console.log(testObj.hat);
console.log(hatValue); */

/* Iterate Through an Array with a For Loop 

var myArr = [ 2, 3, 4, 5, 6];
var total = 0;

for (var i = 0; i < myArr.length; i++) {
    total += myArr[i];
}

console.log(total); */

/* Nesting for loops 

var myArray = [];
var i = 20;

do {
    myArray.push(i);
    i++;
} while (i < 5)

console.log(i, myArray); */

/* Generate Random Fractions 

function randomFraction(){
    return Math.random();
}

console.log(randomFraction()); */

/* Generate Random Whole Numbers 

function randomWholeNum() {

    return Math.floor(Math.random() * 10);
}

console.log(randomWholeNum()); */

/* Generate Random Whole Numbers within a Range 

function randomRange(myMin, myMax) {
    return Math.floor(Math.random() * (myMax - myMin +1)) + myMin;
}

var myRandom = randomRange(5, 15);

console.log(myRandom); */

/* Use the parseInt Function 

function convertToInteger(str) {
    return parseInt(str);
}

console.log(convertToInteger("to")); */

/* Use the parseInt Function with a Radix 

function convertToInteger(str) {
    return parseInt(str, 2)
}

console.log(convertToInteger("100")); */

/* Use Multiple Conditional (Ternary) Operators 

function checkSign(num) {

    return num > 0 ? "positive" : num < 0 ? "negative" : "zero"
} 

console.log(checkSign(-10)); */

/* Compare Scopes of the var and let Keywords 
- declared variable using var, can be used on a global scope
- let is limited to the block statement or expression that it was declared in 

function checkscope() {
    "use strict";
        let i = "function scope";
        if (true) {
            let i = "block scope";
            console.log("Block scope i is: ", i);
        }
        console.log("Function scope i is: ", i);
        return i;
}

console.log(checkScope()); */

/* Declare a Read-Only Variable with the const Keyword 

function printManyTimes(str) {
    "use strict";

    var sentence = str + " is cool";

    sentence = str + " is amazing"

    for(var i = 0; i < str.length; i+=2) {
        console.log(sentence);
    }
}

console.log(printManyTimes("freeCodeCamp")); */

/* Freeze Objects 

function freezeObj() {
    "use strict";
    const MATH_CONSTANTS = {
        PI: 3.14
    };

Object.freeze(MATH_CONSTANTS)

try {
    MATH_CONSTANTS.PI = 99;
    } catch( ex ) {
        console.log(ex);
    }
    return MATH_CONSTANTS.PI;
}

const PI = freezeObj(); */

/* Write Arrow Functions with Parameter 

var myConcat = function(arr1, arr2) {
    return arr1.concat(arr2);
};

var myConcat = (arr1, arr2) => arr1.concat(arr2); 

console.log(myConcat([1, 2] [3, 4, 5])); */

/* Write Higher Order Arrow Functions */
const increment = (function() {
    return function increment(number, value) {
        return number + value;
    };
})();

console.log(increment(5, 2));
console.log(increment(9));

/* Use the Rest Operator with Function Parameters */
const sum = (function() {
    return function sum(...args) {
        return args.reduce((a, b) => a + b, 0);
    };
})();
console.log(sum(1, 2, 3, 4));

/* Use Destructuring Assignment to Assign Variables from Arrays */

const [z, x, , y] = [1, 2, 3, 4, 5, 6];
console.log(z, x, y);

let a = 8, b = 6;
(() => {
    "use strict";
    [a, b] = [b, a]
})();

console.log(a);
console.log(b);

/* Use Destructuring Assignment with the Rest Operator */

const source = [1,2,3,4,5,6,7,8,9,10];
function removeFirstTwo(list) {
    const [ , , ...arr] = list;

    return arr;
}

const arr = removeFirstTwo(source);
console.log(arr);
console.log(source);

/* Use Destructuring Assignment to Pass an Object as a Function's Parameters */
const person = {
    name: "Zodiac Hasbro",
    age: 56
};

const greeting = `Hello, my name is ${person.name}!
I am ${person.age} years old.`

console.log(greeting);

const result = {
    success: ["max-length", "no-amd", "prefer-arrow-functions"],
    failure: ["no-var", "var-on-top", "linebreak"],
    skipped: ["id-blacklist", "no-dup-keys"]
};

function makeList(arr) {
    const resultDisplayArray = [];
    for (let i = 0; i < arr.length; i++) {
        resultDisplayArray.push(`<li class="text-warning">${arr[i]}</li>`)
    }
    return resultDisplayArray;
}

const resultDisplayArray = makeList(result.failure);

console.log(resultDisplayArray);

/* Write Concise Object Literal Declarations Using Simple Fields */

const createPerson = (name, age, gender) => ( { name, age, gender });
console.log(createPerson("Zodiac Hasbro", 56, "male"));

/* Use getters and setters to Control Access to an Object */

/* Differences Between import and require */
const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export { capitalizeString };

export const foo = "bar";
export const bar = "foo";

/* Importing everything */

import * as capitalizeStrings from "capitalize_strings";