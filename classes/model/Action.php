<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 2/1/2018
 * Time: 8:16 PM
 */

require_once ('Model.php');

class Action extends Model {
  protected static $table_name = 'action';
  protected static $fields = array(
    'GameId',
    'TeamId',
    'PlayerId',
    'Minutes',
    'FieldGoalsMade',
    'FieldGoalAttempts',
    '3PointsMade',
    '3PointAttempts',
    'FreeThrowsMade',
    'FreeThrowAttempts',
    'PlusMinus',
    'OffensiveRebounds',
    'DefensiveRebounds',
    'TotalRebounds',
    'Assists',
    'PersonalFouls',
    'Steals',
    'Turnovers',
    'BlockedShots',
    'BlocksAgainst',
    'Points',
    'Starter'
  );
}
