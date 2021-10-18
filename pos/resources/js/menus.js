function init(){
	let param =
	{
		// "request_code": "000A",
		"message" : {
			"id" : sessionStorage.getItem("id"),
			"company_type" : sessionStorage.getItem("company_type")
		}
	}
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
	console.log(this.innerHTML);
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

$('#category_open').on('click', function(){
    $('#category').modal('show');
});
$('#category_close').on('click', function(){
    $('#category').modal('hide');
});

$('#modal_menu_add').on('click', function(){ //메뉴추가하는 스크립트
	var preview = document.getElementById('preview').src;
	var name = document.getElementById('name').value;
	var price = document.getElementById('price').value;
	var explaination = document.getElementById('explaination').value;

});

$('#category_add').on('click', function(){ //카테고리 추가하는 스크립트
	var category_name = document.getElementById('category_name').value;
	
	
});

$('#category_delete').on('click', function(){ //카테고리 삭제하는 스크립트
	
	
	
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
	if(sessionStorage.getItem("company_type")=="영화관"){
		var newa= "<a class='nav-link' href='/pos/movies'><div class='sb-nav-link-icon'><i class='fas fa-tachometer-alt'></i></div>영화 관리</a>"
		$('#nav_side').append(newa);
	}
	init();
});