/**
 * Project:express node 服務器搭建
 * Name：nodejs服务器
 * Dddress：泉州
 * Date：2020-03-14
 * 匹配github项目：伯恩
 * Description:J-TACH-CNC-BOEN 登录
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//获取数据库连接对象
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'glass_min'
});
connection.connect()
const port = 3009;

//处理post字段请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//处理跨域请求
app.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//模板
app.get('/', function(req, res) {
	res.send('请求home成功');
})

//模板 post
app.post('/user/login/test', (req, res) => {
	var name = req.body.username;
	var passwd = req.body.password;
	var userStr = `select * from login where username="${name}" and password="${passwd}"`;

	connection.query(userStr, function(err, result) {
		if(err) {
			throw err;
		} else {
			res.send(result)
		}
	})
})

//模板 get
app.get('/user/login/test', (req, res) => {
	var username = getUrlParam(req.url).username;
	var password = getUrlParam(req.url).password;
	var userStr = `select * from login where username="${username}" and password="${password}"`;

	connection.query(userStr, function(err, result) {
		if(err) {
			throw err;
		} else {
			res.send(result)
		}
	})
})

//伯恩登录-测试
app.get('/User/Login', (req, res) => {
	var username = getUrlParam(req.url).name;
	var result = {
		"IsSuccess": true,
		"msg": "success",
		"Value": {
			"Sex": 1,
			"UserCode": "kanban",
			"UserName": "看板"
		}
	}
	res.send(result);

})

app.listen(port, () => {
	console.log('Express server listening on port ' + port);
})

/**
 * 获取地址携带参数
 */
function getUrlParam(url) {
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.split("?")[1];
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * sql操作
 * @param {String} sql
 */
function conQueryData(sql, result, res, fun) {
	connection.query(sql, function(error, results, fields) {
		if(error) throw error;
		result.data = results;
		result.Value = results;
		res.end(JSON.stringify(result));
		fun;
	});
}

/**
 * sql操作 返回结果result.data/result.Value为obj对象
 * @param {String} sql
 */
function conQueryObj(sql, result, res, fun) {
	connection.query(sql, function(error, results, fields) {
		if(error) throw error;
		result.data = results[0];
		result.Value = results[0];
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
		"IsSuccess": true,
		"Value": data,
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
	if(typeof obj === "undefined" || obj === undefined || obj === null || obj === "") {
		return true;
	} else {
		return false;
	}
}