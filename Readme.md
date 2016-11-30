```js
var wrapper = require('co-mysql'),
  mysql = require('mysql'),
  co = require('co');

var pool = mysql.createPool(options),
  p = wrapper(pool);

// promise
p.query('SELECT 1').then(...).catch(...);

// co
co(function*() {
  var rows = yield p.query('SELECT 1');

  var conn;
  try {
	//getConnection
	conn = yield pool.getConnection();
	yield conn.beginTransaction();
	//....
	yield conn.commit();
    yield conn.release();
  } catch (e) {
	yield conn.rollback();
  }

})();
```
