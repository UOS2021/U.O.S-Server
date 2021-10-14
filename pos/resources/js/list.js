$(document).ready(function(){

	// 이 함수 사용하면 주문현황 리스트에 추가됨
	function list_attr_add(no, order_code, menu, time){
		var newtr = "<tr><td>"+no+"</td>"+"<td>"+order_code+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
		$('#tables').append(newtr);	
	}

	function init(){
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
			console.log(data);
			
		});
	}

	function repeat_request000B(){
		
		/* 실시간 주문 현황에 올라온 state가 0인 주문들 개수 세기 구현 */
		var state0_num = 0;

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
			else if(data.response_code == "B000"){
				/* for문으로 주문현황 리스트에 주문들 추가 */
				console.log(data);
			}
			
		});
	}

	// request 000B 1초마다 반복
	setInterval(repeat_request000B, 1000);


});