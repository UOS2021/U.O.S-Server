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
		console.log(seat_alpha);
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