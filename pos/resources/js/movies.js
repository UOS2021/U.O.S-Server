var total_seat = [];
var origin_seat = [];
var test;
var selected_movie = [];
var selected_index=0;

function click_movie(index){
	selected_index=index;
	console.log(selected_index);
}
function init(){
	let param =
	{
		"request_code": "00C1",
		"message" : {
			"id" : sessionStorage.getItem("id")
		}
	}
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		var i,j,now_theater,now_movie,movie_rows,content_rows;
		console.log(data.movie_list);//받는 data	
		test=data.movie_list;
		now_movie = data.movie_list[0].movie;
		now_theater = data.movie_list[0].theater;
		
		var cnt_name=1;
		var movie_names = [];
		movie_names.push(now_movie);
		for(i=0;i<data.movie_list.length;i++){
			if(data.movie_list[i].movie != now_movie){
				cnt_name++;
				now_movie = data.movie_list[i].movie;
				movie_names.push(now_movie);
			}
		}
		selected_movie = [data.movie_list[0].movie,data.movie_list[0].theater+" "+data.movie_list[0].time];
		for(i=0;i<cnt_name;i++){
			movie_rows="<li class='nav-item dropdown'>";
			movie_rows+="<a class='nav-link dropdown-toggle' data-bs-toggle='dropdown' href='#' role='button' aria-expanded='false'>"+movie_names[i]+"</a>";
			movie_rows+="<ul class='dropdown-menu'>";
			for(j=0;j<data.movie_list.length;j++){
					
				if(data.movie_list[j].movie==movie_names[i]){
					if(j==0){
						content_rows = "<div class = 'tab-pane mt-4 active' id='"+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data.movie_list[j].movie)+j+"_tab'>";
								content_rows += "<h5 class='card-title'>"+data.movie_list[j].movie+"</h5>";
								content_rows += "<h5 class='card-title'>"+data.movie_list[j].theater+" "+data.movie_list[j].time+"</h5>";
							content_rows += "<div class='card mx-2 my-2 border' style='float:left'>";
								content_rows += "<div class='card-body' id = '"+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"_body'>";
								content_rows += "</div>";
							content_rows += "</div>";
						content_rows += "</div>";
						$('#myTab_content').append(content_rows);
					}
					else{
						content_rows = "<div class = 'tab-pane mt-4' id='"+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"' role = 'tabpanel' aria-labelledby='"+inko.ko2en(data.movie_list[j].movie)+j+"_tab'>";
								content_rows += "<h5 class='card-title'>"+data.movie_list[j].movie+"</h5>";
								content_rows += "<h5 class='card-title'>"+data.movie_list[j].theater+" "+data.movie_list[j].time+"</h5>";
							content_rows += "<div class='card mx-2 my-2 border' style='float:left'>";
								content_rows += "<div class='card-body' id = '"+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"_body'>";
								content_rows += "</div>";
							content_rows += "</div>";
						content_rows += "</div>";
						$('#myTab_content').append(content_rows);
					}
					
					movie_rows+="<li><a class='dropdown-item' onclick='click_movie("+j+")' href='#"+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"'>"+data.movie_list[j].theater+" "+data.movie_list[j].time+"</a></li>"
					var seats = new Array(data.movie_list[j].seat_list.length/data.movie_list[j].width);
					var origin = new Array(data.movie_list[j].seat_list.length/data.movie_list[j].width);
					for ( var k =0;k<seats.length;k++){
						seats[k] = new Array((data.movie_list[j].width)-1);
						origin[k] = new Array((data.movie_list[j].width)-1);
					}
					for (var k =0;k<data.movie_list[j].seat_list.length;k++){
						seats[(data.movie_list[j].seat_list[k].code[0].charCodeAt(0))%65][parseInt(data.movie_list[j].seat_list[k].code.substr(1,3))-1] = parseInt(data.movie_list[j].seat_list[k].state);
						origin[(data.movie_list[j].seat_list[k].code[0].charCodeAt(0))%65][parseInt(data.movie_list[j].seat_list[k].code.substr(1,3))-1] = parseInt(data.movie_list[j].seat_list[k].state);
					}
					total_seat.push(seats);
					origin_seat.push(origin);
					var seat_alpha = 65;
					var input_id = '#'+inko.ko2en(data.movie_list[j].movie.replace(/\s/gi, ""))+j+"_body";
					$.each(seats,function(indexY,line){
						var $line = $('<div><div style="float:left;width:60px">'+String.fromCharCode(seat_alpha)+"열"+'</div></div>').addClass('line');
						$.each(line,function(indexX,seat){
							var $output = $('<div></div>',{
								'class' : 'seat',
								'data_x' : indexX,
								'data_y' : indexY,
								'data_state' : seat,
							}).appendTo($line);
							if(seat == 0) // 좌석값이 '0'이면 'enable'스타일 적용
								$output.addClass('enable');
							else if(seat == 1){ // 불가능
								$output.addClass('disable');
							}
							else if(seat == 2){ // 예약된좌석
								$output.addClass('reserved');
							}
						});
						$line.appendTo(input_id);
						seat_alpha++;
					});
				}
			}
			movie_rows+="</ul>";
			movie_rows+="</li>";
			$('#myTab').append(movie_rows);
		}
		$('#myTab a').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
			console.log(this.innerHTML);
			selected_movie.push(this.innerHTML);
		});
	});
	
	// $.each(seats,function(indexY,line){
	// 	var $line = $('<div><div style="float:left;width:60px">'+String.fromCharCode(seat_alpha)+"열"+'</div></div>').addClass('line');
	// 	$.each(line,function(indexX,seat){
	// 		var $output = $('<div></div>',{
	// 			'class' : 'seat',
	// 			'data-x' : indexX,
	// 			'data-y' : indexY
	// 		}).appendTo($line);
			
	// 		if(seat == 1) // 좌석값이 '1'이면 'enable'스타일 적용
	// 			$output.addClass('enable');
	// 		else if(seat == 2){
	// 			$output.addClass('disable');
	// 		}
	// 	});
	// 	$line.appendTo('#set_body');
	// 	seat_alpha++;
	// });
	
}
$('#myTab a').on('click', function (e) {
	e.preventDefault();
    $(this).tab('show');
	console.log(this.innerHTML);
});

$('#modal_open').on('click', function(){
    $('#myModal').modal('show');
	console.log("click open");
});
$(document).on('click', '.seat', function (e) {
	console.log($(this).attr('data_y')+","+$(this).attr('data_x'));
	if($(this).attr('data_state')==0){
		$(this).attr('data_state',1);
		$(this).addClass('disable');
		$(this).removeClass('enable');
		total_seat[selected_index][$(this).attr('data_y')][$(this).attr('data_x')] = 1;
	}
	else if($(this).attr('data_state')==1){
		$(this).attr('data_state',0);
		$(this).removeClass('disable');
		$(this).addClass('enable');
		total_seat[selected_index][$(this).attr('data_y')][$(this).attr('data_x')] = 0;
	}
});

$('#modal_close').on('click', function(){
    $('#myModal').modal('hide');
});

$('#movie_delete').on('click', function(){
	var movie_name = selected_movie[selected_movie.length-2];
	var movie_time = selected_movie[selected_movie.length-1].split(" ");
	var movie_time_send = movie_time[1]+" "+movie_time[2]+" "+movie_time[3];
	console.log(movie_time_send);
	let param =
		{
			"request_code": "00C3",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"movie" : movie_name,
				"time" : movie_time_send,
			}
		}
	console.log(param);
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			alert("영화 삭제 완료");
			location.reload();
		});
});
var ess;
$('#movie_modify').on('click', function(){
	var send_movie_data = total_seat[selected_index];
	console.log(send_movie_data);
	console.log("----------------------");
	console.log(origin_seat[selected_index]);
	var seat_array = new Array();
	for(var i =0;i<send_movie_data.length;i++){
		var alpha = String.fromCharCode(65+i); 
		for(var j=0;j<send_movie_data[i].length;j++){
			if(JSON.stringify(origin_seat[selected_index][i][j])!=JSON.stringify(send_movie_data[i][j])){
				var seat_rows = new Object();
				var alpha_seat = alpha+(j+1);
				console.log(alpha_seat);
				seat_rows.code = alpha_seat;
				seat_rows.state = send_movie_data[i][j];
				seat_array.push(seat_rows);
			}
		}
	}
	var movie_name = selected_movie[selected_movie.length-2];
	var movie_time = selected_movie[selected_movie.length-1].split(" ");
	var movie_time_send = movie_time[1]+" "+movie_time[2]+" "+movie_time[3];
	var sJson = JSON.stringify(seat_array);
	let param =
		{
			"request_code": "00C8",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"movie" : movie_name,
				"time" : movie_time_send,
				"seat" : seat_array,
			}
		}
		console.log(param);
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			alert("영화 업데이트");
			location.reload();
		});
});

$('#modal_movie_add').on('click', function(){ //메뉴추가하는 스크립트
	var name = document.getElementById('movie_name').value;
	var width = document.getElementById('movie_width').value;
	var height = document.getElementById('movie_height').value;
	var date = document.getElementById('movie_date').value.split('-');
	var time = document.getElementById('movie_time').value.split(':');
	var theaters = document.getElementById('movie_location').value;
	var time_send = date[1]+"월 "+date[2]+"일 "+time[0]+":"+time[1];
	var price = document.getElementById('movie_price').value;
	let param =
		{
			"request_code": "00C2",
			"message" : {
				"id" : sessionStorage.getItem("id"),
				"movie" : name,
				"theater" : theaters,
				"time" : time_send,
				"width" : width,
				"height" : height,
				"price" : price,
			}
		}
	console.log(param);
		var req = $.ajax({
			url : "/post",
			data : param,
			type : 'POST',
			dataType : 'json'
		});
		req.done(function(data, status){
			$('#myModal').modal('hide');
			alert("영화추가완료");
			location.reload();
		});
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