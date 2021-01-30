const mcSerber = require('./index.js');
// new mcSerber.
var server = new mcSerber.MinecraftServer();
require('readline').createInterface(process.stdin, process.stdout).on("line", (line) => {
    if(line.toString() == "unban") return server.runCommand("pardon BlueBurgersTDD")
    console.log("sending packet...")
    try {
        server.getPlayer("BlueBurgersTDD").ban().then(health => {
            console.log(health);
        }).catch(a => console.log(a));
        } catch(e) {console.log(e)}
})
server.on("console", a => {
    console.log(a);
});