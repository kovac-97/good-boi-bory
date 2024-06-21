class Dropper {

    
    constructor(asset_path) {
        this.asset_path = asset_path;
        this.dropInterval = null;
        this.difficultyInterval = null;
        this.activeDrops = [];
        this.dropDelay = 1600;
        this.destroyListener;
        this.dropCounter = 0;
    }

    drop() {
        var dropable = new Dropable(new Vector2D(
            Math.random() * (Globals.PLAYGROUND_X) - (Globals.PLAYGROUND_X / 2),
            Globals.PLAYGROUND_Y / 2
        ), 0, this.asset_path);
        this.activeDrops.push(
            dropable
        );
        dropable.drop(new Vector2D(
            (Math.random() - 0.5) * 100,
            0
        ));
        this.dropCounter++;
        this.updateScore();
    }

    updateScore(){
        document.querySelector("#score").innerHTML = `Score: ${this.dropCounter}`;
    }



    startDropping() {
        this.destroyListener = document.addEventListener('droppableDestroyEvent', () => {
            //Better to run this as an event rather than to check every tick...
            this.activeDrops = this.activeDrops.filter(obj => obj.enabled);
        });
        this.dropInterval = setInterval(() => { this.drop() }, this.dropDelay);
        this.difficultyInterval = setInterval(() => {      
            this.dropDelay *= 0.9;
            clearInterval(this.dropInterval);
            this.dropInterval = setInterval(() => { this.drop() }, this.dropDelay);
        }, 4000);
    }


    stopDropping(){
        document.removeEventListener('droppableDestroyEvent',this.destroyListener);
        clearInterval(this.difficultyInterval);
        clearInterval(this.dropInterval);
    }

    tick(deltaTime) {
        for (var dropable of this.activeDrops) {
            dropable.tick(deltaTime);
        }
    }

    afterTick() {
        for (var dropable of this.activeDrops) {
            dropable.afterTick();
        }
    }

    renderDrops() {
        for (var dropable of this.activeDrops) {
            dropable.render();
        }
    }
}