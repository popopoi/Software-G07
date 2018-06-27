var pool = require('../Demo.js');

//本数据库负责 user数据库的相关操作，包括：
//1.用户添加，成功返回1
//2.用户查找，没有这个人返回1，密码正确返回3，错误返回2


var loginmanage = {
    //用户添加
    addUser : function(user_id,password,callback){
        pool.getConnection(function(err,conn){    
            if(err){    
                callback(err,null);    
            }else{    
                sql = 'insert into login(userid,password) values(?,?)';
                conn.query(sql,[user_id,password],function(err,vals){       
                    if(err){
                        //连接数据库错误
                        callback(err,null);
                    }
                    else{
                        //插入成功返回1  
                        callback(null,1);  
                        conn.release();
                    }  
                }); 
            }    
        });
    },

    //用户查找
    selectUser : function(user_id,pass,callback){
        pool.getConnection(function(err,conn){    
            if(err){
                callback(err,null);  
            }
            else{    
                sql = 'select * from login where userid = ?';
                conn.query(sql,user_id,function(err,vals){ 
                    if(err){
                        //连接数据库错误
                        callback(err,null);
                    }
                    else if(vals.length == 0){
                        //如果没有这个人返回1
                        callback(null,1);
                      	conn.release();
                    }
                    else{
                        //如果有这个人返回2  
                        if(vals[0].password == pass){
                            //如果是登陆过程，判断password是否正确，正确返回3
                            callback(null,3);
                          	conn.release();
                        }
                        else{
                            callback(null,2);
                          	conn.release();
                        }
                    }  
                });
            }    
        });
    }

};

module.exports = loginmanage;


loginmanage.addUser('003','123abc',function(err,vals){
    if(err){
        console.log(err);
    }
    else{
        console.log(vals);
    }
})