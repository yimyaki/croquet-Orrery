/*
    This file contains 3 behaviors:
        -glowtext
        -qrcode
        -snowball

    Glowtext and qrcode are unused in this world, and can be implemented to add an in world qrcode
    linking to the scene.

    Snowball contains the code to produce a snowball that is draggable in 2 dimentions.
*/
class GlowTextActor {
    setup() {
        this.text = this._cardData.text;
        this.step();
    }

    step(){
        let currText = this.text;
        this.say("step",currText);
    }

}

class GlowTextPawn {
    setup() {
        this.text = this.actor._cardData.text||"load";
        this.material =  new Microverse.THREE.MeshStandardMaterial({emissive: this.actor._cardData.color || 0xFFFFFF, side: Microverse.THREE.DoubleSide});
        this.material.transparent = true;
        this.material.opacity = 0.7;
        this.upTranslation = this.actor._translation;
        console.log("textsetup");
        this.step(this.text);
        //this.listen("step","step");
        
    }

    step(currText){
        this.shape.children.forEach((c) => this.shape.remove(c));
        const loader = new Microverse.THREE.FontLoader();
        loader.load('./assets/fonts/helvetiker_bold.typeface.json',(font) => {
            let geometry = new Microverse.THREE.TextGeometry(currText, {
                font: font,
                size: .1,
                height: .01,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .01,
                bevelSize: .005,
                bevelOffset: 0,
                bevelSegments: 5
            } );
            let dot = new Microverse.THREE.Mesh(geometry, this.material);
            dot.position.set(-2,0,1);
            dot.rotation.set(0,3.14/2,0);
            this.shape.add(dot);
        });
        let plackGeo = new Microverse.THREE.BoxGeometry(.01,0.5,3);
        let plackMaterial =  new Microverse.THREE.MeshPhysicalMaterial({
            color: this.actor._cardData.color || 0x994d00, //0xb67e11, //0xd4af37,
            metalness:1.0,
            roughness: 0.2,
        });
        let plack = new Microverse.THREE.Mesh(plackGeo,plackMaterial);
        plack.position.set(-2,0,0);
        plack.rotation.set(0,0,0);
        this.shape.add(plack);
    }

    teardown() {
        if (this.bloomPass) {
            this.service("ThreeRenderManager").composer.removePass(this.bloomPass);
            this.bloomPass = null;
        }
    }

}

class TextPawn {
    setup(){
        this.text = this.actor._cardData.text||"load";
        this.addText();
    }

    addText() {
        let color = "#22FF22";

        this.clear("#222222");
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillStyle = color;

        ctx.font = "40px Arial";
        ctx.fillText(this.text, this.canvas.width - 40, 85);

        this.texture.needsUpdate = true;
    }

    clear(fill) {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = fill;
        ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
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

class TourActor{
    setup() {
        this.next_loc = this._cardData.next_loc;
        this.next_rot = this._cardData.next_rot;
        this.destination = this._cardData.destination;
        this.text = this._cardData.text;
        if(!this.stepping){
            this.step();
        }
        this.textinfo = {
            name: "plack",
            type: "object",
            translation: Microverse.v3_add(this.destination, [0, 0, 0]),
            rotation: [0, 0, 0],
            behaviorModules: ["GlowText","TourButton"],
            shadow: true,
            myScope: "left",
            level: 1,
            dataScale: [1, 1, 1],
            singleSided: true,
            text: this.text,
            next_loc:this.next_loc,
            next_rot:this.next_rot,
        };

        this.plackinfo = {
            name: "plack",
            type: "2d",
            translation: Microverse.v3_add(this.destination, [-1, 0, 0]),
            rotation: [0, 3.14/2, 0],
            behaviorModules: ["Text","TourButton"],
            shadow: true,
            myScope: "left",
            dataScale: [1, 1, 1],
            singleSided: true,
            textureType: "canvas",
            textureWidth: 1024,
            textureHeight: 768,
            width: 1,
            height: 0.75,
            depth: 0.05,
            fullBright: false,
            color: 0xffff00,
            frameColor: 0xff0000,
            cornerRadius: 0.1,
            text: this.text,
            next_loc:this.next_loc,
            next_rot:this.next_rot,
        };

        this.buttoninfo = {
            name: "button",
            type: "object",
            translation: [10, 0, 2],
            rotation: [0, 0, 0],
            behaviorModules: ["TourButton"],
            shadow: true,
            myScope: "left",
            level: 1,
            dataScale: [1, 1, 1],
            next_loc:this.next_loc,
            singleSided: true,
        };
    }

    step(){
        
        this.stepping = true;
        let attendee = false;
        let actors = this.queryCards();
        let avatars = actors.filter((a) => a.playerId);
        let posit = Microverse.v3_add(this.destination, [0, 0, 0]);
        avatars.forEach((a) => {
            if (Microverse.v3_magnitude(Microverse.v3_sub(a.translation,posit)) < 1.4) {
                //console.log("on tour");
                //this.say("visible");
                this.visible();
                this.visible = true;
                attendee = true;
            }
        });

        if(this.visible && !attendee){
            this.say("invisible");
        }
        this.future(100).step();

    }

    visible(){
        //console.log("hi");
        if(!this.textCard){
            this.textCard = this.createCard(this.plackinfo);
            //this.buttonCard = this.createCard(this.buttoninfo);
        }
    }
    
}

class TourPawn{
    setup(){
        this.text = this.actor._cardData.text;
        this.listen("visible", "visible")
        this.listen("invisible", "invisible")
    }

    visible(){
        if(!this.textCard){
            this.textCard = this.createCard(this.textinfo);
        }
        if(!this.buttonCard){
            this.buttonCard = this.createCard(this.buttoninfo);
        }
    }

    invisible(){
        //this.textCard.destroy();
        //this.buttonCard.destroy();
    }
}

class TourButtonActor{
    setup(){
        this.next_loc = this._cardData.next_loc;
        this.next_rot = this._cardData.next_rot;
        this.addEventListener("pointerDown", "nextLoc");
    }
    nextLoc(){
        //console.log(this.next_loc);
        this.publish("tour","move",[this.next_loc,this.next_rot]);
        //this.goTo(this.next_loc[0], this.next_loc[1], true);
        //this.goTo([0,0,0], [0,0,0,1], true);
    }
}
class TourButtonPawn{
    setup(){
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
    }

}

export default {
    modules: [
        {
            name: "GlowText",
            actorBehaviors: [GlowTextActor],
            pawnBehaviors: [GlowTextPawn]
        },
        {
            name: "Text",
            //actorBehaviors: [TextActor],
            pawnBehaviors: [TextPawn]
        },
        {
            name: "QRCode",
            pawnBehaviors: [QRCodePawn],
        },
        {
            name: "Tour",
            actorBehaviors: [TourActor],
            pawnBehaviors: [TourPawn]
        },
        {
            name: "TourButton",
            actorBehaviors: [TourButtonActor],
            pawnBehaviors: [TourButtonPawn]
        }
    ]
}