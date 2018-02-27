<?php
  $token = $_GET['a'];
  $cookie = $_GET['b'];

  echo '<p>token: ' . htmlspecialchars($token) . '</p><p>cookie: ' . htmlspecialchars($cookie) . '</p>';


  $servername = "localhost";
  $username = "someuser";
  $password = "somepassword";
  $dbname = "somedb";

  $ref=$_SERVER['HTTP_REFERER'];
  $agent=$_SERVER['HTTP_USER_AGENT'];
  $ip=$_SERVER['REMOTE_ADDR'];
  $host_name = gethostbyaddr($_SERVER['REMOTE_ADDR']);

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  } 

  $sql = "INSERT INTO rx (tm, ref, agent, ip, host_name, token, cookie) VALUES(curdate(),'$ref','$agent','$ip','$host_name', '$token', '$cookie')";
  $test=mysql_query($strSQL);

  if ($conn->query($sql) === TRUE) {
      echo "ok";
  } else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
?>