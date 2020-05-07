import {resultsToShow, cellImages} from './configs';

const seconds = 13;
const game = document.querySelector('#game');

function ResultsTemplate() {
    let resultsParentELement, results = [];

    this.generateResultsElement = () => {
        resultsParentELement = document.createElement('div');
        resultsParentELement.classList.add('results');

        resultsToShow.forEach(type => {
            const result = {};
            let resultElement = document.createElement('div');
            resultElement.classList.add('result');
            resultsParentELement.appendChild(resultElement);

            result.resultElement = resultElement;

            let img = document.createElement('img');
            img.src = cellImages[--type];
            resultElement.appendChild(img);

            let span = document.createElement('span');
            span.innerHTML = '0';
            result.span = span;
            resultElement.appendChild(span);

            results.push(result);
        });

        return resultsParentELement;
    };

    this.add = () => {

    };

    this.reset = (_span = false) => {
        if (!timer) {
            this.createTimerElemnt();
        }
        return _span ? span : timer;
    };



    return this;
};

const results = new ResultsTemplate(seconds);
game.appendChild(results.generateResultsElement());

export const Results = {
    add : results.add,
    reset : results.reset,
};


