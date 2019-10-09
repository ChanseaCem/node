var ws = require("nodejs-websocket")
var AllUserData = new Array();
var port = 3000;

var server = ws.createServer(function(conn) {
	console.log("New connection --------------------" + new Date())
	AllUserData.push({"conn":conn,"flag":null})
	conn.on("text", function(str) {
		console.log("Received " + new Date());
		console.log("Received " + str)
		console.log("Received " + conn.key)
		var obj = JSON.parse(str);
		console.log(AllUserData)
		
		
		for(var i=0;i<AllUserData.length;i++){
			if(obj.type == "main" || obj.type == "son"){
				if(AllUserData[i]&&AllUserData[i].flag == null&&AllUserData[i].conn == conn){
					AllUserData[i].flag = obj.type;
					AllUserData[i].id = obj.type + Math.random().toFixed(6)*100000;
				}
			}
		}
		
		
		var temp = [],index = 0;
		for(var i=0;i<AllUserData.length;i++){
			if(AllUserData[i]&&AllUserData[i].conn.readyState == 1){
				temp[index++] = AllUserData[i];
			}
		}
		AllUserData = [];
		AllUserData = temp;
		boardcast(str);
	})
	conn.on("close", function(code, reason) {
		console.log("Connection closed")
		// 当用户退出的时候捕捉到退出的用户
		for(var i = 0 in AllUserData) {  
			if(AllUserData[i].conn == conn) {
				console.log(AllUserData[i].id + " 退出了")
			}
		}
	})
	conn.on("error", function(err) {
		console.log("Connection error")
		console.log(err)
	})

	function boardcast(str) { // 广播
		console.log(conn.key)
		var user = null;
		AllUserData.forEach(function(item) {
			if(item&&item.conn&&item.conn.readyState == 1) {
				if(item.conn.key == conn.key){
					user = item;
				}
			}
		})
		console.log(user)
		
		var s = JSON.parse(str)
		AllUserData.forEach(function(item) {
			if(item&&item.conn&&item.conn.readyState == 1) {
				if(!s.type){//如果是type表示初始发送标志,不通知任何人
					
					//总共3种:父-->子,子-->父,子--子
					if(item.flag != "main"||item.conn.key != conn.key){
						item.conn.sendText(str)
					}
				}
			}
		})
	}
}).listen(port)
console.log('Server started on port ' + port + '.');