// import {toShakeIt, generateKey, getSuchka, generateCoordinates} from './functions';
import {gameElement, seconds} from './configs';
import {sec2time} from './functions';

const events = {};

const call = (key) => {
    const playCallbacks = events[key] || [];
    playCallbacks.forEach(playCallback => playCallback());
};

const game = document.querySelector('#game');

function TimerTemplate(seconds) {
    const SECONDS = seconds;
    let local_seconds = seconds;
    let interval, queueInterval, queueOfPluses = [];
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
        span.textContent = sec2time(local_seconds);
        interval = setInterval(() => {
            span.textContent = sec2time(local_seconds);
            local_seconds -= .25;
            if (local_seconds < 0) {
                clearInterval(interval);
                interval = null;
                call('end');
                return;
            }
        }, 250);
        return this;
    };

    this.stop = () => {
        if (!interval) {
            return this;
        }
        clearInterval(interval);
        interval = null;
        return this;
    };

    this.reset = () => {
        clearInterval(interval);
        interval = null;
        if(timer.parentNode){
            timer.parentNode.removeChild(timer);
            timer = null;
        }
        local_seconds = SECONDS;
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

    const startQueueRecursive = () => {
        if (!queueOfPluses.length) {
            // this.deleteQueueInterval();
            return;
        }
        let {promise, param} = queueOfPluses[0];

        promise(param).then( () => {
            queueOfPluses.shift();
            startQueueRecursive();
        }).catch(message => {
            console.info(message);
            queueOfPluses.shift();
        });
    };

    this.addToQueue = (toPlusSecondPromise) => {
        queueOfPluses.push(toPlusSecondPromise);
        startQueueRecursive();
    };

    return this;
};

const timer = new TimerTemplate(seconds);


window.plusSeconds = timer.plusSeconds;

export const Timer = {
    on: (eventName, callback) => {
        const callbackFromEventName = events[eventName] || [];
        callbackFromEventName.push(callback);
        events[eventName] = callbackFromEventName;
        return this;
    },
    reset: timer.reset,
    plusSeconds: (seconds) => {
        timer.addToQueue({promise : timer.plusSeconds, param : seconds});
    },
    start: timer.start,
    stop: timer.stop,
    init : () => {
        game.appendChild(timer.getTimerElement());
    },
};


