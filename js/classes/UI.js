class UI {

    static Elements = {};
    static currentUI;
    static currentModal;
    static scaleFactor = 1;

    static fetchUIResources() {

        var keys = [
            'endGame.html',
            'mainMenu.html',
            'modal.html',
        ];
        var promises = [];

        for (var key of keys) {
            promises.push(fetch(`./UI/${key}`).then(response => response.text()));
        }


        return Promise.all(promises).then((results => {
            for (var resultIndex in results) {
                UI.Elements[keys[resultIndex]] = results[resultIndex];
            }

            UI.createUIElements();
        }));
    }

    static clearUI() {
        UI.currentUI.remove();
    }

    static showMainMenu() {
        UI.showElement('mainMenu.html');
        
        var waitScreen = document.getElementById('waitScreen');
        if (waitScreen)
            waitScreen.remove();
        var btns = UI.currentUI.querySelectorAll('button');
        btns[0].onclick = (event) => {
            event.stopPropagation();
            document.dispatchEvent(new Event('startGameEvent'));
        }

        btns[0].focus();
    }

    static showEndGame(win) {
        UI.showModal(win);
        UI.currentUI.querySelector("#highscore").innerHTML = `Highscore: ${localStorage['personalBest']}`;
    }


    static showFinalScreen() {
        UI.showElement('endGame.html');
        var buttons = UI.currentUI.querySelectorAll('button');
        buttons[0].onclick = (event) => {
            event.stopPropagation();
            document.dispatchEvent(new Event('startGameEvent'));
            UI.clearUI();
        };

        buttons[0].focus();


    }


    static showModal() {
        UI.showElement('modal.html');

        var btn = UI.currentUI.querySelector('button');
        btn.onclick = () => {
            UI.clearUI();
            UI.showFinalScreen();
        };
        btn.focus();
    }

    static createUIElements(){
        for(var key of Object.keys(UI.Elements)){
            var dummyDiv = document.createElement('div');
            dummyDiv.id = `dummyDiv${key}`;
            dummyDiv.innerHTML = UI.Elements[key];
            UI.Elements[key] = dummyDiv;
        }
    }

    static showElement(key){
        UI.currentUI = UI.Elements[key];
        document.body.append(UI.currentUI);
    }

    static adjustScale(){
        UI.scaleFactor = window.innerWidth / 380;
        if(UI.scaleFactor < 1){
            UI.scaleOut();
        }
    }
    static scaleOut() {
        document.body.style.transform = 'scale(' + UI.scaleFactor + ')';
        document.body.style['-o-transform'] = 'scale(' + UI.scaleFactor + ')';
        document.body.style['-webkit-transform'] = 'scale(' + UI.scaleFactor + ')';
        document.body.style['-moz-transform'] = 'scale(' + UI.scaleFactor + ')';
    }



}
