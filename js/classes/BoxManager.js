class BoxManager {


    static GenerateObjects(numberOfBoxes = Math.floor((Math.random() * 3) + 4)) {
        var boxes = this.GenerateBoxes(numberOfBoxes);

        var boxMap = Object.fromEntries( //Maps boxId to boxes array index
            boxes.map((box, index) => {
                box.enable();
                return [box.id, index];
            })
        );

        return [boxes, boxMap];
    }

    static GenerateBoxes(numberOfBoxes, existingBoxes = []) {
        if (numberOfBoxes === 0) {
            return existingBoxes;
        }

        const newBox = BoxManager.attemptBoxCreation(existingBoxes);

        return BoxManager.GenerateBoxes(
            newBox ? numberOfBoxes - 1 : numberOfBoxes,
            newBox ? [...existingBoxes, newBox] : existingBoxes
        );

    }

    static attemptBoxCreation(existingBoxes) {
        const dimension = (Math.random() * 16) + 48; // 48=<dimension<64
        const rotation = Math.random() * Math.PI / 4;

        const generateRandomLocation = () => ({
            x: Math.random() * (Globals.PLAYGROUND_X) - (Globals.PLAYGROUND_X / 2),
            y: Math.random() * (Globals.PLAYGROUND_Y * 0.4) - (Globals.PLAYGROUND_Y * 0.2),
        });

        const isCloseToAnyExistingBox = (newBox) =>
            existingBoxes.some((existingBox) => newBox.closeTo(existingBox));

        const createBox = () => {
            const { x, y } = generateRandomLocation();
            const newBox = new Box(dimension, new Vector2D(x, y), rotation, true);

            return isCloseToAnyExistingBox(newBox) ? (() => { newBox.destroyElement(); return null; })() : newBox;
        };

        return createBox();
    }
}