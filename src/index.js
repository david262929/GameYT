const game = document.querySelector('#game');
const start = document.querySelector('#start');

start.style.display = 'none';

import {toShakeIt, getSuchka, generateKey} from './assets/functions';
import {width, height, boomMinimumLimit, eachTypeResultValue} from './assets/configs';
import {createField} from './assets/createField';
import {Timer} from './assets/timer';
import {Results} from './assets/results';


let prevCell = null;
const {field_element, cells} = createField(width, height);
game.appendChild(field_element);
field_element.style.width = `${width}em`;
field_element.style.height = `${height}em`;


const swapCells = (cur, prev, timer = 0) => new Promise(resolve => {
    let curX = cur.getX(), curY = cur.getY(), prevX = prev.getX(), prevY = prev.getY();
    [cells[generateKey(curX, curY)], cells[generateKey(prevX, prevY)]] = [cells[generateKey(prevX, prevY)], cells[generateKey(curX, curY)]];

    cur.setX(prevX);
    cur.setY(prevY);
    prev.setX(curX);
    prev.setY(curY);

    setTimeout(() => resolve(), timer);
});

const getLine = (cell, coordName) => {
    let isXCoord = coordName == 'x';
    let limit = isXCoord ? width : height;
    let result = [];
    let i = 0;
    while (i < limit) {
        const keys = [];
        if (isXCoord) {
            keys.push(i);
            keys.push(cell.getY());
        } else {
            keys.push(cell.getX());
            keys.push(i);
        }
        result.push(cells[generateKey(...keys)]);
        ++i;
    }
    return result;
};

const getCurrLines = (cell) => {
    return {
        horizontal: getLine(cell, 'x'),
        vertical: getLine(cell, 'y'),
    };
};

const selectCell = (currentCell) => {
    if (currentCell === prevCell) {
        prevCell.element.classList.remove("active");
        prevCell = null;
        return
    }
    if (prevCell === null) {
        prevCell = currentCell;
        prevCell.element.classList.add("active");
        return
    }

    const curX = currentCell.getX();
    const curY = currentCell.getY();
    const prevX = prevCell.getX();
    const prevY = prevCell.getY();

    if (
        !(
            (curX == prevX && (Math.abs(prevY - curY) == 1))
            || (curY == prevY && (Math.abs(prevX - curX) == 1))
        )
    ) {
        toShakeIt(prevCell);
        prevCell.element.classList.remove("active");
        prevCell = null;
        return;
    }

    swapCells(currentCell, prevCell, 500).then((cur, prev) => {
        const boomed = initBoom(currentCell, prevCell);
        if (!boomed) {
            swapCells(currentCell, prevCell);
        }
        prevCell.element.classList.remove("active");
        prevCell = null;
    });
};

const getBoomerables = (cell) => {
    // cell.element.classList.add('suchka');
    const lines = getCurrLines(cell);
    const boomerable = [];
    Object.keys(lines).forEach(key => {
        let local_boomerable = [];
        let type = cell.getPicID();
        const line = lines[key];

        const coordNames = {
            horizontal: 'getX',
            vertical: 'getY',
        };

        line.forEach(local_cell => {
            if (type == local_cell.getPicID()) {
                if (local_boomerable.length) {
                    const localCellCoord = local_cell[coordNames[key]]();

                    const lastCell = local_boomerable[local_boomerable.length - 1];
                    const lastCellCoord = lastCell[coordNames[key]]();

                    if (Math.abs(localCellCoord - lastCellCoord) !== 1) {
                        return;
                    }
                }

                local_boomerable.push(local_cell);
                return;
            }

            if (!local_boomerable.includes(cell)) {
                type = local_cell.getPicID();
                local_boomerable = [local_cell];
            }
        });
        if (local_boomerable.length < boomMinimumLimit || !local_boomerable.includes(cell)) {
            return;
        }
        boomerable[key] = local_boomerable;
    });
    return boomerable;
};

const boom = (cell) => {
    const destroingCellId = cell.getPicID();
    if (eachTypeResultValue[destroingCellId]) {
        Timer.plusSeconds(eachTypeResultValue[destroingCellId]);
    }
    Results.add(destroingCellId);

    cell.destroyCell();

    const boomedData = {
        oldCoordinate: {
            x: cell.getX(),
            y: cell.getY(),
        },
        cell,
    };

    let topCellsOfCurrent = getSuchka(boomedData.oldCoordinate.x, boomedData.oldCoordinate.y, Infinity, '', 'top');
    topCellsOfCurrent = topCellsOfCurrent['top'] || [];

    topCellsOfCurrent.forEach(topCellOfCurrent => {
        swapCells(topCellOfCurrent, cell);
    });

    return boomedData;
};

const boomedsRecruite = (boomedData) => {
    const { oldCoordinate, cell } = boomedData;

    let bottomCellsOfBoomedCell = getSuchka(cell.getX(), cell.getY(), oldCoordinate.y, '', 'bottom' );
    bottomCellsOfBoomedCell = bottomCellsOfBoomedCell['bottom'] || [];

    bottomCellsOfBoomedCell.unshift(cell);

    bottomCellsOfBoomedCell.forEach( bottomCellOfBoomedCell => {
        setTimeout(() => {
            initBoom(bottomCellOfBoomedCell);
        }, 250);
    });
};

const initBoom = (...cellsForcheck) => {
    let haveBoomed = false;
    let boomedMainCells = [];
    let boomedsData = [];

    cellsForcheck.forEach((cell, index) => {
        const boomerables = getBoomerables(cell);

        if (index === cellsForcheck.length - 1 && haveBoomed) {
            // console.log(boomedMainCells);
            boomedMainCells.forEach(boomedMainCell => boomedsData.push( boom(boomedMainCell) ) );
        }

        if (!boomerables['horizontal'] && !boomerables['vertical']) {
            return;
        }
        haveBoomed = true;
        Object.keys(boomerables).forEach(key => {
            const lineOfBoomerables = boomerables[key];
            lineOfBoomerables.forEach(boomerable => {
                if (boomerable == cell) {
                    return;
                }
                boomedsData.push( boom(boomerable) )
            });
        });
        if (index === cellsForcheck.length - 1 && haveBoomed) {
            boomedsData.push( boom(cell) )
        } else {
            boomedMainCells.push(cell);
        }

    });

    boomedsData.forEach(boomedData => {
        setTimeout(() => {
            // boomedData.cell.element.classList.add('suchka');
            boomedData.cell.randomPic();
            boomedsRecruite(boomedData);
        }, 250);
    });


    return haveBoomed;
};

window.addEventListener('load', () => {
    document.body.style.display = 'flex';
    setTimeout(Timer.start, 200);

    field_element.addEventListener("click", function (event) {
        const {target} = event;
        if (!target || field_element == target) {
            return;
        }
        const cellElement = target.closest(".cell");
        if (!cellElement) {
            return;
        }
        const key = generateKey(+cellElement.dataset.x, +cellElement.dataset.y);
        selectCell(cells[key]);
    });
});

