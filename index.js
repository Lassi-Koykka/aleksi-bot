import play from "./play.js";
import { ChannelType, Client, Events, GatewayIntentBits } from "discord.js";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { default as dotenv } from "dotenv";
import { getVoiceConnections } from "@discordjs/voice";
dotenv.config();

const prefix = "aleksi";
const TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!TOKEN) throw Error("DISCORD_BOT_TOKEN not found");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const audioDir = join(process.cwd(), "audio");
//Create dir for audio directory if it doesn't already exist;
if (!existsSync(audioDir)) {
  mkdirSync(audioDir);
  console.log(
    `Audio directory did not exist so one was created at: ${audioDir}\n` +
      "Add the audioFiles you want available there.",
  );
}
const files = readdirSync(audioDir).map((file) => {
  return file.split(".")[0];
});

client.once(Events.ClientReady, async () => {
  console.log("Ready!");
  const connections = getVoiceConnections().values();
  for (const connection of connections) {
    connection.destroy();
  }
});

client.on(Events.MessageCreate, async (message) => {
  //If the message doesn't start with a prefix, is sent by a bot, or is a direct message.
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    message.channel.type != ChannelType.GuildText
  )
    return;

  //Get arguments after prefix
  const args = message.cleanContent.slice(prefix.length).trim().split(/ +/);

  //Get the first argument as command
  const commandName = args.shift().toLowerCase();
  const filePath = join(audioDir, commandName + ".mp3");

  // HELP: List available commands
  // Or play the file with the same name as the command if it exists
  if (commandName === "help") {
    let msgStr = "***Available commands:***\n``" + files.join("\n") + "``";
    message.channel.send(msgStr);
  } else if (files.includes(commandName) && existsSync(filePath)) {
    const channel = message.member.voice.channel;
    play(filePath, channel, message);
  }
});

client.login(TOKEN);
