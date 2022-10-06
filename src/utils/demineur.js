/**
 * Verify if a coordinate is present in an array
 * @param {array} tab 
 * @param {array} coord 
 * @returns if the coordinate is in the array
 */
const coordIsPresent = (tab, coord) => tab.some(ind => ind[0] === coord[0] && ind[1] === coord[1]);

/**
 * Generate a random number in a range
 * @param {int} min 
 * @param {int} max 
 * @returns a random number
 */
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

/**
 * Convert the coordinate from game to array
 * @param {array} coord 
 */
const tranformCoordForTab = (coord) => coord.map(ind => ind - 1);


/**
 * Convert the coordinate from array to game
 * @param {array} coord 
 */
const tranformCoordForGame = (coord) => coord.map(ind => ind + 1);

/**
 * Operators object
 */
const operators = {
    '+': function(a, b) { return a + b },
    '-': function(a, b) { return a - b }
};

/**
 * Verify if a coordinate is outside the range
 * @param {int} tabSize 
 * @param {array} coord 
 * @returns if a coordinate is outside the range
 */
const isCoordOutsideRange = (tabSize, coord) => coord[0] >= 0 && coord[0] < tabSize && coord[1] >= 0 && coord[1] < tabSize;

/**
 * Verify the number of click of all the game
 * @param {array} tab 
 * @returns the number of click of all the game
 */
const getCountOfClick = tab => tab.reduce((acc, current) => {
    return acc += current.reduce((acc2, current2) => {
        return acc2 += current2.isDiscovered ? 1 : 0;
    }, 0);
}, 0);

export { coordIsPresent, 
    generateRandomNumber,
    tranformCoordForTab, 
    tranformCoordForGame, 
    operators, 
    isCoordOutsideRange, 
    getCountOfClick };