import React, { useState } from "react";
import { generateGameGrid, stateOfTheGame, verifyIfOthersAreRevealable, revealCase } from "../../business/demineurBusiness";
import { GAME_STATE } from "../../constants/constants";
import MyLittleCase from "./MyLittleCase";

/**
 * By tanguy camus
 * @returns Layout and state of the game
 */
const Demineur = () => {
    // Set up
    const size = 8;
    const [matrix, setMatrix] = useState(generateGameGrid(size));
    const [gameState, setGameState] = useState(GAME_STATE.IN_PROGESS);

    /**
     * Treatment of the click
     * @param {array} coord 
     */
    const clickTreatment = async (coord) => {
        const copy = matrix.slice();
        revealCase(copy, coord);
        verifyIfOthersAreRevealable(clickTreatment, coord, copy);
        setGameState(stateOfTheGame(copy, coord, size));
        setMatrix(copy);
    }

    return (
    <div className="dem-container">
        <h1>{gameState}</h1>
        <div className="dem-tab">
            {matrix.map(ligne => ligne.map(theCase => <MyLittleCase 
            key={theCase.coord} 
            value={theCase}
            isDiscovered={theCase.isDiscovered}
            gameFinish={gameState !== GAME_STATE.IN_PROGESS}
            clickTreatment={(coord) => clickTreatment(coord)} />)) }
        </div>
        {gameState !== GAME_STATE.IN_PROGESS && <input type={'button'} onClick={() => window.location.reload()} value={'Restart'} />}
    </div>)
};

export default Demineur;