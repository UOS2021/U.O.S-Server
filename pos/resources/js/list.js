data = {'no':2,'number':35,'menu':"맥스파이시 상하이 버거 세트",'time':"2021-10-11 10:55"};

function list_attr_add(){
	
	var no = data['no'];
	var number = data['number'];
	var menu = data['menu'];
	var time = data['time'];
	var newtr = "<tr><td>"+no+"</td>"+"<td>"+number+"</td>"+"<td>"+menu+"</td>"+"<td>"+time+"</td></tr>";
	$('#tables').append(newtr);	
}