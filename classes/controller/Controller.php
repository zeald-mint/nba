<?php
class Controller {
  public function __construct() {

  }

  public static function load($controller_name) {
    $controller_name = ucfirst($controller_name)."Controller";
    if( !file_exists("classes/controller/{$controller_name}.php")) {
      return false;
    }
    require_once "{$controller_name}.php";
    return new $controller_name();
  }
}