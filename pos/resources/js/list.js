data = {'no':2,'number':35,'menu':"맥스파이시 상하이 버거 세트",'time':"2021-10-11 10:55"};

function list_attr_add(no, number, menu, time){
	
	var newtr = "<tr><td>"+no+"</td>"+"<td>"+number+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	$('#tables').append(newtr);	
}

$(document).ready(function(){
	var no_value = 0;
	let param =
	{
		"request_code": "000B",
		"message" : {
			"id" : sessionStorage.getItem("id"),
			"no_value" : no_value
		}
	};
	var req = $.ajax({
		url : "/post",
		data : param,
		type : 'POST',
		dataType : 'json'
	});
	req.done(function(data, status){
		//var students = JSON.parse(data);
		console.log(data);
		if(data.response_code == ""){
			
		}

	});
});