/**
 *   MAIN - uos.js
 *
 *   Copyright (C) 2021 U.O.S
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */


// express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path'), mysql = require('mysql'), QRCode = require('qrcode');
const fs = require('fs');
var sync_mysql = require('sync-mysql');

var FCM = require('fcm-node');
// api 토큰
var serverKey = "AAAAjJLRggY:APA91bE2xhI3ZkbiFx1y3o3WugxQlkM8Aub9c77-3n5qyQ9ROF62h8XPKzvKRPUZB1dwNYiexcD9vjpYnQ4bwsdLF75ya9YxISoPnyk1Oc2NBN0IIlVkGM0bDNZdyDM_uBP0Ys05nL_b";
var fcm = new FCM(serverKey);

// mysql 기본설정
const conn = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '112antkglok!',
    database: 'uos',
    multipleStatements: true
};

var sync_connection = new sync_mysql({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '112antkglok!',
    database: 'uos',
    multipleStatements: true
});

// express 미들웨어 불러오기
var static = require('serve-static');

// express 객체 생성
var app = express();
var router = express.Router();

/// local ip 불러오기
var ip = require("ip");
console.dir(ip.address());

// 기본 속성 설정
app.set('port', process.env.PORT || 8080);
app.set('host', ip.address());

// static 서버 미들웨어 사용
app.use(static(__dirname)); // 현재 폴더에 대한 정적 접근 허용

// json 대역폭 설정
app.use(express.json({
  limit : "50mb"
}));

// body-parser : Post request 파싱
var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


router.route('/').get(function(req, res){
    res.redirect('/pos/login.html');
});

router.route('/pos/qrcode').get(function(req, res){
    res.redirect('/pos/qrcode.html');
});

router.route('/pos/menus').get(function(req, res){
    res.redirect('/pos/menus.html');
});

router.route('/pos/list').get(function(req, res){
    res.redirect('/pos/list.html');
});

router.route('/pos/movies').get(function(req, res){
    res.redirect('/pos/movies.html');
});

router.route('/pos/corona').get(function(req, res){
    res.redirect('/pos/corona.html');
});

router.route('/pos/index.html').get(function(req, res){
    res.redirect('/pos/list.html');
});

app.use('/', router);


app.post('/post', function(req, res, next){
    var connection = mysql.createConnection(conn);
    connection.connect();

    var request_code = req.body.request_code;
    var message = req.body.message;

    switch (request_code) {

        case '0000': {
            console.log(message);
            connection.end();
            break;
        }

        // 회원가입 - 일반고객
        case '0001': {
            var check_overlap_text = "select * from customer_account where id=?";
            var res_data_string ='';
            connection.query(check_overlap_text, message.customer_id, function(err, result, fields){
                if(result.length > 0){
                    console.log('아이디 중복');
                    res_data_string = {response_code: "0002"};
                    var res_data_json = JSON.stringify(res_data_string);
                    res.json(res_data_json);
                }
                else{
                    var insert_text = "INSERT INTO `customer_account` (`id`, `pw`, `name`, `phone`)"
                    + "VALUES ('" + message.customer_id + "','" + message.pw + "', '" + message.name + "', '" + message.phone +"');";
                    
                    connection.query(insert_text, function (err, result, fields){
                        if(err){
                            console.log(err);
                        }
                        res_data_string = {response_code: "0001"};
                        var res_data_json = JSON.stringify(res_data_string);
                        res.json(res_data_json);
                    });
                }

                connection.end();

            });
            break;
        }

        // 회원가입 - UOS파트너
        case '0002': {
            var check_overlap_text = "select * from uospartner_account where id=?";
            var res_data_string ='';
            connection.query(check_overlap_text, message.uospartner_id , function(err, result, fields){
                if(result.length > 0){
                    console.log('아이디 중복');
                    res_data_string = {response_code: "0002"};
                    var res_data_json = JSON.stringify(res_data_string);
                    res.json(res_data_json);
                }
                else{
                    var insert_text = "INSERT INTO `uospartner_account` (`id`, `pw`, `name`, `phone`, `company_name`, `license_number`, `company_type`, `company_address`)"
                    + " VALUES ('" + message.uospartner_id + "','" + message.pw + "', '" + message.name + "', '" + message.phone +"', '" + message.company.name +"', '" + message.company.license_num +"', '" + message.company.type +"', '" + message.company.address +"');";

                    connection.query(insert_text, function (err, result, fields){
                        if(err){
                            console.log(err);
                        }

                        var text = message.company.license_img;
                        var bitmap = Buffer.from(text.toString(), 'base64');
                        fs.writeFileSync('assets/uospartner/license_img/' + message.uospartner_id + '.jpg', bitmap);

                        var res_data_string = {response_code: "0001"};
                        var res_data_json = JSON.stringify(res_data_string);
                        res.json(res_data_json);

                        var url_text = "uosmobile://action?uosPartnerId=" + message.uospartner_id + ";";
                        QRCode.toDataURL(url_text , function(err , url) {
                            var data = url.replace(/.*,/ , ''); 
                            console.log("QR코드 생성");
                            var bitmap = Buffer.from(data, 'base64');
                            fs.writeFileSync('assets/qrcode/' + message.uospartner_id +'.jpg', bitmap);
                        });
                    });

                    var create_query = "";
                    var company_type = "";

                    if(message.company.type == "영화관"){
                        company_type = "movie";
                        var create_query1 = "CREATE TABLE movie_" + message.uospartner_id + "(num int not null auto_increment,"
                        + "movie varchar(100), theater varchar(20), time varchar(20), width int, height int, primary key(num)); ";
                        var create_query2 = "CREATE TABLE movie_" + message.uospartner_id + "_food" + "(num int not null auto_increment,"
                        + "category varchar(50), type varchar(20), name varchar(50), price int, description varchar(200), conf varchar(200), category_list varchar(6000), primary key(num)); ";
                        connection.query(create_query1, function (err, result, fields){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(company_type + "_" + message.uospartner_id + " 테이블 생성 완료");
                            }
                        });
                        connection.query(create_query2, function (err, result, fields){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(company_type + "_" + message.uospartner_id + "_food 테이블 생성 완료");
                            }
                        });
                    }
                    else {

                        if(message.company.type == "피시방"){
                            company_type = "pc";
                        }
                        else{
                            company_type = "restaurant";
                        }
                        create_query = "CREATE TABLE " + company_type + "_" + message.uospartner_id + "(num int not null auto_increment,"
                        + "category varchar(50), type varchar(20), name varchar(50), price int, description varchar(200), conf varchar(200), category_list varchar(6000), primary key(num));";
                        
                        connection.query(create_query, function (err, result, fields){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(company_type + "_" + message.uospartner_id + " 테이블 생성 완료");
                            }
                        });
                    }

                    // 계정별 이미지 폴더 생성 
                    fs.mkdirSync(`./assets/images/${message.uospartner_id}`);
                }
                connection.end();
            });
            // 탈출
            break;

        }

        // 로그인
        case '0003': {
            var check_overlap_text = "";
            if(message.type == 'customer'){
                check_overlap_text = "select * from customer_account where id=?";
            }
            else if(message.type == 'uospartner' || message.type == 'pos'){
                console.log("여기");
                check_overlap_text = "select * from uospartner_account where id=?";
            }
            else{
                console.log('로그인 type 오류');
            }

            var res_data_string ='';



            connection.query(check_overlap_text, message.id , function(err, result, fields){
                if(err){
                    console.log(err);
                    console.log('id 체크 오류');
                    res_data_string = { response_code: "0005" };
                }
                else if(result.length > 0){
                    var check = 'false';
                    for(var i =0; i < result.length; i++){
                        if(result[i].pw == message.pw){
                            check = 'true';
                            break;
                        }
                    }

                    if(check == 'true'){
                        console.log('로그인 성공');
                        if(message.type == "customer"){
                            res_data_string = {
                                response_code: "0003",
                                message: {
                                    name: result[0].name,
                                    phone: result[0].phone
                                }
                            };
                            var update_query = "update customer_account set fcm_token='" + message.fcm_token +"' where id=?";
                            connection.query(update_query, message.id , function(err, result, fields){
                                if(err){
                                    console.log('fcm token 업데이트 실패');
                                    console.log(err);
                                }
                                else{
                                    console.log(message.id + ' fcm token 업데이트 성공');
                                }
                            });
                        }
                        else if(message.type == "uospartner"){
                            var readFile = fs.readFileSync('assets/qrcode/' + message.id +'.jpg');
                            var encode = Buffer.from(readFile).toString('base64');
                            res_data_string = {
                                response_code: "0004",
                                message: {
                                    name: result[0].name,
                                    phone: result[0].phone,
                                    company_name: result[0].company_name,
                                    qr_img: encode
                                }
                            };
                        }
                        else if(message.type == "pos"){
                            res_data_string = {
                                response_code: "0003",
                                message: {
                                    name: result[0].name,
                                    company_name: result[0].company_name,
                                    company_type: result[0].company_type
                                }
                            };
                        }
                    }

                    else{
                        console.log(request_code + ' 비밀번호 부적합');
                        res_data_string = { response_code: "0006" };
                    }
                }
                else{
                    console.log('없는 id');
                    res_data_string = { response_code: "0005" };
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });

            break;
        }

        //비밀번호 변경
        case '0004': {
            var select_query = "";
            if(message.type == 'customer'){
                select_query = "select * from customer_account where id=?";
            }
            else if(message.type == 'uospartner'){
                select_query = "select * from uospartner_account where id=?";
            }
            else{
                console.log('type 오류');
            }

            connection.query(select_query, message.id , function(err, result, fields){
                if(message.pw == result[0].pw){
                    var update_query = "";
                    if(message.type == 'customer'){
                        update_query = "update customer_account set pw='" + message.change_pw +  "' where id=?";
                    }
                    else if(message.type == 'uospartner'){
                        update_query = "update uospartner_account set pw='" + message.change_pw +  "' where id=?";
                    }
                    else{
                        console.log('type 오류');
                    }
                    connection.query(update_query, message.id , function(err, result, fields){
                        var res_data_string ='';
                        if(err){
                            console.log('비밀번호 변경 실패');
                            res_data_string = {response_code: "0014"};
                        }
                        else{
                            console.log('비밀번호 변경 성공');
                            res_data_string = {response_code: "0013"};
                        }

                        var res_data_json = JSON.stringify(res_data_string);
                        res.json(res_data_json);
                    });
                }
                else{
                    var res_data_string = { response_code: "0014" };
                    var res_data_json = JSON.stringify(res_data_string);
                    res.json(res_data_json);
                }
                connection.end();
            });

            break;
        }

        // 휴대폰 번호 수정
        case '0005': {
            var update_query = "";
            if(message.type == 'customer'){
                update_query = "update customer_account set phone='" + message.change_phone +  "' where id=?";
            }
            else if(message.type == 'uospartner'){
                update_query = "update uospartner_account set phone='" + message.change_phone +  "' where id=?";
            }
            else{
                console.log('type 오류');
            }
            connection.query(update_query, message.id , function(err, result, fields){
                var res_data_string ='';
                if(err){
                    console.log('휴대폰 번호 변경 실패');
                    res_data_string = {response_code: "0015"};
                }
                else{
                    console.log('휴대폰 번호 변경 성공');
                    res_data_string = {response_code: "0015"};
                }
                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });

            break;
        }

        // 회원 탈퇴
        case '0006': {
            var delete_query = "";
            if(message.type == 'customer'){
                delete_query = "delete from customer_account where id=?";
            }
            else if(message.type == 'uospartner'){
                delete_query = "delete from uospartner_account where id=?";
            }
            else{
                console.log('type 오류');
            }
            connection.query(delete_query, message.id , function(err, result, fields){
                var res_data_string ='';
                if(err){
                    console.log('회원 탈퇴 실패');
                    res_data_string = {response_code: "0017"};
                }
                else{
                    console.log('회원 탈퇴 성공');
                    res_data_string = {response_code: "0016"};
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });
            break;
        }

        // 카드 정보
        case '0007': {
            var select_query = "select * from customer_account where id=?";
            connection.query(select_query, message.customer_id , function(err, result, fields){
                var res_data_string ='';
                if(err || result.length == 0 || result[0].card_num == null ){
                    console.log('카드 조회 실패');
                    res_data_string = {response_code: "0021"};
                }
                else{
                    console.log('카드 조회 성공');
                    res_data_string = {response_code: "0020", message: {num: result[0].card_num, cvc: result[0].cvc, due_date: result[0].due_date}};
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });
            break;
        }

        // 카드 추가
        case '0008': {
            var update_query = "update customer_account set card_num='" + message.card.num +  "', cvc='" + message.card.cvc + "', card_pw='" + message.card.pw +"', due_date='" + message.card.due_date +"' where id=?";
            connection.query(update_query, message.customer_id , function(err, result, fields){
                var res_data_string ='';
                if(err){
                    console.log('카드 등록 실패');
                    res_data_string = {response_code: "0018"};
                }
                else{
                    console.log('카드 등록 성공');
                    res_data_string = {response_code: "0018"};
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });
            break;
        }

        // 카드 제거
        case '0009': {
            var update_query = "update customer_account set card_num=NULL, cvc=NULL, card_pw=NULL, due_date=NULL where id=?";

            connection.query(update_query, message.customer_id , function(err, result, fields){
                var res_data_string ='';
                if(err){
                    console.log('카드 제거 실패');
                    res_data_string = {response_code: "0019"};
                }
                else{
                    console.log('카드 제거 성공');
                    res_data_string = {response_code: "0019"};
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });

            break;
        }

        case '0010' : {
            var res_data_string ='';
            var check = true;
            /*
            카드결제 서버와 통신해서 결제 실패하면 check 변수 false로 변환
            */

            if(check == true){
                //주문 버퍼
                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var hours = ("0" + date.getHours()).slice(-2);
                var minutes = ("0" + date.getMinutes()).slice(-2);
                var seconds = ("0" + date.getSeconds()).slice(-2);

                var now_date = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

                var order_arr = message.order;
                var price = 0;
                order_arr.forEach(function(element){
                    price += element.price * element.count;
                });

                var select_query = "select company_name, company_type from uospartner_account where id=?;";
                connection.query(select_query, message.uospartner_id, function (err1, result1, fields){
                    var company_name = result1[0].company_name;
                    var insert_text = "INSERT INTO `order_buffer` (`state`, `date`, `customer_id`, `uospartner_id`, `company_name`, `card`, `orderlist`, `price`) "
                    + "VALUES ( 0, '" + now_date + "','" + message.customer_id + "','" + message.uospartner_id + "','" + company_name + "','" + JSON.stringify(message.card) + "','" + JSON.stringify(message.order) + "',"+price+");";
                    connection.query(insert_text, function (err, result, fields){

                        if(err){
                            console.log(err);
                            res_data_string = {response_code: "0024"};
                            console.log('주문접수 실패 및 결제 실패');

                            var res_data_json = JSON.stringify(res_data_string);
                            res.json(res_data_json);
                        }
                        else{
                            res_data_string = {response_code: "0023"};
                            console.log("주문 버퍼 추가 및 결제 성공");


                            // 영화관 결제 성공 시 좌석 비활성화
                            for(let order of message.order){
                                if(order.type == 2){
                                    let movie = order.menu.split('&')[0];
                                    let time = order.menu.split('&')[1];

                                    // 변경할 영화 num 가져오기
                                    let sql = `SELECT * FROM movie_${message.uospartner_id} WHERE movie='${movie}' and time='${time}'`;
                                    let results = sync_connection.query(sql);
                                    let movie_num = results[0].num;

                                    // 영화 좌석
                                    let code_arr = order.submenu.split('&');
									let hi = new String();
                                    for(let code of code_arr){
                                        hi += "'"+code+"',";
                                    }
									let sql2 = `UPDATE movie_${message.uospartner_id}_${movie_num} SET state=1 WHERE code IN (${hi.substr(0,hi.length-1)})`;
                                    let results2 = sync_connection.query(sql2);
                                }   
                            }
                            var res_data_json = JSON.stringify(res_data_string);
                            res.json(res_data_json);
                        }
                    });
                    connection.end();
                });
            }
            else{
                res_data_string = {response_code: "0024"};
                res.json(res_data_json);
                console.log('결제 실패');
                connection.end();
            }
            break;
        }

        case '0011' : {

            var select_query = "select * from order_buffer where order_code=?";
            connection.query(select_query, message.order_code , function(err, result, fields){
                if(err){
                    console.log("에러발생 또는 매장에서 주문 거부함");
                }
                else{
                    var res_data_string ='';
                    if(result[0].state == 0){
                        var update_query = "update order_buffer set state=4 where order_code=?";
                        connection.query(update_query, message.order_code , function(err, result, fields){

                            if(err){
                                console.log('주문 취소 실패');
                                res_data_string = {response_code: "0030"};
                            }
                            else{

                                console.log('주문이 취소되었습니다.');
                                res_data_string = {response_code: "0022"};
                            }

                            var res_data_json = JSON.stringify(res_data_string);
                            res.json(res_data_json);

                        });

                    }
                    else{
                        console.log('이미 접수돼서 주문 취소 실패');
                        res_data_string = {response_code: "0030"};
                        var res_data_json = JSON.stringify(res_data_string);
                        res.json(res_data_json);
                    }
                }
                connection.end();
            });

            break;

        }

        case '0012': {
            var select_query = "select * from order_buffer where customer_id=? order by order_code desc";

            connection.query(select_query, message.customer_id , function(err, result, fields){
                var res_data_string ='';
                if(err || result == ""){
                    console.log('주문 내역 없음!');
                    console.log(result);
                    res_data_string = {response_code: "0012", message: { order_list: [] }};

                    var res_data_json = JSON.stringify(res_data_string);
                    res.json(res_data_json);
                }
                else{

                    console.log('주문 내역 성공');


                    var response_obj = new Object();
                    response_obj.response_code = "0012";

                    var order_list_array = new Array();
                    for(var i =0; i < result.length; i++){
                        var obj = new Object();
                        obj.state = result[i].state;
                        obj.date = result[i].date;
                        obj.company_name = result[i].company_name;
                        obj.total_price = result[i].price;
                        obj.order_code = result[i].order_code;
                        obj.product_list = eval(result[i].orderlist);

                        order_list_array.push(obj);

                    }

                    response_obj.message = {
                        order_list : order_list_array
                    };
                    console.log("(0012 주문내역)");
                    console.log(response_obj);
                    
                    var res_string = JSON.stringify(response_obj);
                    res.json(res_string);
                }


                connection.end();
            });

            break;
        }

        // 매장정보 및 주문가능목록 전송
        case '0013': {  
            var sql = `SELECT * FROM uospartner_account WHERE id='${message.uospartner_id}'`;
            var results = sync_connection.query(sql);
            var company_type = results[0].company_type;
            console.log(company_type);

            // 영화관
            if(company_type == "영화관"){
                var sql1 = `SELECT * FROM movie_${message.uospartner_id}; `;
                var sql2 = `SELECT * FROM movie_${message.uospartner_id}_food; `;

                var movie_result = sync_connection.query(sql1);
                var food_result = sync_connection.query(sql2);

                // 보낼 데이터
                var response_data = new Object();
                var message_obj = new Object();
                var category_list = new Array();
                var movie_list = new Array();
                var company_obj = new Object();
                response_data.message = message_obj;
                response_data.response_code = '0008';

                message_obj.company = company_obj;
                message_obj.category_list = category_list;
                message_obj.movie_list = movie_list;

                // 회사 정보 데이터 삽입
                var sql3 = `SELECT * FROM uospartner_account WHERE id='${message.uospartner_id}'`;
                let company_results = sync_connection.query(sql3);
                var company_name = company_results[0].company_name;
                var company_type = company_results[0].company_type;
                company_obj.name = company_name;
                company_obj.type = company_type;

                // 영화 정보 데이터 삽입
                for (var result of movie_result) {
                    var num = result.num;
                    var movieName = result.movie;
                    var theater = result.theater;
                    var time = result.time;
                    var width = result.width;
                    var height = result.height;

                    // 좌석 정보 가져오기
                    var sql4 = `SELECT * FROM movie_${message.uospartner_id}_${num}`;
                    var seat_list = sync_connection.query(sql4);

                    var movie = new Object();
                    movie.movie = movieName;
                    movie.theater = theater;
                    movie.time = time;
                    movie.width = width;
                    movie.height = height;
                    movie.seat_list = seat_list;

                    movie_list.push(movie);
                }

                // 음식 정보 데이터 삽입
                for (var result of food_result) {
					var num = result.num;
                    var categoryName = result.category;
                    var type = result.type;
                    var name = result.name;
                    var price = result.price;
                    var description = result.description;
                    var conf = result.conf;
                    var category_list_json = eval(result.category_list);
					let readImage = fs.readFileSync(`./assets/images/${message.uospartner_id}/${num}.jpg`);
					let image = Buffer.from(readImage).toString('base64');

                    // 카테고리 중복 확인
                    var index = category_list.findIndex(function(item, i) {
                        return item.category == categoryName;
                    });

                    // 카테고리 중복 시
                    if (index != -1) {
                        category_list[index];

                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            category_list[index].product_list.push(product);
                        } else if (type == "set") {
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            category_list[index].set_list.push(set);
                        }
                    }
                    // 카테고리 중복 아닐 시
                    else { 
                        var category = new Object();
                        category_list.push(category);
                        var set_list = new Array();
                        var product_list = new Array();

                        category['category'] = categoryName;
                        category['set_list'] = set_list;
                        category['product_list'] = product_list;

                        // 단품
                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            product_list.push(product);
                        } 
                        // 세트
                        else if (type == "set") { 
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            set_list.push(set);
                        }
                    }
                }

                // response     
                response_data = JSON.stringify(response_data);
                res.json(response_data);
                connection.end();
                break;
            } 
            // 피시방
            else if(company_type == "피시방") {
                var sql = `SELECT * FROM pc_${message.uospartner_id}`;
                let results = sync_connection.query(sql);

                var response_data = new Object();
                var message_obj = new Object();
                response_data.response_code = '0007';
                response_data.message = message_obj;

                var category_list = new Array();
                var company_obj = new Object();
                message_obj.category_list = category_list;
                message_obj.company = company_obj;

                // 회사 정보 데이터 삽입
                var sql1 = `SELECT * FROM uospartner_account WHERE id='${message.uospartner_id}'`;
                let company_results = sync_connection.query(sql1);
                var company_name = company_results[0].company_name;
                var company_type = company_results[0].company_type;
                company_obj.name = company_name;
                company_obj.type = company_type;

                // 피시방 정보 데이터 삽입
                for (var result of results) {
					var num = result.num;
                    var categoryName = result.category;
                    var type = result.type;
                    var name = result.name;
                    var price = result.price;
                    var description = result.description;
                    var conf = result.conf;
                    var category_list_json = eval(result.category_list);
					let readImage = fs.readFileSync(`./assets/images/${message.uospartner_id}/${num}.jpg`);
					let image = Buffer.from(readImage).toString('base64');

                    // 카테고리 중복 확인
                    var index = category_list.findIndex(function(item, i) {
                        return item.category == categoryName;
                    });

                    // 카테고리 중복 시
                    if (index != -1) {
                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            category_list[index].product_list.push(product);
                        } else if (type == "set") {
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            category_list[index].set_list.push(set);
                        }
                    }
                    // 카테고리 중복 아닐 시
                    else { 
                        var category = new Object();
                        category_list.push(category);
                        var set_list = new Array();
                        var product_list = new Array();

                        category['category'] = categoryName;
                        category['set_list'] = set_list;
                        category['product_list'] = product_list;

                        // 단품
                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            product_list.push(product);
                        }
                        // 세트
                        else if (type == "set") { 
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            set_list.push(set);
                        }
                    }
                }

                response_data = JSON.stringify(response_data);
                res.json(response_data);
                connection.end();
                break;
            }
            // 음식점
            else{
                var sql = `SELECT * FROM restaurant_${message.uospartner_id}`;
                let results = sync_connection.query(sql);

                var response_data = new Object();
                var message_obj = new Object();
                response_data.response_code = '0007';
                response_data.message = message_obj;

                var category_list = new Array();
                var company_obj = new Object();
                message_obj.category_list = category_list;
                message_obj.company = company_obj;

                // 회사 정보 데이터 삽입
                var sql1 = `SELECT * FROM uospartner_account WHERE id='${message.uospartner_id}'`;
                let company_results = sync_connection.query(sql1);
                var company_name = company_results[0].company_name;
                var company_type = company_results[0].company_type;
                company_obj.name = company_name;
                company_obj.type = company_type;

                // 음식 정보 데이터 삽입
                for (var result of results) {
					var num = result.num;
                    var categoryName = result.category;
                    var type = result.type;
                    var name = result.name;
                    var price = result.price;
                    var description = result.description;
                    var conf = result.conf;
                    var category_list_json = eval(result.category_list);
					let readImage = fs.readFileSync(`./assets/images/${message.uospartner_id}/${num}.jpg`);
					let image = Buffer.from(readImage).toString('base64');

                    // 카테고리 중복 확인
                    var index = category_list.findIndex(function(item, i) {
                        return item.category == categoryName;
                    });

                    // 카테고리 중복 시
                    if (index != -1) {
                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            category_list[index].product_list.push(product);
                        } else if (type == "set") {
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            category_list[index].set_list.push(set);
                        }
                    }
                    // 카테고리 중복 아닐 시
                    else { 
                        var category = new Object();
                        category_list.push(category);
                        var set_list = new Array();
                        var product_list = new Array();

                        category['category'] = categoryName;
                        category['set_list'] = set_list;
                        category['product_list'] = product_list;

                        // 단품
                        if (type == "product") {
                            var product = new Object();
                            product['name'] = name;
                            product['price'] = price;
                            product['desc'] = description;
                            product['image'] = image;

                            product_list.push(product);
                        }
                        // 세트
                        else if (type == "set") { 
                            var set = new Object();
                            set['name'] = name;
                            set['price'] = price;
                            set['desc'] = description;
                            set['image'] = image;
                            set['conf'] = conf;
                            set['category_list'] = category_list_json;

                            set_list.push(set);
                        }
                    }
                }
            }

            response_data = JSON.stringify(response_data);
            res.json(response_data);
            connection.end();
            break;
        }

        // 주문대기 내역
        case '0015': {
            var select_query = "select * from order_buffer where customer_id=? order by state desc";

            connection.query(select_query, message.customer_id , function(err, result, fields){
                var res_data_string ='';
                if(err || result == ""){
                    console.log('주문 내역 없음!');
                    console.log(result);
                    res_data_string = {response_code: "0025", message: { order_list: [] }};

                    var res_data_json = JSON.stringify(res_data_string);
                    res.json(res_data_json);
                }
                else{
                    console.log('주문 내역 성공');


                    var response_obj = new Object();
                    response_obj.response_code = "0025";

                    var order_list_array = new Array();
                    for(var i =0; i < result.length; i++){
                        if(1 <= result[i].state && result[i].state <= 2){
                            var obj = new Object();
                            obj.state = result[i].state;
                            obj.date = result[i].date;
                            obj.company_name = result[i].company_name;
                            obj.total_price = result[i].price;
                            obj.order_code = result[i].order_code;
                            obj.product_list = eval(result[i].orderlist);

                            order_list_array.push(obj);
                        }
                    }

                    response_obj.message = {
                        order_list : order_list_array
                    };
                    console.log("(0015 주문내역)");
                    console.log(response_obj);

                    var res_string = JSON.stringify(response_obj);
                    res.json(res_string);
                }


                connection.end();
            });
            break;
        }

        // 로그아웃 - 일반고객
        case '0017': {
            var update_query = "update customer_account set fcm_token=NULL where id=?";
            connection.query(update_query, message.customer_id , function(err, result, fields){
                if(err){
                    console.log('로그아웃 실패');
                    res_data_string = {response_code: "0027"};
                }
                else{

                    console.log(message.customer_id + '로그아웃 되었습니다.');
                    res_data_string = { response_code: "0027" };
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);

            });
            break;
        }

        //페이지 로드 주문 내역 요청
        case '000A' : {

            var select_query = "select * from order_buffer where uospartner_id=?";

            connection.query(select_query, message.id, function(err, result, fields){
                if(err){
                    console.log("sql질의 에러");
                }
                else {

                    var response_obj = new Object();
                    response_obj.response_code = "A000";

                    var order_array_arr = new Array();

                    if(result.length != 0){
                        for(var i = 0; i < result.length; i++){
                            var obj = new Object();
                            obj.order_code = result[i].order_code;
                            obj.state = result[i].state;
                            obj.order_list = result[i].orderlist;
                            obj.date = result[i].date;

                            order_array_arr.push(obj);
                        }
                    }

                    response_obj.message = { order_array : order_array_arr };
                    res.json(response_obj);
                }

                connection.end();

            });

            break;
        }

        // 주문조회
        case '000B': {

            var state0_index = 0;
            if(message.state0_num != 0){
                state0_index = message.state0_num-1;
            }

            var select_query1 = "select * from order_buffer where uospartner_id=? and state=0 and order_code > (select order_code from order_buffer where uospartner_id=? and state=0 limit 1 offset "+ state0_index +")";

            connection.query(select_query1, [message.id, message.id] , function(err1, result1, fields){
                console.log(result1);
                if(err1){
                    console.log("sql질의 에러1");
                    console.log(err1);
                }
                else {

                    var select_query2 = "select * from order_buffer where uospartner_id=? and (state=0 or state=1 or state=2)";
                    connection.query(select_query2, [message.id, message.id] , function(err2, result2, fields){
                        if(err2){
                            console.log("sql질의 에러2");
                        }
                        else{
                            var response_obj = new Object();
                            var order_array_arr = new Array();
                            var cancel_order_code_arr = new Array();

                            console.log("result1 : " + result1.length + ", result2" + result2.length);

                            function createResponseState0(){
                                for(var i = 0; i < result1.length; i++){
                                    if(result1[i].state == 0){
                                        var obj = new Object();
                                        obj.order_code = result1[i].order_code;
                                        obj.state = result1[i].state;
                                        obj.order_list = result1[i].orderlist;
                                        obj.date = result1[i].date;
                                        order_array_arr.push(obj);
                                    }
                                }
                            }

                            function createResponseState4(){
                                for(var i = 0; i < result2.length; i++){
                                    cancel_order_code_arr.push(result2[i].order_code);
                                }
                            }

                            if(result1.length == 0 && result2.length == message.state0_num){
                                response_obj.response_code = "C000";
                                res.json(response_obj);
                            }
                            else if(result1.length == 0 && result2.length != message.state0_num ){
                                response_obj.response_code = "B000";
                                createResponseState4();
                                response_obj.message = { order_codes : cancel_order_code_arr };
                                res.json(response_obj);
                            }
                            else if(result1.length != 0 && result2.length == message.state0_num){
                                response_obj.response_code = "B000";
                                createResponseState0();
                                response_obj.message = { order_array : order_array_arr };
                                res.json(response_obj);
                            }
                            else{
                                response_obj.response_code = "B000";
                                createResponseState0();
                                createResponseState4();
                                response_obj.message = {
                                    order_array : order_array_arr,
                                    order_codes : cancel_order_code_arr
                                };
                                console.log(cancel_order_code_arr);
                                res.json(response_obj);
                            }
                        }
                    });
                }

                connection.end();
            });

            break;
        }

        // 주문 수락 버튼
        case '000C' : {
            var update_query = "update order_buffer set state=1 where order_code=" + message.order_code + ";";
            var select_query = "select company_name from order_buffer where order_code=" + message.order_code + ";";
            var company_name = "";
            var fcm_token = "";

            connection.query(select_query, function(err, result, fields){
                company_name = result[0].company_name;
                console.log("됨!");
            });

            var select_query2 = "select fcm_token from customer_account where id=(select customer_id from order_buffer where order_code=" + message.order_code + ");";
            connection.query(select_query2, function(err, result, fields){
                if(err){
                    console.log(err);
                    console.log('주문 수락 실패2');
                    res_data_string = {response_code: "0019"};
                }
                else{
                   fcm_token = result[0].fcm_token;
               }
           });


            connection.query(update_query, function(err1, result1, fields){
                var res_data_string ='';
                if(err1){
                    console.log(err1);
                    console.log('주문 수락 실패1');
                    res_data_string = {response_code: "0019"};
                    // select_query2 삽입
                }
                else{
                    console.log('주문 수락 성공');
                    console.log(result1);
                    res_data_string = {response_code: "0019"};


                    var select_query3 = "select state from order_buffer where order_code=" + message.order_code + ";";
                    connection.query(select_query3, function(err2, result2, fields){
                        if(result2[0].state != 4){
                            var send_message = {
                                to: fcm_token,
                                collapse_key: "",
                                data: {
                                    "response_code": "0010",
                                    "company_name": company_name,
                                    "order_code" : message.order_code
                                }
                            };

                            fcm.send(send_message, function(err, response) {
                                if (err) {
                                    console.log("Something has gone wrong");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });
                        }
                    });
                }

                var res_data_json = JSON.stringify(res_data_string);
                res.json(res_data_json);
                connection.end();
            });
            break;

        }

        //주문 거절
        case '000D' : {

            var select_query1 = "select * from order_buffer where order_code=" + message.order_code + ";";
            var select_query2 = "select fcm_token from customer_account where id=(select customer_id from order_buffer where order_code=" + message.order_code + ");";
            var update_query = "update order_buffer set state=5 where order_code=" + message.order_code + ";";
            var fcm_token = "";
            var company_name = "";
            var order_list = "";
            var date = "";

            connection.query(select_query1, function(err, result, fields){
                company_name = result[0].company_name;
                order_list = result[0].orderlist;
                date = result[0].date;
                console.log("됨!");
            });

            connection.query(select_query2, function(err, result, fields){
                if(err){
                    console.log(err);
                    console.log('주문 수락 실패2');
                    res_data_string = {response_code: "0019"};
                }
                else{
                    fcm_token = result[0].fcm_token;
                }
            });

            connection.query(update_query, function(err, result, fields){
                var send_message = {
                    to: fcm_token,
                    collapse_key: "",
                    data: {
                        "response_code": "0011",
                        "company_name": company_name,
                        "order_code" : message.order_code
                    }
                };

                fcm.send(send_message, function(err, response) {
                    if (err) {
                        console.log("Something has gone wrong");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

                var response_obj = new Object();
                response_obj.response_code = "D000";
                response_obj.message = {
                    "order_code" : message.order_code,
                    "state" : 5,
                    "order_list" : order_list,
                    "date" : date
                };

                res.json(response_obj);
                connection.end();
            });
            break;
        }

        //조리 완료
        case '000E' : {
            var select_query = "select company_name from order_buffer where order_code=" + message.order_code + ";";
            var company_name = "";
            var fcm_token = "";

            connection.query(select_query, function(err, result, fields){
                company_name = result[0].company_name;
                console.log("됨!");
            });

            var select_query2 = "select fcm_token from customer_account where id=(select customer_id from order_buffer where order_code=" + message.order_code + ");";
            connection.query(select_query2, function(err, result, fields){
                if(err){
                    console.log(err);
                    console.log('주문 수락 실패2');
                    res_data_string = {response_code: "0019"};
                }
                else{
                    fcm_token = result[0].fcm_token;
                }
            });

            var update_query = "update order_buffer set state=2 where order_code=" + message.order_code + ";";
            connection.query(update_query, message.order_code, function(err, result, fields){
                var response_obj  = new Object();
                response_obj.message = { "response_code" : "000E" };

                var send_message = {
                    to: fcm_token,
                    collapse_key: "",
                    data: {
                        "response_code": "0028",
                        "company_name": company_name,
                        "order_code" : message.order_code
                    }
                };

                fcm.send(send_message, function(err, response) {
                    if (err) {
                        console.log("Something has gone wrong");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

                res.json(response_obj);
                connection.end();
            });

            break;
        }

        //수령 완료
        case '000F' : {

            var fcm_token = "";
            var select_query = "select fcm_token from customer_account where id=(select customer_id from order_buffer where order_code=" + message.order_code + ");";
            connection.query(select_query, function(err, result, fields){
                if(err){
                    console.log(err);
                    console.log('수령완료실패');
                    res_data_string = {response_code: "000F"};
                }
                else{
                    fcm_token = result[0].fcm_token;
                }
            });

            var update_query = "update order_buffer set state=3 where order_code=" + message.order_code + ";";
            connection.query(update_query, message.order_code, function(err, result, fields){
                var response_obj  = new Object();
                response_obj.message = { "response_code" : "000F" };

                var send_message = {
                    to: fcm_token,
                    collapse_key: "",
                    data: {
                        "response_code": "0032"
                    }
                };

                fcm.send(send_message, function(err, response) {
                    if (err) {
                        console.log("Something has gone wrong");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

                res.json(response_obj);
                connection.end();
            });

            break;
        }

        //코로나 데이터 보내기
        case '000G' : {
            var select_query = "select * from order_buffer where uospartner_id=? and state=3";

            connection.query(select_query, message.id, function(err, result, fields){
                if(err){
                    console.log("sql질의 에러");
                }
                else {

                    var response_obj = new Object();
                    response_obj.response_code = "A000";

                    var order_array_arr = new Array();

                    if(result.length != 0){
                        for(var i = 0; i < result.length; i++){
                            var obj = new Object();
                            obj.order_code = result[i].order_code;
                            obj.state = result[i].state;
                            obj.order_list = result[i].orderlist;
                            obj.date = result[i].date;
                            order_array_arr.push(obj);
                        }
                    }

                    response_obj.message = { order_array : order_array_arr };
                    res.json(response_obj);
                }
                connection.end();

            });

            break;
        }

        case '000H' : {
            var select_query1 = "select * from order_buffer where order_code=?";
            var uospartner_id = "";
            var customer_id = "";
            var date = ""

            var select_query2 = "select * from uospartner_account where id=?";
            var company_name = "";
            var company_address = "";

            var select_query3 = "select name, fcm_token from customer_account where id=?";

            connection.query(select_query1, message.order_code, function(err, result, fields){
                if(err){
                    console.log("sql질의 에러1");
                }
                else{
                    uospartner_id = result[0].uospartner_id;
                    customer_id = result[0].customer_id;
                    date = result[0].date;

                    connection.query(select_query2, uospartner_id, function(err, result, fields){
                        if(err){
                            console.log("sql질의 에러2");
                        }
                        else{
                            company_name = result[0].company_name;
                            company_address = result[0].company_address;
                        }
                    });

                    connection.query(select_query3, customer_id, function(err, result, fields){
                        if(err){
                            console.log("sql질의 에러3");
                        }
                        else{
                            var send_message_string = "[코로나19 알림] " + date + " 경 " + company_name + "에 방문하셨던 "
                            + result[0].name + "님은 코로나19 확진자와 동선이 겹쳤기 때문에 신속히 가까운 보건소에서 검사바랍니다.";
                            var send_message = {
                                to: result[0].fcm_token,
                                collapse_key: "",
                                data: {
                                    "response_code": "0029",
                                    "company_name": company_name,
                                    "message": send_message_string
                                }
                            };

                            fcm.send(send_message, function(err, response) {
                                if (err) {
                                    console.log("Something has gone wrong");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });
                        }
                    });
                }

                connection.end();
            });

        }
        break;


        // 음식점
        // 음식점 데이터 전송
        case '00A1': {
            var sql = `SELECT * FROM restaurant_${message.id}`;
            let results = sync_connection.query(sql);
            var category_list = new Array();

            for (var result of results) {
                var categoryName = result.category;
                var type = result.type;
                var name = result.name;
                var price = result.price;
                var description = result.description;
                var conf = result.conf;
                var category_list_json = result.category_list;
                var image = `../assets/images/${message.id}/${result.num}.jpg`;

                // 카테고리 중복 확인
                var index = category_list.findIndex(function(item, i) {
                    return item.category == categoryName;
                });

                // 카테고리 중복 시
                if (index != -1) {
                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        category_list[index].product_list.push(product);
                    } else if (type == "set") {
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        category_list[index].set_list.push(set);
                    }
                }
                // 카테고리 중복 아닐 시
                else { 
                    var category = new Object();
                    category_list.push(category);
                    var set_list = new Array();
                    var product_list = new Array();

                    category['category'] = categoryName;
                    category['set_list'] = set_list;
                    category['product_list'] = product_list;

                    // 단품
                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        product_list.push(product);
                    }
                    // 세트
                    else if (type == "set") { 
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        set_list.push(set);
                    }
                }
            }

            /* 유현승 */
            res.json(category_list);
            connection.end();
            break;
        }

        // 음식점 메뉴 추가
        case '00A2':{
            var category = message.category;
            console.log("catecory : " + category);
            var type = message.type;
            var name = message.name;
            var price = message.price;
            var description = message.description;
            var conf = message.conf;
            var category_list = JSON.stringify(message.category_list);
            var image_src = message.image_src;
			var menu_id;

            // 단품 추가
            if (type == "product") {
                var sql = `INSERT INTO restaurant_${message.id} (category,type, name, price, description) VALUES ('${category}','${type}','${name}','${price}','${description}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");

            }
            // 세트 메뉴 추가
            else if (type == "set") {
                var sql = `INSERT INTO restaurant_${message.id} (category,type, name, price, description, conf, category_list) VALUES ('${category}','${type}','${name}','${price}','${description}','${conf}','${category_list}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");
            }

            // 이미지 추가
            let image_decode = Buffer.from(image_src, 'base64');
            let makeImageFile = fs.writeFileSync(`./assets/images/${message.id}/${menu_id}.jpg`, image_decode);



            res.json({status:"GOOD"});

            connection.end();
            break;
        }

        //음식점 메뉴 삭제
        case '00A3':{ 
            var category = message.category;
            var name = message.name;
			
			let sql = `SELECT * FROM restaurant_${message.id} WHERE category='${category}' and name='${name}'; `;
			let results = sync_connection.query(sql);
			let delete_num = results[0].num;
			console.log(delete_num);
			
			// 이미지 삭제
			fs.unlinkSync(`./assets/images/${message.id}/${delete_num}.jpg`)
			console.log("이미지 삭제 완료");
			
			// 메뉴 삭제
            var sql2 = `DELETE FROM restaurant_${message.id} WHERE category='${category}' and name='${name}' `;
            let results2 = sync_connection.query(sql2);
            console.log("메뉴 삭제 완료");
			
			
            res.json({status:"GOOD"});

            connection.end();
            break;
        }

        // 음식점 카테고리 삭제
        case '00A4':{
            var category = message.category;
			let sql = `SELECT * FROM restaurant_${message.id} WHERE category='${message.category}'`;
			let results = sync_connection.query(sql);
			
			// 이미지 삭제
			fs.unlinkSync(`./assets/images/${message.id}/${delete_num}.jpg`)
			console.log("이미지 삭제 완료");

			// 메뉴 삭제
            var sql2 = `DELETE FROM restaurant_${message.id} WHERE category='${message.category}'`;
            let results2 = sync_connection.query(sql2);
            console.log("카테고리 삭제 완료");
			
			
            res.json({status:"GOOD"});

            connection.end();
            break;
        }

        // 음식점 카테고리 변경
        case '00A5':{
            var category = message.category;
            var change = message.change;

            var sql = `UPDATE restaurant_${message.id} SET category='${change}' WHERE category='${category}'`;
            let results = sync_connection.query(sql);
            console.log("카테고리 변경 완료");
            res.json({status:"GOOD"});

            connection.end();
            break;
        }

        // 피시방
        // 피시방 데이터 전송
        case '00B1': {
            var sql = `SELECT * FROM pc_${message.id}`;
            let results = sync_connection.query(sql);

            var category_list = new Array();

            for (var result of results) {
                var categoryName = result.category;
                var type = result.type;
                var name = result.name;
                var price = result.price;
                var description = result.description;
                var conf = result.conf;
                var category_list_json = result.category_list;
                var image = `../assets/images/${message.id}/${result.num}.jpg`;

                // 카테고리 중복 확인
                var index = category_list.findIndex(function(item, i) {
                    return item.category == categoryName;
                });

                // 카테고리 중복 시
                if (index != -1) {
                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        category_list[index].product_list.push(product);
                    } else if (type == "set") {
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        category_list[index].set_list.push(set);
                    }
                }
                // 카테고리 중복 아닐 시
                else { 
                    var category = new Object();
                    category_list.push(category);
                    var set_list = new Array();
                    var product_list = new Array();

                    category['category'] = categoryName;
                    category['set_list'] = set_list;
                    category['product_list'] = product_list;

                    // 단품
                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        product_list.push(product);
                    }
                    // 세트
                    else if (type == "set") { 
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        set_list.push(set);
                    }
                }
            }

            /* 유현승 */
            res.json(category_list);
            connection.end();
            break;
        }

        // 피시방 메뉴 추가
        case '00B2':{
            var category = message.category;
            var type = message.type;
            var name = message.name;7
            var price = message.price;
            var description = message.description;
            var conf = message.conf;
            var category_list = JSON.stringify(message.category_list);
            var image_src = message.image_src;
            var menu_id;

            // 단품 추가
            if (type == "product") {
                var sql = `INSERT INTO pc_${message.id} (category,type, name, price, description) VALUES ('${category}','${type}','${name}','${price}','${description}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");

            }
            // 세트 메뉴 추가
            else if (type == "set") {
                var sql = `INSERT INTO pc_${message.id} (category,type, name, price, description, conf, category_list) VALUES ('${category}','${type}','${name}','${price}','${description}','${conf}','${category_list}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");
            }

            // 이미지 추가
            let image_decode = Buffer.from(image_src, 'base64');
            let makeImageFile = fs.writeFileSync(`./assets/images/${message.id}/${menu_id}.jpg`, image_decode);

            res.json({status:"GOOD"});


            connection.end();
            break;
        }

        // 피시방 메뉴 삭제
        case '00B3':{ 
            var category = message.category;
            var name = message.name;

            var sql = `DELETE FROM pc_${message.id} WHERE category='${category}' and name='${name}' `;
            let results = sync_connection.query(sql);
            console.log("메뉴 삭제 완료");
            res.json({status:"GOOD"});

            connection.end();
            break;
        }

        // 피시방 카테고리 삭제
        case '00B4':{
            var category = message.category;

            var sql = `DELETE FROM pc_${message.id} WHERE category='${category}'`;
            let results = sync_connection.query(sql);
            console.log("카테고리 삭제 완료");

            res.json({status:"GOOD"});
            connection.end();
            break;
        }    

        // 피시방 카테고리 변경
        case '00B5':{
            var category = message.category;
            var change = message.change;
            console.log(category,change);
            var sql = `UPDATE pc_${message.id} SET category='${change}' WHERE category='${category}'`;
            let results = sync_connection.query(sql);
            console.log("카테고리 변경 완료");

            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        // 영화관
        // 영화관 데이터 전송
        case '00C1': {
            var sql1 = `SELECT * FROM movie_${message.id} ORDER BY movie, theater, time ASC; `;
            var sql2 = `SELECT * FROM movie_${message.id}_food; `;

            var movie_result = sync_connection.query(sql1);
            var food_result = sync_connection.query(sql2);

            // 보낼 데이터
            var response_data = new Object();
            var category_list = new Array();
            var movie_list = new Array();

            response_data.category_list = category_list;
            response_data.movie_list = movie_list;

            // 영화 정보 데이터
            for (var result of movie_result) {
                var num = result.num;
                var movieName = result.movie;
                var theater = result.theater;
                var time = result.time;
                var width = result.width;
                var height = result.height;

                // 좌석 정보 가져오기
                var sql = `SELECT * FROM movie_${message.id}_${num}`;
                var seat_list = sync_connection.query(sql);

                var movie = new Object();
                movie.movie = movieName;
                movie.theater = theater;
                movie.time = time;
                movie.width = width;
                movie.height = height;
                movie.seat_list = seat_list;

                movie_list.push(movie);
            }

            // 음식 정보 데이터
            for (var result of food_result) {
                var categoryName = result.category;
                var type = result.type;
                var name = result.name;
                var price = result.price;
                var description = result.description;
                var conf = result.conf;
                var category_list_json = result.category_list;
                var image = `../assets/images/${message.id}/${result.num}.jpg`;

                // 카테고리 중복 확인
                var index = category_list.findIndex(function(item, i) {
                  return item.category == categoryName;
              });

                // 카테고리 중복 시
                if (index != -1) {
                    category_list[index];

                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        category_list[index].product_list.push(product);
                    } else if (type == "set") {
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        category_list[index].set_list.push(set);
                    }
                }
                    // 카테고리 중복 아닐 시
                    else { 
                        var category = new Object();
                        category_list.push(category);
                        var set_list = new Array();
                        var product_list = new Array();

                        category['category'] = categoryName;
                        category['set_list'] = set_list;
                        category['product_list'] = product_list;

                    // 단품
                    if (type == "product") {
                        var product = new Object();
                        product['name'] = name;
                        product['price'] = price;
                        product['desc'] = description;
                        product['image'] = image;

                        product_list.push(product);
                    }
                    // 세트
                    else if (type == "set") { 
                        var set = new Object();
                        set['name'] = name;
                        set['price'] = price;
                        set['desc'] = description;
                        set['image'] = image;
                        set['conf'] = conf;
                        set['category_list'] = category_list_json;

                        set_list.push(set);
                    }
                }
            }


            // response     
            res.json(response_data);
            connection.end();

            break;
        }

        // 영화관 영화 추가
        case '00C2':{
            var movie = message.movie;
            var theater = message.theater;
            var time = message.time;
            var width = message.width;
            var height = message.height;
            var price = message.price;

            console.log(movie);
            console.log(theater);
            console.log(time);
            console.log(width);
            console.log(height);

            // 영화 추가
            var sql = `INSERT INTO movie_${message.id} (movie, theater, time, width, height) VALUES('${movie}','${theater}','${time}',${width},${height})`;
            var results = sync_connection.query(sql);
            console.log("영화 추가 완료");

            // 추가된 영화 num 가져오기
            var num = results.insertId
            console.log(num);

            // 영화 시트 테이블 추가
            var sql = `CREATE TABLE movie_${message.id}_${num}(
            num INT UNSIGNED NOT NULL AUTO_INCREMENT,
            code VARCHAR(50) NULL DEFAULT NULL,
            state VARCHAR(50) NULL DEFAULT NULL,
            price VARCHAR(50) NULL DEFAULT NULL,
            PRIMARY KEY (num)
            )`;
            var results = sync_connection.query(sql);
            console.log("시트 테이블 추가 완료");

            // 영화 시트 추가
            var param = [];
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    var row = new Array();
                    var code = String.fromCharCode(i + 65) + (j + 1).toString();
                    row.push(code);
                    row.push(price.toString());
                    row.push('0');
                    param.push(row);
                }
            }

            var sql = `INSERT INTO movie_${message.id}_${num} (code, price, state) VALUES ?`;
            connection.query(sql, [param], function(err, rows) {
                if (err) console.log(err);
                else {
                    console.log(results);
                    console.log("시트 테이블 데이터 추가 완료");
                }
            });

            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        // 영화관 영화 삭제
        case '00C3':{
            var movie = message.movie;
            var time = message.time;

            var sql = `SELECT * FROM movie_${message.id} WHERE time='${time}' and movie='${movie}'`;
            let results = sync_connection.query(sql);
            var num = results[0].num;
            console.log(num);

            var sql1 = `DELETE FROM movie_${message.id} WHERE time='${time}' and movie='${movie}'`;
            let results1 = sync_connection.query(sql1);
            console.log(results1);
            console.log('영화 삭제 완료');

            // 영화 좌석 테이블 삭제
            var sql2 = `DROP TABLE movie_${message.id}_${num}`;
            let results2 = sync_connection.query(sql2);
            console.log("좌석 테이블 삭제");

            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        // 영화관 음식 메뉴 추가
        case '00C4':{
            var category = message.category;
            var type = message.type;
            var name = message.name;
            var price = message.price;
            var description = message.description;
            var conf = message.conf;
            var category_list = JSON.stringify(message.category_list);
            var image_src = message.image_src;
            var menu_id;

            // 단품 추가
            if (type == "product") {
                var sql = `INSERT INTO movie_${message.id}_food (category,type, name, price, description) VALUES ('${category}','${type}','${name}','${price}','${description}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");

            } 
            // 세트 메뉴 추가
            else if (type == "set") { 
                var sql = `INSERT INTO movie_${message.id}_food (category,type, name, price, description, conf, category_list) VALUES ('${category}','${type}','${name}','${price}','${description}','${conf}','${category_list}')`;
                let results = sync_connection.query(sql);
                menu_id = results.insertId;
                console.log("메뉴 추가 완료");
            }

            // 이미지 추가
            let image_decode = Buffer.from(image_src, 'base64');
            let makeImageFile = fs.writeFileSync(`./assets/images/${message.id}/${menu_id}.jpg`, image_decode);

            res.json({test:"GOOD"});
            connection.end();
            break;
        }

        // 영화관 음식 메뉴 삭제
        case '00C5':{
            var category = message.category;
            var name = message.name;

            var sql = `DELETE FROM movie_${message.id}_food WHERE category='${category}' and name='${name}' `;
            let results = sync_connection.query(sql);
            console.log("메뉴 삭제 완료");

            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        // 영화관 음식 카테고리 삭제
        case '00C6':{
            var category = message.category;

            var sql = `DELETE FROM movie_${message.id}_food WHERE category='${message.category}'`;
            let results = sync_connection.query(sql);
            console.log("카테고리 삭제 완료");
            console.log(results);
            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        // 영화관 음식 카테고리 변경
        case '00C7':{
            var category = message.category;
            var change = message.change;
            var sql = `UPDATE movie_${message.id}_food SET category='${change}' WHERE category='${category}'`;
            let results = sync_connection.query(sql);
            console.log("카테고리 변경 완료");

            res.json({status:"GOOD"});
            connection.end();
            break;
        }
        // 영화관 영화 좌석 업데이트
        case '00C8':{
            let movie = message.movie;
            let time = message.time;
            let seat_arr = message.seat;

            // 변경할 영화 num 가져오기
            let sql = `SELECT * FROM movie_${message.id} WHERE movie='${movie}' and time='${time}'`;
            let results = sync_connection.query(sql);
            let movie_num = results[0].num;
			
			// 영화 좌석 변경
			let sql2 = ``;
			seat_arr.forEach(function(seat) {
				sql2 += "UPDATE movie_"+message.id+"_"+movie_num+" SET state = '" + seat.state + "' WHERE code = '" + seat.code + "'; ";
			})
			let results2 = sync_connection.query(sql2);
			console.log("좌석 변경 완료");


            res.json({status:"GOOD"});
            connection.end();
            break;
        }

        default: {
            console.log(request_code + ' does not exist in request_code.');
            console.log(message);
            connection.end();
            break;
        }
    }

});

// express 서버 시작

http.createServer(app).listen(app.get('port'), app.get('host'), ()=>{
    console.log('Express server running at ' + app.get('host') + ":" + app.get('port'));
});