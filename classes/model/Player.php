<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 1/30/2018
 * Time: 8:33 PM
 */
require_once ('Model.php');

class Player extends Model {
  protected static $table_name = 'player';
  protected static $fields = array(
    'PlayerId',
    'PlayerName',
  );
  protected static $id_field = 'PlayerId';

  public function describe() {
    return $this->PlayerName;
  }

  public function team() {
    $sql = "
SELECT TeamId, MAX(game.Date) AS last_game
FROM action
  INNER JOIN game on (action.GameId = game.GameId)
WHERE action.PlayerId = {$this->PlayerId}
GROUP BY TeamId
ORDER BY last_game DESC
LIMIT 0, 1";
    $team = $this->query($sql);
   return Team::get($team[0]['TeamId']);
  }

}
