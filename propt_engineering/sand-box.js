// Additions 

// var sum = 10 + 20;
// console.log(sum);


// var MariaMus = 0;
// var lastname = "Musyoka";

// MariaMus = lastname.length;
// console.log(MariaMus)

var firstMaria = "";
var firstName = "Maria";

firstMaria = firstName[0];
console.log(firstMaria);

var outerWear = "T-shirt";

function myOutfit() {
    var outerWear = "sweater"

    return outerWear;
}

console.log(myOutfit());
console.log(outerWear);


function trueOrFalse(wasThatTrue) {
    if (wasThatTrue) {
        return "Yes, that was true";
    }
    return "No, that was false";
}   

console.log(trueOrFalse(true));
console.log(trueOrFalse(false));


var testObj = {
    "an entree": "hamburger",
    "my side": "veggies",
    "the drink": "water"
};

var entreeValue = testObj["an entree"];
var drinkValue = testObj["my side"];