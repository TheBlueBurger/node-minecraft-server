package io.github.blueburgerstdd.nodeminecraftserverclient;

import io.github.blueburgerstdd.nodeminecraftserverclient.commands.test;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Objects;

public final class NodeMinecraftServerClient extends JavaPlugin {
    public static Socket theClient = null;
    public static ServerSocket socket;
    InputStream inputStream = null;
    InputStreamReader streamReader = null;
    BufferedReader br = null;
    PrintWriter out = null;
    @Override
    public void onEnable() {
        // Plugin startup logic
        {
            try {
                socket = new ServerSocket(18719);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        System.out.println("Waiting for client...");
        if(theClient == null) {
            try {
                theClient = socket.accept();
                System.out.println("Client has connected!");
                try {
                    inputStream = theClient.getInputStream();
                } catch (IOException ignored) {
                }
                InputStreamReader streamReader = new InputStreamReader(inputStream);
                br = new BufferedReader(streamReader);
                out = new PrintWriter(theClient.getOutputStream(), true);
            } catch (IOException e) {
                System.out.println("Error happened while connecting for client, stopping server. Please make a github issue at https://github.com/BlueBurgersTDD/node-minecraft-server with the following data:");
                e.printStackTrace();
                Bukkit.dispatchCommand(Bukkit.getConsoleSender(), "stop");
            }
        }
        new BukkitRunnable() {
            @Override
                    public void run() {
                        System.out.println("Node-Minecraft-Server is ready!");
                        String line = null;
                        while(true) {
                            try {
                                line = br.readLine();
                                if(line != null) {
                                    handlePacket(line);
                                }
                            } catch(IOException ignored) {}
                        }
            }
        }.runTaskAsynchronously((Plugin) this);
        Objects.requireNonNull(this.getCommand("test")).setExecutor(new test());
    }


    @Override
    public void onDisable() {
        try {
            theClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        return true; // yes
    }


    public static ServerSocket getSocket() {
        return socket;
    }
    public static Socket getClient() {
        return theClient;
    }
    public static boolean sendPacket() throws Exception {
        if(theClient == null) {
            throw new Exception("theClient is null, this should be impossible!!!");
        }
        try {
            DataOutputStream out = new DataOutputStream(theClient.getOutputStream());
            return true;
        } catch(Exception e) {
            return false;
        }
    }
    private void handlePacket(String args) {
        try {
            Object datacarb = new JSONParser().parse(args);
            JSONObject data = (JSONObject) datacarb;
            if(data.get("request") != null) {
                switch (data.get("request").toString()) {
                    case "player":
                        Player player;
                        JSONObject json;
                        switch (data.get("data").toString()) {
                            case "health":
                                player = Bukkit.getPlayer(data.get("uuid").toString().replaceAll("-", ""));
                                if(player == null) {
                                    json = new JSONObject();
                                    json.put("success", "false");
                                    json.put("error", "Player not found!");
                                    respond(data, json);
                                    return;
                                }
                                json = new JSONObject();
                                json.put("health", player.getHealth());
                                json.put("max_health", player.getHealthScale());
                                respond(data, json);
                                break;
                            case "banPlayer":
                                player = Bukkit.getPlayer(data.get("uuid").toString().replaceAll("-", ""));
                                if(player == null) {
                                    json = new JSONObject();
                                    json.put("success", "false");
                                    json.put("error", "Player not found!");
                                    respond(data, json);
                                    return;
                                }
                                boolean banIP = (boolean) data.get("banIP");
                                if (banIP) {
                                    player.banPlayerIP(data.get("reason").toString());
                                } else {
                                    player.banPlayer(data.get("reason").toString());
                                }
                                if((boolean) data.get("kickPlayer")) new BukkitRunnable() {
                                    @Override
                                    public void run() {
                                        player.kickPlayer(data.get("reason").toString());
                                    }
                                }.runTask((Plugin) this);
                                json = new JSONObject();
                                json.put("success", "true");
                                respond(data, json);
                        }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void respond(JSONObject RecivedPacket, JSONObject SendPacket) {
        String requestId = RecivedPacket.get("requestId").toString();
        if(requestId != null) {
            SendPacket.put("requestId", requestId);
        }
        out.println(SendPacket.toJSONString());
    }
}
