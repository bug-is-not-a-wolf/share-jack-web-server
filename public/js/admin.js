/**
 * Created by Konstantin on 03.12.2016.
 */
var socket = io();

$(function() {
    $('.playButton').on('click', function () {
        document.getElementById('demo').play();
        socket.emit('play');
    });

    $('.pauseButton').on('click', function () {
        document.getElementById('demo').pause();
        socket.emit('pause');
    });

    $('.increaseVolumeButton').on('click', function () {
        document.getElementById('demo').volume+=0.1;
        console.log(document.getElementById('demo').volume);
        socket.emit('volumeChanged', document.getElementById('demo').volume);
    });

    $('.decreaseVolumeButton').on('click', function () {
        document.getElementById('demo').volume-=0.1;
        console.log(document.getElementById('demo').volume);
        socket.emit('volumeChanged', document.getElementById('demo').volume);
    });
});
