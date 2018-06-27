var ws = require("ws");
var server = new ws.Server({
	// host: ip, // 如果加了host，外部链接不上
	port: 6080,
});

console.log("#######");
function on_server_client_comming(session) {
	session.on("close", function() {
	});

	// error事件
	session.on("error", function(err) {
	});
	// end 

	session.on("message", function(data) {
		console.log("######", data);

		session.send(data);
	});
}
server.on("connection", on_server_client_comming);

var enroll = require("./tyttest/loginFcn.js")//注册调用
var login = require("./tyttest/loginFcn.js") //登录调用
var renew = require("./tyttest/extra/UserManage.js")//数据库更新调用
var socket_io = require('socket.io')
var sio = socket_io(6081);

sio.sockets.on('connection',function(socket){
	console.log("connect called");

	// 注册
	socket.on("your_enroll", function (data) {
		console.log("your_enroll", data);
        enroll.signUp(data.userid,data.password,function(err,vales) {
			if (err) {
				console.log("注册失败");
			}
			else if(vales == 1){
              	console.log('注册成功。');
				socket.emit("your_enroll", vales);
			}
          	else{
              	console.log('用户已存在。');
              	socket.emit("your_enroll", vales);
            }
		});
	});
	// 登录
    socket.on("your_log", function (data) {
		console.log("your_log", data);
		login.login(data.userid,data.password,function(err,vales) {
			if (err) {
				console.log("登录失败");
			}
			else if(vales == 1){
                console.log('用户不存在。');
				socket.emit("your_log", vales);
            }
            else if(vales == 2){
                console.log('密码错误。');
				socket.emit("your_log", vales);
            }
            else{
                console.log('登陆成功。');
				socket.emit("your_log", vales);
            }
		});

	});
  	//score 更新
  	socket.on("your_renew", function (data) {
		console.log("your_renew", data);
		renew.updateScore(data.userid,data.score,function(err,vales) {
          console.log(vales);
			if (err) {
				console.log(err);
			}
			else if(vales == 1){
                console.log('更新成功');
				socket.emit("your_renew", vales);
            }
            else if(vales == 2){
                console.log('不需要更新');
				socket.emit("your_renew", vales);
            }
		});

	});
  //排名
  socket.on("your_see", function (data) {
		renew.scoreRank(function(err,vales) {
			if (err) {
				console.log(err);
			}
			else{
                console.log('查看成功');
                console.log(vales);
				socket.emit("your_see", vales);
            }
            
		});

	});
	// 系统事件
	socket.on('disconnect',function(data){
		console.log("disconnect");		
	});


});
