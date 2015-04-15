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
  + 一度、CONNECTION_STATES.BROKENに設定されるとメソッドを実行できなくなる

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
  不用意にこのメソッドを呼び出すと、実行中のメソッドが結果を取得できなくなります  
  各メソッドが終了してから接続持続時間が経過すると接続が解除されます

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
            + `{name: /foo/}`
            + `{age: {$gt: 10, $lte: 20}}`
            + `{level: {$in: [1, 3, 5]}}`
          + 文字列の一部への一致は正規表現を指定します
          + 以上・以下は$gte・$lte、超・未満は$gt・$ltです
          + 複数の値の内ひとつに該当する場合は$inと配列を指定します
          + MongoDBの[Selector](http://docs.mongodb.org/manual/reference/sql-comparison/)に準拠しています
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
  + 行状態の更新
      + saveメソッドを実行後、行状態を変更します
      + 更新に成功した場合
          + 更新対象が存在した場合、ROW_STATES.SAVE_SUCCESS
          + 更新対象が存在しなかった場合、ROW_STATES.DETACHED
      + 更新に失敗した場合、ROW_STATES.SAVE_FAILURE
      + cocotte-rowを行として更新にした場合は、行状態が即座に書き換えられます
          + 追加・更新の成功し対象行が存在する、ROW_STATES.UNCHANGED
          + 追加・更新の成功し対象行が存在しない、ROW_STATES.DETACHED
          + 追加失敗、ROW_STATES.ADDED
          + 更新失敗、ROW_STATES.MODIFIED
          + 削除成功、ROW_STATES.DETACHED
          + 削除失敗、ROW_STATES.DELETED

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

各値は以下の８つ存在します

  + ROW_STATES.UNCHANGED
      + 変更なし
      + 保存時は何もしない
  + ROW_STATES.ADDED
      + 追加予定
      + 保存時は追加、UNCHANGEDに遷移
      + rowIdが存在する場合はその値の行が存在しない場合に追加、存在する場合は例外発行
      + rowIdが存在しない場合は、追加後にrowIdをオブジェクトに追加
  + ROW_STATES.MODIFIED
      + 変更予定
      + 保存時は更新、UNCHANGEDに遷移
      + 行番号が設定されていない場合や、一致する行が存在しない場合は例外発行
  + ROW_STATES.DELETED
      + 削除予定
      + 保存時は削除、DETACHEDに遷移
      + 行番号が設定されていない場合や、一致する行が存在しない場合は例外発行
  + ROW_STATES.DETACHED
      + 削除済み
      + データベースに存在しない行です
      + 保存時は何もしない
  + ROW_STATES.SAVING
      + 保存中
      + 保存時は何もしない
  + ROW_STATES.SAVE_SUCCESS
      + 保存成功
      + 保存時は何もしない
  + ROW_STATES.SAVE_FAILURE
      + 保存失敗
      + 保存時は何もしない

# 継承クラス実装時

継承クラスを実装する場合は、次のMongoDBのドライバの例で解説します

```
var MongoDB = require('mongodb');
var Driver = require('cocotte-driver');
var helper = require('cocotte-helper');

// クラス
function Mongo (config) {
  // 初期化引数をテストし、プロパティに複製します
  config = config || {};
  helper.copy(config, this);
  Driver.call(this, config);
  var server = new MongoDB.Server(config.host || '127.0.0.1', config.port || 27017);

  //実際のデータベース操作を担当するオブジェクト
  this.db = new MongoDB.Db(config.dbname || 'cocotte', server, {safe: true});
}

// プロパティ情報を設定します
Mongo.properties = {
  host: {
    type: String,
    description: ['ホスト','省略時は127.0.0.1が設定されます']
  },
  port: {
    type: Number,
    description: ['ポート番号', '省略時は27017が設定されます']
  },
  dbname: {
    type: String,
    description: ['データベース名', '省略時はcocotteが設定されます']
  }
};

// ドライバを継承します
helper.inherits(Mongo, Driver);

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

    // 必ずstartメソッドを使用して実処理を記述します
    self.start(callback, function(){

      // 実際のテーブル一覧の取得を処理します
      self.db.collectionNames(function(err, results) {

        // 必ずendメソッドを使用して処理を終了します
        self.end(callback, err || formatTableNames(results));
      });
    });
  };
};

// テーブル一覧を配列に変換します
function formatTableNames(results) {
  return results.reduce(function (x, item) {
    var names = item.name.split('.');
    if (names.length === 2) {
      x.push(names[1]);
    }
    return x;
  }, []);
}

// (他のメソッドは省略)

module.exports = exports = Mongo;
```

メソッドはすべて、callback関数を返す高階関数になっていますが、  
open,closeのメソッドは特に難しいところはありません  
callback関数の第二引数にそれぞれ正しく接続、切断の状態をBooleanで返します

その他のメソッドは、実際にはデータベースに接続できる状態から実装する必要があります  
しかし、これらを愚直に実装するとメソッド本来の処理内容以外に煩雑なソースコードを記述しなくてはいけません  
これらを簡素に記述するために、必ずstart,endメソッドを使用して実装してください  

  + startメソッド
      + 第一引数に結果を返すコールバック関数を指定します  
      + 第二引数に、処理内容を記述した関数を指定します
  + endメソッド
      + 第一引数に結果を返すコールバック関数を指定します
      + 第二引数に、結果を指定します  
          + 結果はメソッドが返したい値もしくは例外オブジェクトを指定します
          + 例外オブジェクトの場合は、例外を発行するように自動的に判別します  
      + 第三引数に、発行するイベントを指定します
          + イベントを発行しない場合は省略可能です
          + 結果に例外オブジェクトが指定された場合は、イベントは発行されません
      + 第四引数に、イベントの発行に伴い通知する値を指定します
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

coモジュールやcocotte-flowモジュールを使用することで、非同期処理を簡単に記述することができます  
同期的な記述が可能になり、保守しやすいソースコードになります  

ただし、ジェネレータをサポートしている必要があり、harmonyオプションを追加してnodeコマンドを実行してください

以下はcocotte-flowモジュールを使用したMongoDBドライバでの行の操作の例です

```
var Driver = require('cocotte-driver-mongo');
var db = new Driver();
var flow = require('cocotte-flow');

flow(function*(){

  var table = 'table1';

  // 追加
  var row = {
    field1: 'foo',
    field2: 100,
    rowState: Driver.ROW_STATES.ADDED
  };
  yield db.save(table, row);

  // 更新
  row.field1 = 'bar';
  row.rowState = Driver.ROW_STATES.MODIFIED;
  yield db.save(table, row);

  // 削除
  row.rowState = Driver.ROW_STATES.DELETED;
  yield db.save(table, row);

  console.log('done');
});
```

cocotte-flowモジュールを使用しない場合は次のようになります  
非同期処理が複数重なるとネストが深くなり可視性が著しく劣ります  
ジェネレータが使用できる環境では前述の方法を推奨します

```
var Driver = require('cocotte-driver-mongo');
var db = new Driver();

var table = 'table1';

// 追加
var row = {
  field1: 'foo',
  field2: 100,
  rowState: Driver.ROW_STATES.ADDED
};
db.save(table, row)(function(err) {
  if (err) {throw err;}

  // 更新
  row.field1 = 'bar';
  row.rowState = Driver.ROW_STATES.MODIFIED;
  db.save(table, row)(function (err) {
    if (err) {throw err;}

    // 削除
    row.rowState = Driver.ROW_STATES.DELETED;
    db.save(table, row)(function (err) {
      if (err) {throw err;}

      console.log('done');
    });
  });
});
```

