import {toShakeIt, getSuchka} from './assets/functions';
import {width, height, boomMinimumLimit} from './assets/configs';
import {createField} from './assets/createField';

const game = document.querySelector('#game');
const start = document.querySelector('#start');
const loading = document.querySelector('#loading');

let prevCell = null;
const size = {width, height};
const {gameArea, field_element, cells} = createField(width, height);
game.appendChild(gameArea);

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
        const keys = [cell.getX(), i];
        if (isXCoord) {
            keys.reverse();
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
            horizontal : 'getX',
            vertical : 'getY',
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
    cell.destroy();
    let topCellsOfCurrent = getSuchka(cell.getX(), cell.getY(), Infinity, '', 'top');
    topCellsOfCurrent = topCellsOfCurrent['top'] || [];

    topCellsOfCurrent.forEach(topCellOfCurrent => {
        swapCells(topCellOfCurrent, cell);
    });

};

const initBoom = (...cells) => {
    let haveBoomed = false;
    let boomedMainCells = [];
    let boomeds = [];

    cells.forEach((cell, index) => {
        const boomerables = getBoomerables(cell);

        if (index === cells.length - 1 && haveBoomed) {
            // console.log(boomedMainCells);
            boomedMainCells.forEach(boomedMainCell => {
                boom(boomedMainCell);
                boomeds.push(boomedMainCell);
            });
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
                boom(boomerable);
                boomeds.push(boomerable);
            });
        });
        if (index === cells.length - 1 && haveBoomed) {
            boom(cell);
            boomeds.push(cell);
        } else {
            boomedMainCells.push(cell);
        }
    });

    boomeds.forEach(boomed => {
        // boomed.element.classList.add('suchka');
        setTimeout(() => {
            boomed.randomPic();
            initBoom(boomed);
        }, 250);
    });


    return haveBoomed;
};

window.addEventListener('load', () => {
    document.body.style.display = 'flex';
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
        selectCell( cells[key] );
    });
});

