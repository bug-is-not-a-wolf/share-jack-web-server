/**
 * Created by Konstantin on 03.12.2016.
 */
function play() {
    document.getElementById('demo').play();
}

function pause() {
    document.getElementById('demo').pause();
}

function increaseVolume() {
    document.getElementById('demo').volume+=0.1;
}

function decreaseVolume() {
    document.getElementById('demo').volume-=0.1;
}
