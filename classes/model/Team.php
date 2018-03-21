<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 2/1/2018
 * Time: 8:20 PM
 */

require_once ('Model.php');

class Team extends Model {
  protected static $table_name = 'team';
  protected static $fields = array(
    'TeamId',
    'TeamName'
  );
  protected static $id_field = 'TeamId';

  public function describe() {
    return $this->TeamName;
  }

  public function player() {

  }
}