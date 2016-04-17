var filtered_json = find_in_object(obj, {from_country: 'United Kingdom'});
filtered_json = addFees(filtered_json);


createTable(filtered_json);
create_map(filtered_json);
