<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 3/20/2018
 * Time: 8:17 PM
 */
require_once ("classes/controller/Controller.php");

function error($message, $code = 500) {
  http_response_code($code);
  exit($message);
}

$urlParts = explode('/' , $_SERVER['REQUEST_URI']);
$id = array_pop($urlParts);
$controller = array_pop($urlParts);

if (!$controller) {
  die('Nope');
}

$method = $_SERVER['REQUEST_METHOD'];
$controller = Controller::load($controller);

switch ($method) {
  case 'POST':
    $action = $id == '' ? "insert" : "update";
    break;
  case 'GET':
    $action = $id == '' ? "get_all" : "get";
    break;
  default:
    error("Invalid request method", 400);
    break;
}

if(!method_exists($controller, $action)) {
  error("Method not found", 405);
}

$result = $controller->$action($id, $_REQUEST);

if(is_null($result)) {
  error("Record not found", 404);
}

header("Content-type: application/json; charset=utf-8");
echo json_encode($result);