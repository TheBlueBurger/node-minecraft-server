package io.github.blueburgerstdd.nodeminecraftserverclient.commands;

import io.github.blueburgerstdd.nodeminecraftserverclient.NodeMinecraftServerClient;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;

import java.util.List;

public class test implements TabCompleter, CommandExecutor {
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        sender.sendMessage(ChatColor.translateAlternateColorCodes('&', "&6&l:OOOOOOOOOOOO&r\nYou found secret test command, sending ilegal packet now!!!!!"));
        try {
            NodeMinecraftServerClient.sendPacket(); //hmmm which one
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        return null;
    }
}
