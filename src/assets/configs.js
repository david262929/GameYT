export const width = 6;
export const height = 8;
export const seconds = 60;
export const resultsToShow = [1,3,6];
export const eachTypeResultValue = [1,3,6];
eachTypeResultValue[1] = 1;
eachTypeResultValue[2] = 1;
eachTypeResultValue[3] = 1;
eachTypeResultValue[4] = 1;
eachTypeResultValue[5] = 5;
eachTypeResultValue[6] = 1;
export const boomMinimumLimit = 3;



import suka1 from '@img/01.png';
import suka2 from '@img/02.png';
import suka3 from '@img/03.png';
import suka4 from '@img/04.png';
import suka5 from '@img/05.png';
import suka6 from '@img/06.png';
import background from '@img/background.jpg';
export const cellImages = [suka1, suka2, suka3, suka4, suka5, suka6];
import '@style/main';

document.body.style.backgroundImage = `url(${background})`;
const style = document.createElement('style');
document.body.appendChild(style);
style.innerHTML = `
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
`;
