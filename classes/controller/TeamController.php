<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 3/20/2018
 * Time: 8:26 PM
 */

require_once ('classes/controller/Controller.php');
require_once ('classes/model/Team.php');
class TeamController extends Controller {
  public function get_all() {
    $teams = Team::get_all();
    return $teams;
  }

  public function get($id) {
    return Team::get($id) ?: null;
  }
}

