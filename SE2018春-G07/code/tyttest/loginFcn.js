var log = require('./extra/LoginManage.js');
var user = require('./extra/UserManage.js');

//本JS实现具体的功能：1.注册；2.登录。
//注册功能: 成功返回1；用户名已存在返回2
//登录功能：用户名不存在返回1；密码错误返回2；密码正确返回3

var logfun = {
    //注册
    signUp : function(user_id,password,callback){
        log.selectUser(user_id,password,function(err,vals){
            if(err){
                //error
                callback(err,null);
            }
            else if(vals == 1){
                //用户名不重复,开始注册
                log.addUser(user_id,password,function(err,vals2){
                    //login表更新
                    if(err){
                        //error
                        callback(err,null);
                    }
                    else if(vals2 == 1){
                        //log表更新成功
                        user.insertUser(user_id,function(err,vals3){
                            if(err){
                                //error
                                callback(err,null);
                            }
                            else if(vals3 == 1){
                                //user表添加成功
                                callback(null,1);
                            }
                        })
                    }
                });
            }
            else if(vals == 2 || vals == 3){
                //用户名重复，不能注册,返回2
                callback(null,2);
            }
        });
    },

    //登录
    login : function(user_id,password,callback){
        log.selectUser(user_id,password,function(err,vals){
            if(err){
                //error
                callback(err,null);
            }
            else if(vals == 1){
                //用户名不存在，返回1
                callback(null,1);
            }
            else if(vals == 2){
                //用户名存在,但密码错误，返回2
                callback(null,2);
            }
            else{
                //用户名存在,且密码正确，返回3
                callback(null,3);
            }
        });
    },
}

module.exports = logfun;