var test;
function init(){
	let param =
	{
		"request_code": "000Z",
		"message" : {
			"id" : sessionStorage.getItem("id"),
		}
	}
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		console.log("TEST");
		console.log(data);//받는 data
		test = data;
		var i,j,category_row,content_row;
		for(i=0;i<data.length;i++){
			if(i==0){
				category_row = "<li class='nav-item'><a class='nav-link active' id='"+inko.ko2en(data[i].category)+"-tab' data-toggle='tab' href='#"+inko.ko2en(data[i].category)+"' role='tab' aria-controls='"+inko.ko2en(data[i].category)+"' aria-selected='true'>"+data[i].category+"</a></li>";
				content_row = "<div class='tab-pane mt-4 active' id='"+inko.ko2en(data[i].category)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data[i].category)+"-tab'>";
				for(j=0;j<data[i].product_list.length;j++){
					content_row+="<div class='card mx-2 my-2 border' style='width:18rem;float:left'>";
					content_row+="<img class='card-img-top' src=''>";
					content_row+="<div class='card-body'>";
					content_row+="<h5 class='card-title'>"+data[i].product_list[j].name+"</h5>";
					content_row+="<h5 class='card-subtitle'>"+data[i].product_list[j].price+"</h5>";
					content_row+="<p class='card-text'>"+data[i].product_list[j].desc+"</p>";
					content_row+="</div>";
					content_row+="</div>";
				}
				content_row+="</div>";
			}
			else{
				category_row = "<li class='nav-item'><a class='nav-link' id='"+inko.ko2en(data[i].category)+"-tab' data-toggle='tab' href='#"+inko.ko2en(data[i].category)+"' role='tab' aria-controls='"+inko.ko2en(data[i].category)+"' aria-selected='false'>"+data[i].category+"</a></li>";
				content_row = "<div class='tab-pane mt-4' id='"+inko.ko2en(data[i].category)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data[i].category)+"-tab'>";
				for(j=0;j<data[i].product_list.length;j++){
					content_row+="<div class='card mx-2 my-2 border' style='width:18rem;float:left'>";
					content_row+="<img class='card-img-top' src=''>";
					content_row+="<div class='card-body'>";
					content_row+="<h5 class='card-title'>"+data[i].product_list[j].name+"</h5>";
					content_row+="<h5 class='card-subtitle'>"+data[i].product_list[j].price+"</h5>";
					content_row+="<p class='card-text'>"+data[i].product_list[j].desc+"</p>";
					content_row+="</div>";
					content_row+="</div>";
				}
				content_row+="</div>";
			}
			$('#myTab').append(category_row);
			$('#myTab_content').append(content_row);
		}
		
		$('#myTab a').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
			console.log(this.innerHTML);
			document.getElementById("preview").src = '';
			$("#file").val('');
		});
	});
}


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
	console.log(preview);
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