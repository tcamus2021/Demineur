import React from "react";

/**
 * By Tanguy Camus
 * @param {object} props 
 * @returns a square in the grid
 */
const MyLittleCase = ({ isDiscovered, value, clickTreatment, gameFinish }) => {
    // Set-up
    const classNameOfCase = isDiscovered ? 'dem-case discovered' : 'dem-case no-discovered';
    const bombImg = value.isBomb ? './bomb.png' : null;

    return (
    <div className={classNameOfCase} onClick={() => gameFinish || clickTreatment(value.coord)}>
        {isDiscovered && 
            <img 
            src={bombImg || './img' + value.nearToBomb + '.png'} 
            alt={value.isBomb ? 'BOMB' : value.nearToBomb}/>}
    </div>)
};

export default MyLittleCase;