import {generateKey, generateCoordinates, getSuchka} from './functions';
import {width, height} from './configs';

function CellTemplate (cell, inner, x, y) {
    this.element = cell;
    this.inner  = inner;
    this.getPicID = function(){
        return +this.inner.dataset.picId;
    };

    this.setPicID = function(id){
        if(id === 5){
            this.element.classList.add('gold');
        }else{
            this.element.classList.remove('gold');
        }
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

    this.destroyCell = function () {
        this.inner.dataset.picId = '-1';
        return this;
    };

    this.toShake = function () {
        this.element.classList.remove('shake');
        setTimeout(() => this.element.classList.add('shake'), 10);
    };

    const generateRandomID = (excludeIds = []) => {
        const ids = Array(6).fill().map( (_, i) => ++i).filter( id => !excludeIds.includes(id));
        return ids[Math.floor(Math.random() * ids.length)];
    };

    this.firstRandomPic = () => {
        if(this.getPicID() !== -1){
            return;
        }
        const nearbieLines = getSuchka(this.getX(), this.getY(), 2, 'only-types', 'top', 'left');
        const excludeIds = [];

        Object.keys(nearbieLines).forEach(key => {
            let nearId;
            nearbieLines[key].forEach( _nearId => {
                if(!nearId){
                    nearId = _nearId;
                    return;
                }
                if( nearId == _nearId ){
                    excludeIds.push(nearId);
                }
            });
        });

        let id = generateRandomID(excludeIds);
        this.setPicID(id);
        return this;
    };

    this.randomPic = () => {
        if(this.getPicID() !== -1){
            return;
        }
        let id = generateRandomID();
        this.setPicID(id);
        return this;
    };

    this.setX(x)
        .setY(y)
        .setPicID(-1);
    return this;
};

export const createField = () => {
    const field_element = document.createElement("div");
    field_element.classList.add("field");
    field_element.classList.add('gameWidth');
    field_element.classList.add('gameHeight');

    window.cells = [];

    generateCoordinates(width, height).forEach( (point) => {
        const {x, y} = point;

        const cell = document.createElement("div");
        cell.classList.add("cell");
        field_element.appendChild(cell);

        const inner = document.createElement("div");
        inner.classList.add('pic');
        cell.appendChild(inner);

        const newCellTemplate = new CellTemplate(cell, inner, x, y);
        cells[generateKey(x, y)] = newCellTemplate;
        newCellTemplate.firstRandomPic();
    });

    return {
        field_element,
        cells,
    }
}


