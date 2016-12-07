/**
 * Created by Konstantin on 03.12.2016.
 */
var socket = io();


$(function() {

    var audio = document.getElementById('audio');
    var segmentEnd = 0;


    audio.controls = true;

    audio.src = '/audio/ADC17605.mp3';

    $('.playButton').on('click', function () {
        playSegment(4, 30);
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
        $('#status').append($('<li>').text(stat.play + ' ' + stat.pause + ' ' + stat.volume + ' ' + stat.currentTime));
        if(stat.play) {
            audio.play();
        } else {
            audio.pause();
        }
        audio.volume = stat.volume;
        audio.currentTime = stat.currentTime;
        console.log(stat);
    });

    function playSegment(start, end) {
        segmentEnd = end;
        audio.currentTime = start;
        audio.play();
    }

    audio.addEventListener('timeupdate', function () {
        if (segmentEnd && audio.currentTime >= segmentEnd) {
            audio.pause();
        }
    }, false);
});

