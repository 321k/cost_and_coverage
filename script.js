

var filtered_json = find_in_object(obj, {from_country: 'Finland'});
filtered_json = addFees(filtered_json);

function find_in_object(my_object, my_criteria){

  return my_object.filter(function(obj) {
    return Object.keys(my_criteria).every(function(c) {
      return obj[c] == my_criteria[c];
    });
  });
}

 function recalculate_table(currency_data){
    var text=document.getElementById('selected_country').value;
	var filtered_json = find_in_object(currency_data, {from_country: text});
	filtered_json = addFees(filtered_json);
	$('#curency_table').empty();
	createTable(filtered_json);
 }

function addFees(obj){
	var amount=document.getElementById('selected_amount').value;
	for(var i=0; i<obj.length; i++) {
		var min_fee = obj[i]['minimum_fee'];
		var fee = min_fee;
		if(amount > obj[i]['tier_2_amount']){
			fee = obj[i]['tier_2_amount'] * obj[i]['tier_1_fee'] + ( obj[i]['tier_2_amount'] - amount ) * obj[i]['tier_2_fee'];
			fee = Math.max(min_fee, fee);
		} else {
			fee = amount * obj[i]['tier_1_fee'];
			fee = Math.max(min_fee, fee);
		}
		obj[i]['calculated_fee'] = Math.round(fee);
	}
	return(obj)
}

function createTable(filtered_obj){
	var $table = $('<table/>');
	$table.append("<tr><th>From country</th><th>To country</th><th>To currency</th><th>Fee</th><th></th></tr>");
	$.each(filtered_obj, function(index, value) {
	   
	   //create a row
	   var $row = $('<tr/>');

	   
	   $('<td/>').text(value.from_country).appendTo($row);

	   //create the id column
	   $('<td/>').text(value.to_country).appendTo($row);

	   //create name column
	   $('<td/>').text(value.to_ccy_code).appendTo($row);

	   //create last_name
	   $('<td/>').text(value.calculated_fee).appendTo($row);

	   $('<td/>').text(value.minimum_fee_ccy).appendTo($row);

	   $table.append($row);
	});

	//append table to the body
	$('#curency_table').append($table);
}

createTable(filtered_json);

function searchKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('select_country').click();
        return false;
    }
    return true;
}
