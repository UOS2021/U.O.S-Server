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