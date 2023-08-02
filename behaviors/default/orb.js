/*
    This file contains 3 behaviors:
        -glowtext
        -qrcode
        -snowball

    Glowtext and qrcode are unused in this world, and can be implemented to add an in world qrcode
    linking to the scene.

    Snowball contains the code to produce a snowball that is draggable in 2 dimentions.
*/
class TextActor {
    setup() {
        let actors = this.queryCards();
        this.avatars = actors.filter((a) => a.playerId);
        this.text = this._cardData.text;
        this.text2 = this._cardData.text2;
        this.currDot = 0;
        if(this.avatars.length<2){
            if(!this.stepping){
                this.stepping = true;
                this.step();
            }
            if(this.QRimg){
                this.QRimg.destroy();
            }
            this.QRimg = this.createCard({
                translation: [0, 2.5, 8.5],
                scale: [2, 2, 2],
                rotation: [0, 0, 0, 1],
                layers: ["pointer"],
                name: "QR-Holo",
                cornerRadius: 0.02,
                behaviorModules: ["QRCode"],
                fullBright: false,
                shadow: true,
                singleSided: true,
                //textureLocation: "3dbVMCMeVHmQoRX1BH8uxp6cCh6izEk_v5CbIrHYOLdIDBAQFBdeS0sCDQgBF0oRF0oHFgsVEQEQSg0LSxFLHjEQEzQrHiIRKzdVLw0DKT4NUVddHCIgI1xUVksNC0oHFgsVEQEQSgkNBxYLEgEWFwFKCAsHBQgAARIAAQIFEQgQSwo1JSMUBiAsKAIUVihJFTEuD1wWKTUFVAohHAlRFjsjAgwOMC8AJi8JPDFLAAUQBUtQIg5dHBU9NChSCjwGKVYMDRMuCyMXMB0vEhxWDz4RVRwLMgMAIgFSPhAX",
                textureType: "canvas",
                textureHeight: 280,
                textureWidth: 280,
                type: "2d",
            });
        }
    }

    step(){
        if(!this.stepping){
            return;
        }
        if(this.avatars.length<2){
            if(this.QRimg){
            this.QRimg.set({scale:[2,2,2]});}
            let currText = "";
            if(this.currDot<=this.text.length){
                currText = this.text.substring(0,this.currDot);
            }else{
                currText = this.text2.substring(0,this.currDot-this.text.length);
            }
            this.currDot+=1;
            this.currDot = this.currDot%(this.text.length+this.text2.length+1);
            this.say("step",currText);
        }else{
            this.say("step",0);
            if(this.QRimg){
            this.QRimg.set({scale: [0,0,0]});}
        }
        let actors = this.queryCards();
        this.avatars = actors.filter((a) => a.playerId);
        this.future(500).step();
    }

}

class TextPawn {
    setup() {
        if (this.left_dots) {
            this.left_dots.forEach((d) => d.removeFromParent());
        }
        this.text = this.actor._cardData.text;
        this.material =  new Microverse.THREE.MeshStandardMaterial({emissive: this.actor._cardData.color || 0xFFFFFF, side: Microverse.THREE.DoubleSide});
        this.material.transparent = true;
        this.material.opacity = 0.27;
        this.currDot = 0;
        this.green = 0x40FF00;
        this.red = 0xFF7300;
        this.upTranslation = this.actor._translation;
        this.listen("step","step");
    }

    step(currText){
        this.shape.children.forEach((c) => this.shape.remove(c));
        if(currText == 0){
            return;
        }
        const loader = new Microverse.THREE.FontLoader();
        loader.load('./assets/fonts/helvetiker_bold.typeface.json',(font) => {
            let geometry = new Microverse.THREE.TextGeometry(currText+"_", {
                font: font,
                size: .2,
                height: .01,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .01,
                bevelSize: .005,
                bevelOffset: 0,
                bevelSegments: 5
            } );
            let dot = new Microverse.THREE.Mesh(geometry, this.material);
            dot.position.set(1,1,1);
            dot.rotation.set(0,0,0)
            this.shape.add(dot);
        });
    }

    teardown() {
        if (this.bloomPass) {
            this.service("ThreeRenderManager").composer.removePass(this.bloomPass);
            this.bloomPass = null;
        }
    }

}

class QRCodePawn {
    setup() {
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
        //debugger;
        let canvas = Microverse.App.makeQRCanvas({colorDark: "#000000", colorLight: "#FFFFFF", height: 256, width: 256});
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,280,280);
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 12, 12, 256, 256); // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        this.texture.needsUpdate = true
        this.shape.traverse((mesh) => {
            if (mesh.material) {
                mesh.material.transparent = true;
                mesh.material.opacity = 0.3;
            }
        });
    }
}
class OrbActor {
    setup(){
        this.messages = [];
        this.flowticks();

    }

    flowticks(){
        this.messages.forEach((c) => c.destroy());
        this.createMessage(0);
        this.createMessage(0.2);
        this.createMessage(0.4);
        this.createMessage(0.6);
        this.createMessage(0.8);
    }

    createMessage(start_ratio){
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);
        console.log("creating message channel");
        //this.messages.forEach((c) => c.destroy());
        let message = this.createCard({
            name: "blip",
                type: "object",
                translation,
                rotation: [0, 0, 0],
                behaviorModules: ["TickBlip"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: this._cardData.spawnTranslation,
                start_ratio: start_ratio,
        });
        this.messages.push(message);

        
    }
}
class OrbPawn {
    /*Creates a white ball of size 'radius' using three.js. this ball is draggable in 2 dimentions.
    movement is restricted on the X dimension*/
    setup() {
        this.radius = this.actor._cardData.radius; //retrive desired radius
        this.dest = this.actor._cardData.spawnTranslation;
        //create ball
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshPhysicalMaterial({
            color: this.actor._cardData.color || 0x994d00, //0xb67e11, //0xd4af37,
            metalness:1.0,
            roughness: 0.2,
        });
        let orb = new Microverse.THREE.Mesh(geometry, material);
        orb.position.set(0,0,0);
        orb.castShadow = true;
        orb.receiveShadow = true;
        this.shape.add(orb);

        let lineMaterial = new Microverse.THREE.LineBasicMaterial( { 
            color: 0xffFFff,
            linewidth: 20,
         } );
        let points = [];
        points.push( new Microverse.THREE.Vector3( 0, 0, 0 ) );
        points.push( new Microverse.THREE.Vector3( -this.dest[0], -this.dest[1], -this.dest[2] ) );//Microverse.v3_add(this.dest, [0, 0, 0]) );
        let lineGeometry = new Microverse.THREE.BufferGeometry().setFromPoints( points );
        let line = new Microverse.THREE.Line( lineGeometry, lineMaterial );
        line.position.set(0,0,0);
        this.shape.add(line);
    }
}

class RingPawn {
    /*Creates a white ball of size 'radius' using three.js. this ball is draggable in 2 dimentions.
    movement is restricted on the X dimension*/
    setup() {
        this.radius = this.actor._cardData.radius || 0.05; //retrive desired radius
        this.thickness = this.actor._cardData.thickness;
        //create ball
        let geometry = new Microverse.THREE.TorusGeometry(this.radius,this.thickness,32,100);
        let material =  new Microverse.THREE.MeshPhysicalMaterial({
            color: this.actor._cardData.color || 0x994d00, //0xb67e11, //0xd4af37,
            metalness:1.0,
            roughness: 0.2,
        });
        let orb = new Microverse.THREE.Mesh(geometry, material);
        orb.position.set(0,0,0);
        orb.castShadow = true;
        orb.receiveShadow = true;
        this.shape.add(orb);
    }
}

class SpawnActor{
    /*Creates a object capable of spawning other objects. as input, the object needs the data location
    of both the spawner and the spawnee as well as locaiton, rotatio, ect. data for both.
    */
    setup(){
        this.addEventListener("pointerDown", "createOutMessage");//reflectSpawn");
        this.addEventListener("pointerDown", "waitReflect");//reflectSpawn");
        this.subscribe("return", "spawn", "spawn");
        this.subscribe("message", "reflect_spawn","createInMessage");
        this.subscribe("message", "done_spawn", "deleteMessage");
        this.spawn(); // spawn one on startup
        this.radd = 0.1;
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
                destination: this._cardData.spawnTranslation,
                messageType: "out",
                messageFor: "spawn",
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
                destination: this._cardData.spawnTranslation,
                messageType: "in",
                messageFor: "spawn",
        });
        this.messages.push(message);
    }

    deleteMessage(){
        /* TODO: FIX THIS!! */
        //this.messages.forEach((c) => c.deleting = true);
        //this.messages.forEach((c) => c.destroy());
    }

    waitReflect(){
        this.future(20000).reflectSpawn();
    }
    reflectSpawn(){
        this.publish("reflect", "spawn");
    }

    spawn(){
        ///Spawn an item using parameters from the spawner
        //add slight variation in spawn location to prevent overlap of multiple spawned objects
        this.radd+=0.05;
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);

        //create spawn
        this.publish("spawn", "spawn", {
            name: "spawned_object",
            type: this._cardData.spawnType,
            dataRotation: this._cardData.spawnDataRotation,
            translation,//: this._cardData.dataTranslation,
            rotation: this._cardData.spawnRotation,
            dataScale: this._cardData.spawnScale,
            behaviorModules: this._cardData.spawnBehaviors,
            layers: ["pointer"],
            shadow: true,
            radius: this.radd+this._cardData.radius,
            thickness: this._cardData.spawnThickness,
        });
    }
}


class SpawnPawn{
    setup() {
        // prevent jumping to crate
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
    }
}

class CreateActor {
    /*
    creates the default cards for the snowman. includes various snowballs, sticks coal and hats.
    useful for allowing the implementation of a reset button
    */
    setup(){
        console.log("Creating Default Cards - 0!");
        this.cards = [];
        this.reset();
        this.subscribe("spawn", "spawn", "createNew")
        this.subscribe("storm", "reset", "reset");
    }

    createDefaults(){
        //console.log("Creating Default Cards!");
    }
    createNew(data){
        let spawn = this.createCard(data);
        this.cards.push(spawn);
    }

    reset(){
        console.log("Creating Default Cards! - 1");
        this.cards.forEach((c) => c.destroy());
        this.createDefaults();
    }
}

class MessageBlipActor {
    setup(){
        this.ratio = 0;
        this.isNeg = 1;
        this.pointB = [0,0,0];
        this.deleting = false;
        this.pointA = this._cardData.destination || [0,0,4]; // postion of 'removed' gate.
        if(this._cardData.messageType == "in"){
            this.pointA = [0,0,0];
            this.pointB = this._cardData.destination || [0,0,4]; 
        }
        if (this.ratio === undefined) this.ratio = 0.2;
        this.updatePositionBy(0);
        this.step();

    }

    step() {
        this.updatePositionBy(0.01);
        if(!this.deleting){
            this.future(100).step();
        }
    }

    updatePositionBy(ratio) { // Where The Movement Occurs
        if(!this.deleting){
        this.ratio += ratio*this.isNeg;
        this.ratio = Math.min(1, Math.max(0, this.ratio));
        let pos = Microverse.v3_lerp(this.pointA, this.pointB, this.ratio);
        this.set({translation: pos});
        if(this.ratio >= 1){
            if(this._cardData.messageType == "out"){
                if(this._cardData.messageFor == "spawn"){
                    this.publish("message", "reflect_spawn");
                }
                if(this._cardData.messageFor == "spin"){
                    this.publish("message", "reflect_spin");
                }
            }
            if(this._cardData.messageType == "in"){
                //this.publish("message", "done");
                console.log(this.deleting);
                if(this._cardData.messageFor == "spawn"){
                    this.publish("message", "done_spawn");
                    this.publish("message", "arrive", 0x00FF00);
                }
                if(this._cardData.messageFor == "spin"){
                    this.publish("message", "done_spin");
                    this.publish("message", "arrive", 0x00FF00);
                }
                this.destroy();
            }
            this.deleting = true;
        }
    }
        if(this.ratio < 0){
            
            //this.ratio = 0;
        }
    }

}

class MessageBlipPawn {
    setup(){
        this.radius = 0.1; //retrive desired radius
        //create ball
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshStandardMaterial({
            color: this.actor._cardData.color || 0x00FF00, 
        });
        let blip = new Microverse.THREE.Mesh(geometry, material);
        blip.position.set(0,0,0);
        blip.castShadow = true;
        blip.receiveShadow = true;
        this.shape.add(blip);
    }
    
}

class TickBlipActor {
    setup(){
        this.ratio = this._cardData.start_ratio||0;
        this.pointA = [0,0,0];
        this.pointB = this._cardData.destination || [0,0,4]; // postion of 'removed' gate.
        if (this.ratio === undefined) this.ratio = 0.2;
        this.updatePositionBy(0);
        this.step();

    }

    step() {
        this.updatePositionBy(0.01);
        this.future(100).step();
    }

    updatePositionBy(ratio) { // Where The Movement Occurs
        
        this.ratio = Math.min(1, Math.max(0, this.ratio));
        let pos = Microverse.v3_lerp(this.pointA, this.pointB, this.ratio);
        if(this.ratio==0){
            this.set({translation: pos});
        }
        else{
            this.translateTo(pos);
        }
        this.ratio += ratio;
        if(this.ratio >= 1){
            this.ratio = 0;
            this.publish("message", "arrive", 0xFFFFFF);
        }

    }

}

class TickBlipPawn {
    setup(){
        this.radius = 0.02; //retrive desired radius
        //create ball
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshStandardMaterial({
            color: this.actor._cardData.color || 0xFFFFFF, 
        });
        let blip = new Microverse.THREE.Mesh(geometry, material);
        blip.position.set(0,0,0);
        blip.castShadow = true;
        blip.receiveShadow = true;
        this.shape.add(blip);
    }
    
}

class SpawnOrreryActor{
    /*Creates a object capable of spawning other objects. as input, the object needs the data location
    of both the spawner and the spawnee as well as locaiton, rotatio, ect. data for both.
    */
    setup(){
        this.addEventListener("pointerDown", "spawn");//reflectSpawn");
        //this.spawn(); // spawn one on startup
        this.radd = 0.1;
        this.messages = [];
    }

    spawn(){
        ///Spawn an item using parameters from the spawner
        //add slight variation in spawn location to prevent overlap of multiple spawned objects
        this.radd+=0.05;
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);

        //create spawn
        this.publish("spawn", "spawn", {
            name: "spawned_object",
            type: this._cardData.spawnType,
            dataRotation: this._cardData.spawnDataRotation,
            translation,//: this._cardData.dataTranslation,
            rotation: this._cardData.spawnRotation,
            dataScale: this._cardData.spawnScale,
            behaviorModules: this._cardData.spawnBehaviors,
            layers: ["pointer"],
            shadow: true,
            radius: this.radd+this._cardData.radius,
            thickness: this._cardData.spawnThickness,
        });
    }
}
class SpawnOrreryPawn{
    setup(){
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
    }
}

class StarActor{
    setup(){

    }

    createStar(){

    }

    flashStar(){

    }

}

class StarPawn{
    setup(){
        this.createStar;
        this.subscribe("message", "arrive", "flashStar");
    }

    createStar(){
        this.geometry = new Microverse.THREE.TetrahedronGeometry(1,0);
        this.material = new Microverse.THREE.MeshStandardMaterial({
            //color: this.actor._cardData.color || 0xFFFFFF, 
            emissive: 0x888888,
        });
        let star = new Microverse.THREE.Mesh(this.geometry, this.material);
        star.position.set(0,0,0);
        star.castShadow = false;
        star.receiveShadow = false;
        this.shape.add(star);
    }

    flashStar(color){
       // this.material.color.set(??);
       this.material.emissive.set(color);
        
    }

}

export default {
    modules: [
        {
            name: "Orb",
            actorBehaviors:[OrbActor],
            pawnBehaviors: [OrbPawn],
        },
        {
            name: "Ring",
            pawnBehaviors: [RingPawn],
        },
        {
            name: "Create",
            actorBehaviors: [CreateActor],
            pawnBehaviors: []
        },
        {
            name: "Spawn",
            actorBehaviors: [SpawnActor],
            pawnBehaviors: [SpawnPawn]
        },
        {
            name: "MessageBlip",
            actorBehaviors: [MessageBlipActor],
            pawnBehaviors: [MessageBlipPawn]
        },
        {
            name: "TickBlip",
            actorBehaviors: [TickBlipActor],
            pawnBehaviors: [TickBlipPawn]
        },
        {
            name: "Star",
            actorBehaviors: [StarActor],
            pawnBehaviors: [StarPawn]

        },
        
    ]
}