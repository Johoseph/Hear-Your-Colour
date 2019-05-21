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

		require 'connectMySQL.php';

		$db = new MySQLDatabase();
		$db->connect();
		$sql = "SELECT * FROM drawings ORDER BY ID  DESC";
		$result = $db->query($sql);

		if (mysqli_num_rows($result) > 0) {
			while ($row = mysqli_fetch_assoc($result)) {
				echo $row['name']. "<br>";
				$part1 = '<a href = "listen.php?ID=';
				$part2 = '"><img src = "';
				$part3 = '" id = "drawings" ></a>';
				echo $part1.$row['ID'].$part2.$row['imageURL'].$part3."<br>";
			}
		}

		$db->disconnect();

		?>
	
	
	</div>

</body>
</html>