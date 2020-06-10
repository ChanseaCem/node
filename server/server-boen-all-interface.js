/**
 * Project:boen项目
 * Name：nodejs-websocket后端服务器
 * Dddress：泉州
 * Technology：
 * Date：2019-11-20
 * 匹配github项目：JTECH-CNC-BOEN boen-third
 * Description:J-TACH-CNC boen项目 后端
 */

/**Connect是一个node中间件（middleware）框架。
如果把一个http处理过程比作是污水处理，中间件就像是一层层的过滤网。
每个中间件在http处理过程中通过改写request或（和）response的数据、状态，实现了特定的功能。
中间件就是类似于一个过滤器的东西，在客户端和应用程序之间的一个处理请求和响应的的方法。*/

/**
 * 导入集
 */
var baseReq = {
	connect: require('connect'), //创建连接
	bodyParser: require('body-parser'), //body解析
	util: require('util'),
	mysql: require('mysql'),
	connection: require('mysql').createConnection({
		host: 'localhost',
		user: 'root',
		password: '123456',
		database: 'boen'
	}),
	ws: require("nodejs-websocket")
}

var boenAll = function() {
	var _this = this;
	this.portOfAjax = 3009;
	this.AllUserData = new Array();
	this.portOf3d = 3888;
	this.setI = null;
	this.setI2 = null;
	this.allStatus = [{
			status: -1,
			text: "未连接(采集)",
			color: '#a5a6a7'
		},
		{
			status: 0,
			text: "采集系统启动",
			color: '#a5a6a7'
		},
		{
			status: 1,
			text: "待机",
			color: '#ffba27'
		}, {
			status: 2,
			text: "加工",
			color: '#32b921'
		}, {
			status: 3,
			text: "告警",
			color: '#dc2929'
		}, {
			status: 4,
			text: "非正常模式",
			color: '#d2ab84'
		}, {
			status: 5,
			text: "暖机",
			color: '#b30df0'
		}, {
			status: 6,
			text: "空跑",
			color: '#b30df0'
		},
		{
			status: 11,
			text: "网络连接成功",
			color: '#d2ab84'
		}, {
			status: 12,
			text: "机床监听成功",
			color: '#32b921'
		}, {
			status: 13,
			text: "机床监听未成功",
			color: '#b30df0'
		}, {
			status: 14,
			text: "多系统并存",
			color: '#0000CB',
			tip: "机床监听成功"
		}, {
			status: 15,
			text: "待修锁机",
			color: '#F84B00',
			tip: "待修锁机"
		}, {
			status: 16,
			text: "待检锁机",
			color: '#EB6F65',
			tip: "待检锁机"
		}
	];
	//this.mac_code_arr = ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26", "C27", "C28", "C29", "C30", "C31", "C32", "C33", "C34", "C35", "C36", "C37", "C38", "C39", "C40", "C41", "C42", "C43", "C44", "C45", "C46", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48", "D49", "D50", "D51", "D52", "D53", "D54", "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20", "E21", "E22", "E23", "E24", "E25", "E26", "E27", "E28", "E29", "E30", "E31", "E32", "E33", "E34", "E35", "E36", "E37", "E38", "E39", "E40", "E41", "E42", "E43", "E44", "E45", "E46", "E47", "E48", "E49", "E50", "E51", "E52", "E53", "E54", "F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "F25", "F26", "F27", "F28", "F29", "F30", "F31", "F32", "F33", "F34", "F35", "F36", "F37", "F38", "F39", "F40", "F41", "F42", "F43", "F44", "F45", "F46", "F47", "F48", "F49", "F50", "F51", "F52", "F53", "F54", "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10", "G11", "G12", "G13", "G14", "G15", "G16", "G17", "G18", "G19", "G20", "G21", "G22", "G23", "G24", "G25", "G28", "G29", "G30", "G31", "G32", "G33", "G34", "G35", "G36", "G37", "G38", "G39", "G40", "G41", "G42", "G43", "G44", "G45", "G46", "G47", "G48", "G49", "G50", "G51", "G52", "G53", "G54", "H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "H11", "H12", "H13", "H14", "H15", "H16", "H17", "H18", "H19", "H20", "H21", "H22", "H23", "H24", "H25", "H26", "H27", "H28", "H29", "H30", "H31", "H32", "H33", "H34", "H35", "H36", "H37", "H38", "H39", "H40", "H41", "H42", "H43", "H44", "H45", "H46", "H47", "H48", "H49", "H50", "H51", "H52", "H53", "H54", "I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08", "I09", "I10", "I11", "I12", "I13", "I14", "I15", "I16", "I17", "I18", "I19", "I20", "I21", "I22", "I23", "I24", "I25", "I26", "I27", "I28", "I29", "I30", "I31", "I32", "I33", "I34", "I35", "I36", "I37", "I38", "I39", "I40", "I41", "I42", "I43", "I44", "I45", "I46", "I47", "I48", "I49", "I50", "I51", "I52", "I53", "I54", "J01", "J02", "J03", "J04", "J05", "J06", "J07", "J08", "J09", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21", "J22", "J23", "J24", "J25", "J26", "J27", "J28", "J29", "J30", "J31", "J32", "J33", "J34", "J35", "J36", "J37", "J38", "J39", "J40", "J41", "J42", "J43", "J44", "J45", "J46", "J47", "J48", "J49", "J50", "J51", "J52", "J53", "J54", "K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K15", "K16", "K17", "K18", "K19", "K20", "K21", "K22", "K23", "K24", "K25", "K26", "K27", "K28", "K29", "K30", "K31", "K32", "K33", "K34", "K35", "K36", "K37", "K38", "K39", "K40", "K41", "K42", "K43", "K44", "K45", "K46", "K47", "K48", "K49", "K50", "K51", "K52", "K53", "K54", "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20", "M21", "M22", "M23", "M24", "M25", "M26", "M27", "M28", "M29", "M30", "M31", "M32", "M33", "M34", "M35", "M36", "M37", "M38", "M39", "M40", "M41", "M42", "M43", "M44", "M45", "M46", "M47", "M48", "M49", "M50", "M51", "M52", "M53", "M54", "N01", "N02", "N03", "N04", "N05", "N06", "N07", "N08", "N09", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22", "N23", "N24", "N25", "N26", "N27", "N28", "N29", "N30", "N31", "N32", "N33", "N34", "N35", "N36", "N37", "N38", "N39", "N40", "N41", "N42", "N43", "N44", "N45", "N46", "N47", "N48", "N49", "N50", "O01", "O02", "O03", "O04", "O05", "O06", "O07", "O08", "O09", "O10", "O11", "O12", "O13", "O14", "O15", "O16", "O17", "O18", "O19", "O20", "O21", "O22", "O23", "O24", "O25", "O26", "O27", "O28", "O29", "O30", "O31", "O32", "O33", "O34", "O35", "O36", "O37", "O38", "O39", "O40", "O41", "O42", "O43", "O44", "O45", "O46", "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14"]
	//this.mac_code_arr = ["M103", "M104", "M105", "M106", "M107", "M108", "M109", "M110", "M111", "M112", "M113", "M114", "M115", "M116", "M117", "M118", "M119", "M120", "M121", "M122", "M123", "M124", "M125", "M126", "M127", "M128", "M129", "M130", "M131", "M132", "M133", "M134", "M135", "M136", "M137", "M138", "M139", "M140", "M141", "M142", "M143", "M144", "M145", "M146", "M147", "M148", "M149", "M150", "M151", "M152", "M153", "M154", "M155", "M156", "M157", "M158", "M159", "M160", "M161", "M162", "M163", "M164", "M165", "M166", "M167", "M168", "M169", "M170", "M171", "M172", "M173", "M174", "M175", "M176", "M177", "M178", "M179", "M180", "M181", "M182", "M183", "M184", "M185", "M186", "M187", "M188", "M189", "M190", "M191", "M192", "M193", "M194", "M195", "M196", "M197", "M198", "M199", "M200", "M201", "M202", "M203", "M204", "M205", "M206", "M207", "M208", "M209", "M210", "M211", "M212", "M213", "M214", "M215", "M216", "M217", "M218", "M219", "M220", "M221", "M222", "M223", "M224", "M225", "M226", "M227", "M228", "M229", "M230"]
	this.mac_code_arr = ["M103", "M104", "M105", "M106", "M107", "M108"]

	this.init = function() {
		this.getDataAjax();
		this.getDataSocket();
	}
	this.getDataAjax = function() {
		baseReq.connect()
			.use(baseReq.bodyParser.json()) //JSON解析
			.use(baseReq.bodyParser.urlencoded({
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
				res.setHeader('Access-Control-Allow-Credentials','true'); //是否允许后续请求携带认证信息（cookies）,该值只能是true,否则不返回
				res.writeHead(200, {
					"Content-Type": "text/plain;charset=utf-8"
				}); //utf-8转码
				next(); //next 方法就是一个递归调用
			})
			//1.1 获取产品
			.use('/api/Product/GetProductList', function(req, res, next) {
				console.log("[获取产品]:");

				var sql = 'SELECT * FROM `boen_getproductList`';
				common.conQueryData(sql, common.newres(), res, next());
			})
			//1.2 3d,获取设备列表
			.use('/api/Machine/GetMachineList', function(req, res, next) {
				console.log("[3d,获取设备列表]:");
				console.log(req.url);
				var sql = "SELECT * FROM `test_3d_maclist`"
				common.conQueryData(sql, common.newres(), res, next());
			})
			//1.4 工艺对应关系
			.use('/api/MacProduct/GetMacProPositon', function(req, res, next) {
				console.log("[工艺对应关系]:");

				var proCode = utils.getUrlParam(req.url).proCode
				console.log(proCode);
				
				var sql = 'SELECT * FROM `boen_gongyiduiyingguanxi`'
				common.conQueryData(sql, common.newres(), res, next());
			})
			//1.5 cpk
			.use('/api/MacProduct/GetMacProPositonCPK', function(req, res, next) {
				console.log("[cpk-最后50组]:");
				console.log(utils.getUrlParam(req.url).maccode);
				console.log(utils.getUrlParam(req.url).proCode);

				var maccode = utils.getUrlParam(req.url).maccode
				var topcount = utils.getUrlParam(req.url).proCode
				
				var sql = "SELECT Cpk,PositionName,CpkType FROM boen_cpk"
				common.conQueryData(sql, common.newres(), res, next());
			})
			//1.6 获取设备型号、负责人、产品信息
			.use('/api/Machine/GetMachineInfo', function(req, res, next) {
				console.log("[获取设备型号、负责人、产品信息]:");
				console.log(utils.getUrlParam(req.url).maccode);

				var maccode = utils.getUrlParam(req.url).maccode
				if(!utils.isnull(maccode)) {
					var sql = 'SELECT * FROM `boen_mac_about` WHERE Code = "' + maccode + '"'
					common.conQueryObj(sql, common.newres(), res, next());
				}else{
					var sql = 'SELECT * FROM `boen_mac_about` WHERE Code = "M1"'
					common.conQueryObj(sql, common.newres(), res, next());
				}
			})
			//1.7  登录
			.use('/api/User/Login', function(req, res, next) {
				console.log("[登录]:");
				console.log(req.url);
				var username = utils.getUrlParam(req.url).name;
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
			//1.12  获取刀具规格列表
			.use('/api/MacToolDetectData/GetToolSpecList', function(req, res, next) {
				console.log("[获取刀具规格列表]:");
				console.log(req.url);
				var sql = "SELECT ID,SpecCode,SpecName,SpecType FROM `boen_daojumotoushuju_list`"
				common.conQueryData(sql, common.newres(), res, next());
			})
			//1.13 获取刀具规格详情
			.use('/api/MacToolDetectData/GetToolSpec', function(req, res, next) {
				console.log("[获取刀具规格详情]:");
				console.log(utils.getUrlParam(req.url).id);
				var sql = 'SELECT SpecName,Manufacturer,Batch FROM `boen_daojumotoushuju_list` WHERE id = "' + utils.getUrlParam(req.url).id + '"'
				common.conQueryObj(sql, common.newres(), res, next());
			})
			//1.14 刀具磨头数据 页面 - 获取刀具规格检测数据最新一条
			.use('/api/MacToolDetectData/GetMacToolDetectionLast', function(req, res, next) {
				console.log("[获取刀具规格检测数据最新一条]:");
				console.log(req.url);
				var sql = "SELECT ID,SpecCode,SpecName,SpecType,Manufacturer,Batch FROM `boen_daojumotoushuju_list`"
				common.conQueryData(sql, common.newres(), res, next());
			})
			//2.1 告警页面-告警内容
			.use('/api/DetectAlarm/GetDetectAlarmList', function(req, res, next) {
				var para = utils.getUrlParam(req.url);
				console.log("[告警页面-告警内容]:",para.timetype,para.alarmtype);

				var r = Math.random() * 48;
				var sql = 'SELECT * FROM `boen-gaojing-gaojingneirong` WHERE idlist < ' + r;
				common.conQueryData(sql, common.newres(), res, next());
			})
			//2.2 spc
			.use('/api/MacDetectData/GetMacPositionDetectionList', function(req, res, next) {
				var para = utils.getUrlParam(req.url);
				console.log("[spc]:",para.machineCode,para.productCode,para.position);
				
//				var data = {"IsSuccess":true,"Extensions":"","Value":[{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.022,"DetectionTime":"2019/10/28 15:16:36","CompValue":0,"MacCode":"M00"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.043,"DetectionTime":"2019/10/28 15:14:50","CompValue":0,"MacCode":"M360"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.023,"DetectionTime":"2019/10/28 15:14:31","CompValue":0,"MacCode":"M266"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.052,"DetectionTime":"2019/10/28 15:14:13","CompValue":0,"MacCode":"M361"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.02,"DetectionTime":"2019/10/28 15:12:12","CompValue":0,"MacCode":"M267"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.017,"DetectionTime":"2019/10/28 15:10:14","CompValue":0,"MacCode":"M269"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.011,"DetectionTime":"2019/10/28 15:08:36","CompValue":0,"MacCode":"M270"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.023,"DetectionTime":"2019/10/28 15:07:50","CompValue":0,"MacCode":"M439"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.024,"DetectionTime":"2019/10/28 15:07:28","CompValue":0,"MacCode":"M438"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.027,"DetectionTime":"2019/10/28 15:06:53","CompValue":0,"MacCode":"M437"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.024,"DetectionTime":"2019/10/28 15:06:38","CompValue":0,"MacCode":"M271"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.023,"DetectionTime":"2019/10/28 15:06:28","CompValue":0,"MacCode":"M436"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.022,"DetectionTime":"2019/10/28 15:06:07","CompValue":0,"MacCode":"M435"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.024,"DetectionTime":"2019/10/28 15:05:45","CompValue":0,"MacCode":"M434"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.038,"DetectionTime":"2019/10/28 15:05:17","CompValue":0,"MacCode":"M433"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.027,"DetectionTime":"2019/10/28 15:04:56","CompValue":0,"MacCode":"M432"},{"QRCode":"C06","CECode":"TK006","QC":"LI","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.007,"DetectionTime":"2019/10/28 15:04:37","CompValue":0,"MacCode":"M248"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.021,"DetectionTime":"2019/10/28 15:04:29","CompValue":0,"MacCode":"M430"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.033,"DetectionTime":"2019/10/28 15:03:59","CompValue":0,"MacCode":"M429"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.018,"DetectionTime":"2019/10/28 15:03:31","CompValue":0,"MacCode":"M428"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.014,"DetectionTime":"2019/10/28 15:02:39","CompValue":0,"MacCode":"M427"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.021,"DetectionTime":"2019/10/28 15:02:02","CompValue":0,"MacCode":"M426"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.043,"DetectionTime":"2019/10/28 15:01:38","CompValue":0,"MacCode":"M385"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.033,"DetectionTime":"2019/10/28 15:01:00","CompValue":0,"MacCode":"M384"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.028,"DetectionTime":"2019/10/28 15:00:20","CompValue":0,"MacCode":"M383"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.023,"DetectionTime":"2019/10/28 15:00:10","CompValue":0,"MacCode":"400"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.028,"DetectionTime":"2019/10/28 14:59:49","CompValue":0,"MacCode":"M382"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.032,"DetectionTime":"2019/10/28 14:59:37","CompValue":0,"MacCode":"397"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.035,"DetectionTime":"2019/10/28 14:59:19","CompValue":0,"MacCode":"M381"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.032,"DetectionTime":"2019/10/28 14:59:07","CompValue":0,"MacCode":"M397"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.016,"DetectionTime":"2019/10/28 14:58:44","CompValue":0,"MacCode":"M425"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.051,"DetectionTime":"2019/10/28 14:58:19","CompValue":0,"MacCode":"M470"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.046,"DetectionTime":"2019/10/28 14:57:45","CompValue":0,"MacCode":"361"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.036,"DetectionTime":"2019/10/28 14:57:42","CompValue":0,"MacCode":"M424"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.037,"DetectionTime":"2019/10/28 14:57:05","CompValue":0,"MacCode":"M423"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.038,"DetectionTime":"2019/10/28 14:56:37","CompValue":0,"MacCode":"M380"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.03,"DetectionTime":"2019/10/28 14:56:08","CompValue":0,"MacCode":"M379"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.016,"DetectionTime":"2019/10/28 14:56:08","CompValue":0,"MacCode":"M422"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.026,"DetectionTime":"2019/10/28 14:55:37","CompValue":0,"MacCode":"421"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.027,"DetectionTime":"2019/10/28 14:55:19","CompValue":0,"MacCode":"M378"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.028,"DetectionTime":"2019/10/28 14:55:13","CompValue":0,"MacCode":"M421"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.031,"DetectionTime":"2019/10/28 14:54:51","CompValue":0,"MacCode":"M377"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.049,"DetectionTime":"2019/10/28 14:54:23","CompValue":0,"MacCode":"M376"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.031,"DetectionTime":"2019/10/28 14:53:53","CompValue":0,"MacCode":"M375"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.031,"DetectionTime":"2019/10/28 14:53:25","CompValue":0,"MacCode":"M374"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.046,"DetectionTime":"2019/10/28 14:52:50","CompValue":0,"MacCode":"M373"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.046,"DetectionTime":"2019/10/28 14:51:17","CompValue":0,"MacCode":"M372"},{"QRCode":"C06","CECode":"TZ005","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.023,"DetectionTime":"2019/10/28 14:51:09","CompValue":0,"MacCode":"0"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.031,"DetectionTime":"2019/10/28 14:50:41","CompValue":0,"MacCode":"M370"},{"QRCode":"C06","CECode":"TZ003","QC":"小陈","Positon":null,"StandardValue":0,"UpperLimit":0.06,"LowerLimit":0,"DetectionValue":0.031,"DetectionTime":"2019/10/28 14:50:12","CompValue":0,"MacCode":"M369"}]}
//				
//				var val = data.Value;
//				for(var i=0,j=2550;i<val.length;i++){
//					var sql = 'INSERT INTO boen_spc VALUES('+(j++)+',"C06-YN-CNC2","'+val[i].CECode
//					+'",'+val[i].CompValue+',"'
//					+val[i].DetectionTime+'",'
//					+val[i].DetectionValue+','
//					+val[i].LowerLimit+',"'
//					+val[i].MacCode+'","BR轮廓","'+val[i].QC+'","'
//					+val[i].QRCode+'",'
//					+val[i].StandardValue+','
//					+val[i].UpperLimit+')'
//					common.conQueryObj(sql, common.newres(), res, next());
//				}
//				var sql = 'SELECT * from boen_spc';
				var sql = 'SELECT * from boen_spc WHERE Positon = "'+unescape(para.position)+'" and prodCode = "'+para.productCode+'"'
				common.conQueryData(sql, common.newres(), res, next());
			})
			//2.4 获取进度条数据
			.use('/api/MacStatus/GetMacStatusList', function(req, res, next) {
				console.log("[获取进度条数据]:");
				console.log(utils.getUrlParam(req.url).maccode);

				var maccode = utils.getUrlParam(req.url).maccode
				//		for(var i=900;i<1100;i++){
				//			for(var j = 0;j<6;j++){
				//				var arr = [-1,0,1,2,3,4,5,6,11,12,13,14]
				//				var sid = (Math.random() * arr.length).toFixed(0)
				//				var sql = 'INSERT INTO `boen_jindutiao` VALUES('+i+',"M'+(i)+'",'+sid+',"提示消息'+i+'",'+i+',"'+utils.formatDateTime(new Date())+'")'
				//				console.log(sql)
				//				common.conQueryObj(sql, common.newres(), res, next());
				//			}
				//		}
				//		var arr = []
				//		for(var i=0;i<1100;i++){
				//			var sec = parseInt((Math.random()*86400).toFixed(0));
				//			arr.push(sec)
				//		}
				//		arr.sort(function(a,b){
				//			return a-b
				//		})
				//		console.log(JSON.stringify(arr))
				//		for(var j=0;j<arr.length;j++){
				//			var arr2 = [-1,0,1,2,3,4,5,6,11,12,13,14]
				//			var sid = (Math.random() * arr2.length).toFixed(0)
				//			var sql = 'INSERT INTO `boen_jindutiao` VALUES('+j+',"M'+(j)+'",'+sid+',"提示消息'+j+'",'+j+',"'+utils.getMandonTime(arr[j])+'")'
				//			console.log(sql)
				//			baseReq.connection.query(sql, function(error, results, fields) {
				//				if(error) throw error;
				//				console.log(results)
				//			});
				//		}

				if(!utils.isnull(maccode)) {
					var sql = 'SELECT * FROM `boen_jindutiao` WHERE MCode = "' + maccode + '"'
					baseReq.connection.query(sql, function(error, results, fields) {
						if(error) throw error;
						results.map((item, index) => {
							item.EndTime = "2020-04-02 " + item.EndTime
							return item
						})
						//seg 设备数据历史进度条分段，6段
						var segs = [
							[],
							[],
							[],
							[],
							[],
							[]
						];
						for(var k = 0; k < results.length; k++) {
							segs[results[k].seg].push(results[k])
						}

						res.end(JSON.stringify(common.newres(segs)));
						next()
					});
				} else {
					var sql = 'SELECT * FROM `boen_jindutiao` WHERE MCode = "M282"'
					common.conQueryData(sql, common.newres(), res, next());
				}
			})
			//2.5设备页面-告警前几条
			.use('/api/Machine/GetMachineAlarmTop', function(req, res, next) {
				console.log("[设备页面-告警前几条]:");
				console.log(utils.getUrlParam(req.url).maccode);
				console.log(utils.getUrlParam(req.url).topcount);

				var maccode = utils.getUrlParam(req.url).maccode
				var topcount = utils.getUrlParam(req.url).topcount
				if(!utils.isnull(maccode)) {
					var sql = 'SELECT MachineCode,StatusCode,StatusMsg,StatusTime,IntervalTime FROM `boen_alarm_deviceInfo` WHERE MachineCode = "' + maccode + '"'
					common.conQueryData(sql, common.newres(), res, next());
				}else{
					var sql = 'SELECT MachineCode,StatusCode,StatusMsg,StatusTime,IntervalTime FROM `boen_alarm_deviceInfo` WHERE MachineCode = "M282"'
					common.conQueryData(sql, common.newres(), res, next());
				}
			})
			.listen(_this.portOfAjax);
		console.log('Server started on port ' + _this.portOfAjax + '.');
	}

	this.getDataSocket = function() {

		/**
		 * Dddress：惠州
		 * Technology：three.js
		 * Date：2019-10-19
		 * 匹配github项目：JTECH-CNC-BOEN boen-third
		 * Description:J-TACH-CNC boen项目3d后端
		 */
		baseReq.ws.createServer(function(conn) {
			console.log("New connection" + new Date())

			if(_this.AllUserData.length > 0) {
				_this.AllUserData = [];
				clearInterval(_this.setI);
				clearInterval(_this.setI2);
			}
			_this.AllUserData.push(conn);
//			console.log(_this.AllUserData)

			_this.setI = setInterval(function() {
				//		var obj = new Object();
				//		obj.cur_mode = "自动模式";
				//
				//		var len = _this.allStatus.length;
				//		var random = Math.round(Math.random() * len) % len;
				//		obj.cur_status = random;
				//		obj.pre_status = random;
				//
				//		obj.dur_time = 960;
				//
				//		var len_code = _this.mac_code_arr.length - 1;
				//		var random_code = _this.mac_code_arr[Math.round(Math.random() * len_code)];
				//		obj.mac_code = random_code;
				//
				//		obj.pub_time = 1570757853;
				//		
				//		var len_tus = _this.allStatus.length - 1;
				//		obj.txt_cur_status = _this.allStatus[Math.round(Math.random() * len_tus)].text + ",模式:自动模式";
				//		obj.txt_pre_status = _this.allStatus[Math.round(Math.random() * len_tus)].text + ",模式:自动模式";
				//		if(obj.cur_status == 6){
				//		console.log(obj)
				//		}

				var obj = new Object();
				var len_code = _this.mac_code_arr.length - 1;
				var random_code = _this.mac_code_arr[Math.round(Math.random() * len_code)];
				obj.MachineCode = random_code;

				var len = _this.allStatus.length;
				var r = Math.round(Math.random() * len) % len;
				obj.StatusID = _this.allStatus[r].status;
				obj.StatusMsg = _this.allStatus[r].text;

				obj.CreateTime = new Date();
				obj.CurMode = Math.random() > 0.5 ? "自动模式" : "手动模式";

				var o = new Object();
				o.Value = obj;
				o.DataType = 1; //用以判断在非当前3d的iframe（客户端），也能持续刷新3d视图
				//console.log(o)

				if(!utils.isnull(_this.AllUserData[0].readyState)) {
					_this.AllUserData[0].sendText(JSON.stringify(o))
				}
			}, 1000);

			conn.on("text", function(str) {
				//当前端发消息给后端，后端进行返回数据（锁机解锁）
				console.log(str)
				if(str.indexOf("MacLock") > -1) {
					var obj = new Object();
					var len_code = _this.mac_code_arr.length - 1;
					var random_code = _this.mac_code_arr[Math.round(Math.random() * len_code)];
					obj.MachineCode = random_code;

					obj.Result = Math.random() > 0.5 ? 1 : 0;

					var o = new Object();
					o.Value = obj;
					o.DataType = 2; //用以反馈锁机-解锁

					if(!utils.isnull(_this.AllUserData[0].readyState)) {
						_this.AllUserData[0].sendText(JSON.stringify(o))
					}
				} else if(str.indexOf("MacStatus") > -1) {
					//机械坐标
					var DataType4 = {
						"DataType": 4,
						"Value": {
							"MachineCode": "M103",
							"Unit": 0,
							"X": Math.random().toFixed(3) * 100,
							"Y": Math.random().toFixed(3) * 100,
							"Z": Math.random().toFixed(3) * 100,
							"PubTime": new Date()
						}
					}

					//设备负载信息
					var DataType8 = {
						"DataType": 8,
						"Value": {
							"MachineCode": "M18",
							"XLoad": Math.random().toFixed(3) * 100,
							"YLoad": Math.random().toFixed(3) * 100,
							"ZLoad": Math.random().toFixed(3) * 100,
							"SpindleLoad": Math.random().toFixed(3) * 100,
							"PubTime": Math.random() > 0.5 ? "1970-01-19 16:22:33" : "2000-01-19 10:12:13"
						}
					}

					//10：设备进给、转速、倍率信息
					var DataType10 = {
						"DataType": 10,
						"Value": {
							"MachineCode": "M103",
							"SpeedSpindle": 138,
							"OverrideSpindle": 12000,
							"Feedrate": 0,
							"OverrideFeedrate": 90,
							"OverrideRapid": 128,
							"PubTime": "1970-01-19 16:22:33"
						}
					}

					//刀具使用信息
					var DataType11 = {
						"DataType": 11,
						"Value": {
							"MachineCode": "M103",
							"NumTool": 11,
							"NumProg": 12,
							"FileProg": "C001",
							"TimeDuration": 33,
							"PubTime": "1970-01-19 16:22:33"
						}
					}

					//设备产量计数
					var DataType12 = {
						"DataType": 12,
						"Value": {
							"MachineCode": "M103",
							"CountProduct": 112,
							"NumProgMain": 127,
							"FileProgMain": "C001",
							"PubTime": "1970-01-19 16:22:33"
						}
					}

					if(!utils.isnull(_this.AllUserData[0].readyState)) {
						_this.AllUserData[0].sendText(JSON.stringify(DataType4))
						clearInterval(_this.setI2)
						_this.setI2 = setInterval(function() {
							var DataType8 = {
								"DataType": 8,
								"Value": {
									"MachineCode": "M18",
									"XLoad": Math.random().toFixed(3) * 100,
									"YLoad": Math.random().toFixed(3) * 100,
									"ZLoad": Math.random().toFixed(3) * 100,
									"SpindleLoad": Math.random().toFixed(3) * 100,
									"PubTime": Math.random() > 0.5 ? "1970-01-19 16:22:33" : "2000-01-19 10:12:13"
								}
							}
							if(_this.AllUserData[0]) _this.AllUserData[0].sendText(JSON.stringify(DataType8))
						}, 1000)
						_this.AllUserData[0].sendText(JSON.stringify(DataType10))
						_this.AllUserData[0].sendText(JSON.stringify(DataType11))
						_this.AllUserData[0].sendText(JSON.stringify(DataType12))
					}

				}
			})
			conn.on("close", function(code, reason) {
				console.log("Connection closed")
				// 当用户退出的时候捕捉到退出的用户
				for(var i = 0; i < _this.AllUserData.length; i++) {
					console.log(_this.AllUserData[i])
					if(_this.AllUserData[i].name == conn.name) {
						console.log(_this.AllUserData[i])
						//_this.AllUserData.splice(i, 1);
					}
				}
			})
			conn.on("error", function(err) {
				console.log("Connection error")
				console.log(err)
			})

			function boardcast(str) { // 广播 //
				// server.connections  保存每个连接进来的用户 //
				var obj = JSON.parse(str);
				_this.AllUserData.forEach(function(item) {
					if(item) {
						item.sendText(str)
					}
				})
			}
		}).listen(_this.portOf3d)
		console.log('Server started on port ' + _this.portOf3d + '.');
	}
}

/**
 * 工具集
 */
var utils = {
	/**
	 * 获取地址携带参数
	 * @param {Object} url
	 */
	getUrlParam: function(url) {
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.split("?")[1];
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},

	/**
	 * 判断string是否为空
	 * @param {String} obj
	 */
	isnull: function(obj) {
		if(typeof obj === "undefined" || obj === undefined || obj === null || obj === "") {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 时间格式化
	 * 如：将Thu Sep 20 2018 16:23:03 GMT+0800 (中国标准时间)转换为"2018-09-20 16:23:03"
	 * @param {String} inputTime
	 */
	formatDateTime: function(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	},

	/**
	 * 获取随机姓名
	 * @param {Object} type
	 */
	getUserNameinRandom: function() {
		var xingshi = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张';
		var mingzi = '春夏秋冬风雨雪霜天地苍穹水火冰云冷凉寒热琴棋书画';

		var len = Math.random();
		len = len > 0.5 ? 3 : 2; //姓名长度
		var index_xing = Math.floor(Math.random() * xingshi.length);
		var index_ming = Math.floor(Math.random() * (mingzi.length - 1));
		var name = '';
		if(len == 2) {
			name = xingshi.split('')[index_xing] + mingzi.split('')[index_ming];
		} else {
			name = xingshi.split('')[index_xing] + mingzi.split('')[index_ming] + mingzi.split('')[index_ming + 1];
		}
		if(name.length == 1) {
			console.log(index_ming)
			name += mingzi.split('')[index_ming];
		}
		return name;
	},

	/**
	 * 一天以内的时间秒转化为时间
	 * 如:86400 ==> 23:59:59
	 * @param {Object} seconds
	 */
	getMandonTime: function(seconds) {

		var h = seconds % 3600 === 0 ? seconds / 3600 : Math.floor(seconds / 3600)
		var minute = seconds - h * 3600;
		var m = minute % 60 === 0 ? minute / 60 : Math.floor(minute / 60)
		var s = seconds % 60;

		h = h > 9 ? h : "0" + h;
		m = m > 9 ? m : "0" + m;
		s = s > 9 ? s : "0" + s;
		return h + ":" + m + ":" + s
	}
}

/**
 * 公共方法
 */
var common = {

	/**
	 * sql操作
	 * @param {String} sql
	 */
	conQueryData: function(sql, result, res, fun) {
		baseReq.connection.query(sql, function(error, results, fields) {
			if(error) throw error;
			result.data = results;
			result.Value = results;
			res.end(JSON.stringify(result));
			fun;
		});
	},

	/**
	 * sql操作 返回结果result.data/result.Value为obj对象
	 * @param {String} sql
	 */
	conQueryObj: function(sql, result, res, fun) {
		baseReq.connection.query(sql, function(error, results, fields) {
			if(error) throw error;
			result.data = results[0];
			result.Value = results[0];
			res.end(JSON.stringify(result));
			fun;
		});
	},

	/**
	 * 返回数据
	 * @param {Object} data
	 */
	newres: function(data) {
		return result = {
			"IsSuccess": true,
			"Value": data,
			"code": 200,
			"msg": "success",
			"data": data
		}
	}
}

var BoenAll = new boenAll()
BoenAll.init()