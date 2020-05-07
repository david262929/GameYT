const width = 7;
const height = 7;
const size = {width, height};
const boomMinimumLimit = 3;
const {field_element, cells, getSuchka, getKey} = createField(size);

window.onload = () => {
    document.body.style.display = 'flex';
};

field_element.addEventListener("click", function (event) {
    const {target} = event;
    if (!target || field_element == target) {
        return;
    }
    var cellElement = target.closest(".cell");
    if (cellElement) {
        selectCell(cells[getKey(+cellElement.dataset.x, +cellElement.dataset.y)])
    } else {
        console.log('Viahkners vat e');
    }

});

const gameArea = document.createElement("div");
// const info = document.createElement("div");
// const time = document.createElement("div");
let count = 60;

// time.setAttribute('id', `time`);
// time.classList.add("time");
// info.appendChild(time)
// info.classList.add("info");

// gameArea.appendChild(info)
gameArea.classList.add("gameArea");
gameArea.appendChild(field_element);
document.body.appendChild(gameArea);


// boom();
//
// function boom() {
//     checkPics()
// }
//
// function checkPics() {
//
//     for (let x = 0; x < size.width; x++) {
//         let bigGroupsX = picLines(x).filter(function (group) {
//             return group.length >= 3;
//         })
//         bigGroupsX.forEach(function (group) {
//             group.forEach(function (cell) {
//                 cell.setPicID(0)
//             })
//             setTimeout(fallDown, 100);
//             setTimeout(addNewPic, 100)
//             // count += group.length + 1
//         })
//         for (let y = 0; y < size.height; y++) {
//             let bigGroupsY = picRows(y).filter(function (group) {
//                 return group.length >= 3;
//             })
//             bigGroupsY.forEach(function (group) {
//                 group.forEach(function (cell) {
//                     cell.setPicID(0)
//                 })
//                 setTimeout(fallDown, 100);
//                 setTimeout(addNewPic, 100)
//                 // count += group.length + 1
//             })
//         }
//     }
// }
//

//
//
// function swapPics(cell1, cell2) {
//     var x = cell1.getX();
//     var y = cell1.getY();
//
//     cell1.setX(cell2.getX());
//     cell1.setY(cell2.getY());
//
//     cell2.setX(x);
//     cell2.setY(y);
// }
//
// function nearPics(cell1, cell2) {
//     if ((cell1.getX() - cell2.getX() === 0 &&
//         cell1.getY() - cell2.getY() === 1) ||
//         (cell1.getX() - cell2.getX() === -1 &&
//             cell1.getY() - cell2.getY() === 0) ||
//         (cell1.getX() - cell2.getX() === 0 &&
//             cell1.getY() - cell2.getY() === -1) ||
//         (cell1.getX() - cell2.getX() === 1 &&
//             cell1.getY() - cell2.getY() === 0)
//     ) {
//         return true;
//     }
//     return false;
// }
//
//

const swapCells = (cur, prev, timer = 0) => new Promise( resolve => {
    let curX = cur.getX(), curY = cur.getY(), prevX = prev.getX(), prevY = prev.getY();
    [cells[getKey(curX, curY)], cells[getKey(prevX, prevY)]] = [cells[getKey(prevX, prevY)], cells[getKey(curX, curY)]];

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
        result.push(cells[getKey(...keys)]);
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

const getBoomerables = (cell) => {
    // cell.element.classList.add('suchka');
    const lines = getCurrLines(cell);
    const boomerable = [];
    Object.keys(lines).forEach(key => {
        let local_boomerable = [];
        let type = cell.getPicID();
        const line = lines[key];

        const coordNames = [];
        coordNames['horizontal'] = 'getX';
        coordNames['vertical'] = 'getY';

        line.forEach(local_cell => {
            if (type == local_cell.getPicID()) {
                if (local_boomerable.length) {
                    const localCellCoord = local_cell[coordNames[key]]();

                    const lastCell = local_boomerable[local_boomerable.length - 1];
                    const lastCellCoord = lastCell[coordNames[key]]();

                    if (Math.abs(localCellCoord - lastCellCoord) == 1) {
                        local_boomerable.push(local_cell);
                    }
                    return;
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
        }else{
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

const toShakeIt = (cell) => {
    const nearLines = getSuchka(cell.getX(), cell.getY(), 1);
    console.log(nearLines);
    Object.keys(nearLines).forEach(key => {
        nearLines[key].forEach( near => near.toShake());
    });
};

let prevCell = null;

function selectCell(currentCell) {

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
        // getSuchka(prevX, prevY, 1);
        return;
    }

    swapCells(currentCell, prevCell, 500).then((cur, prev) => {
        const boomed = initBoom(currentCell, prevCell);
        if(!boomed){
            swapCells(currentCell, prevCell);
        }
        prevCell.element.classList.remove("active");
        prevCell = null;
    });


    // let curNearbies = getSuchka(currentCell.getX(), currentCell.getY(), Infinity),
    //     prevNearbies = getSuchka(prevCell.getX(), prevCell.getY(), Infinity);

    // const boomeds = initBoom(currentCell); //, prevCell
    // if(boomeds.length){
    //     return;
    // }
    // swapCells(currentCell, prevCell);

    // let curHorizontal = [...curNearbies['left'].reverse(),currentCell, ...curNearbies['right'] ]
    //
    // //,
    // //         curVertical = [...curNearbies['bottom'].reverse(),currentCell, ...curNearbies['top'] ];
    //
    //     // prevHorizontal = [...prevNearbies['left'].reverse(),currentCell, ...prevNearbies['right'] ],
    //     // prevVertical = [...prevNearbies['bottom'].reverse(),currentCell, ...prevNearbies['top'] ];
    //
    // console.log(curHorizontal);
    // console.log(curVertical);
    // Object.keys(curNearbies).forEach((key) => {
    //     const nearbyLine = curNearbies[key];
    //     console.log(currentCell);
    //     nearbyLine.unshift(currentCell);
    //     getBoomerables(nearbyLine);
    // });


    // let isBoomerable =


    // if ((curX - prevX === 0 && curY - prevY === 1) ||
    //     (curX - prevX === -1 && curY - prevY === 0) ||
    //     (curX - prevX === 0 && curY - prevY === -1) ||
    //     (curX - prevX === 1 && curY - prevY === 0)
    // ) {
    //     console.log(currentCell, prevCell);
    //     return;
    // }
}

//
// function picLines(y) {
//
//     var picLIne = field.cells.filter(function (cell) {
//         return cell.getY() === y;
//     }).sort(function (cell1, cell2) {
//         return cell1.getX() - cell2.getX();
//     });
//     var result = [];
//     var currentGroup = [];
//
//     picLIne.forEach(function (currentCell) {
//
//         if (currentGroup.length === 0) {
//             currentGroup.push(currentCell);
//         } else {
//             var prevCell = currentGroup[0];
//             if (prevCell.getPicID() === currentCell.getPicID()) {
//                 currentGroup.push(currentCell);
//             } else {
//                 result.push(currentGroup);
//                 currentGroup = [currentCell]
//             }
//         }
//     })
//     result.push(currentGroup);
//     // console.log(result);
//     return result;
// }
//
// function picRows(x) {
//
//     var picRow = field.cells.filter(function (cell) {
//         return cell.getX() === x;
//     }).sort(function (cell1, cell2) {
//         return cell1.getY() - cell2.getY();
//     });
//     var result = [];
//     var currentGroup = [];
//
//     picRow.forEach(function (currentCell) {
//
//         if (currentGroup.length === 0) {
//             currentGroup.push(currentCell);
//         } else {
//             var prevCell = currentGroup[0];
//             if (prevCell.getPicID() === currentCell.getPicID()) {
//                 currentGroup.push(currentCell);
//             } else {
//                 result.push(currentGroup);
//                 currentGroup = [currentCell]
//             }
//         }
//     })
//     result.push(currentGroup);
//     // console.log(result);
//     return result;
// }
//
// function fallDown() {
//     for (let y = 0; y < size.height; y++) {
//         let column = field.cells.filter(function (cell) {
//             return (cell.getX() === y);
//         }).sort(function (cell1, cell2) {
//             return cell1.getY() - cell2.getY()
//         })
//
//         column.sort(function (cell1, cell2) {
//             let cell1Value = cell1.getPicID() === 0 ? 0 : 1;
//             let cell2Value = cell2.getPicID() === 0 ? 0 : 1;
//             let result = cell1Value - cell2Value;
//
//             return result;
//
//         }).forEach(function (cell, index) {
//             cell.setY(index)
//         })
//         // console.log(column);
//     }
// }
//
// function addNewPic() {
//     for (let x = 0; x < size.width; x++) {
//         var emptyCell = field.cells.filter(function (cell) {
//             return (cell.getPicID() === 0)
//         }).forEach(createRandomPic)
//     }
//     checkPics();
//     return emptyCell
// }
//
// function timeer() {
//
//     const time = document.getElementById("time")
//
//
//     setInterval(function () {
//         count--;
//         if (count >= 0) {
//             time.innerHTML = `00:${count}`;
//         }
//         if (count === 0) {
//             time.innerHTML = "Game Over"
//             clearInterval(timeer)
//         }
//     }, 1000)
//
//
// }
//
// timeer();