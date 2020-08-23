class Player {
    constructor(uuid, client) { //no, make it so theres a function "getJoinedAt()" that constacts the serber yes
        this.client = client;    
        return new Player(uuid); //ok done
    }
    getJoinedAt() {
        return new Promise(async (resolve, reject) => {
            this.client.sendPacket(JSON.stringify({
                "request": "getPlayerInfo",
                "uuid": this.uuid,
                "data": "joinedAt",
                "requestId": generateID()
            }));
        })
        //hm now we need request IDs, so it can send back and it knows what it responds to
    }
    getHealth() {
        return new Promise(async (resolve, reject) => {
            var theIdIGuess = generateID();
            this.client.sendPacket(JSON.stringify({
                "request": "getPlayerInfo",
                "uuid": this.uuid,
                "data": "health",
                "requestId": theIdIGuess
            }));
            // we should make it so it waits for an answer from the server
            // just this.
            var listener = this.client.on("packet", onHealth);
            function onHealth(packet) {
                if (packet.requestId == theIdIGuess) { // mabe
                    this.client.removeListener("packet", onHealth); //ill push now
                    resolve(packet.health);
                }
                
            }
        });
    }
}
var IDs = {};
function generateID() { // carb
    var theNumber = Math.floor(Math.random() * 100000000000);
    if(!IDs[theNumber]) {
        IDs[theNumber] = true;
    } else return generateID(); //i made that...
} //:flushed: illegal