// express 기본 모듈 불러오기
var express = require('express'), http = require('http'), path = require('path'), mysql = require('mysql'), QRCode = require('qrcode');
const fs = require('fs');

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


app.use('/', router);


app.post('/post', function(req, res, next){
	var connection = mysql.createConnection(conn);
	connection.connect();

	var request_code = req.body.request_code;
	var message = req.body.message;

	switch (request_code) {
		case '0000':
		console.log(message);
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
		var check_overlap_text = "select * from uospartner_account where id=?";
		var res_data_string ='';
		connection.query(check_overlap_text, message.id , function(err, result, fields){
			if(result.length > 0){
				console.log('아이디 중복');
				res_data_string = {response_code: "0002"};
				var res_data_json = JSON.stringify(res_data_string);
				res.json(res_data_json);
			}
			else{
				var insert_text = "INSERT INTO `uospartner_account` (`id`, `pw`, `name`, `phone`, `company_name`, `license_number`, `company_type`, `company_address`)"
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
		console.log('test')
		var check_overlap_text = "";
		if(message.type == 'customer'){
			check_overlap_text = "select * from customer_account where id=?";
		}
		else if(message.type == 'uospartner' || message.type == 'pos'){
			check_overlap_text = "select * from uospartner_account where id=?";
		}
		else{
			console.log('로그인 type 오류');
		}

		var res_data_string ='';

		connection.query(check_overlap_text, message.id , function(err, result, fields){
			if(err){
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
					if(request_code == '0003'){
						console.log('로그인 성공');
						var companyName = "";
						if(message.type == 'uospartner' || message.type == 'pos'){
							companyName = result[0].company_name;
							if(message.type == 'pos'){
								//res.writeHead(200, {'Content-Type' : 'pos/menus.html'})

								var url_text = "uosmobile://action?uosPartnerId=" + message.id + ";";
								QRCode.toDataURL(url_text , function(err , url) {
									//res.send(url);
									var data = url.replace(/.*,/ , ''); 
									console.log("들어옴");
									//var img = new Buffer(data , 'base64');
									//res.writeHead(200 , {'Content-Type':'image/png'});
									//res.end(img);

									var bitmap = Buffer.from(data, 'base64');
									fs.writeFileSync('qrcode/' + message.id +'.jpg', bitmap);
								});
							}
						}
						res_data_string = { response_code: "0003", message: { name: result[0].name, phone: result[0].phone, type: message.type, company_name: companyName, company_type: result[0].company_type } }; }


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
				res_data_string = {response_code: "0015"};
			}
			else{
				console.log('비밀번호 변경 성공');
				res_data_string = {response_code: "0014"};
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
				res_data_string = {response_code: "0017"};
			}
			else{
				console.log('휴대폰 번호 변경 성공');
				res_data_string = {response_code: "0016"};
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
				res_data_string = {response_code: "0019"};
			}
			else{
				console.log('회원 탈퇴 성공');
				res_data_string = {response_code: "0018"};
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
				res_data_string = {response_code: "0025"};
			}
			else{
				console.log('카드 조회 성공');
				res_data_string = {response_code: "0024", message: {num: result[0].card_num, cvc: result[0].cvc, due_date: result[0].due_date}};
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
   					res_data_string = {response_code: "0021"};
   				}
   				else{
   					console.log('카드 등록 성공');
   					res_data_string = {response_code: "0020"};
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
   					res_data_string = {response_code: "0023"};
   				}
   				else{
   					console.log('카드 제거 성공');
   					res_data_string = {response_code: "0022"};
   				}

   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			break;
   			case '0013':
   			var select_query = "select * from order_details where id=? order by num desc";
   			
   			connection.query(select_query, message.id , function(err, result, fields){
   				var res_data_string ='';
   				if(err || result == ""){
   					console.log('주문 내역 없음');
   					res_data_string = {response_code: "0013", message: { order_list: [] }};

   					var res_data_json = JSON.stringify(res_data_string);
   					res.json(res_data_json);
   				}
   				else{
   					
   					console.log('주문 내역 성공');
   					//console.log(result[0].orderlist);
   					var order_list_json = { date: result[0].date, company_name: result[0].company_name, order: result[0].orderlist };
   					var order_list = JSON.stringify(order_list_json);
   					//console.log("result : " + order_list);
   					for(var i = 1; i < result.length; i++){
   						order_list_json = { date: result[i].date, company_name: result[i].company_name, order: result[i].orderlist };
   						order_list = order_list + "," + ((JSON.stringify(order_list_json)).replace('"[', '[')).replace(']"', "]");
   					}
   					res_data_string = (("{response_code: \"0013\", message: { order_list: [" + order_list + "] }}").replace('"[', '[')).replace(']"', "]");
   					//console.log(res_data_string.replace("\\", ""));

   					//var res_data_json = JSON.stringify(res_data_string);
   					res.json(res_data_string);
   				}

   				
   				
   			});
   			break;

   			case '000A':



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
	console.log('Express server running at ' + app.get('host') + ":" + app.get('port'));
});


