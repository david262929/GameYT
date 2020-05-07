// import {toShakeIt, generateKey, getSuchka, generateCoordinates} from './functions';
// import {seconds} from './configs';
import {sec2time} from './functions';

const seconds = 60;
const game = document.querySelector('#game');

function TimerTemplate(seconds) {
    const SECONDS = seconds;
    let local_seconds = seconds;
    let interval;
    let timer, span, plusElementsParent;
    this.createTimerElemnt = () => {
        timer = document.createElement('div');
        timer.classList.add('timer');

        span = document.createElement('span');
        span.classList.add('seconds');
        timer.appendChild(span);

        plusElementsParent = document.createElement('span');
        plusElementsParent.classList.add('plusElementsParent');
        timer.appendChild(plusElementsParent);
    };

    this.getTimerElement = () => {
        if (!timer) {
            this.createTimerElemnt();
        }
        return timer;
    };


    this.start = () => {
        if (interval) {
            return this;
        }
        span.textContent = sec2time(seconds);
        interval = setInterval(() => {
            span.textContent = sec2time(local_seconds);
            local_seconds -= .25;
            if (local_seconds < 0) {
                clearInterval(interval);
                this.onEnd();
                return;
            }
        }, 250);
        return this;
    };

    this.reset = () => {
        if (this.interval) {
            clearInterval(interval);
        }
        this.start(SECONDS);
        return +this.inner.dataset.picId;
    };

    this.setOneEnded = (callback = () => {}) => {
        this.onEnd = callback;
        return this;
    };

    this.generatePlusSecondElement = (seconds) => new Promise(resolve => {
        let _plus = document.createElement('div');
        _plus.classList.add('_plus');
        _plus.innerHTML = `+${seconds}`;
        plusElementsParent.appendChild(_plus);
        setTimeout(() => {
            _plus.parentNode.removeChild(_plus);
            resolve();
        }, 450); /// 400 is ._plus element _plusAnimateToTop animation duration + 50ms for deletion
    });

    this.plusSeconds = seconds => new Promise(resolve => {
        span.classList.remove('plusSeconds');
        local_seconds += seconds;
        setTimeout(() => {
            span.classList.add('plusSeconds');
            this.generatePlusSecondElement(seconds);

            setTimeout(() => {
                resolve();
            }, 200); /// 200 is .plusSeconds element animation duration
        }, 100 );

    });

    this.setOneEnded();
    return this;
};

const timer = new TimerTemplate(seconds);
game.appendChild(timer.getTimerElement());

window.plusSeconds = timer.plusSeconds;

export const Timer = {
    reset: timer.reset,
    plusSeconds: timer.plusSeconds,
    start: timer.start,
    onEnd: timer.setOneEnded,
};


