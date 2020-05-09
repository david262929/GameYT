import {menuElement} from './configs';

const events = {};

const call = (key) => {
    const playCallbacks = events[key] || [];
    playCallbacks.forEach(playCallback => playCallback());
};

function MenuTemplate(menuParentElement, state = 'full') {
    const self = this;
    this._state;
    let openerElement, playElement, resumeElement, tryAgainElement;

    this.setState = (state = 'pause') => {
        this._state = state;
        switch (state) {
            case 'during-game':
                menuParentElement.classList.remove('first-menu');
                menuParentElement.classList.remove('time-ended');
                menuParentElement.classList.remove('pause');
                break;
            case 'pause':
                menuParentElement.classList.remove('time-ended');
                menuParentElement.classList.remove('first-menu');
                menuParentElement.classList.add('pause');
                break;
            case 'first-time':
                menuParentElement.classList.remove('time-ended');
                menuParentElement.classList.remove('pause');
                menuParentElement.classList.add('first-menu');
                break;
            case 'time-ended':
                menuParentElement.classList.remove('first-menu');
                menuParentElement.classList.remove('pause');
                menuParentElement.classList.add('time-ended');
                break;
        };
        return this;
    };

    this.show = () => new Promise(resolve => {
        menuParentElement.classList.remove('slideUp');
        setTimeout(resolve, 800);// 800ms is .slideUp animation duration
    });

    this.hide = () => new Promise(resolve => {
        menuParentElement.classList.add('slideUp');
        setTimeout(resolve, 800);// 800ms is .slideUp animation duration
    });

    this.setMenuOpener = (menuOpenerElement) => {
        openerElement = menuOpenerElement;
        openerElement.addEventListener('click', () => {
            call('pause');
            self.show().then(() => {
                self.setState('during-game');
            });
        });
        return this;
    };

    this.generateElements = (menuParentElement) => {
        let content = document.createElement('div');
        content.classList.add('content');

        let logo = document.createElement('div');
        logo.classList.add('logo');

        let buttons = document.createElement('div');
        buttons.classList.add('buttons');

        playElement = document.createElement('span');
        playElement.classList.add('play');
        playElement.innerHTML = 'Play';
        playElement.addEventListener('click', () => {
            call('first-play');
            self.hide().then(() => {
                self.setState('during-game');
            });
        });

        resumeElement = document.createElement('span');
        resumeElement.classList.add('resume');
        resumeElement.innerHTML = 'Resume';
        resumeElement.addEventListener('click', () => {
            call('resume');
            self.hide().then(() => {
                self.setState('during-game');
            });
        });

        tryAgainElement = document.createElement('span');
        tryAgainElement.classList.add('try-again');
        tryAgainElement.innerHTML = 'Try Again';
        tryAgainElement.addEventListener('click', () => {
            call('try-again');
            self.hide().then(() => {
                self.setState('during-game');
            });
        });

        buttons.appendChild(playElement);
        buttons.appendChild(resumeElement);
        buttons.appendChild(tryAgainElement);

        content.appendChild(logo);
        content.appendChild(buttons);

        menuParentElement.appendChild(content);


        return this;
    };

    this.on = (eventName, callback) => {
        const callbackFromEventName = events[eventName] || [];
        callbackFromEventName.push(callback);
        events[eventName] = callbackFromEventName;
        return this;
    };


    this.setState(state).generateElements(menuParentElement);
    return this;
};

const menu = new MenuTemplate(menuElement, 'first-time');

export const Menu = {
    setState : menu.setState,
    setMenuOpener : menu.setMenuOpener,
    on : menu.on,
    show : menu.show,
    hide : menu.hide,
};


