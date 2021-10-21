var new_order_list;
var cnt_now;
var cnt_finish;
var state0_num = 0;
var ee;

function init(){
	cnt_now = 0;
	cnt_finish = 0;
	let param =
	{
		"request_code": "000A",
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
			if(eval(order_array[i].order_list).length == 1){
				if(eval(order_array[i].order_list)[0].type==1)
					menu_name = max_name+" 및 "+eval(order_array[i].order_list)[0].submenu;
				else
					menu_name = max_name;
					
			}
			else{
				menu_name = max_name+" 외 "+eval(order_array[i].order_list).length+"개 상품";
			}
			if(order_array[i].state==0 || order_array[i].state == 1 || order_array[i].state == 2){
				list_attr_add('#new_order_list',cnt_now,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
				cnt_now++;
				if(order_array[i].state == 0){
					state0_num++;
				}
			}
			else{
				list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
				cnt_finish++;
			}
		}
		
	});
}

function btn_accept(where,order_code){
	// console.log(order_code);
	let param =
	{
		"request_code": "000C", //request_code 알아서 설정해줘 V누르면
		"message" : {
			"order_code" : order_code,
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		alert("주문 접수 완료");
		var t = $('#new_order_list').DataTable();
		var rows = "<button class='btn btn-warning' id='"+order_code+"' type='button' onclick='menu_wait(this,"+order_code+")'>조리 완료</button>";
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				t.cell(i,4).data(rows);
				break;
			}
		}
	});
}
function btn_reject(order_code){
	
	let param =
	{
		"request_code": "00AB", //request_code 알아서 설정해줘 X누르면
		"message" : {
			"order_code" : order_code,
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		alert("주문 거절 완료");
		var t = $('#new_order_list').DataTable();
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				t.row(i).remove().draw(false);
				cnt_now--;
				break;
			}
		}
	});
}
			 
function menu_wait(where,order_code){
	let param =
	{
		"request_code": "00AC", //request_code 알아서 설정해줘 조리완료
		"message" : {
			"order_code" : order_code,
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		alert("조리 완료");
		var t = $('#new_order_list').DataTable();
		var rows = "<button class='btn btn-info' id='"+order_code+"' type='button' onclick='customer_accept(this,"+order_code+")'>수령 완료</button>";
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				t.cell(i,4).data(rows);
				break;
			}
		}
	});
}

function customer_accept(where, order_code){
	let param =
	{
		"request_code": "00AD", //request_code 알아서 설정해줘 수령완료
		"message" : {
			"order_code" : order_code,
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		alert("수령완료");
		var t = $('#new_order_list').DataTable();
		var rows = "<button class='btn btn-info' id='"+order_code+"' type='button' onclick='customer_accept(this,"+order_code+")'>수령 완료</button>";
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				t.row(i).remove().draw(false);
				break;
			}
		}
		var order_array = data.message.order_array;
		if(order_array.state==3){
			list_attr_add('#finished_order_list',cnt_finish,order_array.order_code,order_array.order_list,order_array.date,order_array.state);
			cnt_finish--;
		}
	});
}

// 이 함수 사용하면 주문현황 리스트에 추가됨
function list_attr_add(table,no, order_code, menu, time,state){
	// var newtr = "<tr><td>"+no+"</td>"+"<td>"+order_code+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	// $(table).append(newtr);
	var t = $(table).DataTable();
	var rows;
	if(state==0){
		rows = "<button class='btn btn-success' id='"+order_code+"' type='button' onclick='btn_accept(this,"+order_code+")'>V</button><button class='btn btn-danger' id='"+order_code+"' type='button' onclick='btn_reject("+order_code+")'>X</button>";
	}
	else if (state == 1){
		rows = "<button class='btn btn-warning' id='"+order_code+"' type='button' onclick='menu_wait(this,"+order_code+")'>조리 완료</button>";
	}
	else if (state==2){
		rows = "<button class='btn btn-info' id='"+order_code+"' type='button' onclick='customer_accept(this,"+order_code+")'>수령 완료</button>";
	}
	else{
		rows = "<button class='btn btn-secondary' type='button' disabled>완료 된 주문</button>";
	}
	t.row.add([no,order_code,menu,time,rows]).draw(false);
}
function repeat_request000B(){
		
	/* 실시간 주문 현황에 올라온 state가 0인 주문들 개수 세기 구현 */
	let param =
	{
		"request_code": "000B",
		"message" : {
			"id" : sessionStorage.getItem("id"),
			"state0_num" : state0_num
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
			dataType : 'json'
	});
	req.done(function(data, status){
			// 추가 주문 내역 없음
		if(data.response_code == "C000"){
			
		}
		// state가 0인 주문 추가로 들어옴
		if(data.response_code == "B000"){
			/* for문으로 주문현황 리스트에 주문들 추가 */
			var i;
			var order_array = data.message.order_array;
			if(order_array!=undefined){
				for(i=0;i<order_array.length;i++){
					if(order_array[i].state==0){
						alert("새로운 주문이 접수되었습니다.");
						list_attr_add('#new_order_list',i,order_array[i].order_code,order_array[i].order_list,order_array[i].date,order_array[i].state);
					}
					state0_num++;
				}
			}
			if(data.message.order_codes!=undefined){
				for(i=0;i<data.message.order_codes.length;i++){
					var t = $('#new_order_list').DataTable();
					var i;
					for(i=0;i<t.rows()[0].length;i++){
						if(t.row(i).data()[1]==data.message.order_codes[i]){
							t.row(i).remove().draw(false);
							cnt_now--;
							break;
						}
					}
					state0_num--;
				}
			}
		}
	});
}
$(document).ready(function(){
    	
	// request 000B 1초마다 반복
	init();
	setInterval(repeat_request000B, 1000);
	$('#new_order_list').DataTable({
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
	if(sessionStorage.getItem("company_type")=="영화관"){
		var newa= "<a class='nav-link' href='/pos/movies'><div class='sb-nav-link-icon'><i class='fas fa-tachometer-alt'></i></div>영화 관리</a>"
		$('#nav_side').append(newa);
	}
	// $(document).on('click','#new_order_list td',function(){
		// var tr = $(this).closest('tr');
		// var td = tr.children();
		// var seq = td.eq(1).text(); // id값 ㅎㅎㅎ
		// console.log(seq);
	// });
});