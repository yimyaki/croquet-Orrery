// SimpleSpin
// Copyright 2022 Croquet Corporation
// Croquet Microverse
// Simple start/stop spinner


class ReflectActor {
    setup() {
        this.subscribe("reflect", "spawn", "spawn");
        this.subscribe("reflect", "toggle", "toggle");

    }
    toggle(rad){
        this.publish("return", "toggle", rad);
    }

    spawn(){
        this.publish("return", "spawn");
    }
}

export default {
    modules: [
        {
            name: "Reflect",
            actorBehaviors: [ReflectActor],
        }
    ]
}
