/**
 * Name：nodejs-websocket后端服务器
 * Dddress：惠州
 * Technology：three.js
 * Date：2019-10-19
 * Description:J-TACH-CNC boen项目3d后端
 * 匹配github项目：JTECH-CNC-BOEN boen-third
 */

var ws = require("nodejs-websocket")
var AllUserData = new Array();
var port = 3888;
var setI = null;

var all = [{
		status: -1,
		text: "未连接(采集)",
		color: '#a5a6a7'
	},
	{
		status: 0,
		text: "0状态",
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
	}
]
//var mac_code_arr = ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26", "C27", "C28", "C29", "C30", "C31", "C32", "C33", "C34", "C35", "C36", "C37", "C38", "C39", "C40", "C41", "C42", "C43", "C44", "C45", "C46", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48", "D49", "D50", "D51", "D52", "D53", "D54", "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20", "E21", "E22", "E23", "E24", "E25", "E26", "E27", "E28", "E29", "E30", "E31", "E32", "E33", "E34", "E35", "E36", "E37", "E38", "E39", "E40", "E41", "E42", "E43", "E44", "E45", "E46", "E47", "E48", "E49", "E50", "E51", "E52", "E53", "E54", "F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "F25", "F26", "F27", "F28", "F29", "F30", "F31", "F32", "F33", "F34", "F35", "F36", "F37", "F38", "F39", "F40", "F41", "F42", "F43", "F44", "F45", "F46", "F47", "F48", "F49", "F50", "F51", "F52", "F53", "F54", "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10", "G11", "G12", "G13", "G14", "G15", "G16", "G17", "G18", "G19", "G20", "G21", "G22", "G23", "G24", "G25", "G28", "G29", "G30", "G31", "G32", "G33", "G34", "G35", "G36", "G37", "G38", "G39", "G40", "G41", "G42", "G43", "G44", "G45", "G46", "G47", "G48", "G49", "G50", "G51", "G52", "G53", "G54", "H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "H11", "H12", "H13", "H14", "H15", "H16", "H17", "H18", "H19", "H20", "H21", "H22", "H23", "H24", "H25", "H26", "H27", "H28", "H29", "H30", "H31", "H32", "H33", "H34", "H35", "H36", "H37", "H38", "H39", "H40", "H41", "H42", "H43", "H44", "H45", "H46", "H47", "H48", "H49", "H50", "H51", "H52", "H53", "H54", "I01", "I02", "I03", "I04", "I05", "I06", "I07", "I08", "I09", "I10", "I11", "I12", "I13", "I14", "I15", "I16", "I17", "I18", "I19", "I20", "I21", "I22", "I23", "I24", "I25", "I26", "I27", "I28", "I29", "I30", "I31", "I32", "I33", "I34", "I35", "I36", "I37", "I38", "I39", "I40", "I41", "I42", "I43", "I44", "I45", "I46", "I47", "I48", "I49", "I50", "I51", "I52", "I53", "I54", "J01", "J02", "J03", "J04", "J05", "J06", "J07", "J08", "J09", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21", "J22", "J23", "J24", "J25", "J26", "J27", "J28", "J29", "J30", "J31", "J32", "J33", "J34", "J35", "J36", "J37", "J38", "J39", "J40", "J41", "J42", "J43", "J44", "J45", "J46", "J47", "J48", "J49", "J50", "J51", "J52", "J53", "J54", "K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K15", "K16", "K17", "K18", "K19", "K20", "K21", "K22", "K23", "K24", "K25", "K26", "K27", "K28", "K29", "K30", "K31", "K32", "K33", "K34", "K35", "K36", "K37", "K38", "K39", "K40", "K41", "K42", "K43", "K44", "K45", "K46", "K47", "K48", "K49", "K50", "K51", "K52", "K53", "K54", "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20", "M21", "M22", "M23", "M24", "M25", "M26", "M27", "M28", "M29", "M30", "M31", "M32", "M33", "M34", "M35", "M36", "M37", "M38", "M39", "M40", "M41", "M42", "M43", "M44", "M45", "M46", "M47", "M48", "M49", "M50", "M51", "M52", "M53", "M54", "N01", "N02", "N03", "N04", "N05", "N06", "N07", "N08", "N09", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22", "N23", "N24", "N25", "N26", "N27", "N28", "N29", "N30", "N31", "N32", "N33", "N34", "N35", "N36", "N37", "N38", "N39", "N40", "N41", "N42", "N43", "N44", "N45", "N46", "N47", "N48", "N49", "N50", "O01", "O02", "O03", "O04", "O05", "O06", "O07", "O08", "O09", "O10", "O11", "O12", "O13", "O14", "O15", "O16", "O17", "O18", "O19", "O20", "O21", "O22", "O23", "O24", "O25", "O26", "O27", "O28", "O29", "O30", "O31", "O32", "O33", "O34", "O35", "O36", "O37", "O38", "O39", "O40", "O41", "O42", "O43", "O44", "O45", "O46", "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14"]
var mac_code_arr = ["M103", "M104", "M105", "M106", "M107", "M108", "M109", "M110", "M111", "M112", "M113", "M114", "M115", "M116", "M117", "M118", "M119", "M120", "M121", "M122", "M123", "M124", "M125", "M126", "M127", "M128", "M129", "M130", "M131", "M132", "M133", "M134", "M135", "M136", "M137", "M138", "M139", "M140", "M141", "M142", "M143", "M144", "M145", "M146", "M147", "M148", "M149", "M150", "M151", "M152", "M153", "M154", "M155", "M156", "M157", "M158", "M159", "M160", "M161", "M162", "M163", "M164", "M165", "M166", "M167", "M168", "M169", "M170", "M171", "M172", "M173", "M174", "M175", "M176", "M177", "M178", "M179", "M180", "M181", "M182", "M183", "M184", "M185", "M186", "M187", "M188", "M189", "M190", "M191", "M192", "M193", "M194", "M195", "M196", "M197", "M198", "M199", "M200", "M201", "M202", "M203", "M204", "M205", "M206", "M207", "M208", "M209", "M210", "M211", "M212", "M213", "M214", "M215", "M216", "M217", "M218", "M219", "M220", "M221", "M222", "M223", "M224", "M225", "M226", "M227", "M228", "M229", "M230"]
var server = ws.createServer(function(conn) {
	console.log("New connection" + new Date())

	if(AllUserData.length > 0) {
		AllUserData = [];
		clearInterval(setI);
	}
	AllUserData.push(conn);
	console.log(AllUserData)

	setI = setInterval(function() {
		//		var obj = new Object();
		//		obj.cur_mode = "自动模式";
		//
		//		var len = all.length;
		//		var random = Math.round(Math.random() * len) % len;
		//		obj.cur_status = random;
		//		obj.pre_status = random;
		//
		//		obj.dur_time = 960;
		//
		//		var len_code = mac_code_arr.length - 1;
		//		var random_code = mac_code_arr[Math.round(Math.random() * len_code)];
		//		obj.mac_code = random_code;
		//
		//		obj.pub_time = 1570757853;
		//		
		//		var len_tus = all.length - 1;
		//		obj.txt_cur_status = all[Math.round(Math.random() * len_tus)].text + ",模式:自动模式";
		//		obj.txt_pre_status = all[Math.round(Math.random() * len_tus)].text + ",模式:自动模式";
		//		if(obj.cur_status == 6){
		//		console.log(obj)
		//		}

		var obj = new Object();
		var len_code = mac_code_arr.length - 1;
		var random_code = mac_code_arr[Math.round(Math.random() * len_code)];
		obj.MachineCode = random_code;

		var len = all.length;
		var r = Math.round(Math.random() * len) % len;
		obj.StatusID = all[r].status;
		obj.StatusMsg = all[r].text;

		obj.CreateTime = new Date();

		console.log(obj)

		AllUserData[0].sendText(JSON.stringify(obj))
	}, 1000);

	conn.on("text", function(str) {

	})
	conn.on("close", function(code, reason) {
		console.log("Connection closed")
		// 当用户退出的时候捕捉到退出的用户
		for(var i = 0; i < AllUserData.length; i++) {
			console.log(AllUserData[i].ws)
			if(AllUserData[i].name == conn.name) {
				console.log(AllUserData[i])
				//				AllUserData.splice(i, 1);
			}
		}
	})
	conn.on("error", function(err) {
		console.log("Connection error")
		console.log(err)
	})

	function boardcast(str) { // 广播 //
		// server.connections  保存每个连接进来的用户 //
		console.log(str);
		var obj = JSON.parse(str);
		console.log(obj);
		console.log(AllUserData);
		AllUserData.forEach(function(item) {
			if(item) {
				console.log(item)
				item.sendText(str)
			}
		})
	}
}).listen(port)
console.log('Server started on port ' + port + '.');