/**
 * Created by Konstantin on 03.12.2016.
 */
var socket = io();


$(function() {
    document.getElementById('demo').src = '/audio/ADC17605.mp3';

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

    socket.on('status', function(stat){
        $('#status').append($('<li>').text(stat.play + ' ' + stat.pause + ' ' + stat.volume));
        if(stat.play) {
            document.getElementById('demo').play();
        } else {
            document.getElementById('demo').pause();
        }
        document.getElementById('demo').volume = stat.volume;
        console.log(stat);
    });
});
