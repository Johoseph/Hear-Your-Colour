<?php

session_start();

require 'connectMySQL.php';

if(isset($_POST['imageURL'])) {

  $db = new MySQLDatabase();
  $db->connect();
  $imageURL = $_POST['imageURL'];
  $name = $_POST['name']."''s Drawing";
  $greenValue = $_POST['greenValue'];
  $blueValue = $_POST['blueValue'];
  $redValue = $_POST['redValue'];

  $sql = "INSERT INTO drawings (name, imageURL, greenValue, blueValue, redValue) VALUES ('$name', '$imageURL', '$greenValue' , '$blueValue', '$redValue')";
  $insert = $db->query($sql);
  header('Location: index.php');
  $db->disconnect(); 
}

?>