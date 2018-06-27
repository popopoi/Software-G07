//导入所需模块
var mysql = require('mysql');
//导入配置文件

//  服务器的数据库连接
var pool = mysql.createPool({
    host : '119.29.3.12',
    port : '3306',
    user : 'tyttest',
    password : 'g07zucc',
    database : 'tyttest',
});


module.exports = pool;