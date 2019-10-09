    var wsuri = "http://127.0.0.1:3000";

    var socket_main =null;
    var socket_sub = null;

    window.onload = function(){

        var search = window.location.search;
        var splitid=getSearchString('splitid',search);

        if(typeof(splitid)!="undefined"){
            //document.getElementById("div2").innerText = "当前页面是分屏页"+splitid;
            //document.getElementById("div3").style.visibility = "hidden";
            console.log(splitid);

            socket_sub = io(wsuri);
            socket_sub.on('connect',function(){
                console.log('分屏已连接')
            });
            socket_sub.on('disconnect',function(){
                console.log('分屏中断');
            });

            socket_sub.on('message', function(msg){
                console.log('message: ' + msg);
				window.location.href =msg;
               // document.getElementById("div2").innerHTML = msg+"<br/>";
            });
        }
		
		var localsg = window.localStorage;
		if (!localsg){
			alert("浏览器支持localstorage");
			return false;
		}else{
			var split = localsg["split"];
			if(split=="true"){
				spliton();
			}
		}
    };

    var spliton = function(){
        console.log("split on!");

        socket_main = io(wsuri);

        socket_main.on('connect',function(){
		    document.getElementById("btn1").value = "已连接";
            document.getElementById("btn1").disabled = true;
		});
        socket_main.on('disconnect',function(){
            document.getElementById("btn1").value = "分屏";
            document.getElementById("btn1").disabled = false;
        });
        socket_main.on('subclose', function(msg){
            console.log('subclose: ' + msg);
            document.getElementById("btn1").value = "分屏";
            document.getElementById("btn1").disabled = false;
			var localsg = window.localStorage;
			localsg.removeItem("split");
        });
        socket_main.on('subopen', function(msg){
            console.log('subopen: ' + msg);
            document.getElementById("btn1").value = "已连接";
            document.getElementById("btn1").disabled = true;
			var localsg = window.localStorage;
			localsg["split"]="true";
        });

		var localsg = window.localStorage;
		localsg["split"]="true";
		window.open("http://localhost:8010/sp?splitid=1","_blank ");

    }
    function send(){
        var msg = document.getElementById("txt1").value;
        socket_main.emit('message',msg);
        // socket_main.emit('hi');
        console.log("send a message:"+msg);
    }

    //key(需要检索的键） url（传入的需要分割的url地址，例：?id=2&age=18）
    function getSearchString(key, Url) {
        var str = Url;
        str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split("&");
        var obj = new Object();
        // 将每一个数组元素以=分隔并赋给obj对象
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
    }
