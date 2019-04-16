/*
Fixed problems:
- sound now adjusts to rotation rather than gradient
- frequency has a fixed limit :)
- sumdAng now uses if statements that fix the problem rotating across the positive x axis (0/360 degrees)
- reset button now additionally resets actually sound/values
Current Problems:
- converting the oscillator to take unique mp3 sounds (web audio api can definitely do this but can it take them via the oscillator?) - looking into gainNode and speed changing
- no additional colour features (only green)
- drawing line currently isn't a solid line --> updated vtx to draw a line but only partly fixed? it's better but not perfect
To do:
- Change from 'onpointermove' to on mouse down
- Add multiple colour options
- MP3s
*/

/*
This script has loosely based on the 'violet theremin' project: https://github.com/mdn/violent-theremin
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

  // Initialising variables: coordinates, gradient

  var coX = 0;
  var coY = 0;
  var x1 = 0;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;
  var x3 = 0;
  var y3 = 0;
  var x4 = 0;
  var y4 = 0;
  var dX1 = 0;
  var dY1 = 0;
  var dX2 = 0;
  var dY2 = 0;
  var ang1 = 0;
  var ang2 = 0;
  var dAng = 0;
  var sumdAng = 210; // range is 20-420 (can be expanded if we want)

  // old gradient calculation variables
  /*
  var grad = 0;
  var gradSum = Math.min(Math.max(parseInt(gradSum), 0), 40);
  gradSum = 20; // to avoid having negative gradients that would confuse the frequency
  */
  
  window.onpointermove = getCoordinates;

  function getCoordinates(e) { 
    coX = e.pageX; coY = e.pageY; 
  }

  // setting each variable step-by-step 
  setInterval(function() { 
    x1 = coX;
    y1 = coY;
  } , 200);
  setTimeout(function() {
    setInterval(function() {
      x3 = coX;
      y3 = coY;
    }, 200)
  }, 50);
  setTimeout(function() {
    setInterval(function() { 
    x2 = coX;
    y2 = coY;
    } , 200);
  } , 100);
  setTimeout(function() {
    setInterval(function() { 
    x4 = coX;
    y4 = coY; 
    } , 200);
  } , 150);
  setTimeout(function() {
    setInterval(function() {
    dX1 = (x2 - x1);
    dY1 = (y1 - y2); 
    dX2 = (x4 - x3);
    dY2 = (y3 - y4);
    } , 200);
  } , 175);
  setTimeout(function() { 
    setInterval(function() {
      if (dX1 > 0 && dY1 > 0) {
        ang1 = Math.atan(dY1/dX1)*180/Math.PI;
      } else if (dX1 < 0 && dY1 > 0) {
        ang1 = 90 - ((-1)*Math.atan(dY1/dX1)*180/Math.PI) + 90;
      } else if (dX1 < 0 && dY1 < 0) {
        ang1 = Math.atan(dY1/dX1)*180/Math.PI + 180;
      } else if (dX1 > 0 && dY1 < 0) {
        ang1 = 90 - ((-1)*Math.atan(dY1/dX1)*180/Math.PI) + 270;
      } else if (dY1 == 0 && dX1 > 0) {
        ang1 = 0;
      } else if (dY1 == 0 && dX1 < 0) {
        ang1 = 180;
      } else if (dX1 == 0 && dY1 > 0) {
        ang1 = 90;
      } else if (dX1 == 0 && dY1 < 0) {
        ang1 = 270;
      } else {
        ang1 = ang1;
      }
    } , 200);
  } , 200);
  setTimeout(function() {
    setInterval(function() {
      if (dX2 > 0 && dY2 > 0) {
        ang2 = Math.atan(dY2/dX2)*180/Math.PI;
      } else if (dX2 < 0 && dY2 > 0) {
        ang2 = 90 - ((-1)*Math.atan(dY2/dX2)*180/Math.PI) + 90;
      } else if (dX2 < 0 && dY2 < 0) {
        ang2 = Math.atan(dY2/dX2)*180/Math.PI + 180;
      } else if (dX2 > 0 && dY2 < 0) {
        ang2 = 90 - ((-1)*Math.atan(dY2/dX2)*180/Math.PI) + 270;
      } else if (dY2 == 0 && dX2 > 0) {
        ang2 = 0;
      } else if (dY2 == 0 && dX2 < 0) {
        ang2 = 180;
      } else if (dX2 == 0 && dY2 > 0) {
        ang2 = 90;
      } else if (dX2 == 0 && dY2 < 0) {
        ang2 = 270;
      } else {
        ang2 = ang2;
      }
    }, 200)
  }, 200);
  setTimeout(function() {
    setInterval(function() {
        if (ang2 + 250 < ang1) {
        dAng = (ang2 + 360) - ang1;
        } else if (ang1 + 250 < ang2) {
        dAng = ang2 - (ang1 + 360);
        } else {
        dAng = ang2 - ang1;  
        }
    }, 200)
  }, 210);
  setTimeout(function() {
    setInterval(function() {
        sumdAng = dAng + sumdAng > 420 ? 420 : dAng + sumdAng < 20 ? 20 : dAng + sumdAng;
    }, 200)
  }, 220);

  // Updating frequency according to gradient

  document.onpointermove = updatePage;

  function updatePage(e) {

      // debugging console checks go here

      console.log(sumdAng);

      oscillator.frequency.value = (sumdAng/420) * maxFreq; // 0-40 is the frequency range
      gainNode.gain.value = maxVol;

      canvasDraw(ctx,coX,coY,12);

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

  var ctx = canvas.getContext('2d');

  var lastX = -1
  var lastY = -1

  function canvasDraw(ctx, x, y, size) {

    if (lastX == -1) {
      lastX = x;
      lastY = y;
    }

    r=0; g=255; b=0; a=255;

      ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x,y);
      ctx.lineWidth = size;
      ctx.stroke();
      // ctx.arc(coX,coY,4,(Math.PI/180)*0,(Math.PI/180)*360,false); // canvasCtx.arc(x,y,radius,starting angle,finishing angle,repeat)
      // ctx.fill(); // fills in arc
      ctx.closePath(); 

      lastX = x;
      lastY = y;
  }
  

  // clear screen (need to add reset variables thingo)

  var clear = document.querySelector('.clear');

  clear.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
      coX = 0;
      coY = 0;
      x1 = 0;
      y1 = 0;
      x2 = 0;
      y2 = 0;
      x3 = 0;
      y3 = 0;
      x4 = 0;
      y4 = 0;
      dX1 = 0;
      dY1 = 0;
      dX2 = 0;
      dY2 = 0;
      ang1 = 0;
      ang2 = 0;
      dAng = 0;
      sumdAng = 210;
  }

}
