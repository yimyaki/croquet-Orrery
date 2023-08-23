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
                next_loc:[3,0,0],
                plack_rot:[0,0.7071,0,0.7071],
                next_rot:[0,0.7071,0,0.7071],
                text: "start tour: click to go to next station",

            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [3, 0, 0],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [3, 0, 0],
                next_loc:[-3,0,4],
                plack_rot:[0,0.7071,0,0.7071],
                next_rot:[0,-0.7071,0,0.7071],
                text: 'station 2:This is the reflector.\n the reflector sends out ticks to keep the models synchronized.\n Click to go to next station',

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
                next_loc:[1.5,0,10],
                plack_rot:[0,-0.7071,0,0.7071],
                next_rot:[0, 0.14357139067798902, 0, 0.9896399627029966],
                text: 'station 3: These orreries represent the object.\n Each user has one copy on their system which is kept synchronized through the reflector. This is shown as white ticks which are sent to the orrery every second.\n Click to go to next station',
            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [1.5, 0, 10],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [1.5, 0, 10],
                next_loc:[1.5, 0, 7],
                plack_rot:[0, 0.14357139067798902, 0, 0.9896399627029966],
                next_rot:[0, 0.14357139067798902, 0, 0.9896399627029966],
                text: 'station 4: when a change is made on one orrery, a message is sent to the reflector. the reflector send back a message to all orreries, and the change is made by all of them simultaniously when the messege arrives. click on the orrery to make a change. Click on this plaque to go to the next station',
            }
        },
        {
            card: {
                name: "tour",
                type: "object",
                translation: [1.5, 0, 10],
                rotation: [0, 0, 0],
                behaviorModules: ["Tour"],
                shadow: true,
                dataScale: [1, 1, 1],
                destination: [1.5, 0, 7],
                next_loc:[10,0,0],
                plack_rot:[0, 0.14357139067798902, 0, 0.9896399627029966],
                next_rot:[0,0.7071,0,0.7071],
                text: 'station 5: these changes are saved so that new orreries appear in the same state. click on this bell to spawn a new orrery. click on this plack to return to beggining',
            }
        },
       {
            card: {
                name: "star",
                type: "3d",
                dataLocation: "./assets/3D/trophy_brass_bell.glb",
                translation: [1.5, 0, 6],
                rotation: [0, 0, 0],
                behaviorModules: [ "SpawnOrrery"],
                dataScale: [1, 1, 1],
            }
        },
    ];
}
