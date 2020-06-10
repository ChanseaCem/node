/**
 * Project:react 汇聚
 * Name：nodejs后端服务器
 * Dddress：泉州
 * StartTime：2020-05-27
 * 匹配github项目：J-TACH-CNC huiju
 * Description:J-TACH-CNC huiju 伯恩后端 汇聚
 */

var connect = require('connect'); //创建连接
var bodyParser = require('body-parser'); //body解析
var util = require('util'); //url.parse 方法来解析 URL 中的参数
var mysql = require('mysql'); //mysql
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'huiju',
	multipleStatements: true
});
var port = "3002";

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
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "http://localhost:3001"); //允许任何源*，这里指定源
		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); //允许任何方法
		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token'); //允许任何类型
		res.setHeader('Access-Control-Allow-Credentials', 'true'); //是否允许后续请求携带认证信息（cookies）,该值只能是true,否则不返回
		res.writeHead(200, {
			"Content-Type": "text/plain;charset=utf-8"
		}); //utf-8转码
		next(); //next 方法就是一个递归调用
	})
	//2.1 获取产品列表
	.use('/chk_detect/api/pro_list', function(req, res, next) {
		console.log("[获取产品列表]:");
		console.log(req.body);
		var sql = 'SELECT product_code FROM `pro_list`';
		conQueryData(sql, newres(), res, next());
	})
	//2.2 获取设备列表
	.use('/chk_detect/api/mac_list', function(req, res, next) {
		console.log("[获取设备列表]:");
		console.log(req.body);
		var sql = 'SELECT mac_code FROM `mac_list` order by mac_code;';
		conQueryData(sql, newres(), res, next());
	})
	//2.3 获取班次列表
	.use('/chk_detect/api/queryShiftName', function(req, res, next) {
		console.log("[获取班次列表]:");
		console.log(req.body);
		var sql = 'SELECT shift_name FROM `shift_list`';
		conQueryData(sql, newres(), res, next());
	})
	//2.4 获取所有组检测NG数量
	.use('/chk_detect/api/team_check_count', function(req, res, next) {
		console.log("[获取所有组检测NG数量]:");
		console.log(req.body);
		var sql = 'SELECT qr,shift_name,product_code FROM `team_check_count`';
		if(req.body.shift_name!=""){
			sql = 'SELECT qr,shift_name,product_code FROM `team_check_count` where shift_name="'+req.body.shift_name+'"';
		}
		conQueryData(sql, newres(), res, next());
	})
	//2.5 获取各个单组检测NG数量详细
	.use('/chk_detect/api/team_check_count_detail', function(req, res, next) {
		console.log("[获取各个单组检测NG数量详细]:");
		console.log(req.body);
		
		var sql = 'SELECT qr,team_check_count_detail.`detect.position` FROM `team_check_count_detail` where pro_code = "' + req.body.product_code + '" AND shift_name = "' + req.body.shift_name + '"';
		if(req.body.shift_name == ""){
			sql = 'SELECT qr,team_check_count_detail.`detect.position` FROM `team_check_count_detail` where pro_code = "' + req.body.product_code + '" AND shift_name = ""';
		}
		conQueryData(sql, newres(), res, next());
	})
	//2.6 获取历史进度条数据
	.use('/chk_detect/api/queryMac_status', function(req, res, next) {
		console.log("[获取进度条数据]:");
		console.log(req.body);

		var maccode = req.body.mac_code;
		var sql = 'SELECT * FROM `jindutiao`'
		if(maccode&&req.body.date) {
			sql = 'SELECT * FROM `jindutiao` WHERE machine_code = "' + maccode + '" and pub_time like "' + req.body.date + '%"'
		}
		conQueryData(sql, newres(), res, next());
	})
	//2.7 获取车间变化数据
	.use('/ae_cnc/chk_detect/mac_list', function(req, res, next) {
		console.log("[获取车间变化数据]:");
		console.log(req.body);

		var sql = 'SELECT * FROM `updateData`'
		conQueryData(sql, newres(), res, next());
	})
	//2.8 获取尺寸精度变化数据
	.use('/chk_detect/api/queryCase_analysis', function(req, res, next) {
		console.log("[获取尺寸精度变化数据]:");
		console.log(req.body);
		var result = {
			"code": 200,
			"msg": "success",
			"data": []
		}
		
		var keys = [{"key":"外形长1"},{"key":"外形长2"},{"key":"外形长3"},{"key":"外形宽1"},{"key":"外形宽3"},{"key":"外形宽2"},{"key":"平台长"},{"key":"平台宽"},{"key":"平台顶边距"},{"key":"平台定位-Y"},{"key":"平台左边距"},{"key":"O孔-Y"},{"key":"O孔真圆度"},{"key":"O孔-X"},{"key":"A孔真圆度"},{"key":"A孔直径"},{"key":"A孔-Y"},{"key":"M孔直径"},{"key":"A孔-X"},{"key":"M孔真圆度"},{"key":"M孔-Y"},{"key":"S孔真圆度"},{"key":"M孔-X"},{"key":"S孔-X"},{"key":"S孔直径"},{"key":"S孔-Y"},{"key":"MIC孔-X"},{"key":"MIC孔真圆度"},{"key":"MIC孔-Y"},{"key":"MIC孔直径"},{"key":"A孔正面倒角"},{"key":"弧高"},{"key":"M孔正面倒角"},{"key":"S孔正面倒角"},{"key":"上企身加倒角"},{"key":"O孔正面倒角"},{"key":"左企身加倒角"},{"key":"MIC孔正面倒角"},{"key":"TL轮廓"},{"key":"BL轮廓"},{"key":"O孔底倒角"},{"key":"弧宽"},{"key":"A孔底倒角"},{"key":"TR轮廓"},{"key":"M孔底倒角"},{"key":"MIC孔底倒角"},{"key":"S孔底倒角"},{"key":"外底倒角上 "},{"key":"外底倒角左  "},{"key":"平台定位-X"},{"key":"O孔直径"},{"key":"BR轮廓"}]
//		var keys = [{"key":"外形长1"},{"key":"外形长2"}]
		
		
		var sql = ""
//		for(let i=0;i<keys.length;i++){
//			sql = 'SELECT * FROM `spc` WHERE `key` = "'+ keys[i].key +'" AND prodCode = "C06-YN-CNC2"'
			sql = 'SELECT * FROM `spc`'
			connection.query(sql, function(error, results, fields) {
				if(error) throw error;
				
				var data = []
				for(let j=0;j<keys.length;j++){
					let obj = new Object();
						obj.data = [];
						index = 0,mac_code = "",prodCode = "";
					for(let i=0;i<results.length;i++){
						if(req.body.mac_code == results[i]['mac_code']&&req.body.product_code == results[i]['prodCode']){
							if(keys[j].key == results[i]['key']){
								obj.data.push({
				                    "detect.cmp_value": results[i]['detect.cmp_value'],
				                    "chk_time": results[i]['chk_time'],
				                    "chk_equ_code": results[i]['chk_equ_code'],
				                    "product_sn": results[i]['product_sn'],
				                    "detect.chk_value": results[i]['detect.chk_value']
				              	})
								index = i;
								mac_code = results[i]['mac_code']
								prodCode = results[i]['prodCode']
							}
						}
					}
					if(req.body.mac_code == mac_code&&req.body.product_code == prodCode){
						obj.key = results[index]['key']
						obj.usl = results[index]['usl']
						obj.lsl = results[index]['lsl']
						obj.std_value = results[index]['std_value']
						data.push(obj)
					}
				}
				result.data = data;
				
				res.end(JSON.stringify(result));
				next()
			});
//			
//			var obj = new Object();
//			obj.key = keys[i].key;
//			
//			sql = 'SELECT `detect.cmp_value`,chk_time,chk_equ_code,product_sn,`detect.chk_value` FROM `spc` WHERE `key` = "'+ keys[i].key +'" AND prodCode = "C06-YN-CNC2"'
//			connection.query(sql, function(error, results, fields) {
//				if(error) throw error;
//				
//				obj.data = results
//				result.data[i] = results;
//				res.end(JSON.stringify(result));
//			});
//			
//			sql = 'SELECT DISTINCT usl FROM `spc` WHERE `key` = "'+ keys[i].key +'" AND prodCode = "C06-YN-CNC2"'
//			connection.query(sql, function(error, results, fields) {
//				if(error) throw error;
//
//				obj.usl = results
//				result.data[i] = results;
//				res.end(JSON.stringify(result));
//			});
//			
//			sql = 'SELECT DISTINCT lsl FROM `spc` WHERE `key` = "'+ keys[i].key +'" AND prodCode = "C06-YN-CNC2"'
//			connection.query(sql, function(error, results, fields) {
//				if(error) throw error;
//
//				obj.lsl = results
//				result.data[i] = results;
//				res.end(JSON.stringify(result));
//			});
//			
//			sql = 'SELECT DISTINCT std_value FROM `spc` WHERE `key` = "'+ keys[i].key +'" AND prodCode = "C06-YN-CNC2"'
//			connection.query(sql, function(error, results, fields) {
//				if(error) throw error;
//
//				obj.std_value = results
//				result.data[i] = results;
//				if(i==keys.length-1){
//					res.end(JSON.stringify(result));
//					next()
//				}
//			});
//			
//		}
//		console.log(sql)
//
//next()
		
	})
	.listen(port);
console.log('Server started on port ' + port + '.');

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

/**
 * 获取地址携带参数
 */
function getUrlParam(url) {
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}