function createField(size) {

    const field = document.createElement("div");
    field.classList.add("field");
    const pointsArr = generateMatrix(size);

    const cells = pointsArr.map(function (point) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.left = point.x + "em";
        cell.style.top = point.y + "em";
        cell.dataset.x =point.x;
        cell.dataset.y =point.y;
        cell.setAttribute('id', `pos_${point.x}x${point.y}`);
        cell.classList.add(`pic${Math.floor(Math.random() * 6 + 1)}`)
        cell.point = point;
        //  cell.classList.add("pic3")
        return cell;
    })
    cells.forEach(function (cell) {
        field.appendChild(cell)
    })
    return {
        element: field,
        cells: cells
    }
}

