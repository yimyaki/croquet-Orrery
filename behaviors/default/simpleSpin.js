// SimpleSpin
// Copyright 2022 Croquet Corporation
// Croquet Microverse
// Simple start/stop spinner


class SpinningActor {
    setup() {
        this.spinning = false; // start without spinning
        this.angle = 0; // the initial angle
        this.spinSpeed = 0.01; // how fast will we spin (in radians)
        this.addEventListener("pointerDown", "reflectToggle");
        this.subscribe("return", "toggle", "toggle");
        this.radius = this._cardData.radius;
    }

    step() {
        if (!this.spinning) {return;}
        this.future(20).step();
        this.angle+=this.spinSpeed;
        this.set({rotation: Microverse.q_euler(0, this.angle, 0)});
    }

    reflectToggle(){
        this.publish("reflect", "toggle", this.radius);
    }

    toggle(rad) {
        if (rad == this.radius){
            this.spinning = !this.spinning;
            if (this.spinning) this.step();
        }
    }

    teardown() {
        this.removeEventListener("pointerDown", "toggle");
        this.spinning = false;
    }
}

export default {
    modules: [
        {
            name: "SimpleSpin",
            actorBehaviors: [SpinningActor],
        }
    ]
}
