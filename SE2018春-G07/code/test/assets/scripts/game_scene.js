// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var net = require("net");
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
        player: {
            type: cc.Node,
            default: null,
        },

        block_prefab: {
            default: [],
            type: cc.Prefab,
        },

        block_root: {
            type: cc.Node,
            default: null,
        },

        left_org: cc.p(0, 0),

        map_root: {
            type: cc.Node,
            default: null,
        },

        y_radio: 0.5560472,

        checkout: {
            type: cc.Node,
            default: null,
        },
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },


     start() {
        this.cur_block = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        //删除额外敌人
        this.cur_block.getChildByName("person1").destroy();
        this.block_root.addChild(this.cur_block);
        this.cur_block.setPosition(this.block_root.convertToNodeSpaceAR(this.left_org));

        var w_pos = this.cur_block.getChildByName("mid").convertToWorldSpaceAR(cc.p(0, 0));
        this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos));
        this.next_block = this.cur_block;
        this.player_com = this.player.getComponent("player");
        this.block_zorder = -1;
        this.add_block();
    },

    add_block() {
        this.cur_block = this.next_block;

        this.next_block  = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        this.block_root.addChild(this.next_block);
        this.next_block.setLocalZOrder(this.block_zorder);
        this.block_zorder --;

        var x_distance = 200 + Math.random() * 200;
        var y_distance = x_distance * this.y_radio;

        var next_pos = this.cur_block.getPosition();
        next_pos.x += (x_distance * this.player_com.direction);
        next_pos.y += y_distance;
        this.next_block.setPosition(next_pos);


        this.player_com.set_next_block(this.next_block.getComponent("block"));

        // 删除掉没有用的block
        // end 
    },

    move_map(offset_x, offset_y) {
        var m1 = cc.moveBy(0.5, offset_x, offset_y);
        var end_func = cc.callFunc(function() {
            this.add_block();
        }.bind(this));

        var seq = cc.sequence([m1, end_func]);
        this.map_root.runAction(seq);
    },

    on_checkout_game: function() {
        this.node.getChildByName("bg").active = false;
        this.checkout.getChildByName("score_2").getComponent(cc.Label).string = this.player.getComponent("player").score;//显示最终得分
        this.checkout.active = true;
    },

    on_game_again: function() {
        // this.player.getComponent("player").close_net();
        
        cc.director.loadScene("game_scene");
    },
    goto_main: function(){
        cc.director.loadScene("main_scene");
    },
    // update (dt) {},
});
