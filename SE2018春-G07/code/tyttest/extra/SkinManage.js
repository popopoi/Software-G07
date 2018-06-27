//导入所需模块
var pool =  require("../Demo.js");

//本数据库负责 skin数据库的相关操作，包括：
//1.查看所有皮肤。
//2.通过皮肤id 查询皮肤, id不存在则返回1.
//3.皮肤添加，id已存在返回1，添加成功返回2.
//4.皮肤detail修改，修改成功返回1

var sql = ' ';

var skinmanage = {
    //函数1：查看所有皮肤
    selectAll : function(callback){
        pool.getConnection(function(err,conn){    
            if(err){ 
                //连接数据库错误   
                callback(err,null);    
            }else{    
                sql = 'select * from skin';
                conn.query(sql,function(err,vals){       
                    if(err){
                        //连接数据库错误
                        callback(err,null);
                    }
                    else{
                        //查询成功，返回skin数组 
                        callback(null,vals);  
                        conn.destroy();
                    }  
                });    
            }    
        });
    },

    //函数2：通过皮肤id查询皮肤信息
    selectSkin : function(skin_id,callback){
        pool.getConnection(function(err,conn){    
            if(err){    
                //连接数据库错误
                callback(err,null);    
            }else{    
                sql = 'select * from skin where skinid = ?';
                conn.query(sql,skin_id,function(err,vals){        
                    if(err){
                        //连接数据库错误
                        callback(err,null);
                    }
                    else{
                        if(vals.length == 0){
                            //如果没有找到，说明id不存在，返回1
                            callback(null,1);
                          	conn.release();
                        }
                        else{
                            //查询成功，返回此skin信息    
                            callback(null,vals);  
                          	conn.release();
                        }
                    }  
                });    
            }    
        }); 
    },

    //函数3：皮肤添加
    insertSkin : function(skin_id,skin_detail,callback){
        pool.getConnection(function(err,conn){    
            if(err){    
                //连接数据库错误
                callback(err,null);    
            }else{    
                skinmanage.selectSkin(skin_id,function(err,vals){
                    if(err){
                        callback(err);
                    }
                    else{
                        if(vals != 1){
                        //如果id已存在，返回1
                        	callback(null,1);
                          	conn.release();
                        }
                        else{
                            //数据库无此id,执行插入操作
                            sql = 'insert into skin(skinid,detail) values(?,?)';
                            conn.query(sql,[skin_id,skin_detail],function(err,vals){
                            if(err){
                                //连接数据库错误
                                callback(err,null);
                            }
                            else{
                                //插入成功，返回2
                                callback(null,2);  
                              	conn.release();
                            }
                            });
                        }
                    } 
                })
            }    
        }); 
    },

    //函数4：皮肤detail修改
    updateDetail : function(skin_id,new_detail,callback){
        pool.getConnection(function(err,conn){    
            if(err){   
                //连接数据库错误 
                callback(err,null);    
            }else{    
                sql = 'update skin set detail = ? where skinid = ?';
                conn.query(sql,[new_detail,skin_id],function(err,vals){    
                     //释放连接    
                    if(err){
                        //连接数据库错误
                        callback(err,null);
                    }
                    else{
                        //更新成功，返回1    
                        callback(null,1);  
                        conn.release();   
                    }  
                });    
            }    
        }); 
    },
};

module.exports = skinmanage;