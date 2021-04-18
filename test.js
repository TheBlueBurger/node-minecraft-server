
const mcServer = require("./index.js");
const server = new mcServer.MinecraftServer();

server.getPlayer("Hello").ban("Hello", true, true).then(() => {
    server.runCommand("say Done!");
});