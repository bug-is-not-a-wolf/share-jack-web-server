'use strict';
let socket = io();

$(function() {
    let audio = document.getElementById('audio');

    audio.controls = true;
    audio.src = '/audio/ADC17605.mp3';

    $('.playButton').on('click', function () {
        audio.play()
        socket.emit('play', audio.currentTime);
    });

    $('.pauseButton').on('click', function () {
        audio.pause();
        socket.emit('pause', audio.currentTime);
    });

    $('.increaseVolumeButton').on('click', function () {
        audio.volume+=0.1;
        console.log(audio.volume);
        socket.emit('volumeChanged', audio.volume, audio.currentTime);
    });

    $('.decreaseVolumeButton').on('click', function () {
        audio.volume-=0.1;
        console.log(audio.volume);
        socket.emit('volumeChanged', audio.volume, audio.currentTime);
    });

    socket.on('status', function(stat){
        console.log(stat);
        $('#status').append($('<li>').text(JSON.stringify(stat)));
        audio.volume = stat.volume;
        audio.currentTime = stat.currentTime;
        stat.isPlaying ? audio.play() : audio.pause();
    });
});

