if(window.io == null){ // h5
    window.io = require("socket-io");
}


var net = {
    sio: null,
    self: null,
        
    connect:function(url) {
        self = this;
        
        var opts = {
            'reconnection':true,
            'force new connection': true,
            'transports':['websocket', 'polling']
        }

        this.sio = window.io.connect(url, opts);

        // 监听地城的系统事件
        this.sio.on('reconnect',function(){
            console.log('reconnection');
        });

        // 连接成功
        this.sio.on('connect',function(data){
            self.sio.connected = true;

            console.log("%%%%%%%%%%%%% connect");
            // 事件 + 数据名字
            // self.send("your_log",{userid:'zjcc',password:'866666'});
            // self.send("your_log",{userid: '陈帆', password: '123456'});
            // self.close();
        });
        

        // 断开连接
        this.sio.on('disconnect',function(data){
            console.log("MMMMMdisconnect");
            self.sio.connected = false;
            // self.close();
        });
        
        // 连接失败
        this.sio.on('connect_failed',function (){
            console.log('connect_failed');
        });
        
        
        // 自己定义,如果你向要收那种事件的数据，你就监听这个事件
        //注册
        this.sio.on('your_enroll',function(data){
            console.log("your_enroll", data);
        });
        //登陆
        this.sio.on('your_log',function(data){
            console.log("your_log", data);
        });
        //更新 score
        this.sio.on('your_renew',function(data){
            console.log("your_renew", data);
        });
        //排名
        this.sio.on('your_see',function(data){
            console.log("your_see", data);
        });
    },
    

    // 发送数据: 事件+数据的模型;
    send:function(event,data){
        if(this.sio.connected){
            this.sio.emit(event,data);  // 触发一个网络事件，名字 + 数据body ---> 服务器;              
        }
        
    },

    // 关闭socket
    close:function(){
        if(this.sio && this.sio.connected){
            this.sio.connected = false;
            this.sio.disconnect(); // API
            this.sio = null;
            console.log("disconnect");
        }
    },


    //一次连接调用事件@陈帆
    // signin: function(data){
    //     var tt = this.connect("119.29.3.12:6081");
    //     // setTimeout(self.send("your_log",{userid: '陈帆', password: '123456'}),1000);
    //     self.send("your_log",{userid: '陈帆', password: '123456'});
    //     console.log("test point");
        
    // }



};

module.exports = net;
