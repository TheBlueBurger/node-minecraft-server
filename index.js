// Illegal file
class minecraft_server {
    constructor(JSONoptions = {}) {
        var server;
        this.clientAlreadyCalled = false;
        this.theClient = null;
        const EventEmitter = require('events').EventEmitter;
        const eventThing = new EventEmitter;
        var axios = require('axios');
        var options = JSONoptions;
        options.onlineMode = JSONoptions["online-mode"] || true;
        options.port = JSONoptions["port"] || 25565;
        options.ram = JSONoptions["ram"] || 1024; //TODO: Add ram
        options.info_callback = JSONoptions["info_callback"] || console.log;
        // It's undefined because function() {} has its own "this" arrow functions dont have their own "this"
        var serverstart = () => {
            eventThing.emit('server_start', null);
            const child = require('child_process');
            server = child.exec("java -jar server.jar nogui", {
                cwd: __dirname + "/server/"
            }); 
            server.stdout.on('data', data => {
                if(data == null || data == "" || data == undefined) return;
                var text = data.toString().replace(/(\r\n|\n|\r)+$/, "");
                eventThing.emit('console', text);
                if(!this.clientAlreadyCalled && text.includes("Waiting for client...")) {
                    this.theClient = new Client();
                    this.clientAlreadyCalled = true;
                    this.theClient.once('connect', () => {
                        eventThing.emit('ready', true);
                    });
                }
            });
        } // It should work fine with arrow functions
        try {
        require('fs').mkdirSync("server");
        }catch(e){}
        (async() => {
        if(!(require('fs').existsSync("./server/server.jar"))) {
            options.info_callback("Could not find server.jar, downloading...");
            axios({
                method: "get",
                url: "https://papermc.io/api/v1/paper/1.16.1/latest/download",
                responseType: 'stream'
            }).then(function (response) {
                var writer_error = false;
                var writer = require('fs').createWriteStream("./server/server.jar");
                response.data.pipe(writer);
                writer.on('error', () => {
                    writer_error = true;
                })
                writer.on('close', () => {
                    if(!writer_error) return serverstart();
                    throw new Error("Error while downloading/writing!");
                })
            });
        } else {
            serverstart();
        }
    })();
        eventThing.runCommand = function(cmd) {
            // Hm yes everything that you make is good
            // Should we start with making the tcp client? yes
            server.stdin.write(cmd+"\n"); //Yes
        }
        eventThing.stop = function() { //best function
            try { // Oops
                eventThing.runCommand("stop");
            } catch(e) {eventThing.emit('console', e)}
        }
        process.on('beforeExit', eventThing.stop);
        eventThing.getClient = () => this.theClient;
        return eventThing;
    }
}
module.exports.MinecraftServer = minecraft_server;

const net = require("net");
const { EventEmitter } = require('events');
class Client extends EventEmitter {
    constructor(host = "localhost", port = 18719) {
        super();
        this.connected = false;
        this.host = host;
        this.port = port;
        this.socket = net.createConnection({
            host: this.host, // mabe but I have to eat brb like 20 mins
            port: this.port
        });
        this.socket.on("data", data => { // Kk
            this.emit('packet', data); //gtg bye will be afk
        }); // legal
        this.socket.on("timeout", () => {
            this.emit("timeout", true);
        });
        this.socket.on('end', () => {
            this.emit('end', true);
        });
        this.socket.on("error", error => {
            this.emit("error", error);
        });
        this.socket.on("connect", () => {
            this.emit("connect");
            this.connected = true;
        });
    }
    sendPacket(data) {
        this.socket.write(data);
        //ok now time for java plugin
    }
    end() {
        this.socket.end();
    }
    //all aliases shortened:
    close() {return this.end();}
    stop() {return this.end();}
    send(a) {return this.sendPacket(a);}
} //mabe