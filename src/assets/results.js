import {resultsToShow, cellImages} from './configs';

const seconds = 13;
const game = document.querySelector('#game');

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

        this.generateResultsElements();
        return resultsParentELement;
    };

    this.add = (type) => {
        const result = results[this.getKey(type)];
        if(!result){
            return;
        }
        let count = +result.span.dataset.count;
        count += 1;
        result.span.dataset.count = count;
        result.span.innerHTML = count;
    };

    this.reset = (_span = false) => {
        resultsParentELement.innrHTML = ``;
        this.generateResultsElements();
        return _span ? span : timer;
    };



    return this;
};

const results = new ResultsTemplate(seconds);
game.appendChild(results.generateResultsMainElement());

export const Results = {
    add : results.add,
    reset : results.reset,
};


