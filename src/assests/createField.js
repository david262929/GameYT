import {toShakeIt, generateKey, getSuchka, generateCoordinates} from '@assets/functions';

function CellTemplate (cell, inner, x, y) {
    this.element = cell;
    this.inner  = inner;
    this.getPicID = function(){
        return +this.inner.dataset.picId;
    };

    this.setPicID = function(id){
        this.inner.dataset.picId = id;
        return this;
    };

    this.getX = function () {
        return +this.element.dataset.x;
    };

    this.getY = function () {
        return +this.element.dataset.y;
    };

    this.setX = function (x) {
        this.element.dataset.x = x;
        this.element.style.left = x + "em";
        return this;
    };

    this.setY = function (y) {
        this.element.dataset.y = y;
        this.element.style.top = y + "em";
        return this;
    };

    this.destroy = function () {
        this.inner.dataset.picId = '-1';
        return this;
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
        this.setPicID(id);
        return this;
    };

    this.setX(x)
        .setY(y)
        .setPicID(-1)
        .randomPic();
    return this;
};

export const createField = () => {

    const gameArea = document.createElement("div");
    gameArea.classList.add("gameArea");

    const field_element = document.createElement("div");
    field_element.classList.add("field");
    gameArea.appendChild(field_element);

    const cells = [];

    generateCoordinates(size.height, size.width).forEach(function (point) {
        const {x, y} = point;

        const cell = document.createElement("div");
        cell.classList.add("cell");
        field_element.appendChild(cell);

        const inner = document.createElement("div");
        inner.classList.add('pic');
        cell.appendChild(inner);

        cells[generateKey(x, y)] = new CellTemplate(cell, inner, x, y);
    });


    return {
        gameArea,
        field_element,
        cells,
    }
}


