/**
 * Project:boen项目
 * Name：nodejs-websocket后端服务器
 * Dddress：泉州
 * Technology：
 * Date：2019-11-20
 * 匹配github项目：JTECH-CNC-BOEN boen-third
 * Description:J-TACH-CNC boen项目 后端（目前只有几个接口）
 */


/**Connect是一个node中间件（middleware）框架。
如果把一个http处理过程比作是污水处理，中间件就像是一层层的过滤网。
每个中间件在http处理过程中通过改写request或（和）response的数据、状态，实现了特定的功能。
中间件就是类似于一个过滤器的东西，在客户端和应用程序之间的一个处理请求和响应的的方法。*/

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
var port = 3009;

var app = connect()
	.use(bodyParser.json()) //JSON解析
	.use(bodyParser.urlencoded({
		extended: true
	}))
	//use()方法还有一个可选的路径字符串，对传入请求的URL的开始匹配。
	//use方法来维护一个中间件队列
	.use(function(req, res, next) {
		//跨域处理
		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*'); //允许任何源
		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); //允许任何方法
		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token'); //允许任何类型
		res.writeHead(200, {
			"Content-Type": "text/plain;charset=utf-8"
		}); //utf-8转码
		next(); //next 方法就是一个递归调用
	})
	//3d,获取设备列表
	.use('/Machine/GetMachineList', function(req, res, next) {
		console.log("[3d,获取设备列表]:");
		console.log(req.url);
		var sql = "SELECT * FROM `test_3d_maclist`"
		conQueryData(sql, newres(), res, next());
	})
	//登录
	.use('/User/Login', function(req, res, next) {
		console.log("[登录]:");
		console.log(req.url);
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
		res.end(JSON.stringify(result));
		next();
	})
	
	//6.3 获取刀具规格列表
	.use('/api/MacToolDetectData/GetToolSpecList', function(req, res, next) {
		console.log("[获取刀具规格列表]:");
		console.log(req.url);
		var sql = "SELECT ID,SpecCode,SpecName,SpecType FROM `boen_daojumotoushuju_list`"
		conQueryData(sql, newres(), res, next());
	})
	
	//6.4 获取刀具规格详情
	.use('/api/MacToolDetectData/GetToolSpec', function(req, res, next) {
		console.log("[获取刀具规格详情]:");
		console.log(getUrlParam(req.url).id);
		var sql = 'SELECT SpecName,Manufacturer,Batch FROM `boen_daojumotoushuju_list` WHERE id = "'+ getUrlParam(req.url).id +'"'
		conQueryObj(sql, newres(), res, next());
	})
	//6.5获取刀具规格检测数据最新一条
//	.use('/api/MacToolDetectData/GetMacToolDetectionLast', function(req, res, next) {
//		console.log("[5获取刀具规格检测数据最新一条]:");
//		console.log(req.url);
//		var sql = "SELECT ID,SpecCode,SpecName,SpecType,Manufacturer,Batch FROM `boen_daojumotoushuju_list`"
//		conQueryData(sql, newres(), res, next());
//	})
	//告警
	.use('/DetectAlarm', function(req, res, next) {
		console.log(req.url);
		var data2 = {
			"IsSuccess": true,
			"Extensions": "",
			"Value": [{
				"ID": "30e0b54907a045cea5a22b8c5b1d8f14",
				"MachineCode": "M230",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:28"
			}, {
				"ID": "3c2f2085dc4043aea58866040390bfd4",
				"MachineCode": "M229",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:24"
			}, {
				"ID": "333aa9c7d7a944f98e81f7fef5b289eb",
				"MachineCode": "M228",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:21"
			}, {
				"ID": "9eeab06566144d64bf78bb043a343bce",
				"MachineCode": "M227",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:19"
			}, {
				"ID": "f4edeb04305d4d7b9ddfbb3f60c4e6c7",
				"MachineCode": "M226",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:16"
			}, {
				"ID": "bfbaeae4949b4093a47582b5b60a0335",
				"MachineCode": "M225",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:13"
			}, {
				"ID": "625dfff6afc64f1c9186f6916e1370c5",
				"MachineCode": "M224",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:09"
			}, {
				"ID": "f5ce0e59e8394b1b8216519ca465da3d",
				"MachineCode": "M223",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:07"
			}, {
				"ID": "2d593663764449568e8ff20b98a65d93",
				"MachineCode": "M222",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:04"
			}, {
				"ID": "06afeac0ecca4913bb8287cb37b93199",
				"MachineCode": "M221",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:01"
			}, {
				"ID": "7261edcd519e4d93a329f55f679461d2",
				"MachineCode": "M220",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:59"
			}, {
				"ID": "82550aa42a6e495b8b3f2a2f00c84691",
				"MachineCode": "M219",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:54"
			}, {
				"ID": "ffbcdc9d126f4d6a861bd8fc47b1e305",
				"MachineCode": "M218",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:51"
			}, {
				"ID": "b39313718c2d46519e155ce9b6838f40",
				"MachineCode": "M217",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:49"
			}, {
				"ID": "32beca7821c64725af71cd6a25e1e76c",
				"MachineCode": "M216",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:45"
			}, {
				"ID": "44801ced22504b648ab7faafc85ad418",
				"MachineCode": "M215",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:42"
			}, {
				"ID": "2e68a036b58f401b9fe131b8e4b45558",
				"MachineCode": "M214",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:40"
			}, {
				"ID": "b28bbe13c42c4548b1208d64a29fbe76",
				"MachineCode": "M213",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值波动较大；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:38"
			}, {
				"ID": "7efbdcfc5c4c467eb722175378eb0b06",
				"MachineCode": "M212",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:34"
			}, {
				"ID": "85c6b83f83d34901b5cd0a1abeb453bd",
				"MachineCode": "M211",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:31"
			}, {
				"ID": "65220efe1b4348baadab780e075bf1d6",
				"MachineCode": "M210",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:28"
			}, {
				"ID": "7c7bbeb4e2234fe59c9aae24dd28493f",
				"MachineCode": "M209",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:25"
			}, {
				"ID": "c2c95570ff564d5c88e81b33ec06d715",
				"MachineCode": "M208",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:21"
			}, {
				"ID": "6cf125fd8ee04aaab235d7c448a28747",
				"MachineCode": "M207",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:19"
			}, {
				"ID": "1e433190cebc4b8c84bb1c8768dc915d",
				"MachineCode": "M206",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:15"
			}, {
				"ID": "e43ef303d0de418ba29274a86beb6bbb",
				"MachineCode": "M205",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:12"
			}, {
				"ID": "b66df3a2d73242929c530c032fab5f7e",
				"MachineCode": "M204",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:09"
			}, {
				"ID": "1d5041f10219475ead2ed36e36f17d03",
				"MachineCode": "M203",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:07"
			}, {
				"ID": "206d9df952e54558aee1e1a38534e4ab",
				"MachineCode": "M202",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:04"
			}, {
				"ID": "029a7b0026794635881a95749c1a60b8",
				"MachineCode": "M201",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:00"
			}, {
				"ID": "0d8c3bacaf934dde85dbd2baade9b523",
				"MachineCode": "M200",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:58"
			}, {
				"ID": "eb23fd1a24de4189b4dc8093cf665983",
				"MachineCode": "M199",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值波动较大；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:55"
			}, {
				"ID": "8652d293005b44e68c8766fc7609439b",
				"MachineCode": "M198",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:53"
			}, {
				"ID": "7ea401767428435d9d30e259a35d9813",
				"MachineCode": "M197",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:49"
			}, {
				"ID": "16ac4bcb6db54264882b6fe025feb5b4",
				"MachineCode": "M196",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:46"
			}, {
				"ID": "a482ad9cee5242e1a8e65075fd4b86b6",
				"MachineCode": "M195",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:43"
			}, {
				"ID": "09e0895e8d1a48a18a21d7585e154b7c",
				"MachineCode": "M194",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:40"
			}, {
				"ID": "2ef69111debb42df8594c0019ff45015",
				"MachineCode": "M193",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:37"
			}, {
				"ID": "955aa2c3ac8c44958d20815fec3caf4c",
				"MachineCode": "M192",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:34"
			}, {
				"ID": "a0f35da8d46c40ebbc2911266a6b9a01",
				"MachineCode": "M191",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:31"
			}, {
				"ID": "897e5b4334ef4c1abff704e7bcae2f91",
				"MachineCode": "M190",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:27"
			}, {
				"ID": "99ebd0009e264a449632a2b8b56ca506",
				"MachineCode": "M189",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:24"
			}, {
				"ID": "c4e6d54fd52c400cb9c06d26742ae1a2",
				"MachineCode": "M188",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:21"
			}, {
				"ID": "27a4f53857154928b1c58e6de6c6652e",
				"MachineCode": "M187",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:19"
			}, {
				"ID": "f5058ef4e71b4d61b0d6ddd559072cf9",
				"MachineCode": "M186",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续上升；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:15"
			}, {
				"ID": "be0514c3e82d4dd8ab2d1a7a00a9e4a0",
				"MachineCode": "M185",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:13"
			}, {
				"ID": "22b6c684438148fc8ff403367189a5be",
				"MachineCode": "M184",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:10"
			}, {
				"ID": "6a27bfdc3f4d48bc8f83916d70c923f0",
				"MachineCode": "M183",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:06"
			}, {
				"ID": "a0508801a07a419e88b609c7e851b776",
				"MachineCode": "M182",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:42:04"
			}]
		}

		var data1 = {
			"IsSuccess": true,
			"Extensions": "",
			"Value": [{
				"ID": "30e0b54907a045cea5a22b8c5b1d8f14",
				"MachineCode": "M230",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:28"
			}, {
				"ID": "3c2f2085dc4043aea58866040390bfd4",
				"MachineCode": "M229",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:24"
			}, {
				"ID": "333aa9c7d7a944f98e81f7fef5b289eb",
				"MachineCode": "M228",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:21"
			}, {
				"ID": "9eeab06566144d64bf78bb043a343bce",
				"MachineCode": "M227",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:19"
			}, {
				"ID": "f4edeb04305d4d7b9ddfbb3f60c4e6c7",
				"MachineCode": "M226",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:16"
			}, {
				"ID": "bfbaeae4949b4093a47582b5b60a0335",
				"MachineCode": "M225",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:13"
			}, {
				"ID": "625dfff6afc64f1c9186f6916e1370c5",
				"MachineCode": "M224",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:09"
			}, {
				"ID": "f5ce0e59e8394b1b8216519ca465da3d",
				"MachineCode": "M223",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:07"
			}, {
				"ID": "2d593663764449568e8ff20b98a65d93",
				"MachineCode": "M222",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:04"
			}, {
				"ID": "06afeac0ecca4913bb8287cb37b93199",
				"MachineCode": "M221",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:01"
			}, {
				"ID": "7261edcd519e4d93a329f55f679461d2",
				"MachineCode": "M220",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:59"
			}, {
				"ID": "82550aa42a6e495b8b3f2a2f00c84691",
				"MachineCode": "M219",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:54"
			}, {
				"ID": "ffbcdc9d126f4d6a861bd8fc47b1e305",
				"MachineCode": "M218",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:51"
			}, {
				"ID": "b39313718c2d46519e155ce9b6838f40",
				"MachineCode": "M217",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:49"
			}, {
				"ID": "32beca7821c64725af71cd6a25e1e76c",
				"MachineCode": "M216",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:45"
			}, {
				"ID": "44801ced22504b648ab7faafc85ad418",
				"MachineCode": "M215",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:42"
			}, {
				"ID": "2e68a036b58f401b9fe131b8e4b45558",
				"MachineCode": "M214",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:40"
			}, {
				"ID": "b28bbe13c42c4548b1208d64a29fbe76",
				"MachineCode": "M213",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值波动较大；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:38"
			}, {
				"ID": "7efbdcfc5c4c467eb722175378eb0b06",
				"MachineCode": "M212",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:34"
			}, {
				"ID": "85c6b83f83d34901b5cd0a1abeb453bd",
				"MachineCode": "M211",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:31"
			}, {
				"ID": "65220efe1b4348baadab780e075bf1d6",
				"MachineCode": "M210",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:28"
			}, {
				"ID": "7c7bbeb4e2234fe59c9aae24dd28493f",
				"MachineCode": "M209",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:43:25"
			}]
		};

		var data = {
			"IsSuccess": true,
			"Extensions": "",
			"Value": [{
				"ID": "30e0b54907a045cea5a22b8c5b1d8f14",
				"MachineCode": "M230",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:28"
			}, {
				"ID": "3c2f2085dc4043aea58866040390bfd4",
				"MachineCode": "M229",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:24"
			}, {
				"ID": "333aa9c7d7a944f98e81f7fef5b289eb",
				"MachineCode": "M228",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值连续NG；平台定位-X，检测值连续NG；平台长，检测值持续下降；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:21"
			}, {
				"ID": "9eeab06566144d64bf78bb043a343bce",
				"MachineCode": "M227",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:19"
			}, {
				"ID": "f4edeb04305d4d7b9ddfbb3f60c4e6c7",
				"MachineCode": "M226",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；平台长，检测值持续上升；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:16"
			}, {
				"ID": "bfbaeae4949b4093a47582b5b60a0335",
				"MachineCode": "M225",
				"ProductCode": "C07-YN-CNC2_1",
				"AlarmType": 6,
				"Content": "MIC孔底倒角，检测值连续NG；MIC孔正面倒角，检测值连续NG；MIC孔直径，检测值连续NG；外形长2，检测值持续下降；平台定位-X，检测值连续NG；O孔底倒角，检测值连续NG；O孔正面倒角，检测值连续NG；",
				"CreateTime": "2019-10-25T08:44:13"
			}]
		};

		var data3 = {
			"IsSuccess": true,
			"Extensions": "",
			"Value": []
		};

		var data4 = {
			"IsSuccess": false,
			"Extensions": "",
			"Value": []
		};

		var r = Math.random();
		console.log(r)
		var senddata = r > 0.8 ? data : (r > 0.6 ? data1 : (r > 0.4 ? data2 : (r > 0.2 ? data3 : data4)));
		res.end(JSON.stringify(data1));
		next();
	})
	.listen(port);
console.log('Server started on port ' + port + '.');

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
	if(typeof obj == "undefined" || obj == undefined || obj == null || obj == "") {
		return true;
	} else {
		return false;
	}
}