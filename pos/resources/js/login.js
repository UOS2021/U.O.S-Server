function login(){
	if($('#inputid').val()=='' || $('#inputPassword').val()==''){
		alert("아이디 혹은 비밀번호를 입력해주세요.");
		location.reload();
	}
	else{
		var userid = $('#inputid').val();
		var userpw= $('#inputPassword').val();
		let param =
		{
			"request_code": "0003",
			"message":{
				"id": userid,
				"pw" : userpw,
				"type" : "pos"
			}
		};
		var ajax = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		ajax.done(function(result, status){
			var data = JSON.parse(result);
			if(data.response_code == "0003"){
				sessionStorage.setItem("id",userid);
				sessionStorage.setItem("pw",userpw);
				location.href="/pos/list.html";
			}
			else{
				alert("아이디 혹은 비밀번호가 잘못되었습니다.");
				location.reload();
			}
		});
	}
}

function f_enterLogin(){
	if(window.event.keyCode == 13){
		login();
	}
}