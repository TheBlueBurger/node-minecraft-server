import Player from "./Player";


const { EventEmitter } = require('events');
// interface OptionsInterface {
//   info_callback?: Function;
//   ram?: number;
//   port?: number;
//   onlineMode?: boolean;
// }

class minecraft_server extends EventEmitter {
  constructor(JSONoptions = {}) {
    super();
    this.server = null;
    this.clientAlreadyCalled = false;
    this.theClient = null;
    var axios = require('axios');
    var options = JSONoptions;
    options.onlineMode = JSONoptions['onlineMode'] || true;
    options.port = JSONoptions['port'] || 25565;
    options.ram = JSONoptions['ram'] || 1024; //TODO: Add ram
    options.info_callback = JSONoptions['info_callback'] || console.log;
    this.options = options;
    var serverstart = () => {
      this.emit('server_start', null);
      const child = require('child_process');
      this.server = child.exec('java -jar server.jar nogui', {
        cwd: __dirname + '/server/',
      });
      this.server.stdout.on('data', (data) => {
        if (data == null || data == '' || data == undefined) return;
        var text = data.toString().replace(/(\r\n|\n|\r)+$/, '');
        this.emit('console', text);
        if (
          !this.clientAlreadyCalled &&
          text.includes('Waiting for client...')
        ) {
          this.theClient = new Client();
          this.clientAlreadyCalled = true;
          this.theClient.once('connect', () => {
            this.emit('ready', true);
          });
        }
      });
    };
    try {
      require('fs').mkdirSync('server');
    } catch (e) {
      ('ignoring this i guess lol');
    }
    (async () => {
      if (!require('fs').existsSync('./server/server.jar')) {
        options.info_callback('Could not find server.jar, downloading...');
        axios({
          method: 'get',
          url: 'https://papermc.io/api/v1/paper/1.16.1/latest/download',
          responseType: 'stream',
        }).then(function (response) {
          var writer_error = false;
          var writer = require('fs').createWriteStream('./server/server.jar');
          response.data.pipe(writer);
          writer.on('error', () => {
            writer_error = true;
          });
          writer.on('close', () => {
            if (!writer_error) return serverstart();
            throw new Error('Error while downloading/writing!');
          });
        });
      } else {
        serverstart();
      }
    })();
    process.on('beforeExit', this.stop);
  }
  stop() {
    this.runCommand('stop');
  }
  runCommand(cmd) {
    this.server.stdin.write(cmd + '\n');
  }
  getPlayer(uuid) {
    return new Player(uuid, this.theClient);
  }
}

const net = require('net');
class Client extends EventEmitter {
  constructor(host = 'localhost', port = 18719) {
    super();
    this.connected = false;
    this.host = host;
    this.port = port;
    this.socket = net.createConnection({
      host: this.host,
      port: this.port,
    });
    this.socket.on('data', (data) => {
      this.emit('packet', data);
    });
    this.socket.on('timeout', () => {
      this.emit('timeout', true);
    });
    this.socket.on('end', () => {
      this.emit('end', true);
    });
    this.socket.on('error', (error) => {
      this.emit('error', error);
    });
    this.socket.on('connect', () => {
      this.emit('connect');
      this.connected = true;
    });
  }
  sendPacket(data) {
    this.socket.write(data);
  }
  end() {
    this.socket.end();
  }
  //all aliases shortened:
  close() {
    return this.end();
  }
  stop() {
    return this.end();
  }
  send(a) {
    return this.sendPacket(a);
  }
}
module.exports.MinecraftServer = minecraft_server;