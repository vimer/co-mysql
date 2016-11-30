// a simple co wrapper
var slice = [].slice
function wrapper(client) {
	var _query = client.query
	var _getConnection = client.getConnection
	return {

		query: function query() {
			var args = slice.call(arguments)
			return function(callback) {
				args.push(function(err, rows) {
					callback(err, rows)
				})
				_query.apply(client, args)
			}
		},

		getConnection: function getConnection() {
			var args = slice.call(arguments)
			return function(callback) {
				args.push(function(err, conn) {
					if(err) return callback(err)
						callback(err, wrapper(conn))
				})
				_getConnection.apply(client, args)
			}
		},

		release: function release() {
			return function(callback) {
				client.release();
				callback();
			}
		},

		beginTransaction: function beginTransaction() {
			return function(callback) {
				client.beginTransaction(callback)
			}
		},

		commit: function commit() {
			return function(callback) {
				client.commit(callback)
			}
		},

		rollback: function rollback() {
			return function(callback) {
				client.rollback(callback);
			}
		}
	}
}

module.exports = wrapper

