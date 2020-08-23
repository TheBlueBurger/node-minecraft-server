var mcServer = require('./index');
var server = new mcServer.MinecraftServer({
    "software": "paper",
    "info_callback": a => {console.log(a)}
});
