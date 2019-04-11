/*
Current Problems:
- gradSum does not cap at frequency values --> math.floor or math.max/min
- gradSum freaks out when gradient reaches infinity (drawing straight up or down)
- gradSum stops working when line stops moving (this is because it updates every 200 ms and expects a new values)
- converting the oscillator to take unique mp3 sounds (web audio api can definitely do this but can it take them via the oscillator?)
- no additional colour features (only green)
- drawing line currently isn't a solid line (again due to the 200ms update) --> could probably easily solve by calculating extra set of co-ords inside the updatePage function
*/

/*
This script has been adapted from the 'violet theremin' project: https://github.com/mdn/violent-theremin
Other useful web api links:
- https://codepen.io/anon/pen/vMyQyd (playing mp3)
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API (web api intro)
*/

var appContents = document.querySelector('.app-contents');
var startMessage = document.querySelector('.start-message');
appContents.style.display = 'none';

window.addEventListener('keydown', init);
window.addEventListener('click', init);

function init() {
  appContents.style.display = 'block';
  document.body.removeChild(startMessage);

  // create web audio api context
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();

  // create Oscillator and gain node
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // create initial theremin frequency and volumn values

  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  var maxFreq = 6000;
  var maxVol = 0.02;

  var initialFreq = 3000;
  var initialVol = 0.001;

  // set options for the oscillator


  oscillator.detune.value = 100; // value in cents
  oscillator.start(0);

  oscillator.onended = function() {
    console.log('Your tone has now stopped playing!');
  };

  gainNode.gain.value = initialVol;
  gainNode.gain.minValue = initialVol;
  gainNode.gain.maxValue = initialVol;

  // Variables: coordinates, gradient

  var coX = 0;
  var coY = 0;
  var x1 = 0;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;
  var dX = 0;
  var dY = 0;
  var grad = 0;
  var gradSum = Math.min(Math.max(parseInt(gradSum), 0), 40);
  gradSum = 20; // to avoid having negative gradients that would confuse the frequency
  
  window.onmousemove = getCoordinates;

  function getCoordinates(e) { 
    coX = e.pageX; coY = e.pageY; 
  }

  // setting each variable step-by-step every 100 milliseconds (then tracked every 200 ms)
  setInterval(function() { 
    x1 = coX;
    y1 = coY;
  } , 200);
  setTimeout(function() {
    setInterval(function() { 
    x2 = coX;
    y2 = coY;
    } , 200);
  } , 100);
  setTimeout(function() {
    setInterval(function() { 
    dX = (1)*(x2 - x1);
    dY = (-1)*(y2 - y1);
    } , 200);
  } , 200);
  setTimeout(function() {
    setInterval(function() { 
    grad = dY/dX;
    } , 200);
  } , 300);
  setTimeout(function() {
    setInterval(function() { 
    gradSum = grad + gradSum;
    } , 200);
  } , 400);

  // Updating frequency according to gradient

  document.onmousemove = updatePage;

  function updatePage(e) {
      KeyFlag = false;

      console.log(gradSum);

      oscillator.frequency.value = (gradSum/40) * maxFreq; // 0-40 is the frequency range
      gainNode.gain.value = maxVol;

      canvasDraw();
  }



  // mute button

  var mute = document.querySelector('.mute');

  mute.onclick = function() {
    if(mute.getAttribute('data-muted') === 'false') {
      gainNode.disconnect(audioCtx.destination);
      mute.setAttribute('data-muted', 'true');
      mute.innerHTML = "Unmute";
    } else {
      gainNode.connect(audioCtx.destination);
      mute.setAttribute('data-muted', 'false');
      mute.innerHTML = "Mute";
    };
  }



  // canvas visualization

  var canvas = document.querySelector('.canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var canvasCtx = canvas.getContext('2d');

  function canvasDraw() {
    if(KeyFlag == true) {
      rX = KeyX;
      rY = KeyY;
    } else {
      rX = coX;
      rY = coY;
    }

      canvasCtx.beginPath();
      canvasCtx.fillStyle = 'green';
      canvasCtx.arc(rX,rY,2,(Math.PI/180)*0,(Math.PI/180)*360,false); // canvasCtx.arc(x,y,radius,starting angle,finishing angle,repeat)
      canvasCtx.fill(); // fills in arc
      canvasCtx.closePath(); 
  }
  

  // clear screen

  var clear = document.querySelector('.clear');

  clear.onclick = function() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }

}
