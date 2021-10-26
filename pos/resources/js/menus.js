var test;
var selected_category;
function menu_del(del_menu){
	if(sessionStorage.getItem("company_type")=='영화관'){
		var con_test = confirm("선택한 메뉴를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00C5",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"name" : del_menu
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("메뉴가 삭제되었습니다.");
				location.reload();
			});
		}
	}
	else if(sessionStorage.getItem("company_type")=='피시방'){
		var con_test = confirm("선택한 메뉴를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00B3",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"name" : del_menu
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("메뉴가 삭제되었습니다.");
				location.reload();
			});
		}
	}
	else{
		var con_test = confirm("선택한 메뉴를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00A3",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"name" : del_menu
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("메뉴가 삭제되었습니다.");
				location.reload();
			});
		}
	}
}
function init(){
	if(sessionStorage.getItem("company_type")=='영화관'){
		let param =
		{
			"request_code": "00C1",
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
			data = data.category_list;
			test = data;
			var i,j,category_row,content_row;
			for(i=0;i<data.length;i++){
				if(i==0){
					category_row = "<li class='nav-item'><a class='nav-link active' id='"+inko.ko2en(data[i].category)+"-tab' data-toggle='tab' href='#"+inko.ko2en(data[i].category)+"' role='tab' aria-controls='"+inko.ko2en(data[i].category)+"' aria-selected='true'>"+data[i].category+"</a></li>";
					selected_category=data[i].category;
					content_row = "<div class='tab-pane mt-4 active' id='"+inko.ko2en(data[i].category)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data[i].category)+"-tab'>";
					for(j=0;j<data[i].product_list.length;j++){
						content_row+="<div class='card mx-2 my-2 border' style='width:18rem;float:left'>";
						content_row+="<img class='card-img-top' src='"+data[i].product_list[j].image+"'>";
						content_row+="<div class='card-body'>";
						content_row+="<h5 class='card-title' style='height:3rem'>"+data[i].product_list[j].name+"</h5>";
						content_row+="<h5 class='card-subtitle' style='height:2rem'>"+data[i].product_list[j].price+"</h5>";
						content_row+="<p class='card-text'>"+data[i].product_list[j].desc+"</p>";
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
				selected_category = this.innerHTML;
				console.log(this.innerHTML);
				document.getElementById("preview").src = '';
				$("#file").val('');
			});
		});
	}
	else if(sessionStorage.getItem("company_type")=='피시방'){
		let param =
		{
			"request_code": "00B1",
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
			console.log(data);//받는 
			test = data;
			var i,j,category_row,content_row;
			for(i=0;i<data.length;i++){
				if(i==0){
					category_row = "<li class='nav-item'><a class='nav-link active' id='"+inko.ko2en(data[i].category)+"-tab' data-toggle='tab' href='#"+inko.ko2en(data[i].category)+"' role='tab' aria-controls='"+inko.ko2en(data[i].category)+"' aria-selected='true'>"+data[i].category+"</a></li>";
					selected_category=data[i].category;
					content_row = "<div class='tab-pane mt-4 active' id='"+inko.ko2en(data[i].category)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data[i].category)+"-tab'>";
					for(j=0;j<data[i].product_list.length;j++){
						content_row+="<div class='card mx-2 my-2 border' style='width:18rem;float:left'>";
						content_row+="<img class='card-img-top' src='"+data[i].product_list[j].image+"'>";
						content_row+="<div class='card-body'>";
						content_row+="<h5 class='card-title'>"+data[i].product_list[j].name+"</h5>";
						content_row+="<h5 class='card-subtitle'>"+data[i].product_list[j].price+"</h5>";
						content_row+="<p class='card-text'>"+data[i].product_list[j].desc+"</p>";
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
				selected_category = this.innerHTML;
				console.log(this.innerHTML);
				document.getElementById("preview").src = '';
				$("#file").val('');
			});
		});
	}
	else{
		let param =
		{
			"request_code": "00A1",
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
			console.log(data);//받는 
			test = data;
			var i,j,category_row,content_row;
			for(i=0;i<data.length;i++){
				if(i==0){
					category_row = "<li class='nav-item'><a class='nav-link active' id='"+inko.ko2en(data[i].category)+"-tab' data-toggle='tab' href='#"+inko.ko2en(data[i].category)+"' role='tab' aria-controls='"+inko.ko2en(data[i].category)+"' aria-selected='true'>"+data[i].category+"</a></li>";
					selected_category=data[i].category;
					content_row = "<div class='tab-pane mt-4 active' id='"+inko.ko2en(data[i].category)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data[i].category)+"-tab'>";
					for(j=0;j<data[i].product_list.length;j++){
						content_row+="<div class='card mx-2 my-2 border' style='width:18rem;float:left'>";
						content_row+="<img class='card-img-top' src='"+data[i].product_list[j].image+"'>";
						content_row+="<div class='card-body'>";
						content_row+="<h5 class='card-title'>"+data[i].product_list[j].name+"</h5>";
						content_row+="<h5 class='card-subtitle'>"+data[i].product_list[j].price+"</h5>";
						content_row+="<p class='card-text'>"+data[i].product_list[j].desc+"</p>";
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
						content_row+=`<button type='button' class='btn btn-danger' onclick='menu_del("${data[i].product_list[j].name}")' style='width:100%'>삭제</button>`;
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
				selected_category = this.innerHTML;
				console.log(this.innerHTML);
				document.getElementById("preview").src = '';
				$("#file").val('');
			});
		});
	}
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

var product_type='product';
function getType(type) {
  product_type = type;
}
$('#modal_menu_add').on('click', function(){ //메뉴추가하는 스크립트
	var type = product_type;
	var name = document.getElementById('name').value;
	var price = document.getElementById('price').value;
	var description = document.getElementById('explaination').value;
	var conf = null;
	var category_list = null;
	var preview = document.getElementById('preview').src;
	console.log(preview);
	if(sessionStorage.getItem("company_type")=='영화관'){
		let param =
		{
			"request_code": "00C4",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"category" : selected_category,
				"type" : type,
				"name" : name,
				"price" : price,
				"description" : description,
				"conf" : conf,
				"category_list" : category_list,
				"image_src" : preview,
			}
		}
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			$('#myModal').modal('hide');
			alert("메뉴추가완료");
			location.reload();
		});
	}
	else if(sessionStorage.getItem("company_type")=='피시방'){
		let param =
		{
			"request_code": "00B2",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"category" : selected_category,
				"type" : type,
				"name" : name,
				"price" : price,
				"description" : description,
				"conf" : conf,
				"category_list" : category_list,
				"image_src" : preview,
			}
		}
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			$('#myModal').modal('hide');
			alert("메뉴추가완료");
			location.reload();
		});
	}
	else{
		let param =
		{
			"request_code": "00A2",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"category" : selected_category,
				"type" : type,
				"name" : name,
				"price" : price,
				"description" : description,
				"conf" : conf,
				"category_list" : category_list,
				"image_src" : preview,
			}
		}
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			$('#myModal').modal('hide');
			alert("메뉴추가완료");
			location.reload();
		});
	}
});

$('#category_add').on('click', function(){ //카테고리 추가하는 스크립트
	var category_name = document.getElementById('category_name').value;
	var category_row = "<li class='nav-item'><a class='nav-link' id='"+inko.ko2en(category_name)+"-tab' data-toggle='tab' href='#"+inko.ko2en(category_name)+"' role='tab' aria-		controls='"+inko.ko2en(category_name)+"' aria-selected='false'>"+category_name+"</a></li>";
		$('#myTab').append(category_row);
	$('#category').modal('hide');
	var content_row = "<div class='tab-pane mt-4' id='"+inko.ko2en(category_name)+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(category_name)+"-tab'>";
	content_row+="</div>";
	$('#myTab_content').append(content_row);
	$('#myTab a').on('click', function (e) {
		e.preventDefault();
		$(this).tab('show');
		selected_category = this.innerHTML;
		console.log(this.innerHTML);
		document.getElementById("preview").src = '';
		$("#file").val('');
	});
});

$('#category_delete').on('click', function(){ //카테고리 삭제하는 스크립트
	if(sessionStorage.getItem("company_type")=='영화관'){
		var con_test = confirm("선택한 카테고리를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00C6",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리가 삭제되었습니다.");
				location.reload();
			});
		}
	}
	else if(sessionStorage.getItem("company_type")=='피시방'){
		var con_test = confirm("선택한 카테고리를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00B4",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리가 삭제되었습니다.");
				location.reload();
			});
		}
	}
	else{
		var con_test = confirm("선택한 카테고리를 삭제하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00A4",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리가 삭제되었습니다.");
				location.reload();
			});
		}
	}
	
	
});

$('#change_category').on('click', function(){ //카테고리명 변경ㄴ하는 스크립트
	if(sessionStorage.getItem("company_type")=='영화관'){
		var con_test = confirm("선택한 카테고리 명을 변경하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00C7",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"change" : document.getElementById("change_category_name").value,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리명이 변경되었습니다.");
				location.reload();
			});
		}
	}
	else if(sessionStorage.getItem("company_type")=='피시방'){
		var con_test = confirm("선택한 카테고리 명을 변경하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00B5",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"change" : document.getElementById("change_category_name").value,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리명이 변경되었습니다.");
				location.reload();
			});
		}
	}
	else{
		var con_test = confirm("선택한 카테고리 명을 변경하시겠습니까?");
		if(con_test){
			let param =
			{
				"request_code": "00A5",
				"message" : {
					"id" : sessionStorage.getItem("id"),
					"category" : selected_category,
					"change" : document.getElementById("change_category_name").value,
				}
			}
			var req = $.ajax({
				url : "/post",
				data : param,
				type : 'POST',
				dataType : 'json'
			});
			req.done(function(data, status){
				alert("카테고리명이 변경되었습니다.");
				location.reload();
			});
		}
	}
	
	
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