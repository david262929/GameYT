function createField(size) {

    const field = document.createElement("div");
    field.classList.add("field");
    const pointsArr = generateMatrix(size);

    const cells = pointsArr.map(function (point) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        // cell.setAttribute('id', `pos_${point.x}x${point.y}`);
        // cell.classList.add(`pic${Math.floor(Math.random() * 6 + 1)}`)
        cell.point = point;
        var inner = document.createElement("div");
        cell.appendChild(inner);
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
        }
        cellObj.setX(point.x)
        cellObj.setY(point.y)
        return cellObj;
    })

    cells.forEach(function (cell) {
        field.appendChild(cell.element)
    })
    return {
        element: field,
        cells: cells
    }
}

function createRandomPic(cell){
    let picId = Math.floor(Math.random() * 6 +1);
    // console.log(cell.getX(5).setPic(picId));
    return cell.setPic(picId)
}
