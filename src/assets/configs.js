export const width = 6;
export const height = 8;
export const seconds = 30;
export const resultsToShow = [1,2,3,4,5,6];
export const eachTypeResultValue = [];
eachTypeResultValue[1] = {
    seconds : 0,
    score : 1,
};
eachTypeResultValue[2] = {
    seconds : 0,
    score : 2,
};
eachTypeResultValue[3] = {
    seconds : 0,
    score : 3,
};
eachTypeResultValue[4] = {
    seconds : 0,
    score : 4,
};
eachTypeResultValue[5] = {
    seconds : 5,
    score : 5,
};
eachTypeResultValue[6] = {
    seconds : 0,
    score : 6,
};
export const boomMinimumLimit = 3;



export const createNeedElements = () => {
    const gameElement = document.querySelector('#game') || document.createElement('div');
    gameElement.id = 'game';
    gameElement.classList.add('hideIcons');

    const menuElement = document.querySelector('#menu') || document.createElement('div');
    menuElement.id = 'menu';
    menuElement.classList.add('first-menu');

    document.body.appendChild(gameElement);
    document.body.appendChild(menuElement);

    return {
        gameElement,
        menuElement,
    };
};

const {gameElement, menuElement} = createNeedElements();

export {gameElement, menuElement};


import logo from '@img/logo.png';
import suka1 from '@img/01.png';
import suka2 from '@img/02.png';
import suka3 from '@img/03.png';
import suka4 from '@img/04.png';
import suka5 from '@img/05.png';
import suka6 from '@img/06.png';
import backgroundImgUrl from '@img/background.jpg';
export const cellImages = [suka1, suka2, suka3, suka4, suka5, suka6];
import '@style/main';


const style = document.createElement('style');
document.body.appendChild(style);
style.innerHTML = `
    body, #menu{
        background-image: url(${backgroundImgUrl});
    }
    .gameWidth{
        width: ${width}em!important;
    }
    .gameHeight{
        height: ${height}em!important;
    }
    [data-pic-id="1"] {
        background-image: url(${suka1});
    }
        
    [data-pic-id="2"] {
        background-image: url(${suka2});
    }
        
    [data-pic-id="3"] {
        background-image: url(${suka3});
    }
        
    [data-pic-id="4"] {
        background-image: url(${suka4});
    }
        
    [data-pic-id="5"] {
        background-image: url(${suka5});
    }
        
    [data-pic-id="6"] {
        background-image: url(${suka6});
    }
    
    .logo{
        background-image: url(${logo});
    }
`;

export const allImages = [backgroundImgUrl, ...cellImages, logo ];



// import suka111 from '@json/config.template.json';
// console.log(suka111);
// require('./json/config.template.json');

// console.log(l);


// import './json/fbapp-config.json';
