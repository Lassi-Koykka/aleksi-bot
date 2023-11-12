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
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = new AudioPlayer();
    const subscription = connection.subscribe(player);

    try {
      if (!subscription) {
        console.error("Failed to subscribe to audio player");
        connection.destroy();
        return;
      }

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
        subscription?.unsubscribe();
      });
    } catch (error) {
      console.log(error);
      connection.destroy();
      subscription.unsubscribe();
    }
  } else {
    message.reply("You need to join a voice channel first!");
  }
};

export default play;
