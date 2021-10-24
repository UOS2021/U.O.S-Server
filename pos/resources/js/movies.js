var seats = [
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,2,2,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,2,2,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1],
];
var seat_alpha = 65;
var test;
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
		var i,first_movie,first_theater,movie_rows;
		console.log(data.movie_list);//받는 data	
		test=data.movie_list;
		first_movie = data[0].movie;
		first_theater = data[0].theater;
		movie_rows="<li class='nav-item dropdown'>";
		movie_rows+="<a class='nav-link dropdown-toggle' data-bs-toggle='dropdown' href='#' role='button' aria-expanded='false'>"+first_movie+"</a>";
		movie_rows+="<ul class='dropdown-menu'>";
		for(i=0;i<data.length;i++){
			if(first_movie==data[i].movie){
				movie_rows+="<h6 class='dropdown-header'>"+data[i].theater+"</h6>";
			}
			
		}
	});
	
	$.each(seats,function(indexY,line){
		var $line = $('<div><div style="float:left;width:60px">'+String.fromCharCode(seat_alpha)+"열"+'</div></div>').addClass('line');
		$.each(line,function(indexX,seat){
			var $output = $('<div></div>',{
				'class' : 'seat',
				'data-x' : indexX,
				'data-y' : indexY
			}).appendTo($line);
			
			if(seat == 1) // 좌석값이 '1'이면 'enable'스타일 적용
				$output.addClass('enable');
			else if(seat == 2){
				$output.addClass('disable');
			}
		});
		$line.appendTo('#set_body');
		seat_alpha++;
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
	if(sessionStorage.getItem("company_type")=="영화관"){
		var newa= "<a class='nav-link' href='/pos/movies'><div class='sb-nav-link-icon'><i class='fas fa-tachometer-alt'></i></div>영화 관리</a>"
		$('#nav_side').append(newa);
	}
	init();
});