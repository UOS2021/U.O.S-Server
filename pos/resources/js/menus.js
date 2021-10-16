function init(){
	let param =
	{
		// "request_code": "000A",
		"message" : {
			"id" : sessionStorage.getItem("id")
		}
	};
	var req = $.ajax({
		url : "/menu",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){

		console.log(data);//받는 data		
	});
}
$('#myTab a').on('click', function (e) {
	e.preventDefault();
    $(this).tab('show');
    document.getElementById("preview").src = '';
    $("#file").val('');
});
$('#modal_open').on('click', function(){
    $('#myModal').modal('show');
	console.log("click open");
});
$('#modal_close').on('click', function(){
    $('#myModal').modal('hide');
});
$('#modal_menu_add').on('click', function(){ //메뉴추가하는 스크립트


});
$(document).on("click", ".browse", function() {
    var file = $(this).parents().find(".file");
    file.trigger("click");
});
$('input[type="file"]').change(function(e) {
	var fileName = e.target.files[0].name;
    $("#file").val(fileName);
	
    var reader = new FileReader();
    reader.onload = function(e) {
        // get loaded data and render thumbnail.
        document.getElementById("preview").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]); // 이미지 url
});

$(document).ready(function(){	
	init();
});