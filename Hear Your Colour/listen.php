<?php

session_start();

?>
<!DOCTYPE html>
<html lang="en-us">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>Hear Your Colour</title>

	<link href="styles/normalize.css" rel="stylesheet" type="text/css">
	<link href="styles/app.css" rel="stylesheet" type="text/css"> <!-- use app.css normally-->

</head>
<body>
	<div class="app-contents">
		<?php
		if(isset($_GET['ID'])) {
			require 'connectMySQL.php';
			$ID = $_GET['ID'];

			$db = new MySQLDatabase();
			$db->connect();
			$sql = "SELECT * FROM drawings WHERE ID ='$ID'";
			$result = $db->query($sql);
			$row = mysqli_fetch_assoc($result);
			$_SESSION["greenValue"] = $row['greenValue'];
			$_SESSION["blueValue"] = $row['blueValue'];
			$_SESSION["redValue"] = $row['redValue'];

			$part4 = '<img src = "';
			$part5 = '" id = "drawing" >';

			echo $part4.$row['imageURL'].$part5;

			$db->disconnect();
		} else {
			header('Location: submit.php');
		}

		?>
	
	
	</div>

	<script>
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

  var maxVol = 5;

  var greenD = '<?php echo $_SESSION['greenValue']; ?>'
  var blueD = '<?php echo $_SESSION['blueValue']; ?>'
  var redD = '<?php echo $_SESSION['redValue']; ?>'

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

  getGreenData();
  sourceGreen.start();

  setTimeout(function() {
    getBlueData();
    sourceBlue.start();
  } , 150);

  setTimeout(function() {
    getRedData();
    sourceRed.start();
  } , 300);

  gainNodeGreen.gain.value = (greenD/3000) * maxVol;
  gainNodeBlue.gain.value = (blueD/3000) * maxVol;
  gainNodeRed.gain.value = (redD/3000) * maxVol;
	</script>

</body>
</html>