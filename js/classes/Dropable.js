class Dropable extends Actor {

    constructor(location = new Vector2D(), rotation = 0, asset_path = './assets/pineapple.png') {
        //element will be created dynamicaly
        var element = Dropable.createElement(asset_path);
        super(location, element, rotation, false);
        this.startSpeed = 0;
        this.incidentAngle; //angle between the box that it hits and the movement
        this.speed = new Vector2D(0, 0);
        this.prevLocation = structuredClone(location);
        this.gravity = 6;
        this.friction = 0.1;

        this.spinRate = 3.0;
        this.spinFriction = 0.1;
    }

    tick(deltaTime) {
        if (!this.enabled) {
            return;
        }

        this.speed.y -= this.gravity * deltaTime;
        this.rotation += this.spinRate * deltaTime;
        this.spinRate *= 1 - (this.spinFriction * deltaTime);

        if (this.friction * deltaTime < 1) {
            this.speed.x *= 1 - (this.friction * deltaTime);
            this.speed.y *= 1 - (this.friction * deltaTime);
        }
        this.location.x += this.speed.x * deltaTime;
        this.location.y += this.speed.y * deltaTime;
        this.handleWallCollision();
        //prevLocation needs to be set after the scene update
    }

    afterTick() {
        this.prevLocation.x = this.location.x;
        this.prevLocation.y = this.location.y;
    }

    drop(startSpeed) {
        this.spinRate = (Math.random() - 0.5) * 6.0;
        this.speed = structuredClone(startSpeed);
        this.rotation = Math.random() * 2 * Math.PI;
        this.destroyTimeout = setTimeout(() => {
            this.destroy()
        }, 12000); //destroy the drop after 12 seconds
        this.enableActor();

    }

    static createElement(asset_path) {
        //because the bullet object will be held in memory
        //we don't need to create an img ID
        //we can always reference the element using this.element
        var img = document.createElement('img');
        img.src = asset_path;
        img.className = 'bullet';
        document.body.appendChild(img);
        return img;
    }

    handleWallCollision() {
        // since the walls are static it is okay to handle those collisions inside the Bullet class.
        // this would cause problems if there were different kind of walls.
        if (this.location.y < -Globals.PLAYGROUND_Y / 2) {
            this.destroy();
            return false;
        } else if (this.location.x < -Globals.PLAYGROUND_X / 2) {
            this.rotation = Math.PI - this.rotation;
            this.speed.x = -this.speed.x;
            this.location.x -= (2 * this.location.x) + Globals.PLAYGROUND_X;
            return true;
        } else if (this.location.x > Globals.PLAYGROUND_X / 2) {
            this.rotation = Math.PI - this.rotation;
            this.speed.x = -this.speed.x;
            this.location.x -= (2 * this.location.x) - Globals.PLAYGROUND_X;
            return true;
        }
    }

    rebound(line) {
        //Incident angle is the smaller of two angles that the vectors create between each other
        //Determining this angle isn't so straightforward as we need to calculate two angles, normalize them, and check which one is greater
        //After that, rotate function runs sine and cosine of the angle to find the new vector


        //Instead of using rotate() we will use complex number magic to rotate the vector
        /*
        First we represent the speed as a complex number instead of a vector:
        Vcomplex = Zv = Vx + iVy         Vx and Vy are the vector components of vector speed
        Next, we take a vector that is created by taking the points of a line in 2D space,
        normalize it, and convert it to a complex number in the same way as we converted speed.
        Zline = deltaX + ideltaY;
        Next we square this complex number:
        Zlsqr= nx + ny;
        The new speed is given by
        ComplexSpeed=Zv* x Zlsqr;
        Vector speed is then:
        V=[VxNx + VyNy, VxNy - VyNx];      
        */

        let tempVar = this.speed.x;


        this.speed.x = (tempVar * line.complexSqr.x) + (this.speed.y * line.complexSqr.y) + (Math.random() * 4 - 2);
        this.speed.y = (tempVar * line.complexSqr.y) - (this.speed.y * line.complexSqr.x) + (Math.random() * 4 - 2);


        if (Math.abs(this.spinRate) < 1.5) {
            this.spinRate *= 1.5;
        }
        this.spinRate *= -1;

        //bullet CANNOT end up in a box
        //we can mirror the bullet to the other side of the line it hit
        //we can do the same complex rotation we did with speed
        let path = new Line(this.prevLocation, this.location);

        let intersectionPoint = path.intersectionPoint(line);
        let distanceOffset = Vector2D.subtract(this.location, intersectionPoint);

        tempVar = distanceOffset.x;
        distanceOffset.x = (tempVar * line.complexSqr.x) + (distanceOffset.y * line.complexSqr.y);
        distanceOffset.y = (tempVar * line.complexSqr.y) - (distanceOffset.y * line.complexSqr.x);

        this.location = Vector2D.add(distanceOffset, intersectionPoint);
    }


    collisionEvent(eventCaller) {
        let callerType = eventCaller.constructor.name;
        if (callerType === 'Box') {
            this.rebound(eventCaller.closestLine(this));
        }
    }


    destroy() {
        super.destroy();
        document.dispatchEvent(new CustomEvent('droppableDestroyEvent', { detail: { instance: this } })); // catch this event in the dropper
        clearTimeout(this.destroyTimeout);
    }


}