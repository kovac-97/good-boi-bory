
class GameInstance {


    static globalKeys = [];
    constructor(setupFunction, gameLoopFunction) {
        this.setupFunction = setupFunction;
        this.gameLoopFunction = gameLoopFunction;

        this.playground = document.getElementById('playground');
        this.frameToken = null;
        this.gameStarted = false;
        this.controllers = [];

        document.addEventListener('gameOverEvent', (event) => {
            this.endGame(event.detail.win);
        });

        document.addEventListener('startGameEvent', () => {
            this.cleanUp();
            this.startGame();
            UI.clearUI();
        });
    }




    startGame() {

        UI.adjustScale();
        document.querySelector("#score").innerHTML = `Score: 0`;
        var audioElement = document.querySelector('audio');

        if (audioElement == null) {
            var audio = document.createElement('audio');
            document.body.appendChild(audio);
            audio.setAttribute('src', './assets/song.mp3');
            audio.play()
            audio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }


        this.gameStarted = true;
        //To avoid passing way to many arguments into the main
        //we will assign them to global scope.
        //This does create global scope pollution, but makes it more convenient
        //to work on setup and gameloop functions.
        let params = this.setupFunction();
        for (var key of Object.keys(params)) {
            window[key] = params[key];
        }

        this.players = [params.player];
        for (var player of this.players) {
            player.control(); //enable player controllers
        }

        params.dropper.startDropping();
        params.animator.startAnimation('standing');
        this.gameLoopFunction();
    }

    cleanUp() {
        if (!this.gameStarted)
            return;

        for (var player of this.players) {
            player.controller.stop();
            player.resetPosition();
        }


        //delete Boxes:
        var boxElements = document.querySelectorAll('.box');
        for (var box of boxElements)
            box.remove();

        //delete droppables
        var pineapples = document.querySelectorAll('.bullet');
        for (var drop of pineapples)
            drop.remove();

    }

    endGame(win) {

        this.setScore(window.dropper.dropCounter);
        window.dropper.stopDropping();
        this.stopMain();
        UI.showEndGame(win);
    }

    setScore(score) {
        localStorage['personalBest'] ? null : localStorage['personalBest'] = 0;
        if (localStorage['personalBest'] < score) {
            localStorage['personalBest'] = score;
        }
    }

    stopMain() {
        window.cancelAnimationFrame(this.frameToken);
    }

}