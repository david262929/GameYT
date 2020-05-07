function CellObjTemplate (cell, inner) {

    this.element = cell;
    this.inner  = inner;
    this.getPicID = function(){
        return +this.inner.dataset.picId;
    };

    this.setPicID = function(id){
        this.inner.dataset.picId = id;
    };

    this.getX = function () {
        return +this.element.dataset.x
    };

    this.getY = function () {
        return +this.element.dataset.y
    };

    this.setX = function (x) {
        this.element.dataset.x = x;
        this.element.style.left = x + "em";
    };

    this.setY = function (y) {
        this.element.dataset.y = y;
        this.element.style.top = y + "em";
    };

    this.destroy = function () {
        this.inner.dataset.picId = '-1';
    };

    this.toShake = function () {
        this.element.classList.remove('shake');
        setTimeout(() => this.element.classList.add('shake'), 10);
    };

    this.randomPic = () => {
        if(this.getPicID() !== -1){
            return;
        }
        let id =  Math.floor(Math.random() * 6 +1); //first && this.getY() == 1 && this.getX() < 4 ? 1 :
        this.setPicID(id)
    };
    return this;
};

function createField(size) {

    const field_element = document.createElement("div");
    field_element.classList.add("field");
    const pointsArr = generateMatrix(size);
    const cells = [];

    const getKey = (x, y) => {
        return `x${x}_y${y}`;
    };

    const getSuchka = (x, y, distance = Infinity, mode = '', ...ways) => {
        if(!ways.length){
            ways = ['top', 'bottom', 'left', 'right'];
        }
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
            if(top_cell && ways.includes('top')){
                if(!result['top']){
                    result['top'] = [];
                }
                if(mode === 'only-types'){
                    top_cell = top_cell.getPicID();
                }
                result['top'].push(top_cell);
            }

            let bottom_cell = cells[getKey(x,y + i)];
            if(bottom_cell && ways.includes('bottom')){
                if(!result['bottom']){
                    result['bottom'] = [];
                }
                if(mode === 'only-types'){
                    bottom_cell = bottom_cell.getPicID();
                }
                result['bottom'].push(bottom_cell);
            }
            let left_cell = cells[getKey(x - i,y )];
            if(left_cell && ways.includes('left')){
                if(!result['left']){
                    result['left'] = [];
                }
                if(mode === 'only-types'){
                    left_cell = left_cell.getPicID();
                }
                result['left'].push(left_cell);
            }

            let right_cell = cells[getKey(x + i,y)];
            if(right_cell && ways.includes('right')){
                if(!result['right']){
                    result['right'] = [];
                }
                if(mode === 'only-types'){
                    right_cell = right_cell.getPicID();
                }
                result['right'].push(right_cell);
            }
        }

        return result;
    };

    pointsArr.forEach(function (point) {
        const cell = document.createElement("div");
        cell.classList.add("cell");


        const inner = document.createElement("div");
        inner.classList.add('pic');
        inner.dataset.picId = -1;
        cell.appendChild(inner);
        field_element.appendChild(cell);

        let cellObj = new CellObjTemplate(cell, inner);

        cellObj.setX(point.x);
        cellObj.setY(point.y);
        cellObj.randomPic();
        cells[`x${point.x}_y${point.y}`] = cellObj;
    });

    return {
        field_element,
        cells,
        getSuchka,
        getKey,
    }
}


