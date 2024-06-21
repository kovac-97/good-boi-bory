window.onload = function () {



   

    const playerElement = document.getElementById('player');


    ; (async function () {

        var playerAnimator = new Animator(
            playerElement
        );

        await playerAnimator.createBase64Paths(
            {
                'standing': {
                    duration: 0.1,
                    sprites: [
                        'standing/Dog_Brown-02-00.png',
                        'standing/Dog_Brown-03-00.png',
                        'standing/Dog_Brown-04-00.png',
                        'standing/Dog_Brown-05-00.png',
                        'standing/Dog_Brown-06-00.png',
                        'standing/Dog_Brown-07-00.png',
                        'standing/Dog_Brown-08-00.png',
                        'standing/Dog_Brown-09-00.png',
                        'standing/Dog_Brown-10-00.png',
                        'standing/Dog_Brown-11-00.png',
                        'standing/Dog_Brown-12-00.png'
                    ]
                },
                'walking': {
                    duration: 0.085,
                    sprites: [
                        'walking/Dog_Brown-01-02.png',
                        'walking/Dog_Brown-02-02.png',
                        'walking/Dog_Brown-03-02.png',
                        'walking/Dog_Brown-04-02.png',
                        'walking/Dog_Brown-05-02.png',
                        'walking/Dog_Brown-06-02.png'
                    ]
                },
                'running': {
                    duration: 0.07,
                    sprites: [
                        'running/Dog_Brown-02-01.png',
                        'running/Dog_Brown-03-01.png',
                        'running/Dog_Brown-04-01.png',
                        'running/Dog_Brown-05-01.png',
                        'running/Dog_Brown-06-01.png',
                        'running/Dog_Brown-07-01.png'
                    ]
                }
            }
        );

        addEventListener('animationStand', () => {
            playerAnimator.startAnimation('standing');
        });
        addEventListener('animationWalk', () => {
            playerAnimator.startAnimation('walking');
        });
        addEventListener('animationRun', () => {
            playerAnimator.startAnimation('running');
        });

        await UI.fetchUIResources();
        let droppableB64 = await fetch(`./assets/pineapple.png`)
            .then(response => response.blob())
            .then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        const base64data = reader.result;
                        resolve(base64data);
                    }
                    reader.onerror = function (error) {
                        reject(error);
                    };
                    reader.readAsDataURL(blob);
                });
            });
        const game = new GameInstance(setup, gameloop);
        UI.showMainMenu();

        function setup(options) {
            let player = new Player(
                new Vector2D(0, -0.5 * Globals.PLAYGROUND_Y),
                new Vector2D(0, 0),
                playerElement,
                0,
                new PlayerController()
            );

            let dropper = new Dropper(droppableB64);

            var [boxes, boxMap] = BoxManager.GenerateObjects();
            return {
                'player': player,
                'boxes': boxes,
                'dropper': dropper,
                'boxMap': boxMap,
                'animator': playerAnimator
            };
        }

        var last_tFrame = 0;
        var deltaTime;
        var firstLoop = true;
        async function gameloop(tFrame = 0) {

            game.frameToken = window.requestAnimationFrame(gameloop);

            deltaTime = (tFrame - last_tFrame) / 100; //conversion to miliseconds

            player.tick(deltaTime);
            dropper.tick(deltaTime);

            player.dispatchAnimationEvents();

            firstLoop = true;
            for (var box of boxes) {
                for (var droppable of dropper.activeDrops) {
                    if (firstLoop) {
                        if (droppable.location.y < -0.4 * Globals.PLAYGROUND_Y)
                            handlePlayerCollisions(droppable, player);
                    }
                    if (box.isHit(droppable)) {
                        droppable.collisionEvent(box);
                    }
                }
                firstLoop = false;
            }


            dropper.afterTick();
            player.afterTick();
            render();
            last_tFrame = tFrame;


        }

        function render() {
            player.render();
            dropper.renderDrops();
        }

        function handlePlayerCollisions(droppable, player) {

            if (
                Vector2D.distanceBetween(droppable.location, player.location) < Player.hitboxSize
            ) {
                render();
                document.dispatchEvent(new CustomEvent('gameOverEvent', {
                    detail: { win: false }
                }));
            }




        }
    })();


};


