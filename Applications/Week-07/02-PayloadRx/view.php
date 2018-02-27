<html>
<body>
<?php
  $servername = "localhost";
  $username = "someuser";
  $password = "somepassword";
  $dbname = "somedb";
$con = mysql_connect($servername, $username, $password);
mysql_select_db($dbname, $con) or die( "Unable to select database");
$query="SELECT * FROM rx";
$result=mysql_query($query);
$num=mysql_numrows($result);
mysql_close();
?>
<table border="1" cellspacing="2" cellpadding="2">
<tr>
<th><font face="Arial, Helvetica, sans-serif">id</font></th>
<th><font face="Arial, Helvetica, sans-serif">time</font></th>
<th><font face="Arial, Helvetica, sans-serif">http referer</font></th>
<th><font face="Arial, Helvetica, sans-serif">user agent</font></th>
<th><font face="Arial, Helvetica, sans-serif">ip address</font></th>
<th><font face="Arial, Helvetica, sans-serif">ip value</font></th>
<th><font face="Arial, Helvetica, sans-serif">domain</font></th>
<th><font face="Arial, Helvetica, sans-serif">Host_name</font></th>
<th><font face="Arial, Helvetica, sans-serif">token</font></th>
<th><font face="Arial, Helvetica, sans-serif">cookie</font></th>
</tr>

<?php
$i=0;
while ($i < $num) {

$f1=mysql_result($result,$i,"id");
$f2=mysql_result($result,$i,"tm");
$f3=mysql_result($result,$i,"ref");
$f4=mysql_result($result,$i,"agent");
$f5=mysql_result($result,$i,"ip");
$f6=mysql_result($result,$i,"ip_value");
$f7=mysql_result($result,$i,"domain");
$f8=mysql_result($result,$i,"host_name");
$f9=mysql_result($result,$i,"token");
$f10=mysql_result($result,$i,"cookie");
?>

<tr>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f1; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f2; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f3; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f4; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f5; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f6; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f7; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f8; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f9; ?></font></td>
<td><font face="Arial, Helvetica, sans-serif"><?php echo $f10; ?></font></td>
</tr>

<?php
$i++;
}
?>
</body>
</html>