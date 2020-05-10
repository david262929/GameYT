import {generateKey, getSuchka, toShakeIt} from "@assets/functions";
import {boomMinimumLimit, eachTypeResultValue, gameElement, height, width} from "@assets/configs";
import {Timer} from "@assets/timer";
import {Results} from "@assets/results";
import {createField} from "@assets/createField";

let prevCell = null;
let field_element;
const events = {};

const call = (key) => {
    const playCallbacks = events[key] || [];
    playCallbacks.forEach(playCallback => playCallback());
};


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
    switch (prevCell) {
        case currentCell:
            prevCell.element.classList.remove("active");
            prevCell = null;
            return
        case null:
            prevCell = currentCell;
            prevCell.element.classList.add("active");
            return
        default:
            currentCell.element.classList.add("active");
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
        setTimeout(() => currentCell.element.classList.remove("active"), 200);
        prevCell = null;
        return;
    }

    swapCells(currentCell, prevCell, 500).then((cur, prev) => {
        const boomed = initBoom(currentCell, prevCell);
        if (!boomed) {
            swapCells(currentCell, prevCell);
        }
        prevCell.element.classList.remove("active");
        currentCell.element.classList.remove("active");
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
    const {oldCoordinate, cell} = boomedData;

    let bottomCellsOfBoomedCell = getSuchka(cell.getX(), cell.getY(), oldCoordinate.y, '', 'bottom');
    bottomCellsOfBoomedCell = bottomCellsOfBoomedCell['bottom'] || [];

    bottomCellsOfBoomedCell.unshift(cell);

    bottomCellsOfBoomedCell.forEach(bottomCellOfBoomedCell => {
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

        if (boomerables['horizontal'] || boomerables['vertical']) {
            Object.keys(boomerables).forEach(key => {
                const lineOfBoomerables = boomerables[key];
                lineOfBoomerables.forEach(boomerable => {
                    if ( cellsForcheck.includes(boomerable) ) {
                        boomedMainCells.push(boomerable);
                        return;
                    }
                    haveBoomed = true;
                    boomedsData.push(boom(boomerable));
                });
            });
        }

        if (index === cellsForcheck.length - 1 && haveBoomed) {
            boomedMainCells.forEach(boomedMainCell => {
                boomedsData.push(boom(boomedMainCell));
            });
        }
    });

    boomedsData.forEach(boomedData => {
        setTimeout(() => {
            boomedData.cell.randomPic();
            boomedsRecruite(boomedData);
        }, 250);
    });

    return haveBoomed;
};

Timer.on('end', () => call('time-ended'));

export const Game = {
    on: (eventName, callback) => {
        const callbackFromEventName = events[eventName] || [];
        callbackFromEventName.push(callback);
        events[eventName] = callbackFromEventName;
        return this;
    },
    init: () => new Promise(resolve => {
        Timer.init();
        Results.init();
        field_element = createField(width, height).field_element;
        field_element.addEventListener("click", function (event) {
            const {target} = event;
            if (!target || field_element === target) {
                return;
            }
            const cellElement = target.closest(".cell");
            if (!cellElement) {
                return;
            }
            const key = generateKey(+cellElement.dataset.x, +cellElement.dataset.y);
            selectCell(cells[key]);
        });
        gameElement.appendChild(field_element);
        resolve();
    }),
    reset: () => new Promise(resolve => {
        Timer.reset();
        Results.reset();
        gameElement.classList.add('hideIcons');
        if(field_element.parentNode){
            field_element.parentNode.removeChild(field_element);
        }
        resolve();
    }),
    start : (callback) => {
        Timer.start();
        gameElement.classList.remove('hideIcons');
        if(callback){
            setTimeout(() => {
                callback()
            },200);
        }
    },
    stop : () => {
        Timer.stop();
    },
    getMenuOpener: () => {
        return gameElement.querySelector('.menuOpener');
    },
};;