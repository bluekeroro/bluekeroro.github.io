//source.start(0) and source.stop(0) control the first music
//bufferLoader.onload(bufferLoader.bufferList[1~8]) play the sound effect
window.onload = init;
var context;
var bufferLoader;
var source;
var SoundLoadComplete=false;
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) {
                    //loader.onload(loader.bufferList);
                    SoundLoadComplete=true;
                    source= context.createBufferSource();
                    source.buffer = bufferLoader.bufferList[0];
                    source.connect(context.destination);
                    source.start(0);
                }
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }
    request.send();
}
BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}
function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    bufferLoader = new BufferLoader(
        context,
        [
            'sound/music/song18.mp3',
            'sound/sound_effect/1.C(do).mp3',
            'sound/sound_effect/2.D(re).mp3',
            'sound/sound_effect/3.E(mi).mp3',
            'sound/sound_effect/4.F(fa).mp3',
            'sound/sound_effect/5.G(sol).mp3',
            'sound/sound_effect/6.A(la).mp3',
            'sound/sound_effect/7.B(si).mp3',
            'sound/sound_effect/swallow.mp3'
        ],
        Play
    );
    bufferLoader.load();
}
function Play(array) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    source1.buffer = array;
    source1.connect(context.destination);
    source1.start(0);
}
