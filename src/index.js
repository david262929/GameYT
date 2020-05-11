import { gameElement, menuElement, allImages} from './assets/configs';
import {loadImages} from './assets/functions';
import {Menu} from './assets/menu';
import {Game} from './assets/game';

const start = (info) => {
    Menu.setMenuOpener( Game.getMenuOpener() )
        .on('first-play', Game.start)
        .on('resume', Game.start)
        .on('pause', Game.stop)
        .on('try-again', () => Game.reset().then(Game.init).then(Menu.hide).then(Game.start));

    Game.on('time-ended', (score) => Menu.setState('time-ended', score).show());

};

gameElement.classList.add('gameWidth');
menuElement.querySelector('.content').classList.add('gameWidth');

window.addEventListener('load', () => {
    document.body.style.display = 'flex';
    if(location.hostname == 'localhost'){
        loadImages(
            allImages,
            (progress) => FBInstant.setLoadingProgress(progress),
            () => Game.init().then(start));
        return;
    }

    FBInstant.initializeAsync().then(() => loadImages(
        allImages,
        (progress) => FBInstant.setLoadingProgress(progress),
        () => Game.init().then(() =>
            FBInstant.startGameAsync().then(() => {

                const contextId = FBInstant.context.getID();
                const contextType = FBInstant.context.getType();

                const playerName = FBInstant.player.getName();
                const playerPic = FBInstant.player.getPhoto();
                const playerId = FBInstant.player.getID();

                console.log({contextId,contextType, playerName, playerPic, playerId});
                start({contextId,contextType, playerName, playerPic, playerId});
            })
        )
    ));

});

