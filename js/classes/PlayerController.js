class PlayerController {

    control(player) {
        this.touchFunction = function (event) {
            var touchLocation = event.touches[0].clientX - (window.innerWidth / 2);
            if (Math.abs(touchLocation - player.location.x) < 3) {
                player.slowDown();
            } else if (touchLocation > player.location.x) {
                player.moveRight();
            } else {
                player.moveLeft();
            }
        };

        this.touchEndFunction = function (event) {
            player.slowDown();
        }

        this.keydownFunction = function (event) {
            switch (event.key) {
                case 'ArrowLeft':
                    player.moveLeft();
                    break;
                case 'ArrowRight':
                    player.moveRight();
                    break;
            }
        }


        this.keyupFunction = function (event) {
            if (event.key.includes('Arrow')) {
                player.slowDown();
            }
        }




        document.addEventListener('keydown', this.keydownFunction);
        document.addEventListener('keyup', this.keyupFunction);

        document.addEventListener('touchstart', this.touchFunction);
        document.addEventListener('touchmove', this.touchFunction);
        document.addEventListener('touchend', this.touchEndFunction);
    }



    stop() {
        document.removeEventListener('click', this.clickFunction);
        document.removeEventListener('keydown', this.keydownFunction);
        document.removeEventListener('keyup', this.keyupFunction);
    }
}