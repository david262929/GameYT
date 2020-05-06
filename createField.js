function createField(size) {

    const field_element = document.createElement("div");
    field_element.classList.add("field");
    const pointsArr = generateMatrix(size);
    const cells = [];
    pointsArr.forEach(function (point) {
        const cell = document.createElement("div");
        cell.classList.add("cell");


        const inner = document.createElement("div");
        cell.appendChild(inner);
        field_element.appendChild(cell);
        var cellObj = {
            element:cell,
            getPic:function(){
                return +inner.dataset.picId;
            },
            setPic:function(id){
                inner.className = `pic${id}`;
                inner.dataset.picId = id;
            },
            getX : function () {
                return +cell.dataset.x
            },
            getY : function () {
                return +cell.dataset.y
            },
            setX : function (x) {
                cell.dataset.x = x;
                cell.style.left = x + "em";
            },
            setY : function (y) {
                cell.dataset.y = y;
                cell.style.top = y + "em";
            }
        };
        createRandomPic(cellObj);
        cellObj.setX(point.x);
        cellObj.setY(point.y);
        cells[`x${point.x}-y${point.y}`] = cellObj;
    });

    return {
        field_element,
        cells,
        getSuchka : (x, y, distance = 1) => {
            if(x && y){
                console.log(x,y);
                return;
            }
            const current_cell = cells[`x${x}-y${y}`];
            if(!current_cell){
                return [];
            }
            const result = [];
            result['current'] = current_cell;
            for(let i = 1; i < distance + 1; i++) {
                if(y >= 0 && y <= size.height){
                    const top_cell = cells[`x${x}-y${y-i}`];
                    if(top_cell){
                        if(!result['top']){
                            result['top'] = [];
                        }
                        result['top'].push(top_cell)
                    }

                    const bottom_cell = cells[`x${x}-y${y+i}`];
                    if(bottom_cell){
                        if(!result['bottom']){
                            result['bottom'] = [];
                        }
                        result['bottom'].push(bottom_cell)
                    }
                }
                if(x >= 0 && x <= size.width){
                    const left_cell = cells[`x${x-i}-y${y}`];
                    if(left_cell){
                        if(!result['left']){
                            result['left'] = [];
                        }
                        result['left'].push(left_cell)
                    }

                    const right_cell = cells[`x${x+i}-y${y}`];
                    if(right_cell){
                        if(!result['right']){
                            result['right'] = [];
                        }
                        result['right'].push(right_cell)
                    }
                }
            }

            return result;
        },
    }
}



function createRandomPic(cell){
    let picId = Math.floor(Math.random() * 6 +1);
    // console.log(cell.getX(5).setPic(picId));
    return cell.setPic(picId)
}
