'use strict';
let socket = io();

$(function () {
  let audio = document.getElementById('audio');

  audio.src = '/audio/ADC17605.mp3';

  socket.on('status', stat => {
    console.log(stat);
    audio.volume = stat.volume;
    audio.currentTime = stat.currentTime;
    stat.isPlaying ? audio.play() : audio.pause();
  });
  socket.on('play', stat => {
    audio.currentTime = stat.currentTime;
    audio.volume = stat.volume;
    audio.play();
  });
  socket.on('pause', stat => {
    audio.currentTime = stat.currentTime;
    audio.volume = stat.volume;
    audio.pause();
  });
  socket.on('volumeChange', stat => audio.currentTime = stat.currentTime);

  socket.emit('update');

  $('.playButton').on('click', function () {
    audio.play();
    socket.emit('play', audio.currentTime);
  });

  $('.pauseButton').on('click', function () {
    audio.pause();
    socket.emit('pause', audio.currentTime);
  });

  $('.increaseVolumeButton').on('click', function () {
    audio.volume += 0.1;
    console.log(audio.volume);
    socket.emit('volumeChange', audio.volume, audio.currentTime);
  });

  $('.decreaseVolumeButton').on('click', function () {
    audio.volume -= 0.1;
    console.log(audio.volume);
    socket.emit('volumeChange', audio.volume);
  });
});
