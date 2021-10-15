
//초기 시작하는 부분
$(document).ready(function(){ 
	var id = sessionStorage.getItem("id");
	document.getElementById("no_qr").style.display = "none";
	document.getElementById("qrcode").src = "/qrcode/"+id+'.jpg';
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