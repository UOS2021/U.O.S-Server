const sync_mysql = require('sync-mysql');
const fs = require('fs');

var sync_connection = new sync_mysql({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '112antkglok!',
    database: 'uos',
    multipleStatements: true
});

exports.changeCategory = function(req, res){
		var category = message.category;
		var change = message.change;

		var sql = `UPDATE restaurant_${message.id} SET category='${change}' WHERE category='${category}'`;
		let results = sync_connection.query(sql);
		console.log("카테고리 변경 완료");
		res.json({status:"GOOD"});
}