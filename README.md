cocotte-driver
======

# はじめに

データベースへの操作を行うドライバのスーパークラス（インターフェース）です  

# プロパティ

## 接続状態

  + プロパティ名 connectionState
  + 型 CONNECTION_STATE
      + 定数がDriver.CONNECTION_STATESに設定されています
      + CONNECTION_STATES.OPENNING : 接続準備中
      + CONNECTION_STATES.OPEND    : 接続中
      + CONNECTION_STATES.CLOSING  : 切断準備中
      + CONNECTION_STATES.CLOSED   : 切断中
      + CONNECTION_STATES.BROKEN   : 壊れている
  + 規定値 CONNECTION_STATES.CLOSED
  + 読取専用です

## 実行メソッド数

  + プロパティ名 activeCount
  + 型 Number
  + 規定値 0
  + 実行中のメソッドの数です
  + 読取専用です

## 接続持続時間

  + プロパティ名 keepTime
  + 型 Number
  + 規定値 300
  + 値はmsです
  + 最後に結果を返してから一定時間を経過した場合に自動的接続がきれるように設定されます

## 再接続時間

  + プロパティ名 retryTime
  + 型 Number
  + 規定値 300
  + 値はmsです
  + 接続を開くのに失敗した場合に、再接続を試みるまでの秒数です

## 再接続最大回数

  + プロパティ名 retryMax
  + 型 Number
  + 規定値 10
  + 接続を開くのに連続して失敗した場合に、何回以上失敗した時にconnectionStateをBROKENに設定するかを決定します

# メソッド

継承クラスは次のメソッドを実装する必要があります  

データベースの操作は非同期動作です  
そのため、メソッドを実行すると全てコールバック関数を返します  
結果を直接返すメソッドではありません  
コールバック関数は、第一引数に例外オブジェクト、第二引数にメソッドの結果を返します  
取得系以外のメソッドを実行後にイベントが発生します  
すべてのメソッドではデータベースに接続できずメソッドの実行が開始できない場合にbrokenが発生することがあります  
brokenイベントは値がありません  

## 接続を開く

  このメソッドを外部から明示的に使用することはありません
  各メソッドの実行時に自動的に接続が開かれます

  + メソッド名 open
  + 引数なし
  + 結果 {Boolean} opened 接続が開いている場合はtrue
      + 既に接続が開いていても例外は発生させません
  + イベント open 値なし
 
## 接続を閉じる

  このメソッドを外部から明示的に使用することはありません
  各メソッドが終了してから一定時間経過すると接続が解除されます

  + メソッド名 close
  + 引数なし
  + 結果 {Boolean} closed 接続が閉じている場合はtrue
      + 既に接続が閉じていても例外は発生させません
  + イベント close 値なし

## テーブル一覧を取得する

  + メソッド名 getTables
  + 引数なし
  + 結果 {Array.String} tableNames テーブル名一覧
  + イベント なし

## テーブルを作成する

  + メソッド名 createTable
  + 引数
      + {String} table  テーブル名
      + {Array}  fields フィールド
        + フィールドの例
        + `[{name: 'name', type: String, max: 10}, {name: 'age', type: Number, max: 200}]`
      + {Boolean} ifExists 存在確認
        + テーブルが存在する場合は、例外を発行せずfalseを返します
  + 結果 {Boolean} created 作成したかどうか
  + イベント createTable
      + 値 `{table: tableName, fields: [field1, field2]}`

## テーブルを削除する

  + メソッド名 dropTable
  + 引数
      + {String}   table  テーブル名
      + {Boolean}  ifExists 存在確認
          + trueの場合は、テーブルが存在しない場合に例外を発生させずに結果にfalseを返します
  + 結果 {Boolean} droped 削除したかどうか
  + イベント dropTable
      + 値 {String} table

## フィールドの一覧を取得する

  + メソッド名 getFields
  + 引数
    + {String} table テーブル名
    + {Boolean} ifExists 存在確認
  + 結果 {Array.String} フィールド名
  + イベント なし

## フィールドを追加する

  + メソッド名 addField
  + 引数
      + {String} table テーブル名
      + {Object} field フィールド
        + フィールドの例
        + `{name; 'name', type: String, max: 10}`
      + {Boolean} ifExists 存在確認
        + trueの場合は、テーブルが存在しない場合や、フィールドが既に存在する場合は例外を発生させずにfalseを返します
  + 結果 {Boolean} added 追加したかどうか
  + イベント addField
      + 値 `{table: tableName, field: schema}`

## フィールドを削除する

  + メソッド名 removeField
  + 引数
      + {String} table テーブル名
      + {String} field フィールド
      + {Boolean} ifExists 存在確認
        + trueの場合は、テーブルが存在しない場合や、フィールドが既に存在する場合は例外を発生させずにfalseを返します
  + 結果 {Boolean} removed 削除したかどうか
  + イベント removeField
      + 値 `{table: tableName, field: fieldName}`

## インデックス一覧を取得する
  + メソッド名 getIndexes
  + 引数
      + {String}   table テーブル名
      + {Boolean}  ifExists 存在確認
          + trueの場合は、テーブルが存在しない場合に例外を発生させずに結果に空配列を返します
  + 結果 {Array.Array} indexes インデックス
      + 以下のような形式です
        + `[ [{field: 'name', acs: true}], [{field: 'entryDate', acs: false}], [{field: 'company', acs: true}, {field: 'dept', acs: true}] ]`
        + テーブルには３つのインデックスが追加されています
        + ２つめのインデックスは、降順です
        + ３つめのインデックスは、複合インデックスです

## インデックスを追加する

  + メソッド名 addIndex
  + 引数
      + {String}   table テーブル名
      + {Array}    index インデックス
          + インデックスの例
          + `[{field: 'name', acs: true}]`
          + `[{field: 'entryDate', acs: false}]`
          + `[{field: 'company', acs: true}, {field: 'dept', acs: true}]`
      + {Boolean}  ifExists 存在確認
          + trueの場合は、テーブルが存在しない場合や既にインデックスが作成されている場合に例外を発生させずに結果にfalseを返します
      + {Boolean}  unique    ユニークインッデクスに設定
  + 結果 {Boolean} added 追加したかどうか
  + イベント addIndex
      + 値 `{table: tableName, index: schema}`

## インデックスを削除する

  + メソッド名 removeIndex
  + 引数
      + {String}  table テーブル名
      + {Array}   index 削除するインデックス
        + インデックスの指定は追加と同じです
      + {Boolean} ifExists 存在確認
          + trueの場合は、テーブルが存在しない場合やインデックスが無い場合は例外を発生させずに結果にfalseを返します
  + 結果 {Boolean} removed 削除したかどうか
  + イベント removeIndex
      + 値 `{table: tableName, index: schema}`

## 行番号を作成する

  + メソッド名 createId
  + 引数
      + {String} table テーブル名
  + 結果 {String} rowId 行番号
  + イベント createId
      + 値 `{table: tableName, rowId: rowId}`

## 複数行を取得する

  + メソッド名 find
  + テーブルやフィールドが存在しない場合は例外が発行されます
  + 引数
      + {String}   table テーブル名
      + {Object}   selector 抽出条件
          + 例は以下のとおり
            + `{name: 'foo'}`
            + `{name: {like: '%foo%'}}`
            + `{age: {gt: 10, lte: 20}}`
            + `{level: [1, 3, 5]}`
          + 以上・以下はgte・lte、超・未満はgt・ltです
          + 複数の値の内ひとつに該当する場合は配列を指定します
      + {Array}    fields 取得フィールド名
          + nullで全てのフィールドを指定したことになります
      + {Array}    sort ソート順
          + ソート順の例
          + `[{field: 'name', acs: true}]`
          + `[{field: 'entryDate', acs: false}]`
          + `[{field: 'company', acs: true}, {field: 'dept', acs: true}]`
          + ２つめは、降順です
          + ３つめは、複数のフィールドです
          + nullでソート順を指定しないことになります
      + {Number}   skip  取得を開始する行を指定します
          + 例えば2を指定すると、結果の3行目から取得します
          + nullで最初の行からの取得を指定することになります
      + {Number}   limit 最大で取得する行数を指定します
          + nullで全ての行を取得します
  + 結果 {Array.Object} rows 取得行
      + 一件も取得できなかった場合は空配列が返されます
  + イベント なし  

## 最初の行を返す

  + メソッド名 getRow
  + テーブルやフィールドが存在しない場合は例外が発行されます
  + 引数
      + {String}   table テーブル名
      + {Object}   selector 抽出条件
          + 条件の指定は複数行を取得する場合と同じです
      + {Array}    fields 取得フィールド名
      + {Array}    sort ソート順
      + {Number}   skip 取得を開始する行を指定します
  + 結果 {Object} row 行
      + 存在しない場合はnullを返します
  + イベント なし

## 最初の行の指定フィールドの値を取得する

  + メソッド名 getValue
  + テーブルやフィールドが存在しない場合はnullが返されます
  + 引数
      + {String}   table テーブル名
      + {Object}   selector 抽出条件
      + {String}   field 指定フィールド
          + 指定したフィールドが存在しない場合は例外が発行されます
      + {Array}    sort ソート順
      + {Number}   skip 取得を開始する行を指定します
  + 結果 {Mixed} value 
      + 行が存在しない場合は例外が発行されます
  + イベント なし

## 行数を取得する

  + メソッド名 count
  + テーブルやフィールドが存在しない場合は例外が発行されます
  + 引数
      + {String}   table テーブル名
      + {Object}   selector 抽出条件
          + 条件の指定は複数行を取得する場合と同じです
  + 結果 {Number} 行数
  + イベント なし

## 行を保存する

  + メソッド名 save
  + 引数
      + {String}   table テーブル名
      + {Object}   row 行
        + 保存する方法はrowのrowStateの値やrowIdにより動作が異なります
        + 詳しくは行状態を参照してください
  + 結果 {Object}  row 行
  + イベント save
      + 値 `{table: tableName, row: row, before: beforeRowState}`
      + beforeのrowStateがADDED,MODIFIED,DELETEDのみイベントが発生します

# 行状態

行状態は、saveメソッドに渡されるオブジェクトに設定されます  
rowStateが設定されていない場合は、saveは例外を発行させます  
更新行または削除行は行番号(rowId)が必ず含まれる必要があります  

```
var row = {
  rowState: Driver.ROW_STATES.ADDED,
  name: 'foo'
};

driver.save(row);
```

各値は以下の５つ存在します

  + ROW_STATES.UNCHANGED
      + 変更なし
      + 実際の値 0
      + 保存時は何もしない
  + ROW_STATES.ADDED
      + 追加予定
      + 実際の値 1
      + 保存時は追加、UNCHANGEDに遷移
      + rowIdが存在する場合はその値の行が存在しない場合に追加、存在する場合は例外発行
      + rowIdが存在しない場合は、追加後にrowIdをオブジェクトに追加
  + ROW_STATES.MODIFIED
      + 変更予定
      + 実際の値 2
      + 保存時は更新、UNCHANGEDに遷移
      + 行番号が設定されていない場合や、一致する行が存在しない場合は例外発行
  + ROW_STATES.DELETED
      + 削除予定
      + 実際の値 3
      + 保存時は削除、DETACHEDに遷移
      + 行番号が設定されていない場合や、一致する行が存在しない場合は例外発行
  + ROW_STATES.DETACHED
      + 削除済み
      + 実際の値 4
      + 保存時は何もしない
  + ROW_STATES.SAVING
      + 保存中
      + 実際の値 5
      + 保存時は何もしない

# 継承クラス実装時

継承クラスを実装する場合は、次のMongoDBのドライバの例で解説します

```
var util = require('util');
var MongoDB = require('mongodb');
var Driver = require('cocotte-driver');

// クラス
function Mongo (config) {
  var server = new MongoDB.Server(config.host || '127.0.0.1', config.port || 27017);

  //実際のデータベース操作を担当するオブジェクト
  this.db = new MongoDB.Db(config.dbname || 'cocotte', server, {safe: true});
}

// ドライバを継承する
util.inherits(Mongo, Driver);

// 接続を開きます
Mongo.prototype.open = function open () {
  var self = this;
  return function openThunk (callback) {
    self.db.open(function (err){
      callback(err, !err);
    });
  };
};

// 接続を閉じます
Mongo.prototype.close = function close () {
  var self = this;
  return function closeThunk (callback) {
    self.db.close(function(err){
      callback(err, !err);
    });
  };
};

//テーブル一覧を取得します
Mongo.prototype.getTables = function getTables() {
  var self = this;

  return function getTablesThunk (callback) {

    // 必ずstartメソッドを使用して実処理を記述する
    self.start(callback, function(){

      // 実際のテーブル一覧の取得処理
      self.db.collectionNames(function(err, results) {

        // 必ずendメソッドを使用して処理を終了する
        self.end(callback, err || formatTableNames(results));
      });
    });
  };
};

// テーブル一覧を配列に変換
function formatTableNames(results) {
  return results.reduce(function (x, item) {
    var names = item.name.split('.');
    if (names.length === 2) {
      x.push(names[1]);
    }
    return x;
  }, []);
}

// 他のメソッドは省略

module.exports = exports = Mongo;
```

open,closeのメソッドは特に難しいところはありません  
callback関数の第二引数にそれぞれ正しく接続、切断の状態をBooleanで返します

その他のコマンドは、データベースに接続できる状態から実装する必要があります  
これらを簡素に記述するために、必ずstart,endメソッドを使用して実装してください  

  + startメソッド
      + 第一引数に結果を返すコールバック関数を指定します  
      + 第二引数に、処理内容を記述します  
  + endメソッド
      + 第一引数に結果を返すコールバック関数を指定します
      + 第二引数に、結果を指定します  
          + 結果に例外オブジェクトを渡すと、例外を発行するように自動的に設定します  
      + 第三引数に、発行するイベントを指定します
          + 省略可能です
          + イベントは、正常な結果を取得したときのみ、値に結果を設定して発行します
      + 第四引数に、イベントの値を指定します
          + 省略可能です
          + 値はメソッド毎に形式が決められています
          + 詳しくは各メソッドのイベントの項を参照してください


実際にテーブル一覧を取得する場合には次のように記述します

```
var db = new Mongo();
db.getTables()(function(err, tables) {
  console.log(err || tables);
});
```

# 非同期処理の簡素な記述方法

coモジュールを使用することで、非同期処理を簡単に記述することができます  
同期的な記述がされているが、実際には非同期で動作するため保守しやすいソースコードになります  

ただし、yieldキーワードをサポートするためには、--harmonyオプションを追加してnodeコマンドを実行してください

```
var co = require('co');
var db = new Mongo();

co(function*(){

  var tables = yield db.getTables();

  var row = {
    name: 'foo',
    rowState: db.ROW_STATES.ADDED
  };

  // 追加
  yield db.save('table1', row);

  row.name = 'bar';
  row.rowState = db.ROW_STATE.MODIFIED;

  // 更新
  yield db.save('table1', row);

})();
```





