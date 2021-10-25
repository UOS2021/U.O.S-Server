
//초기 시작하는 부분
$(document).ready(function(){ 
	var id = sessionStorage.getItem("id");
	document.getElementById("no_qr").style.display = "none";
	document.getElementById("qrcode").src = "/assets/qrcode/"+id+'.jpg';
	if(sessionStorage.getItem("company_type")=="영화관"){
		var newa= "<a class='nav-link' href='/pos/movies'><div class='sb-nav-link-icon'><i class='fas fa-tachometer-alt'></i></div>영화 관리</a>"
		$('#nav_side').append(newa);
	}
});
	