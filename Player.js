class Player {
  constructor(uuid, client) {
    //no, make it so theres a function "getJoinedAt()" that constacts the serber yes
    this.client = client;
  }
  getJoinedAt() {
    return new Promise(async (resolve, reject) => {
      this.client.sendPacket(
        JSON.stringify({
          request: 'getPlayerInfo',
          uuid: this.uuid,
          data: 'joinedAt',
          requestId: generateID(),
        })
      );
    });
    //hm now we need request IDs, so it can send back and it knows what it responds to
  }
  getHealth() {
    return new Promise(async (resolve, reject) => {
      var theIdIGuess = generateID();
      this.client.sendPacket(
        JSON.stringify({
          request: 'getPlayerInfo',
          uuid: this.uuid,
          data: 'health',
          requestId: theIdIGuess,
        })
      );
      var listener = this.client.on('packet', onHealth);
      function onHealth(packet) {
        if (packet.requestId == theIdIGuess) {
          this.client.removeListener('packet', onHealth);
          resolve(packet.health);
        }
      }
    });
  }
}
var IDs = {};
function generateID() {
  var theNumber = Math.floor(Math.random() * 100000000000);
  if (!IDs[theNumber]) {
    IDs[theNumber] = true;
  } else return generateID();
}
module.exports = Player;
