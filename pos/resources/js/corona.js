function list_attr_add(table,no, order_code, menu, time,state){
	// var newtr = "<tr><td>"+no+"</td>"+"<td>"+order_code+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	// $(table).append(newtr);
	var t = $(table).DataTable();
	var rows;
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

function init(){
	cnt_now = 0;
	cnt_finish = 0;
}

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
			list_attr_add('#finished_order_list',cnt_finish,order_array[i].order_code,menu_name,order_array[i].date,order_array[i].state);
			cnt_finish++;
		}
		
});

$(document).ready(function(){
    	
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