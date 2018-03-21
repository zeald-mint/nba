<?php
/**
 * Created by PhpStorm.
 * User: Zeald.Mint
 * Date: 1/30/2018
 * Time: 8:27 PM
 */

class Model {
  protected static $mysqli_db;
  protected static $table_name;
  protected static $fields;
  protected static $id_field;


  public function __construct($fields = []) {
    $this->set($fields);
  }

  public function set($fields) {
    if(is_array($fields)) {
      foreach ($fields as $key => $value) { // index 0 to retrieve first row
        $this->$key = $value;
      }
    }
    return $this;
  }

  // Function to save data to the database. No argument needed
  public function save() {
    $sql_parts = [];
    $id = $this->{static::$id_field};
    if(!$id) {
      $insert = true;
      $this->{static::$id_field} = rand(0, 999999999);
    }
    foreach (static::$fields as $field) {
      $sql_parts[] = "$field = '" . addslashes($this->$field) . "'";
    }
    if (!$insert) {
      $sql = "UPDATE " . static::$table_name
        . " SET " . implode(",", $sql_parts)
        . " WHERE " . static::$id_field . " = '" . addslashes($id) . "'";;
    } else {
      $sql = "REPLACE " . static::$table_name
        . " SET " . implode(",", $sql_parts);
    }
    $this->query($sql);
    return $this;
  }

  // Function to retrieve data from database using id argument
  public function retrieve($id) {
    $sql = "SELECT * from " . static::$table_name
          . " WHERE " . static::$id_field
          . " = '" . addslashes($id) . "'";
    $data = $this->query($sql);
    //$this->dump($sql);
    if (!$data) {
      return false;
    }
    foreach ($data[0] as $key => $value) { // index 0 to retrieve first row
      $this->$key = $value;
    }
    return $this;
  }

  public function delete($id) {
    $sql = "DELETE FROM " . static::$table_name
          . " WHERE " . static::$id_field
          . " = '" . addslashes($id) . "'";
    $data = $this->query($sql);
    if (!$data) {
      return false;
    }
    return $this;
  }

  public static function add_field(...$fields) {
    static::$fields = array_merge(static::$fields, $fields);
  }

  public static function search($search_fields) {
    $sql_parts = [];
    foreach (static::$fields as $field) {
      if(isset($search_fields[$field])) {
        $sql_parts[] = "$field = '" . addslashes($search_fields[$field]) . "'";
      }
    }

    $sql = "SELECT * FROM " . static::$table_name . " WHERE " . implode(" AND ", $sql_parts);
    $obj = new self(); // create new self object
    $data = $obj->query($sql);
    if (!$data) {
      return false;
    }
    $players = [];
    foreach ($data as $search_result) { // index 0 to retrieve first row
      $players[] = new static($search_result);
    }
    $obj->dump($players);
    return $players;
  }

  // should be overriden by child class
  public function describe() {}

  public static function get($id) {
    $self = new static();
    return $self->retrieve($id);
  }

  public static function get_all($limit = NULL, $offset = NULL) {
    $sql = "SELECT * FROM " . static::$table_name .
      " WHERE 1";
    if( isset($limit) ) {
      $sql .= " LIMIT " . ($offset > 0 ? $offset : 0) . ", " .$limit;
    }
    //die(var_dump($sql));
    $results = self::query($sql);
    $collection = array();
    if($results[0]) {
      foreach ($results as $result) {
        $collection[] = new static($result);
      }
    }
    return $collection;
  }

  /**
   * Execute a query & return the resulting data as an array of assoc arrays
   * @param string $sql query to execute
   * @return boolean|array array of associative arrays - query results for select
   *     otherwise true or false for insert/update/delete success
   */
  public static function query($sql) {
    if(!static::$mysqli_db) {
      static::$mysqli_db = new mysqli('localhost', 'root', 'mysql', 'nba');
    }

    $result = static::$mysqli_db->query($sql);
    if (!is_object($result)) {
      return $result;
    }
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    return $data;
  }


  /**
   * Debug method - dumps a print_r of any passed variables and exits
   * @param mixed any number of variables you wish to inspect
   */
  public function dump() {
    $args = func_get_args();
    if (!$args) {
      $data = [];
      foreach (static::$fields as $field) {
        $data[$field] = $this->$field;
      }
      $args[] = $data;
    }
    global $noexit;
    foreach ($args as $arg) {
      $out = print_r($arg, 1);
      echo '<pre>' . $out . '</pre><hr />';
    }
    if (!$noexit) {
      $bt = debug_backtrace();
      exit('<i>Called from: ' . $bt[0]['file'] . ' (' . ($bt[1]['class'] ? $bt[1]['class'] . ':' : '') . $bt[1]['function'] . ')</i>');
    }
  }





}