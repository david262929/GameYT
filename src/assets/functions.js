import {width, height} from './configs';

export const generateKey = (x, y) => {
    return `x${x}_y${y}`;
};

export const getSuchka = ( x, y, distance = Infinity, mode = '', ...ways) => {
    if(!ways.length){
        ways = ['top', 'bottom', 'left', 'right'];

    }
    const current_cell = cells[generateKey( x, y )];
    if(!current_cell){
        return [];
    }
    const result = [];
    for(let i = 1; i < distance + 1; i++) {
        if(i > width && i > height ){
            distance = 0;
        }

        ways.forEach(way => {
            let _x = x,
                _y = y;
            switch (way){
                case 'top':
                    _y -= i;
                    break;
                case 'bottom':
                    _y += i;
                    break;
                case 'left':
                    _x -= i;
                    break;
                case 'right':
                    _x += i;
                    break;
            }

            let way_cell = cells[generateKey(_x,_y)];
            if(!way_cell){
                return;
            }

            if(!result[way]){
                result[way] = [];
            }
            if(mode === 'only-types'){
                way_cell = way_cell.getPicID();
            }
            result[way].push(way_cell);
        });

    }

    return result;
};

export const toShakeIt = ( cell) => {
    const nearLines = getSuchka( cell.getX(), cell.getY(), 1);
    Object.keys(nearLines).forEach(key => {
        nearLines[key].forEach( near => near.toShake());
    });
};

export const generateCoordinates = (width, height) => {
    const result = [];

    const columns  = [...Array(height).fill(0)].map((x, index)=>index);
    const rows  = [...Array(width).fill(0)].map((x, index)=>index);

    columns.forEach( y => rows.forEach(x => result.push({x,y} ) ) );

    return result;
};

export const sec2time = (_seconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1),
        time = parseFloat(_seconds).toFixed(3),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
};
