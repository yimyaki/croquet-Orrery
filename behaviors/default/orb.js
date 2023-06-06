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
        this.createMessage();
        
    }

    createMessage(){
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);
        console.log("creating message channel");
        this.messages.forEach((c) => c.destroy());
        let message = this.createCard({
            name: "blip",
                type: "object",
                translation,
                rotation: [0, 0, 0],
                behaviorModules: ["TickBlip"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: this._cardData.spawnTranslation,
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
        this.subscribe("message", "reflect","createInMessage");
        this.subscribe("message", "done", "deleteMessage");
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
        });
        this.messages.push(message);
    }

    createInMessage(){
        let translation = Microverse.v3_add(this.translation, [0, 0, 0]);
        console.log("creating message channel");
        this.messages.forEach((c) => c.destroy());
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
        });
        this.messages.push(message);
    }

    deleteMessage(){
        this.messages.forEach((c) => c.deleting = true);
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
        if(this.deleting){
            return;
        }
        this.future(100).step();
    }

    updatePositionBy(ratio) { // Where The Movement Occurs
        this.ratio += ratio*this.isNeg;
        this.ratio = Math.min(1, Math.max(0, this.ratio));
        let pos = Microverse.v3_lerp(this.pointA, this.pointB, this.ratio);
        //console.log(this.doomed);
        this.set({translation: pos});
        if(this.ratio >= 1){
            if(this._cardData.messageType == "out"){
                this.publish("message", "reflect");}
            if(this._cardData.messageType == "in"){
                //this.publish("message", "done");
                this.deleting = true;
                this.destroy();
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
        this.ratio = 0;
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
        this.ratio += ratio;
        this.ratio = Math.min(1, Math.max(0, this.ratio));
        let pos = Microverse.v3_lerp(this.pointA, this.pointB, this.ratio);
        this.set({translation: pos});
        if(this.ratio >= 1){
            this.ratio = 0;
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
        
    ]
}