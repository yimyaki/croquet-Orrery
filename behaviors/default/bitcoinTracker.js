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

class BitcoinTrackerActor {
    setup() {
        if (!this.history) {
            this.history = [{ date: 0, amount: 0 }];
        }
        this.listen("BTC-USD", "onBitcoinData");
        //this.listen("BTC-USD-history", "onBitcoinHistory");
    }

    latest() {
        return this.history[this.history.length - 1];
    }

    onBitcoinData({date, amount}) {
        // Adds a new entry if it is more than 1000 miliiseconds after
        // the last data point, and publishes value-change event.
        if (date - this.latest().date < 1000) return;
        this.addEntries({date, amount});
        this.say("value-changed", amount);
    }

    /**onBitcoinHistory(prices) {
        const newer = prices.filter(p => p.date - this.latest().date > 25000);
        this.addEntries(...newer);
        this.publish(this.id, "value-init", newer.map(v=>v.amount));
    }**/

    addEntries(...data) {
        this.history.push(...data);
        if (this.history[0].date === 0) {this.history.shift();}
        if (this.history.length > 300) {this.history.shift();}
    }
}

class BitcoinTrackerPawn {
    setup() {
        this.lastAmount = 0;
        this.listen("value-changed", "onBTCUSDChanged");

        this.onBTCUSDChanged();

        // Those two messages are sent from the Elected module.
        // When handleElected is sent, it signifies that it newly becomes a leader.
        // When handleUnelected is sent, it signifies that it is not a leader anymore.
        //this.listen("handleElected", "handleElected");
        //this.listen("handleUnelected", "handleUnelected");

        // Upon start up, this message query the current status from the Elected module.
        this.say("electionStatusRequested");
    }

    /*
      When this peer is elected, this creates a socket.

      When data is undefined, it is a result from electionStatusRequested.
      When data and data.to is filled with the elected viewId.
    */
    /*handleElected(data) {
        if (!data || data.to === this.viewId) {
            console.log("bitcoin elected");
            //this.fetchHistory().then(() => this.openSocket());
        }
    }

    /*
      When this peer is unelected.
    */
    /*handleUnelected() {
        console.log("bitcoin unelected");
        this.closeSocket();
    }*/

    openSocket() {
        this.closeSocket();

        const host = "wss://ws.sfox.com/ws";
        const sub_msg = {"type": "subscribe", "feeds": ["ticker.sfox.btcusd"]};

        this.socket = new WebSocket(host);

        this.socket.onopen = () => {
            this.socket.send(JSON.stringify(sub_msg));
        };

        this.socket.onmessage = (evt) => {
            let last;
            try {
                last = JSON.parse(evt.data).payload.last;
            } catch(e) {
                console.log("invalid data");
            }
            if (last !== undefined) {
                this.say("BTC-USD", { date: Date.now(), amount: +last });
            }
        }
    }

    closeSocket() {
        if (this.socket) {
            this.socket.close();
        }
    }

    latest() {
        return this.actorCall("BitcoinTrackerActor", "latest");
    }

    /*
      At the initialization time, we fetch more data via an http end point.
    */
    /*fetchHistory() {
        console.log("Fetching BTC-USD history from Coinbase...");
        return fetch(`https://api.coinbase.com/v2/prices/BTC-USD/historic?period=day`).then((response) => {
            return response.json();
        }).then((json) => {
            const prices = json.data.prices.map(price => ({ date: +new Date(price.time), amount: +price.price }));
            console.log("fetched %s prices", prices.length);
            const newer = prices.filter(price => price.date > this.latest().date).slice(0, 20);
            newer.sort((a, b) => a.date - b.date);
            console.log("publishing %s latest prices", newer.length);
            this.say("BTC-USD-history", newer);
        });
    }*/

    /*
      The card that has this module is expected to be "2d" type with textureType: "canvas".
      this.canvas is the DOM canvas element.
      The setColor event at the end informs other related pawns to change their color,
      thus using the view's id as scope.
    */

    onBTCUSDChanged() {
        //console.log("changed");
        // this is called on all views, not just the elected one
        //let amount = this.latest().amount;
        //if(this.lastAmount === amount) return;
        let color = "#22FF22";//this.lastAmount > amount ? "#FF2222" : "#22FF22";
        //this.lastAmount = amount;

        this.clear("#222222");
        let ctx = this.canvas.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillStyle = color;

        ctx.font = "40px Arial";
        ctx.fillText("hello", this.canvas.width - 40, 85);

        /**ctx.textAlign = "center";
        ctx.font = "90px Arial";
        ctx.fillText("$" + amount.toFixed(2), this.canvas.width / 2, 100); //50+this.canvas.height/2);**/
        this.texture.needsUpdate = true;
        this.publish(this.id, "setColor", color);
    }

    clear(fill) {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = fill;
        ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    teardown() {
        this.closeSocket();
    }
}



export default {
    modules: [
        {
            name: "BitcoinTracker",
            actorBehaviors: [BitcoinTrackerActor],
            pawnBehaviors: [BitcoinTrackerPawn],
        },
    ]
}

/* globals Microverse */
