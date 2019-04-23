/*
NOTES
- Due to XML sound request CORS issue, the website needs to be hosted on a server (localhost or zone) to be run
*/

/*
PROBLEMS/TO-DO
- Adding multiple colours with associated mp3s
- Fixing canvas visualisation (lines remain solid no matter how fast the cursor moves)
- Adapting the system for touch interaction with the PX screen
*/

/*
REFERENCES THAT I WILL FIX UP LATER
Violet Theremin: https://github.com/mdn/violent-theremin
AudioBufferSourceNode.playbackRate: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/playbackRate
Touch-screen sketchpad: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/
*/

var startMessage = document.querySelector('.start-message');

// Conditions to start running the application
window.addEventListener('keydown', init);
window.addEventListener('click', init);

/*
The init function allows for the application to be started on click or keydown rather than starting it straight away
*/
function init() {
  document.body.removeChild(startMessage); // removes 'ready to start' message

  // create web audio api context (responsible for all sounds)
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();
  
  // create gain node (responsible for volume)
  var gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);

  /*
  The getData function is used to get a specific sound. 
  */
  function getData() {
  source = audioCtx.createBufferSource(); // creating sound source element
  request = new XMLHttpRequest();
  request.open('GET', 'audio/forestGreen.mp3', true); // link to specific sound file here
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        source.buffer = myBuffer;
        source.connect(gainNode); // connecting gainNode to provide volume
        source.loop = true; // looping the sound
        },
      function(e){"Error with decoding audio data" + e.error});
    }
  request.send();
  }

  // creating variables to control playback rate
  var initialPlaybackRate = 1;
  var maxPlaybackRate = 3;

  // requesting and starting mp3 sound playback
  getData();
  source.start(0); // method to play mp3

  // setting screen bound variables
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  // creating varialbes to control volume (gain)
  var maxVol = 1.0;

  // creating variables to calculate line angles
  var coX; // the position of the cursor on the x-axis
  var coY; // the position of the cursor on the y-axis
  var x1; // the position of the cursor on the x-axis every 200ms (0ms delay)
  var y1; // the position of the cursor on the y-axis every 200ms (0ms delay)
  var x2; // the position of the cursor on the x-axis every 200ms (100ms delay)
  var y2; // the position of the cursor on the y-axis every 200ms (100ms delay)
  var x3; // the position of the cursor on the x-axis every 200ms (50ms delay)
  var y3; // the position of the cursor on the y-axis every 200ms (50ms delay)
  var x4; // the position of the cursor on the x-axis every 200ms (150ms delay)
  var y4; // the position of the cursor on the y-axis every 200ms (150ms delay)
  var dX1; // the distance the cursor has moved on the x-axis (between x1 and x2)
  var dY1; // the distance the cursor has moved on the y-axis (between y1 and y2)
  var dX2; // the distance the cursor has moved on the x-axis (between x3 and x4)
  var dY2; // the distance the cursor has moved on the x-axis (between y3 and x4)
  var ang1; // the rotation of the line created by dX1 and dY1 (0-360 degrees)
  var ang2; // the rotation of the line created by dX2 and dY2 (0-360 degrees)
  var dAng; // the difference between ang1 and ang2 (degrees)
  var sumdAng = 210; // the sum of dAng over time
  
  // getCoordinates will be called everytime the mouse pointer moves
  window.onpointermove = getCoordinates;

  /*
  The getCoordinates function is used to set cursor coordinates to variables
  */
  function getCoordinates(e) { 
    coX = e.pageX; coY = e.pageY; 
  }

  /*
  The below code is used to calculate the sumdAng variable which is used to control playback rate based on line rotation over time
  */

  // 0ms -> storing the cursor coordinates every 200ms
  setInterval(function() { 
    x1 = coX;
    y1 = coY;
  } , 200);

  // 50ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() {
      x3 = coX;
      y3 = coY;
    }, 200)
  }, 50);

  // 100ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() { 
    x2 = coX;
    y2 = coY;
    } , 200);
  } , 100);

  // 150ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() { 
    x4 = coX;
    y4 = coY; 
    } , 200);
  } , 150);

  // 175ms -> calculating change in cursor position every 200ms
  setTimeout(function() {
    setInterval(function() {
    dX1 = (x2 - x1);
    dY1 = (y1 - y2); 
    dX2 = (x4 - x3);
    dY2 = (y3 - y4);
    } , 200);
  } , 175);

  // 200ms -> calculating the rotation the line created by arctan(dY1/dX1)
  setTimeout(function() { 
    setInterval(function() {
      if (dX1 > 0 && dY1 > 0) { // Quadrant I (+dX1, +dY1)
        ang1 = Math.atan(dY1/dX1)*180/Math.PI;
      } else if (dX1 < 0 && dY1 > 0) { // Quadrant II (-dX1, +dY1)
        ang1 = 90 - ((-1)*Math.atan(dY1/dX1)*180/Math.PI) + 90;
      } else if (dX1 < 0 && dY1 < 0) { // Quadrant III (-dX1, -dY1)
        ang1 = Math.atan(dY1/dX1)*180/Math.PI + 180;
      } else if (dX1 > 0 && dY1 < 0) { // Quadrant IV (+dX1, -dY1)
        ang1 = 90 - ((-1)*Math.atan(dY1/dX1)*180/Math.PI) + 270;
      } else if (dY1 == 0 && dX1 > 0) { // x-axis between Quadrant I and IV
        ang1 = 0;
      } else if (dY1 == 0 && dX1 < 0) { // x-axis between Quadrant II and III
        ang1 = 180;
      } else if (dX1 == 0 && dY1 > 0) { // y-axis between Quadrant I and II
        ang1 = 90;
      } else if (dX1 == 0 && dY1 < 0) { // y-axis between Quadrant III and IV
        ang1 = 270;
      } else { // in case something goes wrong, the existing ang1 will be used
        ang1 = ang1;
      }
    } , 200);
  } , 200);

  // 200ms -> calculating the rotation the line created by arctan(dY2/dX2)
  setTimeout(function() {
    setInterval(function() {
      if (dX2 > 0 && dY2 > 0) { // Quadrant I (+dX2, +dY2)
        ang2 = Math.atan(dY2/dX2)*180/Math.PI;
      } else if (dX2 < 0 && dY2 > 0) { // Quadrant II (-dX2, +dY2)
        ang2 = 90 - ((-1)*Math.atan(dY2/dX2)*180/Math.PI) + 90;
      } else if (dX2 < 0 && dY2 < 0) { // Quadrant III (-dX2, -dY2)
        ang2 = Math.atan(dY2/dX2)*180/Math.PI + 180;
      } else if (dX2 > 0 && dY2 < 0) { // Quadrant IV (+dX2, -dY2)
        ang2 = 90 - ((-1)*Math.atan(dY2/dX2)*180/Math.PI) + 270;
      } else if (dY2 == 0 && dX2 > 0) { // x-axis exception between Quadrant I and IV
        ang2 = 0;
      } else if (dY2 == 0 && dX2 < 0) { // x-axis exception between Quadrant II and III
        ang2 = 180;
      } else if (dX2 == 0 && dY2 > 0) { // y-axis exception between Quadrant I and II
        ang2 = 90;
      } else if (dX2 == 0 && dY2 < 0) { // y-axis exception between Quadrant III and IV
        ang2 = 270;
      } else { // in case something goes wrong, the existing ang2 will be used
        ang2 = ang2;
      }
    }, 200)
  }, 200);

  // 210ms -> calculating the difference between the ang1 and ang2
  setTimeout(function() {
    setInterval(function() {
        if (ang2 + 250 < ang1) { // exception when moving from Quadrant IV to Quadrant I (360 to 0)
        dAng = (ang2 + 360) - ang1;
        } else if (ang1 + 250 < ang2) { // exception when moving from Quadrant I to Quadrant IV (0 to 360)
        dAng = ang2 - (ang1 + 360);
        } else { 
        dAng = ang2 - ang1;  
        }
    }, 200)
  }, 210);

  // 220ms -> summing dAng every 200ms
  setTimeout(function() {
    setInterval(function() {
        sumdAng = dAng + sumdAng > 420 ? 420 : dAng + sumdAng < 20 ? 20 : dAng + sumdAng; // limits sumdAng to values between 20 and 420
    }, 200)
  }, 220);

  // creating variables to detect mouse click status
  var mouseDown = 0;
  document.body.onmousedown = function() {
    mouseDown = 1;
  }
  document.body.onmouseup = function() {
    mouseDown = 0;
  }

  // updatePage will be called everytime the mouse moves
  document.onmousemove = updatePage;

  /*
  The updatePage function is used to produce sound and visuals
  */
  function updatePage(e) {
    if (mouseDown == 1) { // when the mouse is held down 
      console.log(sumdAng); // testing that sumdAng is returning accurate information
      source.playbackRate.value = (sumdAng/420) * maxPlaybackRate; // calculating the playback rate based on the sumdAng variable
      gainNode.gain.value = maxVol; // setting the volume to be max
      canvasDraw(ctx,coX,coY,12); // drawing the canvas
    } else {
      gainNode.gain.value = 0; // setting the gainNode off when not holding down the mouse
    }
  }

  /*
  The below code is used for canvas visualisation
  */

  var canvas = document.querySelector('.canvas');

  // setting the canvas width and height to be the same as the screen
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // create canvas context
  var ctx = canvas.getContext('2d');

  var lastX = -1
  var lastY = -1

  function canvasDraw(ctx, x, y, size) {

    if (lastX == -1) {
      lastX = x;
      lastY = y;
    }

    r = 0; 
    g = 255; 
    b = 0; 
    a = 255;

      // defining canvas properties
      ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x,y);
      ctx.lineWidth = size;
      ctx.stroke();
      ctx.closePath(); 

      lastX = x;
      lastY = y;
  }
  

  /*
  The below code is binds the 'r' key to a reset functionality that clears the canvas and resets sound to base values
  */

  // everytime a key is pressed the keyPress function will be run
  document.onkeydown = function(keyPress) {
    keyPressR = keyPress || window.event;
    var key = keyPress.which || keyPressR.keyCode;
      if (key === 82) { // key value for 'r'
      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // set variables to base values
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
}