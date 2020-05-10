import {resultsToShow, cellImages, gameElement} from './configs';
import {convertScore} from './functions';

function ResultsTemplate() {
    let resultsParentELement, results = [];

    this.getKey = (type) =>{
        return `type_${type}`;
    }

    this.generateResultsElements = () => resultsToShow.forEach(type => {
        const result = {};
        let resultElement = document.createElement('div');
        resultElement.classList.add('result');
        resultsParentELement.appendChild(resultElement);

        result.resultElement = resultElement;

        let img = document.createElement('img');

        img.src = cellImages[type - 1];
        resultElement.appendChild(img);

        let span = document.createElement('span');
        span.innerHTML = '0';
        span.dataset.count = 0;
        result.span = span;
        resultElement.appendChild(span);

        results[ this.getKey(type) ] = result;
    });

    this.generateResultsMainElement = () => {
        resultsParentELement = document.createElement('div');
        resultsParentELement.classList.add('results');
        resultsParentELement.dataset.resultsCount = resultsToShow.length;

        this.generateResultsElements();
        return resultsParentELement;
    };

    this.add = (type) => {
        const result = results[this.getKey(type)];
        if(!result){
            return;
        }
        const {span} = result;
        let count = +span.dataset.count;
        count += 6098700;
        span.dataset.count = count;
        const textContent = convertScore(count);
        document.querySelector('.score-number').innerHTML = textContent;
        span.innerHTML = textContent;
        if(textContent.length > 3){
            result.resultElement.classList.add('moreThen3Symbols');
        }else{
            result.resultElement.classList.remove('moreThen3Symbols');
        }
    };

    this.reset = () => {
        if(!resultsParentELement) {
            return;
        }
        if(resultsParentELement.parentNode){
            resultsParentELement.parentNode.removeChild(resultsParentELement);
        }
    };


    return this;
};

const results = new ResultsTemplate();

export const Results = {
    init : () => {
        gameElement.appendChild(results.generateResultsMainElement());
    },
    add : results.add,
    reset : results.reset,
};


