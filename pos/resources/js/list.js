var new_order_list;
var cnt_now;
var cnt_finish;
var state0_num = 0;
var state3_num = 0;
var state4_num = 0;
var ee;
var test;
var total_order_list = [];
function logout(){
	sessionStorage.setItem("id",'');
	sessionStorage.setItem("company_type",'');
	location.href = "/";
}
// 처음 리스트 받아오기
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
		test=order_array;
		console.log(test);
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
			
			if(order_array[i].state==0 || order_array[i].state == 1 || order_array[i].state == 2){
				list_attr_add('#new_order_list',cnt_now,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
				cnt_now++;
				if(order_array[i].state == 0){
					state0_num++;
				}
				
			}
			else{
				if(order_array[i].state == 3){
                    state3_num++;
                }
				list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
				cnt_finish++;
			}
		}
		
	});
}

// 주문 수락
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

// 주문 거절
function btn_reject(order_code){
	
	let param =
	{
		"request_code": "000D", //request_code 알아서 설정해줘 X누르면
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
		var t1 = $('finished_order_list').DataTable();
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				t.row(i).remove().draw(false);
				cnt_now--;
				break;
			}
		}
		var max_name = "";
		var max_price = -1;
		for(var j=0;j<eval(data.message.order_list).length;j++){
			if(max_price < eval(data.message.order_list)[j].price){
				max_name = eval(data.message.order_list)[j].menu;
				max_price = eval(data.message.order_list)[j].price;
			}
		}
		var menu_name;
		if(eval(data.message.order_list).length == 1){
			if(eval(data.message.order_list)[0].type==1)
				menu_name = max_name+" 및 "+eval(data.message.order_list)[0].submenu;
			else
				menu_name = max_name;
				
		}
		else{
			menu_name = max_name+" 외 "+eval(data.message.order_list).length+"개 상품";
		}
		list_attr_add('#finished_order_list',cnt_finish,data.message.order_code,menu_name,data.message.date,data.message.state);
		cnt_finish++;
	});
}

// 조리 완료
function menu_wait(where,order_code){
	let param =
	{
		"request_code": "000E",
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

// 수령 완료
function customer_accept(where, order_code){
	let param =
	{
		"request_code": "000F",
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
		var i;
		for(i=0;i<t.rows()[0].length;i++){
			if(t.row(i).data()[1]==order_code){
				list_attr_add('#finished_order_list',cnt_finish,t.row(i).data()[1],t.row(i).data()[2],t.row(i).data()[3],3);
				t.row(i).remove().draw(false);
				cnt_now--;
				cnt_finish++;
				break;
			}
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
	else if(state==3){
		rows = "<button class='btn btn-secondary' type='button' disabled>완료 된 주문</button>";
	}
	else if(state==4){
		state4_num++;
		rows = "<button class='btn btn-secondary' type='button' disabled>취소 된 주문</button>";
	}
	else if(state==5){
		rows = "<button class='btn btn-secondary' type='button' disabled>거절 한 주문</button>";
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
			"state0_num" : state0_num,
			"state4_num" : state4_num
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
					if(sessionStorage.getItem("company_type")=="영화관"){
						if(order_array[i].state==3){
							alert("새로운 주문이 접수되었습니다.");
							list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
							cnt_finish++;
						}
					}
					else{
						if(order_array[i].state==0){
							alert("새로운 주문이 접수되었습니다.");
							state0_num++;
							list_attr_add('#new_order_list',cnt_now,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
							cnt_now++;
						}
					}
				}
			}
			if(data.message.order_codes!=undefined ){
				var t = $('#new_order_list').DataTable();
				
				for(i=0;i<t.rows()[0].length;i++){
					var j;
					var check = 0;
					for(j=0;j<data.message.order_codes.length;j++){
						if(t.row(i).data()[1]==data.message.order_codes[j]){
							check=1;
							break;
						}
					}
					if(!check){	
						list_attr_add('#finished_order_list',cnt_finish,t.row(i).data()[1],t.row(i).data()[2],t.row(i).data()[3],4);
						t.row(i).remove().draw(false);
						cnt_now--;
						cnt_finish++;
						state0_num--;
					}
				}
			}
		}
	});
}
function repeat_request000I(){
		
	/* 실시간 주문 현황에 올라온 state가 3인 주문들 개수 세기 구현 */
	let param =
	{
		"request_code": "000I",
		"message" : {
			"id" : sessionStorage.getItem("id"),
			"state0_num" : state0_num,
			"state4_num" : state4_num,
			"state3_num" : state3_num
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
			console.log(data);
			/* for문으로 주문현황 리스트에 주문들 추가 */
			var i;
			var order_array = data.message.order_array;
			if(order_array!=undefined){
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
					if(sessionStorage.getItem("company_type")=="영화관"){
						if(order_array[i].state==3){
							alert("새로운 주문이 접수되었습니다.");
							list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
							cnt_finish++;
							state3_num++;
						}
					}
					else{
						if(order_array[i].state==0){
							alert("새로운 주문이 접수되었습니다.");
							state0_num++;
							list_attr_add('#new_order_list',cnt_now,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
							cnt_now++;
						}
					}
				}
			}
			if(data.message.order_codes!=undefined ){
				var t = $('#new_order_list').DataTable();
				
				for(i=0;i<t.rows()[0].length;i++){
					var j;
					var check = 0;
					for(j=0;j<data.message.order_codes.length;j++){
						if(t.row(i).data()[1]==data.message.order_codes[j]){
							check=1;
							break;
						}
					}
					if(!check){	
						list_attr_add('#finished_order_list',cnt_finish,t.row(i).data()[1],t.row(i).data()[2],t.row(i).data()[3],4);
						t.row(i).remove().draw(false);
						cnt_now--;
						cnt_finish++;
						state0_num--;
					}
				}
			}
		}
	});
}

$(document).ready(function(){
    if(!sessionStorage.getItem("id")){
		alert("로그인이 필요합니다.");
		location.href="/";
	}
	// request 000B 1초마다 반복
	init();
	
	if(sessionStorage.getItem("company_type")=="영화관"){
		setInterval(repeat_request000I, 1000);
	}
	else{
		setInterval(repeat_request000B, 1000);	
	}
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
		$('#now_order').hide();
		$('#nav_side').append(newa);
	}
	var t = $('#new_order_list').DataTable();
     
	var t2 = $('#finished_order_list').DataTable();
    $('#new_order_list tbody').on('click', 'tr', function () {
        var data = t.row( this ).data();
		console.log(total_order_list[data[1]-1]);
    } );
	$('#finished_order_list tbody').on('click', 'tr', function () {
        var data = t2.row( this ).data();
		console.log(eval(total_order_list[data[1]-1]));
    } );
	// $(document).on('click','#new_order_list td',function(){
		// var tr = $(this).closest('tr');
		// var td = tr.children();
		// var seq = td.eq(1).text(); // id값 ㅎㅎㅎ
		// console.log(seq);
	// });
});