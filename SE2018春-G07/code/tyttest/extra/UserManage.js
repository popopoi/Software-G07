//导入所需模块
var pool = require("../Demo.js");

//本数据库负责 user数据库的相关操作，包括：
//1.根据userid查询user信息。
//2.添加新 user，添加成功返回1
//3.user 最高得分更新：若确实需要更新，更新，并返回1，若不需要更新，返回2
//4.user 最高得分查询
//5.全部user 最高分排名查询


var sql = '';

var usermanage = {
    //函数1：通过 id 查询user信息
    selectUser1 : function(user_id,callback){
            //导出查询相关    
         pool.getConnection(function(err,conn){    
            if(err){    
                //pool连接错误
                callback(err,null);    
            }else{    
                sql = 'select * from user where userid = ?';
                conn.query(sql,user_id,function(err,vals){       
                    if(err){
                        //查询错误
                        callback(err,null);
                    }
                    else{
                        //查询成功，返回user对象
                        callback(null,vals);  
                        conn.release();  
                    }  
                });    
            }    
        });     
    },

    //函数2：新user 添加
    insertUser : function(user_id,callback){
        pool.getConnection(function(err,conn){
            if(err){
                //pool连接失败
                callback(err,null);
            }
            else{
                sql = 'insert into user(userid,score) values(?,0)';
                conn.query(sql,user_id,function(err,vals){
                    if(err){
                        //user添加失败
                        callback(err,null);
                    }
                    else{
                        //添加成功返回1
                        callback(null,1);
                        conn.release();
                    }
                });
            }
        });
    },
    //函数3：user score 更新  
    updateScore : function(user_id,score,callback){
        pool.getConnection(function(err,conn){
            if(err){
                //pool连接错误
                callback(err,null);
            }
            else{
                //判断新score与原score分数哪个更高
                usermanage.selectScore(user_id,function(err,vals){
                    if(err){
                        callback(err,null);
                    }
                    else{
                        if(score <= vals[0].score){
                            //新得分低于最高得分，返回2
                            callback(null,2);
                          	conn.release();
                        }
                        else{
                            //新得分高于最高得分，更新最高得分，返回1
                            sql = 'update user set score=? where userid=?';
                            conn.query(sql,[score,user_id],function(err,vals){
                                if(err){
                                    //更新失败
                                    callback(err,null);
                                }
                                else{
                                    //更新成功，返回1
                                    callback(null,1);
                                    conn.release();
                                }
                            });
                        }
                    }
                })
                
                
            }
        });
    },

    //函数4：user score 查询
    selectScore : function(user_id,callback){
        pool.getConnection(function(err,conn){
            if(err){
                //pool连接失败
                callback(err,null);
            }
            else{
                sql = 'select score from user where userid=?';
                conn.query(sql,[user_id],function(err,vals){
                    if(err){
                        //查询失败
                        callback(err,null);
                    }
                    else{
                        //查询成功，返回score
                        callback(null,vals);
                        conn.release();
                    }
                });
            }
        });
    },

    //函数5：user按score由高到低排序
    scoreRank : function(callback){
        pool.getConnection(function(err,conn){
            if(err){
                //pool连接失败
                callback(err,null);
            }
            else{
                sql = 'select (@num:=@num+1) as num,userid,score from user,(select @num:=0) as it where score>0 order by score DESC';
                conn.query(sql,function(err,vals){
                    if(err){
                        //查询失败
                        callback(err,null);
                    }
                    else{
                        //查询成功，返回用户信息的数组
                        callback(null,vals);
                        conn.release();
                    }
                });
            }
        });
    },
};

module.exports = usermanage;