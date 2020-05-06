const size = {width: 7, height: 7};
const {field_element, cells, getSuchka} = createField(size);
console.log(getSuchka(3, 3, 2));
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
//                 cell.setPic(0)
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
//                     cell.setPic(0)
//                 })
//                 setTimeout(fallDown, 100);
//                 setTimeout(addNewPic, 100)
//                 // count += group.length + 1
//             })
//         }
//     }
// }
//
// field.element.addEventListener("click", function (event) {
//     var cellElement = event.target.closest(".cell");
//     if (cellElement) {
//         var foundCell = field.cells.find(function (cell) {
//             return cell.getX() === +cellElement.dataset.x && cell.getY() === +cellElement.dataset.y
//         });
//     }
//     selectPic(foundCell)
// });
//
// let prevCell = null;
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
// function selectPic(currentCell) {
//
//     if (currentCell === prevCell) {
//         prevCell.element.classList.remove("active")
//         prevCell = null;
//         return
//     }
//     if (prevCell === null) {
//         prevCell = currentCell;
//         prevCell.element.classList.add("active")
//         return
//     }
//     if (nearPics(prevCell, currentCell)) {
//         swapPics(prevCell, currentCell)
//         for (let x = 0; x < size.width; x++) {
//             let bigGroupsX = picLines(x).filter(function (group) {
//                 return group.length >= 3;
//             })
//             bigGroupsX.forEach(function (group) {
//                 group.forEach(function (cell) {
//                     if (cell.getPic() === 5) {
//                         count++;
//                     }
//                     cell.setPic(0)
//                 })
//                 fallDown();
//                 setTimeout(addNewPic, 10)
//                 // count += group.length+1
//             })
//         }
//         for (let y = 0; y < size.height; y++) {
//             let bigGroupsY = picRows(y).filter(function (group) {
//                 return group.length >= 3;
//             })
//             bigGroupsY.forEach(function (group) {
//                 group.forEach(function (cell) {
//                     if (cell.getPic() === 5) {
//                         count++;
//                     }
//                     cell.setPic(0)
//                 })
//                 fallDown();
//                 setTimeout(addNewPic, 10)
//                 // count += group.length+1
//             })
//         }
//         // let  bigGroups = [...bigGroupsX,...bigGroupsY];
//
//
//     }
//
//     prevCell.element.classList.remove("active");
//     prevCell = null;
// }
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
//             if (prevCell.getPic() === currentCell.getPic()) {
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
//             if (prevCell.getPic() === currentCell.getPic()) {
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
//         column.sort(function (cell1, cell2) {
//             let cell1Value = cell1.getPic() === 0 ? 0 : 1;
//             let cell2Value = cell2.getPic() === 0 ? 0 : 1;
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
//             return (cell.getPic() === 0)
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