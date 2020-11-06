class Player {
  constructor (uuid, client) {
    // no, make it so theres a function "getJoinedAt()" that constacts the serber yes
    this.client = client
    this.uuid = uuid;
  }

  getJoinedAt () {
    return new Promise(async (resolve, reject) => {
      this.client.sendPacket(
        JSON.stringify({
          request: 'getPlayerInfo',
          uuid: this.uuid,
          data: 'joinedAt',
          requestId: generateID()
        })
      )
    })
    // hm now we need request IDs, so it can send back and it knows what it responds to
  }
  /**
   * @returns Promise<outputsForAutoComplete["getHealth"]>
   */
  getHealth () {
    return sendData({
      data: {
        request: 'getPlayerInfo',
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
    var listener = client.on('packet', onHealth)
    function onHealth (packet) {
      packet = JSON.parse(packet);
      console.log("Got packet: " + packet)
      if (packet.requestId == theIdIGuess.toString()) {
        console.log("pass check")
        client.removeListener('packet', onHealth)
        resolve(packet)
        console.log("Resolved!")
      }
    }
  } else resolve();
  })
}
var IDs = {}
function generateID () {
  var theNumber = Math.floor(Math.random() * 100000000000)
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
