class Player extends Actor {

    static hitboxSize = 20;
    constructor(location = new Vector2D(), offset, element, rotation, controller) {
        super(
            location,
            element,
            rotation,
            true, //enable actor
            offset
        );
        this.resetPosition();

        this.prevSpeed = this.speed;
        this.friction = 0.0;
        this.controller = controller;
    }

    control() {
        this.controller.control(this);
    }

    disable() {
        super.disableActor();
        this.controller.stop();
    }

    tick(deltaTime) {
        // this.moveTo(this.destination, deltaTime);
        this.move(deltaTime);
        this.handleCollison();
    }

    move(deltaTime) {
        this.speed += this.acceleration * deltaTime;
        this.location.x += this.speed * deltaTime;
        this.speed *= 1 - (this.friction * deltaTime);

    }

    moveLeft(){
        this.acceleration = -10;
        this.friction = 0.1;
    }

    moveRight(){
        this.acceleration = 10;
        this.friction = 0.1;
    }

    slowDown(){
        this.acceleration = 0;
        this.friction = 0.5;
    }

    shouldChangeDirection() {
        //By applying De Morgan's Laws to the if-elif-else below we get the shorter form:
        return (this.destination <= this.location || this.speed <= 0) && (this.destination >= this.location || this.speed >= 0);

        //Leaving this here for clarity...
        /*
        if (destination > location && speed > 0) {
            //destination is right of the location
            //the player is moving towards it
            return false;
        } else if (destination < location && speed < 0) {
            //destination is left of the location
            //the player is moving towards it
            return false;
        } else {
            return true;
        }
        */
    }

    handleCollison() {
        //Colliding with the wall doesn't immediatly change the player's speed.
        //This can also be used to rebound and build faster than normal speeds and create high angles of aim.
        if (this.location.x > Globals.PLAYGROUND_X / 2) {
            this.speed = -this.speed; //change direction of travel
            this.location.x -= (2 * this.location.x) - Globals.PLAYGROUND_X; // set location to the mirror image of the overshoot
            this.destination = Globals.PLAYGROUND_X / 2; //set new destination to prevent flicker
        } else if (this.location.x < -Globals.PLAYGROUND_X / 2) {
            this.speed = -this.speed;
            this.location.x -= (2 * this.location.x) + Globals.PLAYGROUND_X;
            this.destination = - Globals.PLAYGROUND_X / 2;
        }
    }

    setDestination(destination) {
        //There is no need to use this function within this class.
        //This is a public function that just abstracts the inner variable this.destination.
        this.destination = destination;
    }

    resetPosition() {
        this.location.x = 0;
        this.speed = 0;
        this.acceleration = 0;
        this.destination = 0;
        this.remainingDistance = 0;
    }

    afterTick() {
        this.prevSpeed = this.speed; //will be used to change the animations
    }

    render() {
        super.render();
        this.element.style.transform += " scaleY(0.78)";
        if (this.speed > 0){
            this.element.style.transform += " scaleX(-1.4)";
        } else {
            this.element.style.transform += " scaleX(1.4)";
        }
    }

    dispatchAnimationEvents() {

        var absSpeed = Math.abs(this.speed);
        var absPrevSpeed = Math.abs(this.prevSpeed);
        if (absSpeed > 40 && absPrevSpeed <= 40) {
            //run
            dispatchEvent(new Event('animationRun'));
        } else if (
            absSpeed > 2 && absPrevSpeed <= 2 ||
            absSpeed < 40 && absPrevSpeed >= 40
        ) {
            //walk
            dispatchEvent(new Event('animationWalk'));
        } else if (
            absSpeed < 2 && absPrevSpeed >= 2
        ) {
            //stand
            dispatchEvent(new Event('animationStand'));
        }
    }
}