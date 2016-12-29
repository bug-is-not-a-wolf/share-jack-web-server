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

    const setPlaying = (isPlaying, time) => {
      status.isPlaying = isPlaying;
      status.currentTime = time;
    };

    io.emit('status', status);

    socket.on('update', _ => io.emit('status', status));

    socket.on('disconnect', function () {
      console.log('Disconnected...');
    });

    socket.on('play', time => {
      console.log('Playing... ');
      setPlaying(true, time);
      statusChangeTime = Date.now();
      io.emit('play', status);
    });

    socket.on('pause', time => {
      console.log('Stopping... ');
      setPlaying(false, time);
      io.emit('pause', status);
    });

    socket.on('volumeChange', function (volume) {
      console.log('Volume was changed to ' + volume);
      status.volume = volume;
      io.emit('volumeChange', status);
    });
  });

  return io;
};
