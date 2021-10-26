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
	document.getElementById('name').value='';
	document.getElementById('price').value='';
	document.getElementById('explaination').value='';
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
$('#if_set').hide();
$('#if_set_conf').hide();
function getType(type) {
    product_type = type;
	console.log(type);
	if(type=='product'){
		$('#if_set').hide();
		$('#if_set_conf').hide();
	}
	else if(type=='set'){
		
		$('#if_set_conf').show();
		$('#if_set').show();
	}
}
$('#modal_menu_add').on('click', function(){ //메뉴추가하는 스크립트
	var type = product_type;
	var name = document.getElementById('name').value;
	var price = document.getElementById('price').value;
	var description = document.getElementById('explaination').value;
	var conf =document.getElementById('set_conf').value;
	var category_list = side_menu_list;
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
var side_category_cnt=0;
function add_side_category(){
	side_category_menu_index=0;
	document.getElementById('side_category_name').value='';
	$('#side_category_menus').empty();
	$('#myModal2').modal('show');
}
var side_category_menu_index = 0;
function add_side_menu(){
	var rows;
	rows = "<div id='side_menu_"+side_category_menu_index+"'>";	
		rows += "<div class='row'>";
			rows += "<div class='col'>";
				rows += "<label for='name' class='col-form-label'>이름</label>";
				rows += "<input type='text' class='form-control' id='name"+side_category_menu_index+"'>";
			rows += "</div>";
			rows += "<div class='col'>";
				rows += "<label for='price' class='col-form-label'>가격</label>";
				rows += "<input type='text' class='form-control' id='price"+side_category_menu_index+"'>";
			rows += "</div>";
			rows += "<div class='col'>";
				rows += " <label for='explaination' class='col-form-label'>설명</label>";
				rows += "<input type='text' class='form-control' id='explaination"+side_category_menu_index+"'>";
			rows += "</div>";
				rows += `<button type='button' class='btn btn-danger btn-sm' onclick='delete_side_menu("${side_category_menu_index}")'>X</button>`;
		rows += "</div>";
	rows += "</div>";
	side_category_menu_index++;
	$('#side_category_menus').append(rows);
}
function delete_side_menu(index){
	var where = 'side_menu_'+index;
	console.log(where);
	document.getElementById(where).remove();
}

var side_menu_list = new Array();
function side_category_add(){
	var side_name,side_price,side_explain;
	var aJsonArray = new Array();
	var bJson = new Object();
	var side_name = document.getElementById('side_category_name').value;
	var cnt=0;
	for(var i=0;i<side_category_menu_index;i++){
		var aJson = new Object();
		if(document.getElementById('side_menu_'+i)){
			side_name = document.getElementById('name'+i).value;
			side_price = document.getElementById('price'+i).value;
			side_explain = document.getElementById('explaination'+i).value;
			console.log(side_name,side_price,side_explain);
			aJson.price = side_price;
			aJson.name = side_name;
			aJson.desc = side_explain;
			cnt++;
		}
		aJsonArray.push(aJson);
		
	}
	bJson.product_list = aJsonArray;
	bJson.category = side_name;
	bJson.required = true;
	side_menu_list.push(bJson);
	$('#myModal2').modal('hide');
	var rows2 = "<button type='button' class='btn btn-success' style='margin-right:5px;'>"+side_name+"<span class='badge badge-secondaryㄴ'>외 "+cnt+"개 항목"+"</span></button>"
	$('#side_list').append(rows2);
}


$('#modal_open').on('click', function(){
	side_menu_list = new Array();
    $('#myModal').modal('show');
	$('#side_list').empty();
	$('#if_set').hide();
	$('#if_set_conf').hide();
	$("#product").prop("checked", true);
	document.getElementById('name').value='';
	document.getElementById('price').value='';
	document.getElementById('explaination').value='';
	document.getElementById("preview").src = '';
	console.log("click open");
});
$('#modal_close2').on('click', function(){
    $('#myModal2').modal('hide');
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