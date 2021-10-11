
//초기 시작하는 부분
$(document).ready(function(){ 
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
});



function make_qr(){
	document.getElementById("no_qr").style.display = "none";
	document.getElementById("qrcode").src = "resources/assets/img/qrcode.png";
	document.getElementById("qrcode").style.display = "";
}

function delete_qr(){
	document.getElementById("no_qr").style.display = "";
	document.getElementById("qrcode").style.display = "none";
	document.getElementById("qrcode").src = "";
}