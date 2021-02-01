const play = (fileName, vc) => {
    if (vc) {
        vc.join().then(connection => {
            const dispatcher = connection.play(fileName);

            dispatcher.on('start', () => {
                console.log(fileName + ' is now playing!');
            });

            dispatcher.on('finish', () => {
                console.log(fileName + ' has finished playing!');
                vc.leave();
            });

            // Always remember to handle errors appropriately!
            dispatcher.on('error', (error) => {
                console.log(error);
            });

        });
    } else {
        message.reply('You need to join a voice channel first!');
    }
}

module.exports = play;