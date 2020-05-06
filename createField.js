

function createField(size) {

    const field_element = document.createElement("div");
    field_element.classList.add("field");
    const pointsArr = generateMatrix(size);
    const cells = [];

    const getKey = (x, y) => {
        return `x${x}_y${y}`;
    };

    const getSuchka = (x, y, distance = 1, mode = '') => {
        const current_cell = cells[getKey( x, y )];
        if(!current_cell){
            return [];
        }
        const result = [];
        for(let i = 1; i < distance + 1; i++) {
            if(i > size.width && i > size.height ){
                distance = 0;
            }

            let top_cell = cells[getKey(x,y - i)];
            if(top_cell){
                if(!result['top']){
                    result['top'] = [];
                }
                if(mode === 'only-types'){
                    top_cell = top_cell.getPic();
                }
                result['top'].push(top_cell);
            }

            let bottom_cell = cells[getKey(x,y + i)];
            if(bottom_cell){
                if(!result['bottom']){
                    result['bottom'] = [];
                }
                if(mode === 'only-types'){
                    bottom_cell = bottom_cell.getPic();
                }
                result['bottom'].push(bottom_cell);
            }
            let left_cell = cells[getKey(x - i,y )];
            if(left_cell){
                if(!result['left']){
                    result['left'] = [];
                }
                if(mode === 'only-types'){
                    left_cell = left_cell.getPic();
                }
                result['left'].push(left_cell);
            }

            let right_cell = cells[getKey(x + i,y)];
            if(right_cell){
                if(!result['right']){
                    result['right'] = [];
                }
                if(mode === 'only-types'){
                    right_cell = right_cell.getPic();
                }
                result['right'].push(right_cell);
            }
        }

        return result;
    };



    const createRandomPic = (cell) => {
        const nearbyCells = getSuchka(cell.getX(), cell.getY(), 2, 'only-types');

        const generatePicId = () =>  Math.floor(Math.random() * 6 +1);
        let picId = generatePicId();
        // if(cell.getX()  == 3 && cell.getY() == 3){
        //     const excludeList = [];
        //
        //     const nearsDistanceOne = [];
        //
        //     let loop = true;
        //     while(loop){
        //         Object.keys(nearbyCells).forEach( (key) => {
        //
        //             let equal = true;
        //             let type;
        //             console.log(nearbyCells[key]);
        //             nearbyCells[key].forEach((_type) => {
        //                 if(!equal){
        //                     return;
        //                 }
        //                 if(type !== picId){
        //                     type = _type;
        //                     equal = false;
        //                 }
        //             });
        //             if(equal){
        //                 excludeList.push(type);
        //                 let picId = generatePicId();
        //             }
        //         });
        //         loop = false;
        //
        //         // if(nearbyCells['bottom'].){
        //         //
        //         // }
        //     }
        //     console.log(excludeList);
        // }
        return cell.setPic(picId)
    };

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
        cellObj.setX(point.x);
        cellObj.setY(point.y);
        cells[`x${point.x}_y${point.y}`] = cellObj;

        createRandomPic(cellObj);
    });




    return {
        field_element,
        cells,
        getSuchka,
        getKey,
    }
}


