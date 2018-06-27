// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// var net = require("net");
if(window.io == null){ // h5
    window.io = require("socket-io");
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        loginNode:{
            default: null,
            type: cc.Node,
        },
        signinNode:{
            default: null,
            type: cc.Node,
        },
        tooltipNode:{
            default: null,
            type: cc.Node,
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //设置常驻节点
        // cc.game.addPersistRootNode(this.node.getChildByName("login").node);
        // cc.game.addPersistRootNode(this.node);
        // console.log(cc.sys.localStorage.getItem('userid'));
        //初始化本地用户信息
        console.log(cc.sys.localStorage.getItem('userid'));
        if(cc.sys.localStorage.getItem('userid') == null){
            cc.sys.localStorage.setItem('userid', '游客');
        }
        else{}
        var temptest = cc.sys.localStorage.getItem('userid');
        this.node.getChildByName("user").getComponent(cc.Label).string = temptest;
        console.log("################",temptest);

        //tip面板上的cc.Label组件
        this.tip = this.tooltipNode.getChildByName("tip").getChildByName("Label").getComponent(cc.Label);
        //接收注册时服务器返回的数值（1为注册成功；2为注册失败）
        this.signin_tip = null;
        //接收登陆时服务器返回的数值（1为登陆成功；2为登陆失败）
        this.login_tip = null;
        //判断是否和服务器连接
        this.is_connect = false;


        //导入net
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
                // this.sio.on('your_enroll',function(data){
                //     this.signin_successful = data;
                //     console.log("your_enroll-first", this.signin_successful);
                    
                // });
                //登陆
                // this.sio.on('your_log',function(data){
                //     console.log("your_log", data);
                // });
                //更新 score
                // this.sio.on('your_renew',function(data){
                //     console.log("your_renew", data);
                // });
                //排名
                // this.sio.on('your_see',function(data){
                //     console.log("your_see", data);
                // });
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

        this.net = net;



       
    },

    start () {
        // this.net = net;
        // this.sio = this.net.sio;
        // this.net.connect("119.29.3.12:6081");
        // if(this.net.sio.connected){
            // this.net.sio.emit("your_log",{userid: '陈帆', password: '123456'});                
        // }

        // setTimeout(function(){this.net.sio.connected = false;
        //     this.net.sio.disconnect(); // API
        //     this.net.sio = null;},4000);

        // this.net.sio.connected = false;
        // this.net.sio.disconnect(); // API
        // this.net.sio = null;
            
        // this.net.sio.emit("your_log",{userid: '陈帆', password: '123456'});
        // this.net.send("your_log",{userid: '陈帆', password: '123456'});
        // tempnet.send("your_log",{userid:'zjcc',password:'866666'});
        // this.net.signin('hello');



    },


    //以下为按钮需要调用的函数，用于转场
    goto_nextSence(){
        cc.director.loadScene("game_scene");

    },
    goto_signinBox(){
        this.signinNode.active = true;

    },
    goto_loginBox(){
        this.loginNode.active = true;

    },
    signin_goto_tooltipBox(){
        
        //收集注册信息
        var userid = this.signinNode.getChildByName("userid").getChildByName("input_userid").getComponent(cc.EditBox).string;
        var password = this.signinNode.getChildByName("userpwd").getChildByName("input_userpwd").getComponent(cc.EditBox).string;
        // 前端初步判断输入的信息是否有误
        if(password == "" ){
            // console.log("注册信息有误");
            this.tip.string = "请输入密码！";
             //激活tip面板
             this.tooltipNode.active = true;
            
        }
        else{
            //第一次连接服务器
            this.net.connect("119.29.3.12:6081");
            this.is_connect = true;
            //连接服务器(count表示连接尝试次数)
            // var count = 3;
            // while(this.net.sio.connected == false  &&  count >= 1){
            //     console.log("剩余尝试次数",count);
            //     this.net.connect("119.29.3.12:6081");
            //     count --;
            // }
            
            // //判断是否连接成功
            // if(this.net.sio.connected == false){
            //     console.log("连接失败");
            // }


            // console.log(temp);
            // if(temp){
            //     this.is_connect = true;
            // }
            // else{console.log("连接服务器失败！",this.net.sio.connected);}
            

            //打包要发送的数据
            var temp_signin = {userid: userid,password: password};
            

            //发送注册信息，接收服务器反馈
            this.net.sio.emit("your_enroll",temp_signin);
            this.net.sio.on('your_enroll',function(data){
                // console.log("your_enroll的送回数据", data);
                this.signin_tip = data;
                //更新tip面板信息
                if(this.signin_tip === 1 ){
                    this.tip.string = "注册成功！";
                }else if(this.signin_tip === 2){
                    this.tip.string = "该用户已存在。";
                }
                //激活tip面板
                this.tooltipNode.active = true;
            }.bind(this));
            
        }

        
    },

    login_goto_tooltipBox(){
        
        //收集登陆信息
        var userid = this.loginNode.getChildByName("userid").getChildByName("input_userid").getComponent(cc.EditBox).string;
        var password = this.loginNode.getChildByName("userpwd").getChildByName("input_userpwd").getComponent(cc.EditBox).string;
        // 前端初步判断输入的信息是否有误
        if( userid == "" ){
            this.tip.string = "请输入用户名！";
             //激活tip面板
             this.tooltipNode.active = true;
            
        }else if( password == "" ){
            this.tip.string = "请输入密码！";
            //激活tip面板
            this.tooltipNode.active = true;
        }
        else{
            //第一次连接服务器
            this.net.connect("119.29.3.12:6081");
            this.is_connect = true;
            //打包要发送的数据
            var temp_login = {userid: userid,password: password};
            
            //发送登陆信息，接收服务器反馈
            this.net.sio.emit("your_log",temp_login);
            this.net.sio.on('your_log',function(data){
                this.login_tip = data;
                console.log(this.login_tip);
                //更新tip面板信息
                if(this.login_tip === 3 ){
                    this.tip.string = "登陆成功！";
                    //保存用户名信息，并且在主界面中显示
                    cc.sys.localStorage.setItem('userid', userid);
                    // var temptest = cc.sys.localStorage.getItem('userid');
                    this.node.getChildByName("user").getComponent(cc.Label).string = cc.sys.localStorage.getItem('userid');
                }else if(this.login_tip === 2){
                    this.tip.string = "用户信息错误！";
                }
                //激活tip面板
                this.tooltipNode.active = true;
            }.bind(this));
            
        }
    },

    start_goto_tooltipBox(){
        var userid = cc.sys.localStorage.getItem('userid');
        //更新tip面板信息
        if( userid == '游客'){
            this.tip.string = "游客登陆，不计分数！";
            this.tooltipNode.active = true;
        }
        else{
            this.goto_nextSence();
        }

    },


    //以下为按钮需要调用的函数，用于转场
    close_signinBox(){

        this.signinNode.active = false;
        // console.log(this.signinNode.width+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    },
    close_loginBox(){
        this.loginNode.active = false;
    },
    close_tooltipBox(){
        //关闭服务器
        console.log("连接状态：",this.is_connect);
        if(this.is_connect == true ){
            this.net.sio.disconnect();
            this.is_connect = false;
            console.log("关闭连接");
        }

        this.tooltipNode.active = false;

        if(this.tip.string == "游客登陆，不计分数！"){
            this.goto_nextSence();
        }
        
    },



    //以下为网络连接
    



    // update (dt) {},
});
