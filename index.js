class minecraft_server {
    constructor(JSONoptions = {}) {
        var server;
        const EventEmitter = require('events').EventEmitter;
        const eventThing = new EventEmitter;
        var axios = require('axios');
        var options = JSONoptions;
        options.software = JSONoptions["software"] || "paper";
        options.onlineMode = JSONoptions["online-mode"] || true;
        options.port = JSONoptions["port"] || 25565;
        options.ram = JSONoptions["ram"] || 1024;
        options.info_callback = JSONoptions["info_callback"] || console.log;
        switch (options["software"]) {
            case "vanilla":
                options["software"] = "vanilla"
                break;
            case "paper":
                options["software"] = "paper"
                break;
            default:
                throw new Error("Invalid software type!");
        }
        var serverstart = function() {
            eventThing.emit('server_start', null);
            const child = require('child_process');
            server = child.exec("java -jar server.jar nogui", {
                cwd: __dirname + "/server/"
            });
            server.stdout.on('data', data => {
                if(data == null || data == "" || data == undefined) return;
                var text = data.toString().replace(/(\r\n|\n|\r)+$/, "");
                eventThing.emit('console', text);
            });
        }
        try {
        require('fs').mkdirSync("server");
        }catch(e){}
        (async() => {
        if(!(require('fs').existsSync("./server/server.jar"))) {
            options.info_callback("Could not find server.jar, downloading...");
            axios({
                method: "get",
                url: options.software == "paper" ? "https://papermc.io/api/v1/paper/1.16.1/latest/download" : "https://launcher.mojang.com/v1/objects/a412fd69db1f81db3f511c1463fd304675244077/server.jar",
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
            server.stdin.write(cmd+"\n");
        }
        eventThing.stop = function() {
            try {
                eventThing.runCommand("stop")
            } catch(e) {eventThing.emit('console', e)}
        }
        process.on('beforeExit', eventThing.stop);
        return eventThing;
    }
}
module.exports = minecraft_server;