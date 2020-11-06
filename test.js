const mcSerber = require('./index.js');
// new mcSerber.
var server = new mcSerber.MinecraftServer();
require('readline').createInterface(process.stdin, process.stdout).on("line", () => {
    console.log("sending packet...")
    try {
        server.getPlayer("87619c9a-a35d-4a0f-9fd8-266ff7a178b0").getHealth().then(health => {
            console.log(health);
        }).catch(a => console.log(a));
        } catch(e) {console.log(e)}
})
server.on("console", a => {
    console.log(a);
});
server.getPlayer("onitdgfr").getHealth().then(a => a.)