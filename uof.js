// express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path'), mysql = require('mysql');
const fs = require('fs');

// mysql 기본설정
const conn = {
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '112antkglok!',
	database: 'uof_account'
};

// express 미들웨어 불러오기
var static = require('serve-static');

// express 객체 생성
var app = express();
var router = express.Router();

// 기본 속성 설정
app.set('port', process.env.PORT || 8080);
app.set('host', '192.168.50.14');

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


app.post('/post', function(req, res, next){
	var connection = mysql.createConnection(conn);
	connection.connect();

	var request_code = req.body.request_code;
	var message = req.body.message;

   	switch (request_code) {
   		case '0000':
   			console(message);
   			break;
   		case '0001':
   			var check_overlap_text = "select * from customer_account where id=?";
   			var res_data_string ='';

   			connection.query(check_overlap_text, message.id , function(err, result, fields){
   				if(result.length > 0){
   					console.log('아이디 중복');
					res_data_string = {response_code: "0002"};
					var res_data_json = JSON.stringify(res_data_string);
   					res.json(res_data_json);
   				}
   				else{
   					var insert_text = "INSERT INTO `customer_account` (`id`, `pw`, `name`, `phone`)"
   					+ "VALUES ('" + message.id + "','" + message.pw + "', '" + message.name + "', '" + message.phone +"');";
   					connection.query(insert_text, function (err, result, fields){
   						if(err){
   							console.log(err);
   						}
   						res_data_string = {response_code: "0001"};
   						var res_data_json = JSON.stringify(res_data_string);
   						res.json(res_data_json);
   					});
   				}
   				
   			});

   			break;

   		case '0002':
   			var check_overlap_text = "select * from uofpartner_account where id=?";
   			var res_data_string ='';
   			connection.query(check_overlap_text, message.id , function(err, result, fields){
   				if(result.length > 0){
   					console.log('아이디 중복');
					res_data_string = {response_code: "0002"};
					var res_data_json = JSON.stringify(res_data_string);
   					res.json(res_data_json);
   				}
   				else{
   					var insert_text = "INSERT INTO `uofpartner_account` (`id`, `pw`, `name`, `phone`, `company_name`, `license_number`, `company_type`, `company_address`)"
   					+ " VALUES ('" + message.id + "','" + message.pw + "', '" + message.name + "', '" + message.phone +"', '" + message.company.name +"', '" + message.company.license_num +"', '" + message.company.type +"', '" + message.company.address +"');";
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
		   			});
   				}
   			
   			});

   			break;
		case '0003':

   		case '0004':
   			var check_overlap_text = "";
   			if(message.type == 'customer'){
   				check_overlap_text = "select * from customer_account where id=?";
   			}
   			else if(message.type == 'uofpartner'){
   				check_overlap_text = "select * from uofpartner_account where id=?";
   			}
   			else{
   				console.log('로그인 type 오류');
   			}

   			var res_data_string ='';

   			connection.query(check_overlap_text, message.id , function(err, result, fields){
   				if(result.length > 0){
   					var check = 'false';
   					for(var i =0; i < result.length; i++){
   						if(result[i].pw == message.pw){
   							check = 'true';
   							break;
   						}
   					}
   					if(check == 'true'){
   						if(request_code == '0003'){
   							console.log('로그인 성공');
   							res_data_string = { response_code: "0003", message: { name: result[0].name, phone: result[0].phone, type: message.type } };	
   						}
   						else{
   							console.log('비밀번호 적합');
   							res_data_string = { response_code: "0004" };
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
   				
   			});
   			break;

   		case '0005':
   			var update_query = "";
   			if(message.type == 'customer'){
   				update_query = "update customer_account set pw='" + message.change_pw +  "' where id=?";
   			}
   			else if(message.type == 'uofpartner'){
   				update_query = "update uofpartner_account set pw='" + message.change_pw +  "' where id=?";
   			}
   			else{
   				console.log('type 오류');
   			}

   			connection.query(update_query, message.id , function(err, result, fields){
   				var res_data_string ='';
   				if(err){
   					console.log('비밀번호 변경 실패');
   					res_data_string = {response_code: "0013"};
   				}
   				else{
   					console.log('비밀번호 변경 성공');
   					res_data_string = {response_code: "0012"};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			break;

   		case '0006':
   			var update_query = "";
   			if(message.type == 'customer'){
   				update_query = "update customer_account set phone='" + message.change_phone +  "' where id=?";
   			}
   			else if(message.type == 'uofpartner'){
   				update_query = "update uofpartner_account set phone='" + message.change_phone +  "' where id=?";
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
   					res_data_string = {response_code: "0014"};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});

   			break;

   		case '0007':
   			var delete_query = "";
   			if(message.type == 'customer'){
   				delete_query = "delete from customer_account where id=?";
   			}
   			else if(message.type == 'uofpartner'){
   				delete_query = "delete from uofpartner_account where id=?";
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
   				
   			});
   			break;
		case '0008':
   			var select_query = "select * from customer_account where id=?";
   			
   			connection.query(select_query, message.id , function(err, result, fields){
   				var res_data_string ='';
   				if(err || result[0].card_num == null ){
   					console.log('카드 조회 실패');
   					res_data_string = {response_code: "0023"};
   				}
   				else{
   					console.log('카드 조회 성공');
   					res_data_string = {response_code: "0022", message: {num: result[0].card_num}};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			break;

   		case '0009':
   			var update_query = "update customer_account set card_num='" + message.card.num +  "', cvc='" + message.card.cvc + "', card_pw='" + message.card.pw +"', due_date='" + message.card.due_date +"' where id=?";
   			//var update_query = "update customer_account set card_num='" + message.card.num +  "', cvc='" + message.card.cvc + "', card_pw='" + message.card.pw + "', due_date='" + message.card.due_date + "' where id=?";
   			connection.query(update_query, message.id , function(err, result, fields){
   				var res_data_string ='';
   				if(err){
   					console.log('카드 등록 실패');
   					console.log(message);
   					res_data_string = {response_code: "0019"};
   				}
   				else{
   					console.log('카드 등록 성공');
   					res_data_string = {response_code: "0018"};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			break;
   		case '0010':
   			var update_query = "update customer_account set card_num=NULL, cvc=NULL, card_pw=NULL, due_date=NULL where id=?";
   			
   			connection.query(update_query, message.id , function(err, result, fields){
   				var res_data_string ='';
   				if(err){
   					console.log('카드 제거 실패');
   					res_data_string = {response_code: "0021"};
   				}
   				else{
   					console.log('카드 제거 성공');
   					res_data_string = {response_code: "0020"};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			break;

   		default:
   			console.log(request_code + ' does not exist in request_code.');
   			console.log(message);
   			break;
   	}

   	//connection.end();
});

// express 서버 시작

http.createServer(app).listen(app.get('port'), app.get('host'), ()=>{
	console.log('Express server running at ' + app.get('port') + ':'+ app.get('host'));
});

