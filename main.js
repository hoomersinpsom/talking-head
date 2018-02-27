/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
text = document.getElementById( "text" )
window.inputRange = 100
window.debug = false

function changeRange(e){
    var val = e.target.value
    window.inputRange = val
}
function changeDebug(e){
    var val = e.target.checked
    console.log(val)
    window.debug = val
}
window.onload = function() {
    var range = document.getElementById('range')
    range.addEventListener("input", changeRange, false);
    // grab our canvas
    var range = document.getElementById('debug')
    range.addEventListener("click", changeDebug, false);
    // grab our canvas
    canvasContext = document.getElementById( "meter" ).getContext("2d");

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
          "audio": {
            "mandatory": {
              "googEchoCancellation": "false",
              "googAutoGainControl": "false",
              "googNoiseSuppression": "false",
              "googHighpassFilter": "false"
            },
            "optional": []
          },
        }, gotStream, didntGetStream);
      } catch (e) {
        alert('getUserMedia threw exception :' + e);
      }

    }


    function didntGetStream() {
      alert('Stream generation failed.');
    }

    var mediaStreamSource = null;

    function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext, 0.9, 0.9);
    mediaStreamSource.connect(meter);
    head = new Image();
    head.src = './top.png';
    head.onload = function(){
      bg = new Image();
      bg.src = './bg.png';
      bg.onload = function(){
        mouth = new Image();
        mouth.src = './mouth.png';
        mouth.onload = function(){
          drawLoop(); 
        }
      }
    }
    // kick off the visual updating
    //drawLoop();
  }
  eyesOpen = true
  eyesOpen = true
  function drawLoop() {
    // clear the background
    canvasContext.fillStyle = "#00ff00";
    canvasContext.fillRect(0,0,200,200);


    //canvasContext.fillStyle = "black";


    // draw a bar based on the current volume
    // canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);
    var left = 20;
    var offset = 80
    var maxTop = offset + 16
    canvasContext.drawImage(bg, 0, 16);
    var top = ~~(offset + (meter.volume*window.inputRange))
    if(top < offset + 5) top = offset;
    if(top < 82) top = offset
      if(top > maxTop) top = maxTop 
    //top = top % 5 == 0 ? top : offset
    // top = Math.round(top / 4) * 4
    if(window.debug){
        text.innerText = window.debug + top + '|' + window.inputRange + '|'+ meter.volume 
    }
    canvasContext.drawImage(mouth, 8 + left, top);
    //canvasContext.fillRect(10,top, 30, 30);

    canvasContext.drawImage(head, 0 + left, 0);
    if(eyesOpen){
      var possible = ~~(Math.random() * 60)
      if(possible == 15){
        eyesOpen = false;
        setTimeout(function(){
            eyesOpen = true;
        },300)
      }
    }
    if(!eyesOpen){

        canvasContext.fillStyle = "#afa096"
        canvasContext.fillRect(44, 60, 12, 4);
        canvasContext.fillRect(76, 60, 12, 4);
    }
    
    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
  }
