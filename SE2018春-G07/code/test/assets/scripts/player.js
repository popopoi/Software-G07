// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var game_scene = require("game_scene");
if(window.io == null){ // h5
    window.io = require("socket-io");
}
var scrollview_load = require("scrollview_load");

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
        init_speed: 150,
        a_power: 600,
        y_radio: 0.5560472,

        game_manager: {
            type: game_scene,
            default: null,
        },
        record_score:{
            type:cc.Label,
            default:null,
        },
        // scrollview_com:{
        //     type: scrollview_load,
        //     default: null,
        // },
        score:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.next_block = null;
        this.direction = 1; // 1，-1

        
        // console.log("+++++++++++++++++++++++++++++"+this.record_board);

        //网络连接状态
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












       
    },

    player_jump() {
        var x_distance = this.x_distance * this.direction;
        var y_distance = this.x_distance * this.y_radio;

        var target_pos = this.node.getPosition();
        target_pos.x += x_distance;
        target_pos.y += y_distance;

        this.rot_node.runAction(cc.rotateBy(0.5, 360 * this.direction));

        

        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        var is_game_over = false;
        if (this.next_block.is_jump_on_block(w_pos, this.direction)) {
            target_pos = this.node.parent.convertToNodeSpaceAR(w_pos); // target_pos就变成了参考点的位置;
            this.score += 1;
            this.record_score.string = this.score; //更新计数器
            

        }
        else {//游戏结束
            

            is_game_over = true;

            //网络连接
            this.net.connect("119.29.3.12:6081");
            this.is_connect = true;

            //打包要发送的数据
            var userid = cc.sys.localStorage.getItem('userid');
            var temp = {userid: userid, score: this.score};

            //发送分数信息，接收服务器反馈
            this.net.sio.emit("your_renew",temp);
            this.net.sio.on('your_renew',function(data){
                if(data == 1){
                    console.log("新成绩");
                }
                else if(data == 2){
                    console.log("无突破");
                }

                
                this.close_net();
            }.bind(this));
            

            // this.close_net();

            // var tempFun = this.close_net;
            // this.scheduleOnce(this.close_net,1);
            // this.scheduleOnce(this.scrollview_com.load_record(),0.5);

            // this.scrollview_load.load_record();


        }

        var j = cc.jumpTo(0.5, target_pos, 200, 1);
        this.direction = (Math.random() < 0.5) ? -1 : 1;

        var end_func = cc.callFunc(function() {
            if (is_game_over) {
                this.game_manager.on_checkout_game();
            }
            else {
                if (this.direction === -1) {
                    this.game_manager.move_map(580 - w_pos.x, -y_distance);    
                }
                else {
                    this.game_manager.move_map(180 - w_pos.x, -y_distance);
                }
            }
        }.bind(this));

        
        var seq = cc.sequence(j, end_func);

        var finish = this.node.runAction(seq);
        if( finish.isDone ){
           this.game_manager.next_block.getChildByName("person1").destroy();//删除敌人
        }

        
        
    },

    set_next_block(block) {
        this.next_block = block;
    },

    //关闭网络连接
    close_net(){
        if(this.is_connect == true ){
            this.net.sio.disconnect();
            this.is_connect = false;
            console.log("关闭连接");
        }
    },


    start () {
        

        this.rot_node = this.node.getChildByName("rotate");
        this.anim_node = this.rot_node.getChildByName("anim");

        this.is_power_mode = false;
        this.speed = 0;
        this.x_distance = 0;

        this.anim_node.on(cc.Node.EventType.TOUCH_START, function(e) {
            this.is_power_mode = true;
            this.x_distance = 0;
            this.speed = this.init_speed;

            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(2, 1, 0.5));

            //测试改变方块的大小
            this.game_manager.cur_block.stopAllActions();
            this.game_manager.cur_block.runAction(cc.scaleTo(2, 1, 0.5));

        }.bind(this), this);

        this.anim_node.on(cc.Node.EventType.TOUCH_END, function(e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));

            // 改变方块的大小
            this.game_manager.cur_block.stopAllActions();
            this.game_manager.cur_block.runAction(cc.scaleTo(0.5, 1, 1));

            this.player_jump();
        }.bind(this), this);

        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));

             // 改变方块的大小
             this.game_manager.cur_block.stopAllActions();
             this.game_manager.cur_block.runAction(cc.scaleTo(0.5, 1, 1));

            this.player_jump();
        }.bind(this), this);
    },

    update (dt) {
        if (this.is_power_mode) {
            this.speed += (this.a_power * dt);
            this.x_distance += this.speed * dt;
        }
    },
});
