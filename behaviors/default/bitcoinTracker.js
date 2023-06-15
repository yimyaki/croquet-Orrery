// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

/*

This module manages a list of recent values from a bitcoin position
server. It is used with the Elected module, so that one of
participants is chosen to fetch values.

*/

/*

BitcoinTrackerActor's history is a list of {date<milliseconds>, and amount<dollar>}

*/


class BitcoinTrackerPawn {
    setup() {
        this.onBTCUSDChanged();
    }

    /*
      The card that has this module is expected to be "2d" type with textureType: "canvas".
      this.canvas is the DOM canvas element.
      The setColor event at the end informs other related pawns to change their color,
      thus using the view's id as scope.
    */

    onBTCUSDChanged() {
        let color = "#22FF22";

        this.clear("#222222");
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillStyle = color;

        ctx.font = "40px Arial";
        ctx.fillText("hello", this.canvas.width - 40, 85);

        this.texture.needsUpdate = true;
    }

    clear(fill) {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = fill;
        ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
    }
}



export default {
    modules: [
        {
            name: "BitcoinTracker",
            //actorBehaviors: [BitcoinTrackerActor],
            pawnBehaviors: [BitcoinTrackerPawn],
        },
    ]
}

/* globals Microverse */
