const { assert } = require("console");

class Player {
  constructor (uuid, client) {
    // no, make it so theres a function "getJoinedAt()" that constacts the serber yes
    this.client = client
    this.uuid = uuid;
  }

  ban (reason = "Banned by an operator", kickPlayer = true, banIP = false) {
    return sendData({
      data: {
        request: 'player',
        uuid: this.uuid,
        data: 'banPlayer',
        reason: reason,
        kickPlayer,
        banIP
      },
      client: this.client,
      addRequestId: true,
    }).then(() => {
      this.client.
    })
  }
  getHealth () {
    return sendData({
      data: {
        request: 'player',
        uuid: this.uuid,
        data: 'health'
      },
      addRequestId: true,
      client: this.client
    })
  }
  uuid
}
function sendData(data) {
  return new Promise(async (resolve, reject) => {
    if(!data) return;
    var json = {};
    if(data.data) {
      Object.keys(data.data).forEach(theData => {
        json[theData] = data.data[theData];
      })
    }
    if(data.addRequestId) {
      var theIdIGuess = generateID()
      json["requestId"] = theIdIGuess;
    }
    var client = data.client;
    if(!client) return reject();
    client.sendPacket(
      JSON.stringify(json)
    )
    if(json["requestId"]) {
    var listener = client.on('packet', onResp)
    function onResp (packet) {
      packet = JSON.parse(packet);
      if (packet.requestId == theIdIGuess.toString()) {
        client.removeListener('packet', onResp)
        if(json["requestId"]) delete IDs[json["requestId"]]
        resolve(packet)
      }
    }
  } else resolve();
  })
}
var IDs = {}
function generateID () {
  var theNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  if (!IDs[theNumber]) {
    IDs[theNumber] = true
    return theNumber;
  } else return generateID()
}
var outputsForAutoComplete = {
  getHealth: {
    health: 0,
    max_health: 0
  }
}
module.exports = Player
