// express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path'), mysql = require('mysql'), QRCode = require('qrcode');
const fs = require('fs');

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
  database: 'uos'
};

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
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


router.route('/').get(function(req, res){

  /*
  QRCode.toDataURL(url_text,function(err, url){
    console.log(url);
  });
  */
/*
  var options = {
    host: 'ipv4bot.whatismyipaddress.com',
    port: 80,
    path: '/'
  };
  http.get(options, function(res2) {
    res2.on("data", function(ip) {
      console.log("BODY: " + ip);
      var url_text = "uosmobile://action?uosPartnerId=" + ip + "&targetPort=8080;";
      QRCode.toDataURL(url_text , function(err , url) {
        //res.send(url);
        var data = url.replace(/.*,/ , ''); 
        console.log("들어옴");
        //var img = new Buffer(data , 'base64');
        //res.writeHead(200 , {'Content-Type':'image/png'});
        //res.end(img);

        var bitmap = Buffer.from(data, 'base64');
        fs.writeFileSync('qrcode/qrcode1.jpg', bitmap);
      });
    });
  });
  */
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

app.use('/', router);


app.post('/post', function(req, res, next){
  var connection = mysql.createConnection(conn);
  connection.connect();

  var request_code = req.body.request_code;
  var message = req.body.message;

  console.log(message);
  switch (request_code) {
    case '0000':
    console.log(message);
    connection.end();
    break;
    case '0001':
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

    case '0002':
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
          fs.writeFileSync('qrcode.jpg', bitmap);

          var res_data_string = {response_code: "0001"};
          var res_data_json = JSON.stringify(res_data_string);
          res.json(res_data_json);

          //res.writeHead(200, {'Content-Type' : 'pos/menus.html'})

          var url_text = "uosmobile://action?uosPartnerId=" + message.uospartner_id + ";";
          QRCode.toDataURL(url_text , function(err , url) {
            //res.send(url);
            var data = url.replace(/.*,/ , ''); 
            console.log("QR코드 생성");
            //var img = new Buffer(data , 'base64');
            //res.writeHead(200 , {'Content-Type':'image/png'});
            //res.end(img);

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
        

      }
      connection.end();
    });

    break;
    case '0003':
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

    case '0004':
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


    });

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
      connection.end();
    });
    break;

    case '0005':
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

    case '0006':
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
    case '0007':
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

    case '0008':
    var update_query = "update customer_account set card_num='" + message.card.num +  "', cvc='" + message.card.cvc + "', card_pw='" + message.card.pw +"', due_date='" + message.card.due_date +"' where id=?";
        //var update_query = "update customer_account set card_num='" + message.card.num +  "', cvc='" + message.card.cvc + "', card_pw='" + message.card.pw + "', due_date='" + message.card.due_date + "' where id=?";
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
        case '0009':
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

        case '0010' :

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
        
        var insert_text = "INSERT INTO `order_buffer` (`state`, `date`, `customer_id`, `uospartner_id`, `company_name`, `card`, `orderlist`, `price`) "
        + "VALUES ( 0, '" + now_date + "','" + message.customer_id + "','" + message.uospartner_id + "','" + message.company_name + "','" + JSON.stringify(message.card) + "','" + JSON.stringify(message.order) + "',"+price+");";
        connection.query(insert_text, function (err, result, fields){

          if(err){
            console.log(err);
            res_data_string = {response_code: "0010"};
            console.log('주문접수 실패');

            var res_data_json = JSON.stringify(res_data_string);
            res.json(res_data_json);
          }
          else{
            res_data_string = {response_code: "0010"};
            console.log("주문 버퍼 추가");

            var res_data_json = JSON.stringify(res_data_string);
            res.json(res_data_json);

          }
          connection.end();
        });
        
        break;

        case '0011' :
        
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

        case '0012':
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
        

        case '0013':
        var select_query = "select * from order_buffer where uospartner_id=?";
        
        connection.query(select_query, message.uospartner_id , function(err, result, fields){


        });

        var res_data_string = { response_code: "0007", message: { company: { name: "companyname", type: "pc" }, category_list: [{ category: "category", product_list:[{ name: "productname", price: 1000, desc: "desc", image: "img" }], set_list: [{ name: "setname", price: 1000, desc: "desc", conf: "conf", image: "img", category_list: [{ category: "category", product_list:[{ name: "productname", price: 1000, desc: "desc" }] }] }] }] } };

        res.json(res_data_string);
        break;

        case '0014':

        break;

        case '0015':
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

        case '0017': 
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

        case '000A' :

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

        case '000B':
        // select order_code, uospartner_id, state from order_buffer where uospartner_id="testidpc" and (state=1 or state=2)and order_code > (select order_code from order_buffer where uospartner_id="testidpc" and (state=1 or state=2) limit 1 offset 4);
        var index = message.state0_num;
        var select_query = "select * from order_buffer where uospartner_id=? and (state=0 or state=4) and order_code > (select order_code from order_buffer where uospartner_id=? and (state=0 or state=4) limit 1 offset "+ index +")";

        //var select_query = "select * from order_buffer where uospartner_id=? and (state=? or state=?)";
        connection.query(select_query, [message.id, message.id] , function(err, result, fields){
          if(err){
            console.log("sql질의 에러");
          }
          else {
            var check = false;
            var response_obj = new Object();
            // 추가 된 거 있을 때
            if(result.length > 0){
              check = true;

              response_obj.response_code = "B000";

              var order_array_arr = new Array();
              var cancel_order_code_arr = new Array();

              for(var i = 0; i < result.length; i++){
                if(result[i].state == 0){
                  var obj = new Object();
                  obj.order_code = result[i].order_code;
                  obj.state = result[i].state;
                  obj.order_list = result[i].orderlist;
                  obj.date = result[i].date;
                  order_array_arr.push(obj);
                }
                else if(result[i].state == 4){
                  cancel_order_code_arr.push(result[i].order_code);
                }
              }

              if(order_array_arr.length == 0){
                response_obj.message = { order_codes : cancel_order_code_arr };
              }
              else if(cancel_order_code_arr.length == 0){
                response_obj.message = { order_array : order_array_arr };
              }
              else{
                response_obj.message = {
                  order_codes : cancel_order_code_arr,
                  order_array : order_array_arr
                };
              }

              res.json(response_obj);
            }

            //추가 된 거 없을 때
            else {
              response_obj.response_code = "C000";
              res.json(response_obj);
            }
          }

          connection.end();
        });

        break;

        // 주문 수락 버튼
        case '000C' :
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

        //주문 거절
        case '000D' :

        var select_query1 = "select company_name from order_buffer where order_code=" + message.order_code + ";";
        var select_query2 = "select fcm_token from customer_account where id=(select customer_id from order_buffer where order_code=" + message.order_code + ");";
        var update_query = "update order_buffer set state=5 where order_code=" + message.order_code + ";";
        var fcm_token = "";
        var company_name = "";

        connection.query(select_query1, function(err, result, fields){
          company_name = result[0].company_name;
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
          response_obj.message = { response_code : "D000" };

          res.json(response_obj);


          connection.end();
        });
        break;

        //조리 완료
        case '000E' :

        break;

        //수령 완료
        case '000F' :

        break;

        //코로나 데이터 보내기
        case '000G' :
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



        case '000Z':

        /* 유현승 */


        connection.end();
        break;

        /*

        case '000C':

        var select_query = "select * from customer_account where id=?";
        
        connection.query(select_query, message.id , function(err_origin, result_origin, fields){
          var res_data_string ='';
          if(err_origin){
            console.log('없는 아이디');
            res_data_string = {response_code: "D000"};

            var res_data_json = JSON.stringify(res_data_string);
            console.log('보내는 값 : ' + res_data_json)
            res.json(res_data_json);
          }
          else if(result_origin[0].card_pw != message.card.pw){
            console.log("카드 비밀번호 부적합");
            res_data_string = {response_code: "C000"};

            var res_data_json = JSON.stringify(res_data_string);
            console.log('보내는 값 : ' + res_data_json)
            res.json(res_data_json);
          }
          else{
            console.log('카드 조회 성공');

            var today = new Date();

            function plusZero(data){
              return (data < 10 ? '0' + data : data);
            }

            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            var date = today.getDate();
            var hour = today.getHours();
            var minute = today.getMinutes();
            var second = today.getSeconds();

            var today_string = year + "-" + plusZero(month) + "-" + plusZero(date) + " "+ plusZero(hour) + ":" + plusZero(minute) + ":" + plusZero(second);

            var insert_text = "INSERT INTO `order_details` (`id`, `date`, `company_name`, `orderlist`, `price`)"
            + "VALUES ('" + message.id + "','" + today_string + "', '" + message.company_name + "', '" + JSON.stringify(message.order) + "', '" + message.total_price +"');";
            connection.query(insert_text, function (err, result, fields){

              if(err){
                console.log(err);
                res_data_string = {response_code: "B000"};
                console.log('결제 실패');

                var res_data_json = JSON.stringify(res_data_string);
                console.log('보내는 값 : ' + res_data_json)
                res.json(res_data_json);
              }
              else{

                var select_query2 = "select COUNT(`num`) AS numCount from order_details";

                connection.query(select_query2, function(err2, result2, fields){
                  res_data_string = {response_code: "A000", message: {num: result2[0].numCount}};
                  console.log('결제 성공');

                  var res_data_json = JSON.stringify(res_data_string);
                  console.log('보내는 값 : ' + res_data_json)
                  res.json(res_data_json);
                });

              }
            });                   
          }


          connection.end();
        });

        break;
        */

        default:
        console.log(request_code + ' does not exist in request_code.');
        console.log(message);
        connection.end();
        break;
        
      }

    });

// express 서버 시작

http.createServer(app).listen(app.get('port'), app.get('host'), ()=>{
  console.log('Express server running at ' + app.get('host') + ":" + app.get('port'));
});


