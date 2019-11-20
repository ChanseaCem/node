/**
 * Project:boen项目 汇聚部分
 * Name：nodejs-websocket后端服务器-3d服务
 * Dddress：泉州
 * Date：2019-11-20
 * 匹配github项目：J-TECH-CNC-webshow2
 * Description:J-TACH-CNC boen项目 汇聚部分 3d车间布局数据获取服务
 */

var connect = require('connect'); //创建连接
var bodyParser = require('body-parser'); //body解析
var util = require('util'); //url.parse 方法来解析 URL 中的参数
var mysql = require('mysql'); //mysql
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'glass_min'
});
var port = 8080;

var app = connect();
app.use(bodyParser.json()) //JSON解析
	.use(bodyParser.urlencoded({
		extended: true
	}))
	//use()方法还有一个可选的路径字符串，对传入请求的URL的开始匹配。
	//use方法来维护一个中间件队列
	.use(function(req, res, next) {
		//跨域处理
		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin); //req.headers.origin这个是react请求修改的必须
		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); //允许任何方法
		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token'); //允许任何类型
		res.setHeader('Access-Control-Allow-Credentials', 'true'); //允许任何类型
		res.writeHead(200, {
			"Content-Type": "application/json;charset=utf-8"
		}); //utf-8转码
		next(); //next 方法就是一个递归调用
	})
	//登录（登录只是模板）
	.use('/login', function(req, res, next) {
		console.log("[登录]:");
		console.log(req.body);

		var username = "",
			password = "";
		username = req.body.account;
		password = req.body.pwd;

		var sql = 'SELECT count(*) as count FROM `login` WHERE username = "' + username + '" and `password` = "' + password + '"';

		var result = {
			"code": 0,
			"msg": "success",
			"data": []
		}
		connection.query(sql, function(error, results, fields, next) {
			if(error) throw error;
			console.log("results")
			console.log(results)
			if(results[0].count == 1) {
				result.msg = "登录成功";
				result.code = 1;
			} else {
				result.msg = "登录失败";
			}
			res.end(JSON.stringify(result));
			next;
		});
	})
	//
	.use('/dataConverge/chk_detect/mac_list', function(req, res, next) {
		console.log("[mac_list]:");
		console.log(req.body);
		var sql = 'SELECT * FROM testin3d';
		conQueryData(sql, newres(), res, next());
//		for(var i=1;i<10;i++){
//			var sql = 'INSERT INTO `testIn3d` VALUES('+(i+1)
//			+',"M'+i+'","ok",1)'
//			console.log(sql)
//			connection.query(sql);
//		}
	})
	.listen(port);
console.log('Server started on port ' + port);

/**
 * sql操作
 * @param {String} sql
 */
function conQueryData(sql, result, res, fun) {
	connection.query(sql, function(error, results, fields) {
		if(error) throw error;
		result.data = results;
		res.end(JSON.stringify(result));
		fun;
	});
}

/**
 * 返回数据
 * @param {Object} data
 */
function newres(data) {
	return result = {
		"code": 200,
		"msg": "success",
		"data": data
	}
}

/**
 * 判断string是否为空
 * @param {String} obj
 */
function isnull(obj) {
	if(typeof obj == "undefined" || obj == undefined || obj == null || obj == "") {
		return true;
	} else {
		return false;
	}
}