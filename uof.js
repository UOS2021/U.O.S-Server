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

	var paramDecoded;
	var inputData;

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
   						console.log('로그인 성공');
   						res_data_string = {response_code: "0003"};
   						
   					}
   					else{
   						console.log('비밀번호 부적합');
   						res_data_string = {response_code: "0005"};
   						
   					}
					
   				}
   				else{
   					console.log('없는 id');
   					res_data_string = {response_code: "0004"};
   					
   				}
   				var res_data_json = JSON.stringify(res_data_string);
   				res.json(res_data_json);
   				
   			});
   			
   			break;

   		case '0004':

   			break;
   		default:
   			console.log(request_code + ' does not exist in request_code.');
   			console.log(message);
   			break;
   	}

   	/*
   	var res_data_string = {request_code: "0003"};
   	var res_data_json = JSON.stringify(res_data_string);
   	res.json(res_data_json);
	*/

   	//connection.end();
});

/*
router.route('/').get(function(req, res){
	res.redirect('/homepage/index.html');
});
router.route('/routetest').get(function(req, res){
	res.redirect('http://google.co.kr');
});
app.use('/', router);

router.route('/rss').get( (req, res)=>{
	console.log("rss data requested");
	var feed = "http://rss.joins.com/joins_news_list.xml";
	http.get(feed, (httpres)=>{
		var rss_res="";
		httpres.on('data', (chunk)=>{
			rss_res += chunk;
		});
		httpres.on('end', (chunk)=>{
			res.send(rss_res);
			console.log("rss response completed");
			res.end();
		});
	});
});
*/

/*
app.listen(8080, () => {

	console.log('Example app listening on port 8080!');

});
*/

/*
app.use(express.urlencoded()); // post 방식 처리
app.use(express.json()); // 클라이언트와 서버간에 json 형태의 데이터를 사용하겠다
*/

// express 서버 시작


http.createServer(app).listen(app.get('port'), app.get('host'), ()=>{
	console.log('Express server running at ' + app.get('port') + ':'+ app.get('host'));
});

