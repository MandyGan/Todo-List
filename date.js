//jshint esversion:6
module.exports = getDate;

function getDate() {

let today = new Date();
// var currentDay = today.getDay();
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let day = today.toLocaleDateString("en-US", options);
return day;
}

module.exports.getDay = getDay;

function getDay() {

    let today = new Date();
    // var currentDay = today.getDay();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    let day = today.toLocaleDateString("en-US", options);
    return day;
    }
    

