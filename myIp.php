<?php
header('Content-type: application/json');

$resp = array ("ip" => $_SERVER['REMOTE_ADDR']);

echo json_encode($resp);
?>