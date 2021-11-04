var alarm_code = [];
function logout(){
	sessionStorage.setItem("id",'');
	sessionStorage.setItem("company_type",'');
	location.href = "/";
}
function list_attr_add(table,no, order_code, menu, time,state){
	// var newtr = "<tr><td>"+no+"</td>"+"<td>"+order_code+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	// $(table).append(newtr);
	var t = $(table).DataTable();
	var rows;
	var rows_send;
	rows_send = "<button class='btn btn-warning' type='button' onclick='send_alarm("+order_code+")'>알람 전송</button>";
	if(state==3){
		rows = "<button class='btn btn-secondary' type='button' disabled>완료 된 주문</button>";
	}
	else if(state==4){
		rows = "<button class='btn btn-secondary' type='button' disabled>취소 된 주문</button>";
	}
	else if(state==5){
		rows = "<button class='btn btn-secondary' type='button' disabled>거절 한 주문</button>";
	}
	t.row.add([no,order_code,menu,time,rows]).draw(false);
}
function send_alarm(code){
	console.log(alarm_code);
	let param =
	{
		"request_code": "000H",
		"message" : {
			"id" : sessionStorage.getItem("id"),
			"order_code" : alarm_code
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		alert("알람 전송 완료");
		
	});
}
function init(){
	cnt_now = 0;
	cnt_finish = 0;

	let param =
	{
		"request_code": "000G",
		"message" : {
			"id" : sessionStorage.getItem("id")
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		/* for문으로 주문현황 리스트에 주문들 추가 */
		console.log(data);
		var i;
		var order_array = data.message.order_array;
		for(i=0;i<order_array.length;i++){
			var max_name = "";
			var max_price = -1;
			for(var j=0;j<eval(order_array[i].order_list).length;j++){
				if(max_price < eval(order_array[i].order_list)[j].price){
					max_name = eval(order_array[i].order_list)[j].menu;
					max_price = eval(order_array[i].order_list)[j].price;
				}
			}
			var menu_name;
			if(eval(order_array[i].order_list)[0].type == 2){
				max_name = (eval(order_array[i].order_list)[0].menu).split("&")[0] + "("+(eval(order_array[i].order_list)[0].menu).split("&")[1]+")";
			};
			if(eval(order_array[i].order_list).length == 1){
				if(eval(order_array[i].order_list)[0].type==1)
					menu_name = max_name+" 및 "+eval(order_array[i].order_list)[0].submenu;
				else
					menu_name = max_name;	
			}
			else{
				menu_name = max_name+" 외 "+eval(order_array[i].order_list).length+"개 상품";
			}
			list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
			cnt_finish++;
		}
		
	});
}
$.fn.dataTable.ext.search.push(
	function(settings, data, dataIndex){
		// var min = Date.parse($('#fromDate').val());
		// var max = Date.parse($('#toDate').val());
		// console.log(min);
		// var targetDate = Date.parse(data[3]);
		var min = new Date($("#fromDate").val() + " "+ $('#fromTime').val());
		var max = new Date($("#toDate").val() + " "+ $('#toTime').val());
		console.log(min);
		var targetDate = new Date(data[3]);
		if( (isNaN(min) && isNaN(max) ) || 
			(isNaN(min) && targetDate <= max )|| 
			( min <= targetDate && isNaN(max) ) ||
			( targetDate >= min && targetDate <= max) ){
				alarm_code.push(data[1]);
				return true;
			}
		return false;
	}
)
$(document).ready(function(){
    if(!sessionStorage.getItem("id")){
		alert("로그인이 필요합니다.");
		location.href="/";
	}	
	init();
	$('#finished_order_list').DataTable({
		language : {
			info : '총 _TOTAL_ 개의 행 중 _START_ 행 부터 _END_ 행 까지',
			imfoEmpty : '데이터가 없습니다.',
			lengthMenu : '총 _MENU_ 행씩 보기',
			paginate : {
				first : '처음',
				last : '끝',
				next : '다음',
				previous : '이전'
			},
			search : '검색 ->'
		}
	});
	
	
	var t = $('#finished_order_list').DataTable();
	$('#toDate, #fromDate, #toTime, #fromTime').unbind().bind('change',function(){
		alarm_code = [];
    	t.draw();
	})


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