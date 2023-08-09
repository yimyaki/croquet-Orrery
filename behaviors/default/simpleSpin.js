// SimpleSpin
// Copyright 2022 Croquet Corporation
// Croquet Microverse
// Simple start/stop spinner


class SpinningActor {
    setup() {
        this.spinning = false; // start without spinning
        this.angle = 0; // the initial angle
        this.spinSpeed = 0.01; // how fast will we spin (in radians)
        //this.addEventListener("pointerDown", "reflectToggle");
        this.addEventListener("pointerDown", "createOutMessage");//reflectSpawn");
        this.addEventListener("pointerDown", "waitReflect");//reflectSpawn");
        this.subscribe("return", "toggle", "toggle");
        this.subscribe("message", "reflect_spin","createInMessage");
        this.subscribe("message", "done_spin", "deleteMessage");
        this.radius = this._cardData.radius;
        this.messages = [];
    }

    createOutMessage(){
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);
        console.log("creating message channel");
        //this.messages.forEach((c) => c.destroy());
        let message = this.createCard({
            name: "blip",
                type: "object",
                translation,
                rotation: [0, 0, 0],
                behaviorModules: ["MessageBlip"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: this._cardData.destination,
                messageType: "out",
                messageFor: "spin",
        });
        this.messages.push(message);
    }

    createInMessage(){
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);
        console.log("creating message channel");
        //this.messages.forEach((c) => c.destroy());
        let message = this.createCard({
            name: "blip",
                type: "object",
                translation,
                rotation: [0, 0, 0],
                behaviorModules: ["MessageBlip"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: this._cardData.destination,
                messageType: "in",
                messageFor: "spin",
        });
        this.messages.push(message);
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

    waitReflect(){
        this.future(20000).reflectToggle();
    }

    deleteMessage(){
        this.messages.forEach((c) => c.deleting = true);
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
