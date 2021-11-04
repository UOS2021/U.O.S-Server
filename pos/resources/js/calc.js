var selected_type = "일별";
var today = new Date();
var today_year = today.getFullYear();
var today_month = today.getMonth() + 1;
var today_date = today.getDate();

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
function prev_year(){
	today = new Date(today.getFullYear()-1,today.getMonth(),today.getDate());
	$("#print_year").html(today.getFullYear()+"년");
	communicate(today.getFullYear());
}
function next_year(){
	today = new Date(today.getFullYear()+1,today.getMonth(),today.getDate());
	$("#print_year").html(today.getFullYear()+"년");
	communicate(today.getFullYear());
}
function prev_month(){
	today = new Date(today.getFullYear(),today.getMonth()-1,today.getDate());
	$("#print_month").html(today.getFullYear()+"년 "+(today.getMonth()+1)+"월");
	communicate(today.getFullYear()+"-"+(today.getMonth()+1));
}
function next_month(){
	today = new Date(today.getFullYear(),today.getMonth()+1,today.getDate());
	$("#print_month").html(today.getFullYear()+"년 "+(today.getMonth()+1)+"월");
	communicate(today.getFullYear()+"-"+(today.getMonth()+1));
}
function prev_date(){
	today = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
	$("#print_date").html(today.getFullYear()+"년 "+(today.getMonth()+1)+"월 " + today.getDate()+"일");
	communicate(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+pad(today.getDate()));
}
function next_date(){
	today = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
	$("#print_date").html(today.getFullYear()+"년 "+(today.getMonth()+1)+"월 " + today.getDate()+"일");
	communicate(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+pad(today.getDate()));
}

var tt;
function communicate(date){
	let param =
	{
		"request_code": "000J",
		"message" : {
			"uospartner_id" : sessionStorage.getItem("id"),
			"date" : date 
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		tt=data;
		if(selected_type == "일별"){
			$("#salesd").html(data.message.sales.toLocaleString()+"원");
			$("#num_ordersd").html(data.message.num_orders+"건");
			$("#num_orders_canceledd").html(data.message.num_orders_canceled+"건");
			$("#num_order_rejectedd").html(data.message.num_orders_rejected+"건");
		}
		else if(selected_type == "월별"){
			$("#salesm").html(data.message.sales.toLocaleString()+"원");
			$("#num_ordersm").html(data.message.num_orders+"건");
			$("#num_orders_canceledm").html(data.message.num_orders_canceled+"건");
			$("#num_order_rejectedm").html(data.message.num_orders_rejected+"건");
		}
		else{
			$("#salesy").html(data.message.sales.toLocaleString()+"원");
			$("#num_ordersy").html(data.message.num_orders+"건");
			$("#num_orders_canceledy").html(data.message.num_orders_canceled+"건");
			$("#num_order_rejectedy").html(data.message.num_orders_rejected+"건");
		}
		
	});
}
function logout(){
	sessionStorage.setItem("id",'');
	sessionStorage.setItem("company_type",'');
	location.href = "/";
}

$('#myTab a').on('click', function (e) {
	today = new Date();
	e.preventDefault();
	$(this).tab('show');
	selected_type = this.innerHTML;
	console.log(selected_type);
	if(selected_type == "일별"){
		communicate(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+pad(today.getDate()));
	}
	else if(selected_type == "월별"){
		communicate(today.getFullYear()+"-"+(today.getMonth()+1));
	}
	else{
		communicate(today.getFullYear());
	}
});
function init(){
	communicate(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+pad(today.getDate()));
}
$(document).ready(function(){
    if(!sessionStorage.getItem("id")){
		alert("로그인이 필요합니다.");
		location.href="/";
	}	
	
	init();
	
	if(sessionStorage.getItem("company_type")=="영화관"){
		var newa= "<a class='nav-link' href='/pos/movies'><div class='sb-nav-link-icon'><i class='fas fa-tachometer-alt'></i></div>영화 관리</a>"
		$('#nav_side').append(newa);
	}
	$('#company_names').html(sessionStorage.getItem("company_name"));
	// $(document).on('click','#new_order_list td',function(){
		// var tr = $(this).closest('tr');
		// var td = tr.children();
		// var seq = td.eq(1).text(); // id값 ㅎㅎㅎ
		// console.log(seq);
	// });
});