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
  <p class="start-message">Ready to start</p>

	<div class="app-contents">

	<!-- uncomment the below code to give buttons to change colours -->
	<!--
	<button class= "red"> Red </button>
	<button class= "green"> Green </button>
	<button class= "blue"> Blue </button>
	<button class= "orange"> Orange </button>
	<button class= "black"> Black </button>
	<button class= "yellow"> Yellow </button>
	<button class= "pink"> Pink </button>
	-->

	<form id="user-inputs" action="save.php" method="POST">
	Name: <input type="name" name="name" required>
	Canvas URL: <input type="textarea" id="debugConsole" name="imageURL" required>
	Green.length: <input type="textarea" id="greenConsole" name="greenValue" required>
	Blue.length: <input type="textarea" id="blueConsole" name="blueValue" required>
	Red.length: <input type="textarea" id="redConsole" name="redValue" required>
	<button type="submit" id = "done">Submit</button>
	</form>

    <canvas class="canvas">
      Your browser does not support HTML5 canvas
    </canvas>
	</div>

    <script src="scripts/app.js"></script>

</body>
</html>