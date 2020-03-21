/**
 * Project:翰宏 手机端 app项目
 * Name：nodejs-websocket后端服务器
 * Dddress：泉州
 * Date：2019-12-03
 * 匹配github项目：J-TACH-CNC-glass_min glass_min
 * Description:J-TACH-CNC-glass_min 玻璃间 手机端app的各种数据请求
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
var port = "3001";

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
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin||"http://localhost:3001"); //允许任何源*，这里指定源
		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); //允许任何方法
		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token'); //允许任何类型
		res.setHeader('Access-Control-Allow-Credentials','true'); //是否允许后续请求携带认证信息（cookies）,该值只能是true,否则不返回
		res.writeHead(200, {
			"Content-Type": "text/plain;charset=utf-8"
		}); //utf-8转码
		next(); //next 方法就是一个递归调用
	})
	//登录
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
	//1.1.1.	工艺相关信息
	.use('/v1/cnc/quality/technics_info', function(req, res, next) {
		console.log("[工艺相关信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `processcorrespondence`';
		conQueryData(sql, newres(), res, next());
	})
	//1.1.2.	工艺对应关系
	.use('/v1/cnc/quality/technics_ref', function(req, res, next) {
		console.log("[工艺对应关系]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `relationshiptable`';
		conQueryData(sql, newres(), res, next());
	})
	//1.1.3.	工序能力直方图
	.use('/v1/cnc/quality/process_ability', function(req, res, next) {
		console.log("[工序能力直方图]:");
		console.log(req.body);
		var con = "";
		if(!isnull(req.body.request)) {
			con = req.body.request.mac_code;
		}
		var sql = 'SELECT * FROM `ability` where mac_code = "' + con + '"';
		conQueryData(sql, newres(), res, next());
	})
	//1.1.4.	尺度精度变化趋势图
	.use('/v1/cnc/quality/detection_change', function(req, res, next) {
		console.log("[尺度精度变化趋势图]:");
		console.log(req.body);
		var con = "";
		if(!isnull(req.body.request)) {
			con = req.body.request.mac_code;
		}
		var sql = 'SELECT * FROM `sizechange` where mac_code = "' + con + '"';
		conQueryData(sql, newres(), res, next());
	})
	//1.1.5.	CPK数据
	.use('/v1/cnc/quality/cpk', function(req, res, next) {
		console.log("[CPK数据]:");
		console.log(req.body);
		var con = "";
		if(!isnull(req.body.request)) {
			con = req.body.request.mac_code;
		}
		var sql = 'SELECT * FROM `cpk` where mac_code = "' + con + '"';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.1.	前7天告警时间统计Top10
	.use('/v1/cnc/statistics/pre_7days_alarm_time_total', function(req, res, next) {
		console.log("[前7天告警时间统计Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 1';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.2.	前3周告警时间统计Top10
	.use('/v1/cnc/statistics/pre_3weeks_alarm_time_total', function(req, res, next) {
		console.log("[前3周告警时间统计Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 2';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.3.	前3月告警时间统计Top10
	.use('/v1/cnc/statistics/pre_3months_alarm_time_total', function(req, res, next) {
		console.log("[前3月告警时间统计Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 3';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.4.	前7天告警信息统计Top10
	.use('/v1/cnc/statistics/pre_7days_alarm_info_total', function(req, res, next) {
		console.log("[前7天告警信息统计Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 1';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.5.	前3周告警信息统计Top10
	.use('/v1/cnc/statistics/pre_3weeks_alarm_info_total', function(req, res, next) {
		console.log("[前3周告警信息统计Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 2';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.6.	前3月告警信息Top10
	.use('/v1/cnc/statistics/pre_3months_alarm_info_total', function(req, res, next) {
		console.log("[前3月告警信息Top10]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarms` where type = 3';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.7.	前7天状态统计
	.use('/v1/cnc/statistics/pre_7days_status_total', function(req, res, next) {
		console.log("[前7天状态统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `statuscounts` where type = 1';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.8.	前3周状态统计
	.use('/v1/cnc/statistics/pre_3weeks_status_total', function(req, res, next) {
		console.log("[前3周状态统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `statuscounts` where type = 2';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.9.	前3月状态统计
	.use('/v1/cnc/statistics/pre_3months_status_total', function(req, res, next) {
		console.log("[前3月状态统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `statuscounts` where type = 3';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.10.	前7天产量统计
	.use('/v1/cnc/statistics/pre_7days_harv_total', function(req, res, next) {
		console.log("[前7天产量统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `productcounts` where type = 1';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.11.	前3周产量统计
	.use('/v1/cnc/statistics/pre_3weeks_harv_total', function(req, res, next) {
		console.log("[前3周产量统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `productcounts` where type = 2';
		conQueryData(sql, newres(), res, next());
	})
	//1.2.12.	前3月产量统计
	.use('/v1/cnc/statistics/pre_3months_harv_total', function(req, res, next) {
		console.log("[前3月产量统计]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `productcounts` where type = 3';
		conQueryData(sql, newres(), res, next());
	})
	//1.3.2.	获取车间某天整体OEE信息
	.use('/v1/cnc/workshop/cur_work_shop_oee', function(req, res, next) {
		console.log("[获取车间某天整体OEE信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `oee`';
		conQueryData(sql, newres(), res, next());
	})
	//1.3.7.	获取车间计划与实际产量信息
	.use('/v1/cnc/workshop/cur_plan_act_harv', function(req, res, next) {
		console.log("[获取车间计划与实际产量信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `planandproductinfo`';
		conQueryData(sql, newres(), res, next());
	})
	//1.3.8.	获取车间设备信息
	.use('/v1/cnc/workshop/work_shop_mac_info', function(req, res, next) {
		console.log("[获取车间设备信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `status3d`';
		conQueryData(sql, newres(), res, next());
	})
	//1.4.2.	获取设备某天的状态条明细信息
	.use('/v1/cnc/device/mac_status_bar_list', function(req, res, next) {
		console.log("[获取设备某天的状态条明细信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `statusalllist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.4.3.	获取设备某天状态统计信息
	.use('/v1/cnc/device/mac_status_bar_total', function(req, res, next) {
		console.log("[获取设备某天状态统计信息]:");
		console.log(req.body);
		var con = "";
		if(!isnull(req.body.request)) {
			con = req.body.request.cur_date;
		}
		var sql = 'SELECT * FROM `statusall` where date = "' + con + '"';
		conQueryData(sql, newres(), res, next());
	})
	//1.4.4.	获取设备某天OEE信息
	.use('/v1/cnc/device/cur_mac_oee', function(req, res, next) {
		console.log("[获取设备某天OEE信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `oee`';
		conQueryData(sql, newres(), res, next());
	})
	//1.4.5.	获取设备最新5条告警信息
	.use('/v1/cnc/device/cur_mac_alarm_last5', function(req, res, next) {
		console.log("[获取设备最新5条告警信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `alarmlast5`';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.1.	产品列表
	.use('/v1/cnc/common/product_list', function(req, res, next) {
		console.log("[产品列表]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `prolist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.2.	设备列表
	.use('/v1/cnc/common/mac_list', function(req, res, next) {
		console.log("[通用设备列表]:");
		console.log(req.body);
		var sql = 'SELECT code,id,name FROM `equlistComm` WHERE id = "aaf6387e-9607-41ff-b2b4-93b35fcbc795"';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.3.	刀库列表
	.use('/v1/cnc/common/tool_lib_list', function(req, res, next) {
		console.log("[刀库列表]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `toolliblist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.4.	刀具列表
	.use('/v1/cnc/common/tool_list', function(req, res, next) {
		console.log("[刀具列表]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `toollist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.5.	生产单元
	.use('/v1/cnc/common/getUnitInfo', function(req, res, next) {
		console.log("[生产单元]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `prounitscomm`';
		conQueryData(sql, newres(), res, next());
	})
	//1.5.6.	班次列表
	.use('/v1/cnc/common/getShift', function(req, res, next) {
		console.log("[班次列表]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `shiftscomm`';
		conQueryData(sql, newres(), res, next());
	})
	//1.6.1.	刀具寿命初始化接口
	.use('/v1/cnc/toolLife/getLifeInfo', function(req, res, next) {
		console.log("[刀具寿命初始化接口]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `cuttinglife`';
		conQueryData(sql, newres(), res, next());
	})
	//1.7.1.	刀补位置
	.use('/v1/cnc/tool_loss/tool_comp_position', function(req, res, next) {
		console.log("[刀补位置]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `toolpos`';
		conQueryData(sql, newres(), res, next());
	})
	//1.9.1.	车间实时产出达成率
	.use('/v1/cnc/capacity/getCapacity', function(req, res, next) {
		console.log("[车间实时产出达成率]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `capacity`';
		conQueryData(sql, newres(), res, next());
	})
	//1.9.2.	车间实时设备综合效率分解
	.use('/v1/cnc/capacity/getWorkshopEfficient', function(req, res, next) {
		console.log("[车间实时设备综合效率分解]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `effchart`';
		conQueryData(sql, newres(), res, next());
	})
	//1.9.3.	AR损失TOP5
	.use('/v1/cnc/capacity/getLossArTop5', function(req, res, next) {
		console.log("[AR损失TOP5]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `arlosstop5`';
		conQueryData(sql, newres(), res, next());
	})
	//1.9.4.	PR损失节拍
	.use('/v1/cnc/capacity/getLossPr', function(req, res, next) {
		console.log("[PR损失节拍]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `losspr`';
		conQueryData(sql, newres(), res, next());
	})
	//1.7.2.	刀补数趋势/检测-差值
	.use('/v1/cnc/tool_loss/tool_comp_tendency', function(req, res, next) {
		console.log("[刀补数趋势/检测-差值]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `tool_comp_tendency` where id < 30';
		conQueryData(sql, newres(), res, next());
	})
	//1.10.1.	历史料架信息
	.use('/v1/cnc/materialRack/getHistoryInfo', function(req, res, next) {
		console.log("[历史料架信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `historyinfoofshelflist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.10.2.	根据生产单元获取设备列表
	.use('/v1/cnc/materialRack/getMacListByUnit', function(req, res, next) {
		console.log("[根据生产单元获取设备列表]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `maclist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.10.3.	获取所有料架信息
	.use('/v1/cnc/materialRack/getShelfList', function(req, res, next) {
		console.log("[获取所有料架信息]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `shelflist`';
		conQueryData(sql, newres(), res, next());
	})
	//1.11.1.	获取设备计划与实际产量信息
	.use('/v1/cnc/history/mac_plan_act_harv_history', function(req, res, next) {
		console.log("[获取设备计划与实际产量信息]:");
		console.log(req.body);
		var con = "";
		if(!isnull(req.body.request)) {
			con = req.body.request.cur_date;
		}
		var sql = 'SELECT * FROM `historyprorecord` WHERE shift_date < "' + con + '"';
		conQueryData(sql, newres(), res, next());
	})
	//车间设备列表(独立页面)
	.use('/workshoplist', function(req, res, next) {
		console.log("[车间设备列表（独立页面）]:");
		console.log(req.body);
		var con = -2;
		if(!isnull(req.body.request)) {
			con = req.body.request.tag;
		}
		var sql = 'SELECT * FROM `equipment_list`';
		if(con != -2) {
			sql = 'SELECT * FROM `equipment_list` WHERE statusNum = ' + con;
		}
		console.log(con);
		conQueryData(sql, newres(), res, next());
	})
	//车间设备列表（车间总体状况）
	.use('/v1/cnc/workLayout/getMacListInit', function(req, res, next) {
		console.log("[车间设备列表（车间总体状况）]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `equListofWorkshop`';
		conQueryData(sql, newres(), res, next());
	})
	//待机/告警持续时长
	.use('/v1/cnc/workLayout/getStatusByDateAndStatus', function(req, res, next) {
		console.log("[待机/告警持续时长]:");
		console.log(req.body);
		var sql = 'SELECT * FROM `mactop5list`';
		conQueryData(sql, newres(), res, next());
	})
	.listen(port);
console.log('Server started on port '+ port +'.');

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