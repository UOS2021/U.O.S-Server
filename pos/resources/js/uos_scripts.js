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
				location.href="/pos/list.html";
			}
		});
	}
}

data = {'no':2,'number':35,'menu':"맥스파이시 상하이 버거 세트",'time':"2021-10-11 10:55"};

function list_attr_add(){
	
	var no = data['no'];
	var number = data['number'];
	var menu = data['menu'];
	var time = data['time'];
	var newtr = "<tr><td>"+no+"</td>"+"<td>"+number+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	$('#tables').append(newtr);	
}

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

//qr코드 페이지 렌더링할때 ajax로 서버에서 qrcode 있는지 없는지 확인해야할듯