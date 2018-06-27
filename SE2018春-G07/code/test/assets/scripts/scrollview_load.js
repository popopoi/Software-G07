// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        item_height: 100,
        PAGE_NUM: 10,
        item_prefab: {
            default:null,
            type: cc.Prefab,
        },

        scroll_view: {
            type: cc.ScrollView,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {

        //连接状态
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
        
        };

        this.net = net;



        
        
        
        // for(var i= 1; i <= 100; i++){
        //     this.value_set.push(i);
        //     //push排行榜的数据}
        // };

        this.content = this.scroll_view.content;
        //创建多个item实例,打包成集合
        this.item_set = [];
        for( var i = 0; i < this.PAGE_NUM*10; i++){
            var item = cc.instantiate(this.item_prefab);
            this.item_set.push(item);
            this.content.addChild(item);
        };


    },

    start: function() {
        //[索引]当前24个item加载的 100项数据里面的起始数据记录的索引
        // this.load_record(this.start_index);
        this.load_record();
        //记录content节点的开始坐标
        // this.start_ypos = this.content.y;
    },

    //填入数据到排行榜
    load_record: function(){
        //联网
        this.value_set = new Array();
        this.net.connect("119.29.3.12:6081");
        this.is_connect = true;

        //请求排行榜，接收服务器反馈
        this.net.sio.emit("your_see");
        this.net.sio.on('your_see',function(data){
            //接收数值
            // this.value_set = data;s
            console.log("排行榜信息");
            for(var i=0; i < data.length; i ++){
                var temp = {userid: data[i].userid, num: data[i].num, score: data[i].score}
                this.value_set[i] = temp;

                var order = this.item_set[i].getChildByName("order").getComponent(cc.Label);
                order.string = this.value_set[i].num;
                var userid = this.item_set[i].getChildByName("userid").getComponent(cc.Label);
                userid.string = this.value_set[i].userid;
                var score = this.item_set[i].getChildByName("score").getComponent(cc.Label);
                score.string = this.value_set[i].score;
                if(userid.string == cc.sys.localStorage.getItem('userid')){
                    this.item_set[i].getChildByName("bg").color = new cc.Color(255, 0, 0);
                }
            }

            this.close_net();
        }.bind(this));
        // console.log(this.value_test[0].userid);

        // console.log(this.value_set);

        // this.close_net();
    },


    //关闭网络连接
    close_net(){
        if(this.is_connect == true ){
            this.net.sio.disconnect();
            this.is_connect = false;
            console.log("关闭连接");
        }
    },

    update: function(dt) {
        // 
    },
});
