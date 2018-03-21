<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 2/1/2018
 * Time: 8:21 PM
 */

require_once ('Model.php');

class Game extends Model {
  protected static $table_name = 'game';
  protected static $fields = array(
    'GameId',
    'Team1Id',
    'Team2Id',
    'ResultOfTeam1',
    'URL',
    'Date'
  );
  protected static $id_field = 'GameId';
}

