<?php
header('Content-type: application/json');

$externalContent = file_get_contents('http://checkip.dyndns.com/');

preg_match('/Current IP Address: \[?([:.0-9a-fA-F]+)\]?/', $externalContent, $m);

$externalIp = $m[1];

$resp = array ("ip" => $externalIp);

echo json_encode($resp);
?>