import { createReadStream } from "fs";
import { VoiceChannel, Message } from "discord.js";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { basename } from "path";

/**
 * @param {string} fileName
 * @param {VoiceChannel} channel
 * @param {Message} message
 */
const play = (fileName, channel, message) => {
  if (channel && channel.joinable) {
    console.log("Channel guild", channel.guild);
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      const player = new AudioPlayer();

      const subscription = connection.subscribe(player);

      if (!subscription) {
        console.error("Failed to subscribe to audio player");
        connection.destroy();
        return;
      }

      setTimeout(() => subscription.unsubscribe(), 5_000);

      const resource = createAudioResource(createReadStream(fileName));
      const fileBaseName = basename(fileName);

      player.play(resource);

      player.on("error", () => {
        console.error("FAILED TO PLAY\n", error);
      });

      player.on(AudioPlayerStatus.Playing, () => {
        console.log(fileBaseName + " is now playing!");
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log(fileBaseName + " has finished playing!");
        connection.destroy();
      });
    } catch (error) {
      console.log(error);
      connection.destroy();
    }
  } else {
    message.reply("You need to join a voice channel first!");
  }
};

export default play;
