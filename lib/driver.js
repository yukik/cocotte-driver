'use strict';

/**
 * dependencies
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * alias
 */
var ALART = 'このメソッドはサポートされていません';
var ROW_STATES = require('./row-states');
var CONNECTION_STATES = require('./connection-states');

/**
 * データベースドライバのスーパークラス
 * @method Driver
 * @param  {Object} config
 */
function Driver () {}

// 継承
util.inherits(Driver, EventEmitter);

/**
 * 行状態の定数群
 */
Driver.ROW_STATES = ROW_STATES;

/**
 * 接続状態の定数群
 */
Driver.CONNECTION_STATES = CONNECTION_STATES;

/**
 * プロパティ
 *
 * サブクラスで必ず設定します
 * cocotte-helperの記述にしたがい設定する必要があります
 */
Driver.properties = {
  keepTime: {
    type: Number,
    description: ['接続持続時間','msです', '規定値は300']
  },
  retryTime: {
    type: Number,
    description: ['再接続時間', 'msです', '規定値は300']
  },
  retryMax: {
    type: Number,
    description: ['再接続時間', '規定値は10']
  }
};

/**
 * 接続状態
 */
Driver.prototype.connectionState = CONNECTION_STATES.CLOSED;

/**
 * 実行メソッド数
 * @property {Number} activeCount
 */
Driver.prototype.activeCount = 0;

/**
 * 接続持続時間(ms)
 * @property {Number} keepTime
 */
Driver.prototype.keepTime = 300;

/**
 * 再接続時間
 * @property {Number} retryTime
 */
Driver.prototype.retryTime = 300;

/**
 * 再接続最大回数
 * 設定値以上失敗した場合は、connectionStateがBROKENに設定されます
 * @property {Number}
 */
Driver.prototype.retryMax = 10;

/**
 * 接続連続失敗数
 * @property {Number}
 */
Driver.prototype._openFailureCount = 0;

/**
 * 接続を開きます
 * @method open
 * @return {Function} openThunk -> {Boolean} opend
 */
Driver.prototype.open = function open () {
  return function openThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 接続を閉じます
 * @method close
 * @return {Function} closeThunk -> {Boolean} closed
 */
Driver.prototype.close = function close () {
  return function closeThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * テーブル一覧を取得します
 * @method getTables
 * @return {Function} getTablesThunk -> {Array.String} tableNames
 */
Driver.prototype.getTables = function getTables () {
  return function getTablesThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * テーブルを作成します
 * @method createTable
 * @param  {String}   table
 * @param  {Array}    fields
 * @param  {Boolean}  ifExists
 * @return {Function} createTableThunk -> {Boolean} created
 */
Driver.prototype.createTable = function createTable () {
  return function createTableThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * テーブルを削除します
 * @method dropTable
 * @param  {String}   table
 * @param  {Boolean}  ifExists
 * @return {Function} dropTableThunk -> {Boolean} droped
 */
Driver.prototype.dropTable = function dropTable () {
  return function dropTableThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * フィールド一覧を取得します
 * @method getFields
 * @param  {String}   table
 * @return {Function} getFieldsThun -> {Array.String} fields
 */
Driver.prototype.getFields = function getFields () {
  return function getFieldsThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * フィールドを追加します
 * @method addField
 * @param  {String}   table
 * @param  {Object}   field
 * @param  {Boolean}  ifExists
 * @return {Function} addFieldThunk -> {Boolean} added
 */
Driver.prototype.addField = function addField () {
  return function addFieldThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * フィールドを削除します
 * @method removeField
 * @param  {String}   table
 * @param  {Object}   field
 * @param  {Boolean}  ifExists
 * @return {Function} removeFieldThunk -> {Boolean} removed
 */
Driver.prototype.removeField = function removeField () {
  return function removeFieldThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * インデックス一覧を取得する
 * @method getIndexes
 * @param  {String}   table
 * @param  {Boolean}  ifExists
 * @return {Function} getIndexesThunk -> {Array.Array.String} indexes
 */
Driver.prototype.getIndexes = function getIndexes () {
  return function getIndexesThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * インデックスを追加します
 * @method  addIndex
 * @param  {String}   table
 * @param  {Array}    index
 * @param  {Boolean}  ifExists
 * @param  {Boolean}  unique
 * @return {Function} addIndexThunk -> {Boolean} added
 */
Driver.prototype.addIndex = function addIndex () {
  return function addIndexThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * インデックスを削除します
 * @method removeIndex
 * @param  {String}   table
 * @param  {Array}    index
 * @param  {Boolean}  ifExists
 * @return {Function} removeIndexThunk -> {Boolean} removed
 */
Driver.prototype.removeIndex = function removeIndex () {
  return function removeIndexThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 行番号を作成します
 * @method createId
 * @param  {String}   table
 * @return {Function} createIdThunk -> {String} rowId
 */
Driver.prototype.createId = function createId () {
  return function createIdThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 複数行を取得します
 * @method find
 * @param  {String}   table
 * @param  {Object}   selector
 * @param  {Array}    fields
 * @param  {Array}    sort
 * @param  {Number}   skip
 * @param  {Number}   limit
 * @return {Function} findThunk -> {Array.Object} rows
 */
Driver.prototype.find = function find () {
  return function findThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 最初の行を返します
 * 
 * 存在しない場合はnullを返します
 * 
 * @method getRow
 * @param  {String}   table
 * @param  {Object}   selector
 * @param  {Array}    fields
 * @param  {Array}    sort
 * @param  {Number}   skip
 * @return {Function} getRowThunk -> {Object} row
 */
Driver.prototype.getRow = function getRow () {
  return function getRowThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 最初の行の指定フィールドの値を取得
 * 
 * @method getValue
 * @param  {String}   table
 * @param  {Object}   selector
 * @param  {String}   field
 * @param  {Array}    sort
 * @param  {Number}   skip
 * @return {Function} getValueThunk -> {Mixed} value 
 */
Driver.prototype.getValue = function getValue () {
  return function getValueThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 行数を取得します
 * 
 * @method count
 * @param {String}  table
 * @param {Object}  selector
 * @return {Function} countThunk -> {Number} count
 */
Driver.prototype.count = function count () {
  return function countThunk (callback) {
    callback(new Error(ALART), null);
  };
};

/**
 * 行を保存します
 *
 * 保存する方法はrowのrowStateの値により動作が異なります
 * 詳しくはrow-states.jsを参照してください
 * 更新行または削除行は行番号(rowId)が含まれる必要があります
 *
 * @method save
 * @param  {String}   table
 * @param  {Object}   row
 * @param  {Boolean}  ifExists
 * @return {Function} saveThunk -> {Object} row
 */
Driver.prototype.save = function save () {
  return function saveThunk (callback) {
    callback(new Error(ALART), null);
  };
};


// コマンドの開始終了は別ファイルに定義
var startAndEnd = require('./startAndEnd');

/**
 * コマンド開始
 * コマンドが実行される前に必ず呼びだす関数
 * 
 * コマンドを実行できる状態になった場合は、activeCallbackが呼ばれます
 * 実行できない場合は、callbackが呼び出されます
 * @method start
 * @param  {Function} callback       結果を返すコールバック関数
 * @param  {Function} activeCallback 実際のコマンドの処理
 */
Driver.prototype.start = startAndEnd.start;

/**
 * コマンド終了
 * コマンドが終了した時に必ず呼び出す関数
 * 
 * 接続を解除します
 * 結果が例外かどうかを自動的に判別します
 * @method end
 * @param  {Function}    callback   結果を返すコールバック関数
 * @param  {Error|Mixed} result     結果もしくは例外
 * @param  {String}      eventName  発行するイベント名
 * @param  {Mixed}       eventValue イベントの値
 */
Driver.prototype.end = startAndEnd.end;

module.exports = exports = Driver;