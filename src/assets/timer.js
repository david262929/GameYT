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
    let interval, queueStarted, queueOfPluses = [];
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
        let plusTemporary = document.createElement('div');
        plusTemporary.classList.add('plusTemporary');
        plusTemporary.innerHTML = `+${seconds}`;
        plusElementsParent.appendChild(plusTemporary);
        setTimeout(() => {
            plusTemporary.parentNode.removeChild(plusTemporary);
            resolve();
        }, 450); /// 400 is .plusTemporary element plusTemporaryAnimateToTop animation duration + 50ms for deletion
    });

    this.plusSeconds = seconds => new Promise( resolve => {
        span.classList.remove('plused');
        local_seconds += seconds;
        setTimeout(() => {
            span.classList.add('plused');
            // span.classList.add('plused');
            this.generatePlusSecondElement(seconds);
            setTimeout(() => {
                resolve();
            }, 100); /// 100 is half of .plused element animation duration
        }, 10 );

    });

    // this.set

    const afterQueue = () => {
        queueStarted = false;
        queueOfPluses.shift();
        startQueueRecursive();
    };

    const startQueueRecursive = () => {
        queueStarted = !!queueOfPluses.length;
        if (!queueOfPluses.length){
            return;
        }

        let {promise, param} = queueOfPluses[0];

        promise(param).then( afterQueue );
    };

    this.addToQueue = (toPlusSecondPromise) => {
        if(!queueStarted){
            startQueueRecursive();
        }
        queueOfPluses.push(toPlusSecondPromise);
    };

    return this;
};

const timer = new TimerTemplate(seconds);

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


