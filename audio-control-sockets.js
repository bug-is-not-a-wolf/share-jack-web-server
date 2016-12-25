module.exports = (server) => {
  const io = require('socket.io')(server);

  let status = {isPlaying: false, volume: 1, currentTime: 0};
  let statusChangeTime = Date.now();

  io.on('connection', function (socket) {
    console.log('Connection established...');

    if (status.isPlaying) {
      let timeDiff = (Date.now() - statusChangeTime) / 1000;
      statusChangeTime = Date.now();
      status.currentTime += timeDiff;

      if (status.currentTime >= 214) {		// TODO: change magic number to .currentAudioLength() (seconds)
        status.isPlaying = false;
      }
    }

    const sendStatus = _ => io.emit('status', status);
    const setPlaying = (isPlaying, time) => {
      status.isPlaying = isPlaying;
      status.currentTime = time;
    };

    socket.on('update', sendStatus);

    socket.on('disconnect', function () {
      console.log('Disconnected...');
    });

    socket.on('play', function (time) {
      console.log('Playing... ');
      setPlaying(true);
      statusChangeTime = Date.now();
      sendStatus();
    });

    socket.on('pause', function (time) {
      console.log('Stopping... ');
      setPlaying(false);
      sendStatus();
    });

    socket.on('volumeChanged', function (volume) {
      console.log('Volume was changed to ' + volume);
      status.volume = volume;
      sendStatus();
    });
  });

  return io;
};