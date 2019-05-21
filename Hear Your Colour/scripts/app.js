/*
NOTES
- Due to XML sound request CORS issues, the website needs to be hosted on a server (localhost or zone) to be run
*/

/*
PROBLEMS/TO-DO
- Fixing canvas visualisation (lines remain solid no matter how fast the cursor moves)
- Additional functionalites: colour mixing, screen recording/playback
*/

/*
REFERENCES THAT I WILL FIX UP LATER
Violet Theremin: https://github.com/mdn/violent-theremin
AudioBufferSourceNode.playbackRate: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/playbackRate
Touch-screen sketchpad: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/
*/

var startMessage = document.querySelector('.start-message');
var appContents = document.querySelector('.app-contents');

// Conditions to start running the application
window.addEventListener('keydown', init);
window.addEventListener('click', init);
appContents.style.display = "none";

// uncomment the below code to link js variables to buttons
/*
var green = document.querySelector(".green");
var blue = document.querySelector(".blue");
var red = document.querySelector(".red");
var orange = document.querySelector(".orange");
var black = document.querySelector(".black");
var yellow = document.querySelector(".yellow");
var pink = document.querySelector(".pink");
*/

/*
The init function allows for the application to be started on click or keydown rather than starting it straight away
*/
function init() {
  appContents.style.display = "block";
  document.body.removeChild(startMessage); // removes 'ready to start' message

  // create web audio api context (responsible for all sounds)
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();
  
  /*
  create gain nodes (responsible for volume)
  */

  // create gain node for green sound
  var gainNodeGreen = audioCtx.createGain();
  gainNodeGreen.connect(audioCtx.destination);

  // create gain node for blue sound
  var gainNodeBlue = audioCtx.createGain();
  gainNodeBlue.connect(audioCtx.destination);

  // create gain node for red sound
  var gainNodeRed = audioCtx.createGain();
  gainNodeRed.connect(audioCtx.destination);

  /*
  The getData functions are used to get all the specific sounds. 
  */

  var sourceGreen;
  var sourceBlue;
  var sourceRed;

  // loading mp3 for green
  function getGreenData() {
  sourceGreen = audioCtx.createBufferSource(); // creating sound source element
  request = new XMLHttpRequest();
  request.open('GET', 'audio/green.mp3', true); // link to specific sound file here
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        sourceGreen.buffer = myBuffer;
        sourceGreen.connect(gainNodeGreen); // connecting gainNode to provide volume
        sourceGreen.loop = true; // looping the sound
        },
      function(e){"Error with decoding audio data" + e.error});
    }
  request.send();
  }

  // loading mp3 for blue
  function getBlueData() {
  sourceBlue = audioCtx.createBufferSource(); // creating sound source element
  request = new XMLHttpRequest();
  request.open('GET', 'audio/blue.mp3', true); // link to specific sound file here
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        sourceBlue.buffer = myBuffer;
        sourceBlue.connect(gainNodeBlue); // connecting gainNode to provide volume
        sourceBlue.loop = true; // looping the sound
        },
      function(e){"Error with decoding audio data" + e.error});
    }
  request.send();
  }

  // loading mp3 for red
  function getRedData() {
  sourceRed = audioCtx.createBufferSource(); // creating sound source element
  request = new XMLHttpRequest();
  request.open('GET', 'audio/red.mp3', true); // link to specific sound file here
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        sourceRed.buffer = myBuffer;
        sourceRed.connect(gainNodeRed); // connecting gainNode to provide volume
        sourceRed.loop = true; // looping the sound
        },
      function(e){"Error with decoding audio data" + e.error});
    }
  request.send();
  }

  // creating variable to control playback rate
  var maxPlaybackRate = 3;

  // creating variables to control volume (gain)
  var maxVol = 5.0;

  // requesting and starting mp3 sound playback (initialising with green)
  getGreenData();
  sourceGreen.start();
  var colour = ['38', '99', '39', '255'];
  var col = 1;

  setTimeout(function() {
    getBlueData();
    sourceBlue.start();
  } , 200);

  setTimeout(function() {
    getRedData();
    sourceRed.start();
  } , 400);

  /*
  The keyPress function is run everytime a key is pressed - specific keys have been binded to reset the drawing board or change the colour
  */
  document.onkeydown = function(keyPress) {
    keyPress = keyPress || window.event;
    var key = keyPress.which || keyPress.keyCode;
      if (key === 192) { // pressing ` resets the canvas
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
        dXY = 0;
        ang1 = 0;
        ang2 = 0;
        dAng = 0;
        sumdAng = 0;
        greenD = [];
        blueD = [];
        redD = [];
        x1T = 0;
        y1T = 0;
        x2T = 0;
        y2T = 0;
        x3T = 0;
        y3T = 0;
        x4T = 0;
        y4T = 0;
        dX1T = 0;
        dY1T = 0;
        dX2T = 0;
        dY2T = 0;
        dXYT = 0;
        ang1T = 0;
        ang2T = 0;
        dAngT = 0;
        sumdAngT = 0;
      } else if (key === 49) { // pressing 1 changes the line colour to green
        col = 1;
        colour = ['38', '99', '39', '255'];
      } else if (key === 50) { // pressing 2 changes the line colour to blue
        col = 2;
        colour = ['25', '33', '66', '255'];
      } else if (key === 51) { // pressing 3 changes the line colour to red
        col = 3;
        colour = ['170', '0', '0', '255'];
      } else if (key === 52) { // pressing 4 generates canvas URL
        saveViaAJAX();
        // window.location = "submit.php"
      } else if (key === 53) { // pressing 5 submits the form
        document.getElementById("done").click();
      }
  }

  // uncomment the below code to add button functionality
  /*
  // changing the colour to green
  green.onclick = function() {
    source.stop(0);
    getGreenData();
    source.start(0);
    colour = ['0', '255', '0', '255'];
  }
  
  // changing the colour to blue
  blue.onclick = function() {
    source.stop(0);
    getBlueData();
    source.start();
    colour = ['0', '0', '255', '255'];
  }
  */

  // setting screen bound variables
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  // creating variables to calculate line angles (mouse)
  var coX; // the position of the cursor on the x-axis
  var coY; // the position of the cursor on the y-axis
  var x1 = 0; // the position of the cursor on the x-axis every 200ms (0ms delay)
  var y1 = 0; // the position of the cursor on the y-axis every 200ms (0ms delay)
  var x2 = 0; // the position of the cursor on the x-axis every 200ms (100ms delay)
  var y2 = 0; // the position of the cursor on the y-axis every 200ms (100ms delay)
  var x3 = 0; // the position of the cursor on the x-axis every 200ms (50ms delay)
  var y3 = 0; // the position of the cursor on the y-axis every 200ms (50ms delay)
  var x4 = 0; // the position of the cursor on the x-axis every 200ms (150ms delay)
  var y4 = 0; // the position of the cursor on the y-axis every 200ms (150ms delay)
  var dX1 = 0; // the distance the cursor has moved on the x-axis (between x1 and x2)
  var dY1 = 0; // the distance the cursor has moved on the y-axis (between y1 and y2)
  var dX2 = 0; // the distance the cursor has moved on the x-axis (between x3 and x4)
  var dY2 = 0; // the distance the cursor has moved on the x-axis (between y3 and x4)
  var dXY = 0; // the absolute distance from point 1 to point 3
  var ang1 = 0; // the rotation of the line created by dX1 and dY1 (0-360 degrees)
  var ang2 = 0; // the rotation of the line created by dX2 and dY2 (0-360 degrees)
  var dAng = 0; // the difference between ang1 and ang2 (degrees)
  var sumdAng = 0; // the sum of dAng over time

  // creating variables to calculate line angles (touch)
  var touchX; // the position of a touch on the x-axis
  var touchY; // the position of a touch on the y-axis
  var x1T = 0; // the position of a touch on the x-axis every 200ms (0ms delay)
  var y1T = 0; // the position of a touch on the y-axis every 200ms (0ms delay)
  var x2T = 0; // the position of a touch on the x-axis every 200ms (100ms delay)
  var y2T = 0; // the position of a touch on the y-axis every 200ms (100ms delay)
  var x3T = 0; // the position of a touch on the x-axis every 200ms (50ms delay)
  var y3T = 0; // the position of a touch on the y-axis every 200ms (50ms delay)
  var x4T = 0; // the position of a touch on the x-axis every 200ms (150ms delay)
  var y4T = 0; // the position of a touch on the y-axis every 200ms (150ms delay)
  var dX1T = 0; // the distance a pen has moved on the x-axis (between x1 and x2)
  var dY1T = 0; // the distance a pen has moved on the y-axis (between y1 and y2)
  var dX2T = 0; // the distance a pen has moved on the x-axis (between x3 and x4)
  var dY2T = 0; // the distance a pen has moved on the x-axis (between y3 and x4)
  var dXYT = 0; // the absolute distance from point 1 to point 3
  var ang1T = 0; // the rotation of the line created by dX1 and dY1 (0-360 degrees)
  var ang2T = 0; // the rotation of the line created by dX2 and dY2 (0-360 degrees)
  var dAngT = 0; // the difference between ang1 and ang2 (degrees)
  var sumdAngT = 0; // the sum of dAng over time

  // creating variables to track the amount of each colour
  var greenD = []; // the coordinates the cursor/pen has travelled while green
  var blueD = []; // the coordinates the cursor/pen has travelled while blue 
  var redD = []; // the coordinates the cursor/pen has travelled while red 
  
  // getCoordinates will be called everytime the mouse pointer moves
  window.onmousemove = getCoordinates;

  /*
  The getCoordinates function is used to set cursor coordinates to variables
  */
  function getCoordinates(e) { 
    coX = e.pageX;
    coY = e.pageY; 
  }

  /*
  The getTouchPos function is used to set touch coordinates to variables
  */
  function getTouchPos(e) {
    if (!e)
      var e = event;

    if(e.touches) {
      if (e.touches.length == 1) { // verifying that there is only 1 touch
        var touch = e.touches[0]; // takes the information for the touch
        touchX = touch.pageX;
        touchY = touch.pageY;
      }
    }
  }

  /*
  The below code is used to calculate the sumdAng (mouse) and sumdAngT (touch) variables which are used to control playback rate based on line rotation over time
  */

  // sumdAng -> mouse calculation
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

  // 200ms -> calculating the rotation the line created by arctan(dY1/dX1); calculating the distance from point 1 to point 3 'as the crow flies' (dXY)
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
      dXY = Math.sqrt(Math.pow(Math.abs(dX1), 2) + Math.pow(Math.abs(dY1), 2)) > 300 ? 300 : Math.sqrt(Math.pow(Math.abs(dX1), 2) + Math.pow(Math.abs(dY1), 2));
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
        sumdAng = dAng + sumdAng > 400 ? 400 : dAng + sumdAng < -400 ? -400 : dAng + sumdAng; // limits sumdAng to values between -200 and 200
    }, 200)
  }, 220);

  // sumdAngT -> touch calculation
  // 0ms -> storing the cursor coordinates every 200ms
  setInterval(function() { 
    x1T = touchX;
    y1T = touchY;
  } , 200);

  // 50ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() {
      x3T = touchX;
      y3T = touchY;
    }, 200)
  }, 50);

  // 100ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() { 
    x2T = touchX;
    y2T = touchY;
    } , 200);
  } , 100);

  // 150ms -> storing the cursor coordinates every 200ms
  setTimeout(function() {
    setInterval(function() { 
    x4T = touchX;
    y4T = touchY;
    } , 200);
  } , 150);

  // 175ms -> calculating change in cursor position every 200ms
  setTimeout(function() {
    setInterval(function() {
    dX1T = (x2T - x1T);
    dY1T = (y1T - y2T); 
    dX2T = (x4T - x3T);
    dY2T = (y3T - y4T);
    } , 200);
  } , 175);

  // 200ms -> calculating the rotation the line created by arctan(dY1/dX1); calculating the distance from point 1 to point 3 'as the crow flies' (dXYT)
  setTimeout(function() { 
    setInterval(function() {
      if (dX1T > 0 && dY1T > 0) { // Quadrant I (+dX1, +dY1)
        ang1T = Math.atan(dY1T/dX1T)*180/Math.PI;
      } else if (dX1T < 0 && dY1T > 0) { // Quadrant II (-dX1, +dY1)
        ang1T = 90 - ((-1)*Math.atan(dY1T/dX1T)*180/Math.PI) + 90;
      } else if (dX1T < 0 && dY1T < 0) { // Quadrant III (-dX1, -dY1)
        ang1T = Math.atan(dY1T/dX1T)*180/Math.PI + 180;
      } else if (dX1T > 0 && dY1T < 0) { // Quadrant IV (+dX1, -dY1)
        ang1T = 90 - ((-1)*Math.atan(dY1T/dX1T)*180/Math.PI) + 270;
      } else if (dY1T == 0 && dX1T > 0) { // x-axis between Quadrant I and IV
        ang1T = 0;
      } else if (dY1T == 0 && dX1T < 0) { // x-axis between Quadrant II and III
        ang1T = 180;
      } else if (dX1T == 0 && dY1T > 0) { // y-axis between Quadrant I and II
        ang1T = 90;
      } else if (dX1T == 0 && dY1T < 0) { // y-axis between Quadrant III and IV
        ang1T = 270;
      } else { // in case something goes wrong, the existing ang1 will be used
        ang1T = ang1T;
      }
      dXYT = Math.sqrt(Math.pow(Math.abs(dX1T), 2) + Math.pow(Math.abs(dY1T), 2)) > 300 ? 300 : Math.sqrt(Math.pow(Math.abs(dX1T), 2) + Math.pow(Math.abs(dY1T), 2));
    } , 200);
  } , 200);

  // 200ms -> calculating the rotation the line created by arctan(dY2/dX2)
  setTimeout(function() {
    setInterval(function() {
      if (dX2T > 0 && dY2T > 0) { // Quadrant I (+dX2, +dY2)
        ang2T = Math.atan(dY2T/dX2T)*180/Math.PI;
      } else if (dX2T < 0 && dY2T > 0) { // Quadrant II (-dX2, +dY2)
        ang2T = 90 - ((-1)*Math.atan(dY2T/dX2T)*180/Math.PI) + 90;
      } else if (dX2T < 0 && dY2T < 0) { // Quadrant III (-dX2, -dY2)
        ang2T = Math.atan(dY2T/dX2T)*180/Math.PI + 180;
      } else if (dX2T > 0 && dY2T < 0) { // Quadrant IV (+dX2, -dY2)
        ang2T = 90 - ((-1)*Math.atan(dY2T/dX2T)*180/Math.PI) + 270;
      } else if (dY2T == 0 && dX2T > 0) { // x-axis exception between Quadrant I and IV
        ang2T = 0;
      } else if (dY2T == 0 && dX2T < 0) { // x-axis exception between Quadrant II and III
        ang2T = 180;
      } else if (dX2T == 0 && dY2T > 0) { // y-axis exception between Quadrant I and II
        ang2T = 90;
      } else if (dX2T == 0 && dY2T < 0) { // y-axis exception between Quadrant III and IV
        ang2T = 270;
      } else { // in case something goes wrong, the existing ang2 will be used
        ang2T = ang2T;
      }
    }, 200)
  }, 200);

  // 210ms -> calculating the difference between the ang1 and ang2
  setTimeout(function() {
    setInterval(function() {
        if (ang2T + 250 < ang1T) { // exception when moving from Quadrant IV to Quadrant I (360 to 0)
        dAngT = (ang2T + 360) - ang1T;
        } else if (ang1T + 250 < ang2T) { // exception when moving from Quadrant I to Quadrant IV (0 to 360)
        dAngT = ang2T - (ang1T + 360);
        } else { 
        dAngT = ang2T - ang1T;  
        }
    }, 200)
  }, 210);

  // 220ms -> summing dAng every 200ms
  setTimeout(function() {
    setInterval(function() {
        sumdAngT = dAngT + sumdAngT > 400 ? 400 : dAngT + sumdAngT < -400 ? -400 : dAngT + sumdAngT; // limits sumdAng to values between 20 and 420
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
  The updatePage function is used to produce sound and visuals (on mouse down)
  The col variable is used to detect which colour is currently active and increases colour variables accordingly
  Comments have been included for the first statement but apply to all
  */
  function updatePage(e) {
    if (mouseDown == 1 && col == 1) { // when the mouse is held down and colour is green (col = 1)
      // console.log(sumdAng) // testing that sumdAng and dXY are returning accurate information -> clockwise loops should lower sumdAng while anti-clockwise loops should raise it; dXY should be larger when moving the cursor faster and lower when moving it slower
      // console.log(greenD); // testing that colour variable (greenD) is returning accurate information -> colour variable should increase steadily with mouse movement (faster with larger mouse movements)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (greenD.includes((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString()) === false) {
        greenD.push((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString());
      }
      blueD = blueD.filter(function(el) {
        return !greenD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !greenD.includes(el);
      });
      sourceGreen.detune.value = sumdAng * 5; // calculating the detune amount (cents) based on the sumdAng variable
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol; // playing cumulative blue sound value
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,coX,coY,5); // drawing the canvas
    } else if (mouseDown == 1 && col == 2) { // when the mouse is held down and colour is blue (col = 2)
      // console.log(sumdAng, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (blueD.includes((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString()) === false) {
        blueD.push((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !blueD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !blueD.includes(el);
      })
      sourceBlue.detune.value = sumdAng * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,coX,coY,5);
    } else if (mouseDown == 1 && col == 3) {
      // console.log(sumdAng, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (redD.includes((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString()) === false) {
        redD.push((Math.ceil(coX/5)*5).toString() + (Math.ceil(coY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !redD.includes(el);
      });
      blueD = blueD.filter(function(el) {
        return !redD.includes(el);
      })
      sourceRed.detune.value = sumdAng * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,coX,coY,5);
    } else { // when the mouse is not held down
      // console.log(sumdAng);
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      sourceRed.detune.value = 0;
      sourceBlue.detune.value = 0;
      sourceGreen.detune.value = 0;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      lastX = -1;
      lastY = -1;
      sumdAng = 0;
    }
  }

   // touch functions will be called everytime a touch element changes
  document.ontouchstart = updatePageTouchStart;
  document.ontouchmove = updatePageTouchMove;
  document.ontouchend = updatePageTouchEnd;

  /*
  The updatePageTouch functions are used to produce sound and visuals (on touch)
  */

  // runs when a new touch starts
  function updatePageTouchStart() { // runs on touch start
    if (col == 1) { // when the colour is green (col = 1)
      getTouchPos(); // updates touch coordinates
      // console.log(sumdAngT) // testing that sumdAngT and dXY are returning accurate information -> clockwise loops should lower sumdAng while anti-clockwise loops should raise it; dXY should be larger when moving the cursor faster and lower when moving it slower
      // console.log(greenD); // testing that colour variable (greenD) is returning accurate information -> colour variable should increase steadily with mouse movement (faster with larger mouse movements)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (greenD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        greenD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      blueD = blueD.filter(function(el) {
        return !greenD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !greenD.includes(el);
      });
      sourceGreen.detune.value = sumdAngT * 5; // calculating the detune amount (cents) based on the sumdAng variable
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol; // playing cumulative blue sound value
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5); // drawing the canvas
      event.preventDefault();
    } else if (col == 2) { // when the colour is blue (col = 2)
      getTouchPos();
      // console.log(sumdAngT, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (blueD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        blueD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !blueD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !blueD.includes(el);
      })
      sourceBlue.detune.value = sumdAngT * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5);
      event.preventDefault();
    } else if (col == 3) {
      getTouchPos();
      // console.log(sumdAngT, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (redD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        redD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !redD.includes(el);
      });
      blueD = blueD.filter(function(el) {
        return !redD.includes(el);
      })
      sourceRed.detune.value = sumdAngT * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5);
      event.preventDefault();
    }
  }

  // runs when a new touch starts
  function updatePageTouchMove(e) { // runs on touch start
    if (col == 1) { // when the colour is green (col = 1)
      getTouchPos(e); // updates touch coordinates
      // console.log(sumdAngT) // testing that sumdAngT and dXY are returning accurate information -> clockwise loops should lower sumdAng while anti-clockwise loops should raise it; dXY should be larger when moving the cursor faster and lower when moving it slower
      // console.log(greenD); // testing that colour variable (greenD) is returning accurate information -> colour variable should increase steadily with mouse movement (faster with larger mouse movements)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (greenD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        greenD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      blueD = blueD.filter(function(el) {
        return !greenD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !greenD.includes(el);
      });
      sourceGreen.detune.value = sumdAngT * 5; // calculating the detune amount (cents) based on the sumdAng variable
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol; // playing cumulative blue sound value
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5); // drawing the canvas
      event.preventDefault();
    } else if (col == 2) { // when the colour is blue (col = 2)
      getTouchPos(e);
      // console.log(sumdAngT, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (blueD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        blueD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !blueD.includes(el);
      });
      redD = redD.filter(function(el) {
        return !blueD.includes(el);
      })
      sourceBlue.detune.value = sumdAngT * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5);
      event.preventDefault();
    } else if (col == 3) {
      getTouchPos(e);
      // console.log(sumdAngT, dXY)
      console.log(greenD.length, blueD.length, redD.length);
      // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
      if (redD.includes((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString()) === false) {
        redD.push((Math.ceil(touchX/5)*5).toString() + (Math.ceil(touchY/5)*5).toString());
      }
      greenD = greenD.filter(function(el) {
        return !redD.includes(el);
      });
      blueD = blueD.filter(function(el) {
        return !redD.includes(el);
      })
      sourceRed.detune.value = sumdAngT * 5;
      gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
      gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
      gainNodeRed.gain.value = (redD.length/3000) * maxVol;
      canvasDraw(ctx,touchX,touchY,5);
      event.preventDefault();
    }
  }

  // runs when an existing touch ends
  function updatePageTouchEnd(e) {
    getTouchPos(e); // updates the touch coordinates
    // console.log(sumdAngT);
    console.log(greenD.length, blueD.length, redD.length);
    // console.log(gainNodeGreen.gain.value, gainNodeBlue.gain.value);
    //sourceRed.detune.value = 0;
    //sourceBlue.detune.value = 0;
    //sourceGreen.detune.value = 0;
    gainNodeGreen.gain.value = (greenD.length/3000) * maxVol;
    gainNodeBlue.gain.value = (blueD.length/3000) * maxVol;
    gainNodeRed.gain.value = (redD.length/3000) * maxVol;
    lastX = -1;
    lastY = -1;
    sumdAngT = 0;
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

  /*
  The canvasDraw function can be called to draw on the canvas
  */
  function canvasDraw(ctx, x, y, size) {

    if (lastX == -1) {
      lastX = x;
      lastY = y;
    }

      // defining canvas properties
      ctx.strokeStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+(colour[3]/255)+")";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(x,y);
      ctx.lineWidth = size;
      ctx.stroke();
      ctx.closePath();


      lastX = x;
      lastY = y;
  }

  // Adding a canvas clause to react to the touchscreen events on the canvas
  if (ctx) {
    canvas.addEventListener('touchstart', updatePageTouchStart, false);
    canvas.addEventListener('touchmove', updatePageTouchMove, false);
    canvas.addEventListener('touchend', updatePageTouchEnd, false);
  }

  function saveViaAJAX() {
  var drawing = canvas.toDataURL();
  var debugConsole = document.getElementById("debugConsole");
  debugConsole.value = drawing;
  var greenConsole = document.getElementById("greenConsole");
  greenConsole.value = greenD.length;
  var blueConsole = document.getElementById("blueConsole");
  blueConsole.value = blueD.length;
  var redConsole = document.getElementById("redConsole");
  redConsole.value = redD.length;
  }
}