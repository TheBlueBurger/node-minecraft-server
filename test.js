var mcServer = require('./index');
var server = new mcServer({
    "software": "paper",
    "info_callback": a => {console.log(a)}
});
server.on('console', a => {
    console.log(a);
    if(a.toString().includes("BlueBurgersTDD")) server.runCommand("say hello blue!");
    if(a.toString().includes("!stop")) server.stop();
});