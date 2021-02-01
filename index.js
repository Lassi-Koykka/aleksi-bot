const Discord = require('discord.js');
const fs = require('fs');
const play = require('./play')
const path = require('path');

const client = new Discord.Client();
const files = fs.readdirSync(path.join(__dirname, 'videos')).map(file => { return file.split('.')[0] })

const { prefix, token } = require('./config.json');

client.once('ready', async () => console.log('Ready!'));

client.login(token);

client.on('message', async message => {
    
    //If the message doesn't start with a prefix, is sent by a bot, or is a direct message.
    if (!message.content.startsWith(prefix)
        || message.author.bot
        || message.channel.type != 'text') return;

    //Get arguments after prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/);

    //Get the first argument as command
    const commandName = args.shift().toLowerCase();
    const filePath = path.join(__dirname, 'videos', commandName + '.mp4')

    if (commandName === 'help') {
        let msgStr = "***Available commands:***\n``" + files.join("\n") + "``";
        message.channel.send(msgStr);
    }else if (files.includes(commandName) && fs.existsSync(filePath) && (!message.guild.voice || !message.guild.voice.connection)){
        const vc = message.member.voice.channel;
        play(filePath, vc);
    }
    
})    

