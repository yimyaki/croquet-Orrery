// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = ["newwhite"];

    /* Alternatively, you can specify a card spec for an avatar,
       instead of a string for the partical file name, to create your own avatar.
       You can add behaviorModules here. Also, if the system detects a behavior module
       named AvatarEventHandler, that is automatically installed to the avatar.
        {
            type: "3d",
            modelType: "glb",
            name: "rabbit",
            dataLocation: "./assets/avatars/newwhite.zip",
            dataRotation: [0, Math.PI, 0],
            dataScale: [0.3, 0.3, 0.3],
        }
    */

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.ExcludedSystemBehaviorModules = ["avatarEvents.js"];
    Constants.UserBehaviorModules = [
        "csmLights.js","orb.js", "simpleSpin.js", "reflector.js","tour.js","avatarEvents.js","bitcoinTracker.js",
    ];
    const frameColor = 0x888888;

    Constants.DefaultCards = [
        {
            card: {
                name: "start point",
                type: "object",
                translation: [10, 0, 0],
                rotation: [0,Math.PI/2,0],
                spawn: "default"
                //todo:this.lookTo(-0.3, 0, [0, 0, 0])
            }
        },
        {
            card: {
                name:"world model",
                layers: ["walk"],
                type: "3d",
                dataLocation: "./assets/3D/doric_pillars_environment.glb",
                dataType: "glb",
                singleSided: true,
                shadow: true,
                translation:[0, -1.7, 0],
                dataTranslation:[0, -1, 0],
                placeholder: true,
                dataScale: [.1,.1,.1],
                placeholderSize: [400, 0.1, 400],
                placeholderColor: 0x808080,
                placeholderOffset: [0, 0, 0],
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light", "Create"],
                dataLocation: "./assets/sky/autumn_sky.exr",
                fileName: "/autumn_sky.exr",
                dataType: "exr",
            }
        },
        {
            card: {
                name: "orb",
                type: "object",
                translation: [0, 0, 9],
                rotation: [0, 0, 0],
                behaviorModules: ["Orb","Spawn"],
                shadow: true,
                radius: .5,
                dataScale: [1, 1, 1],

                spawnType: "object",
                spawnDataRotation:  [0, 0, 0],
                spawnTranslation: [0, 0, 9],
                spawnRotation:  [0, 0, 0],
                spawnScale: [1, 1, 1],
                spawnThickness: .02,
                spawnBehaviors: ["Ring", "SimpleSpin"],

            }
        },
        {
            card: {
                name: "orb",
                type: "object",
                translation: [3, 0, 4],
                rotation: [0, 0, 0],
                behaviorModules: ["Orb","Spawn"],
                shadow: true,
                radius: .5,
                dataScale: [1, 1, 1],

                spawnType: "object",
                spawnDataRotation:  [0, 0, 0],
                spawnTranslation: [3, 0, 4],
                spawnRotation:  [0, 0, 0],
                spawnScale: [1, 1, 1],
                spawnThickness: .02,
                spawnBehaviors: ["Ring", "SimpleSpin"],

            }
        },
        /**{
            card: {
                name: "ring",
                type: "object",
                translation: [0, 0, 9],
                rotation: [0, 0, 0],
                behaviorModules: ["Ring", "SimpleSpin"],
                shadow: true,
                radius: .8,
                thickness: .02,
                dataScale: [1, 1, 1],

            }
        },**/
        {
            card: {
                name:"Crystal",
                layers: ["walk"],
                behaviorModules: ["Reflect"],
                type: "3d",
                dataLocation: "./assets/3D/stylized_crystal_baked_lighting_map.glb",
                dataType: "glb",
                singleSided: true,
                shadow: true,
                translation:[0, 1, 0],
                dataTranslation:[0, 0, 0],
                dataScale: [0.5,0.5,0.5],
            }
        },
        {
            card: {
                name: "blip",
                type: "object",
                translation: [0, 0, 0],
                rotation: [0, 0, 0],
                behaviorModules: ["MessageBlip"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [0, 0, 9]

            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [10, 0, 0],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [10, 0, 0],
                next_loc:[1,0,0],
                next_rot:[0,0,0,1],
                text: "start tour: click to go to next station",

            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [1, 0, 0],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [1, 0, 0],
                next_loc:[-3,0,4],
                next_rot:[0,0,0,1],
                text: "station 2:This is the refector. the reflector send out ticks to keep the models syncronized. click to go to next station",

            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [-3, 0, 4],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [-3, 0, 4],
                next_loc:[10,0,0],
                next_rot:[0,0,0,1],
                text: "station 3: These orrerys represent the object. each user has one copy on their system which is kept syncronixed through the reflector. click to go to next station",
            }
        },
        {
            card: {
                name: "bitcointracker",
                translation: [-5, 0.6, -16.87],
                rotation: [0, 0, 0],
                scale: [3, 3, 3],
                type: "2d",
                textureType: "canvas",
                textureWidth: 1024,
                textureHeight: 768,
                width: 1,
                height: 0.75,
                frameColor: frameColor,
                // color: 0xffffff,
                depth: 0.05,
                cornerRadius: 0.1,
                behaviorModules: ["Elected", "BitcoinTracker"],
            },
            id: "main",
        },
    ];
}
