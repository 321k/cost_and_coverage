
create_map = function(filtered_json){
  $('#map').empty();
  var to_countries = []
  for(var i=0; i<filtered_json.length; i++){
    to_countries[i] = filtered_json[i]["to_country_no"];
  }
  to_countries = $.unique(to_countries)

  from_business_not_allowed = []
  for(var i=0; i<filtered_json.length; i++){
    if(filtered_json[i]["from_business_allowed"] === false){
      from_business_not_allowed.push(filtered_json[i]["from_country_no"])
    }
  }

  to_business_not_allowed = []
  for(var i=0; i<filtered_json.length; i++){
    if(filtered_json[i]["to_business_allowed"] === false){
      to_business_not_allowed.push(filtered_json[i]["to_country_no"])
    }
  }


  var from_countries = []
  for(var i=0; i<filtered_json.length; i++){
    from_countries[i] = filtered_json[i]["from_country_no"];
  }
  from_countries = $.unique(from_countries)


  var width = 1100;
  var height = 600;

  var projection = d3.geo.equirectangular();

  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);
  var path = d3.geo.path()
      .projection(projection);
  var g = svg.append("g");

  d3.json("world-110m2.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d, i) { return d["id"] ; })
      .style("fill", function(d, i) { 
        if ($.inArray(d["id"], from_countries) >= 0){
            return "#0054FF";
        } else if($.inArray(d["id"], to_business_not_allowed) >= 0){
            return "grey"
        } else if ($.inArray(d["id"], from_business_not_allowed) >= 0){
            return "grey"
        } else if($.inArray(d["id"], to_countries) >= 0) {
            return "#00BFFF";
        } else {
            return "#B9D3EE"}; 
      })
      .on('mouseover', function(d, i) {
        var currentState = this;
        d3.select(this).style('fill-opacity', 0.5);
      })
      .on('mouseout', function(d, i) {
        d3.selectAll('path')
            .style({
                'fill-opacity':1
            });
      })
      .attr("class", function(d, i) {
        if($.inArray(d["id"], to_business_not_allowed) >= 0) {
          return "business_not_allowed";
        } else {
          return "business_allowed";
        }
      })
  });
}

 function recalculate_table(currency_data){
  var text=document.getElementById('selected_country').value;
  var filtered_json = find_in_object(currency_data, {from_country: text});
  filtered_json = addFees(filtered_json);
  $('#curency_table').empty();
  createTable(filtered_json);
  $('#map').empty();
  create_map(filtered_json);
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
function find_in_object(my_object, my_criteria){

  return my_object.filter(function(obj) {
    return Object.keys(my_criteria).every(function(c) {
      return obj[c] == my_criteria[c];
    });
  });
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
