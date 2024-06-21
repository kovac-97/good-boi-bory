class Animator {
    constructor(element) {
        this.element = element; // element to be acted upon
        this.animations = {}; // {state: {duration(float), sprites(strArray)}}
        this.interval = null;
        this.index = 0;
    }

    startAnimation(state) {
        clearInterval(this.interval); //no need for a separate stopAnim function
        this.element.src = this.animations[state]['sprites'][0];

        this.index = 0;
        this.interval = setInterval(() => {
            if (this.index >= this.animations[state]['sprites'].length) {
                this.index = 0;
            }
            this.element.src = this.animations[state]['sprites'][this.index];
            this.index++;
        }, this.animations[state]['duration'] * 1000);
    }

    createBase64Paths(animations) {
        var promises = [];

        var states = Object.keys(animations);
        for (var state of states) {
            this.animations = { ...this.animations, [state]: { duration: animations[state].duration } };
            this.animations[state].sprites = [];
            for (var path of animations[state]['sprites']) {
                ((currentState) => {
                    promises.push(
                        fetch(`./assets/animation-sprites/${path}`)
                            .then(response => response.blob())
                            .then(blob => {
                                return new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onloadend = function () {
                                        const base64data = reader.result;
                                        resolve({ state: currentState, data: base64data });
                                    }
                                    reader.onerror = function (error) {
                                        reject(error);
                                    };
                                    reader.readAsDataURL(blob);
                                });
                            })
                    );
                })(state);
            }
        }

        return Promise.all(promises).then((results => {
            for (var result of results) {
                this.animations[result['state']]['sprites'].push(result['data']);
            }
        }));

    }
}