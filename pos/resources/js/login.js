function login(){
	if($('#inputid').val()=='' || $('#inputPassword').val()==''){
		alert("아이디 혹은 비밀번호를 입력해주세요.");
		location.reload();
	}
	else{
		var param = {};
		param.userid = $('#inputid').val();
		param.userpw = $('#inputPassword').val();
		var ajax = $.ajax({
			url : "/login",
			data : param,
			type : 'POST',
			dataType : "JSON",
			success:function(result){
				alert(result.msg);
				sessionStorage.setItem("userid",param.userid);
				sessionStorage.setItem("userpw",param.userpw);
				location.href="/pos/list.html";
			}
		});
	}
}