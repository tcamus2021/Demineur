import { GAME_STATE, ORIENTATION } from "../constants/constants";
import { coordIsPresent, generateRandomNumber, getCountOfClick, isCoordOutsideRange, operators, tranformCoordForGame, tranformCoordForTab } from "../utils/demineur";

/**
 * Generate a random coordinate for the bomb (without double)
 * @param {array} tab 
 * @param {int} size 
 * @returns one random coordinate wich is not present in the array
 */
 const getRandomInd = (tab, size) => {
    let response = null;
    const ind1 = generateRandomNumber(1, size+1);
    const ind2 = generateRandomNumber(1, size+1);
    if(coordIsPresent(tab, [ind1, ind2])){
        response = getRandomInd(tab);
    } else {
        response = [ind1, ind2];
    }
    return response;
};

/**
 * Treatment of the reveal of a case
 * @param {array} tab 
 * @param {array} coord 
 */
 const revealCase = (tab, coord) => tab[coord[0]-1][coord[1]-1].isDiscovered = true;

/**
 * Generate the grid game
 * @param {int} size 
 * @returns the grid game
 */
 const generateGameGrid = (size) => {
    const matrix = createMatrix(size);
    const bombs = generateBombsCoord(size);
    const copy = [];
    let counteurDim1 = 1;
    matrix.forEach((ligne) => {
        let counteurDim2 = 1;
        const ligneCopy = []
        ligne.forEach(() => {
            ligneCopy.push({ 
                coord: [counteurDim1, counteurDim2],
                isBomb: coordIsPresent(bombs, [counteurDim1, counteurDim2]),
                nearToBomb: calculateValueOfACase(bombs, [counteurDim1, counteurDim2]),
                isDiscovered: false
            });
            counteurDim2++;
        })
        copy.push(ligneCopy);
        counteurDim1++;
    })
    return copy;
};

/**
 * Calculate the differents values from the grid
 * @param {array} bombs 
 * @param {array} coord 
 * @returns the value
 */
 const calculateValueOfACase = (bombs, coord) => {
    let weight = 0;
    if(coordIsPresent(bombs, coord)){
        weight = -1;
    } else {
        const differentsOperations = [];
        for(let value in ORIENTATION){
            differentsOperations.push(getOperationOnCoordWithOrientation(value));
        }
        differentsOperations.forEach((operation) => {
            let coord1ValueToTest = operation.coord1op ? operators[operation.coord1op](coord[0], 1) : coord[0];
            let coord2ValueToTest = operation.coord2op ? operators[operation.coord2op](coord[1], 1) : coord[1];
            if(coordIsPresent(bombs, [coord1ValueToTest, coord2ValueToTest])){
                weight++;
            }
        });
        return weight;
    }
};

/**
 * create an empty array to start the game
 * @param {int} size 
 * @returns the matrix
 */
 const createMatrix = (size) => {
    const matrix = Array(size);
    const ligne = Array(size);
    ligne.fill(0);
    matrix.fill(ligne);
    return matrix;
};

/**
 * Generate bombs
 * @param {int} size 
 * @returns an array full of coordinate of bombs
 */
 const generateBombsCoord = (size) => {
    const bombs = Array(size);
    for (let index = 0; index < bombs.length; index++) {
        bombs[index] = getRandomInd(bombs, size);
    }
    return bombs;
};

/**
 * Verify the square around are revealable
 * @param {function} revealMethod 
 * @param {array} coord 
 * @param {array} tab 
 */
 const verifyIfOthersAreRevealable = (revealMethod, coord, tab) => {
    coord = coord.map(ind => ind - 1);
    if(tab[coord[0]][coord[1]].nearToBomb === 0){
        for(let value in ORIENTATION){
            verifyASpecificOrientation(tab, coord, revealMethod, value);
        }
    }
};

/**
 * Explicit list of the differents operations to find the squares arround
 * @param {ORIENTATION} orientation 
 * @returns the list of the differents operations to find the squares arround
 */
 const getOperationOnCoordWithOrientation = (orientation) => {
    let operation = {};
    switch(ORIENTATION[orientation]){
        case ORIENTATION.NORTH : operation = { coord1op: '+', coord2op: false};break;
        case ORIENTATION.SOUTH : operation = { coord1op: '-', coord2op: false};break;
        case ORIENTATION.EAST : operation = { coord1op: false, coord2op: '+'};break;
        case ORIENTATION.WEST : operation = { coord1op: false, coord2op: '-'};break;
        case ORIENTATION.NORTH_EAST : operation = { coord1op: '+', coord2op: '+'};break;
        case ORIENTATION.NORTH_WEST : operation = { coord1op: '+', coord2op: '-'};break;
        case ORIENTATION.SOUTH_EAST : operation = { coord1op: '-', coord2op: '+'};break;
        default : operation = { coord1op: '-', coord2op: '-'};
    }
    return operation;
};

/**
 * Verify a specific operation in function of an orientation
 * @param {array} tab 
 * @param {array} coord 
 * @param {function} revealMethod 
 * @param {ORIENTATION} orientation 
 */
 const verifyASpecificOrientation = (tab, coord, revealMethod, orientation) => {
    const operation = getOperationOnCoordWithOrientation(orientation);
    const coord1ValueToTest = operation.coord1op ? operators[operation.coord1op](coord[0], 1) : coord[0];
    const coord2ValueToTest = operation.coord2op ? operators[operation.coord2op](coord[1], 1) : coord[1];
    if(isCoordOutsideRange(tab.length, [coord1ValueToTest, coord2ValueToTest])){
        if(!tab[coord1ValueToTest][coord2ValueToTest].isDiscovered ){
            tab[coord1ValueToTest][coord2ValueToTest].isDiscovered = true;
            if(tab[coord1ValueToTest][coord2ValueToTest].nearToBomb === 0){
                revealMethod(tranformCoordForGame([coord1ValueToTest, coord2ValueToTest]));
            }
        }
    }
};

/**
 * Verify if the game is win or loose
 * @param {array} tab 
 * @param {array} coord 
 * @param {int} size 
 * @returns if the game is win, loose or continue
 */
 const stateOfTheGame = (tab, coord, size) => {
    const coordForTab = tranformCoordForTab(coord);
    const coordToTest = tab[coordForTab[0]][coordForTab[1]];
    if(coordToTest.isBomb && coordToTest.isDiscovered){
        tab.forEach(ligne => ligne.map(elem => elem.isDiscovered = elem.isBomb || elem.isDiscovered));
        return GAME_STATE.LOOSE
    }
    const cpt = getCountOfClick(tab);
    if(cpt === ((size*size)-size)){
        return GAME_STATE.WIN
    }
    return GAME_STATE.IN_PROGESS;
};

export {
    generateGameGrid, 
    revealCase, 
    stateOfTheGame, 
    verifyIfOthersAreRevealable
};