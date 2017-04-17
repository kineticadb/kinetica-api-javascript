'use strict';


/*
The script is called from an HTML file (opened in a browser) with the following content:

<!DOCTYPE html>
<html>
<head>
</head>

<body>
<script language="javascript" src="../GPUdb.js"> </script>
<script language="javascript" src="example.js"> </script>
</body>

</html>

*/


// Execute the 'main' function
main();


function main()
{
	// Convenient variables for referring to the base type, table & columns, as
	//   well as the view created from it
	var type_name = "javascript_api_example_type";
	var table_name = "javascript_api_example_table";
	var view_name = "javascript_api_example_view";
	var col1 = "col1";
	var col2 = "col2";
	var group_id = "group_id";
	
	console.log( "Establishing a connection with the database..." );
	var gpudb = new GPUdb( "http://localhost:9191" ); // One host
    var gpudbHA = new GPUdb( ["http://localhost:9191",
                              "http://localhost:9192"
                             ] ); // Multiple hosts as a single list
	
	// Declare the data type for the table
	var my_type = {
		"type": "record",
		"name": type_name,
		"fields": [
			{"name":col1,"type":"double"},
			{"name":col2,"type":"string"},
			{"name":group_id,"type":"string"}
		]
	};

	// Register the data type and get the type's ID
	var create_type_rsp = gpudb.create_type( JSON.stringify( my_type ), type_name );
	var type_id = create_type_rsp.type_id;
	
	// Clear example table from the database
	if (gpudb.has_table( table_name ).table_exists)
		gpudb.clear_table( table_name );
	
	// Create example table
	var create_table_rsp = gpudb.create_table( table_name, type_id );
	
	// Generate records to be inserted 
	var records = [];
	for (var i = 0; i < 10; i++)
	{
		var record = {
			col1 : (i + 0.1),
			col2 : ("string " + i),
			group_id : "Group 1"
		};
		records.push( record );
	}
	
	// This option will return IDs per record with which we can refer
	// to particular records later as needed
	var insert_options = { "return_record_ids" : "true" }
	var insert_records_rsp = gpudb.insert_records( table_name, records, insert_options );
	console.log( "Record IDs for newly inserted records: " + insert_records_rsp["record_ids"] );
	
	// Fetch the records from the table
	var get_records_rsp = gpudb.get_records( table_name );
	console.log( "Retrieved records: " );
	console.log( JSON.stringify( get_records_rsp["data"] ) );
	
	// Perform a filter operation on the table
	var expression = (col1 + " = 1.1");
	var filter_rsp = gpudb.filter( table_name, view_name, expression );
	console.log( "Number of filtered records: " + filter_rsp["count"] );
	
	// Fetch the records from the view (like reading from a regular table)
	var get_records_rsp = gpudb.get_records( view_name );
	console.log( "Filtered records: " );
	console.log( JSON.stringify( get_records_rsp["data"] ) );
	
	// Drop the view
	gpudb.clear_table( view_name );
	
	// Perform a filter operation on the table on two columns
	expression = (col1 + " <= 9 and " + group_id + '= "Group 1"');
	filter_rsp = gpudb.filter( table_name, view_name, expression );
	console.log( "Number of records filtered by the second expression: " + filter_rsp["count"] );
	
	// Fetch the records from the view
	get_records_rsp = gpudb.get_records( view_name );
	console.log( "Second set of filtered records: " );
	console.log( JSON.stringify( get_records_rsp["data"] ) );
	
	// Drop the view
	gpudb.clear_table( view_name );
	
	// Perform a filter by list operation
	var column_values_map = {
		col1 : [ "1.1", "2.1", "5.1" ]
	};
	var filter_by_list_rsp = gpudb.filter_by_list( table_name, view_name, column_values_map );
	console.log( "Number of records filtered by list: " + filter_by_list_rsp["count"] );
	
	// Fetch the records from the second view
	get_records_rsp = gpudb.get_records( view_name );
	console.log( "Records filtered by a list: " );
	console.log( JSON.stringify( get_records_rsp["data"] ) );
	
	// Drop the view
	gpudb.clear_table( view_name );
	
	// Perform a filter by range operation
	var lower_bound = 1;
	var upper_bound = 5;
	var filter_by_range_rsp = gpudb.filter_by_range( table_name, view_name, col1, lower_bound, upper_bound );
	console.log( "Number of records filtered by range: " + filter_by_range_rsp["count"] );
	
	// Fetch the records from the second view
	get_records_rsp = gpudb.get_records( view_name );
	console.log( "Records filtered by a range: " );
	console.log( JSON.stringify( get_records_rsp["data"] ) );
	
	
	// Perform an aggregate operation (statistics: sum, mean, count)
	var statistics = "sum,mean,count"
	var stats_rsp = gpudb.aggregate_statistics( table_name, col1, statistics )
	console.log( "Statistics of values in <" + col1 + ">: " + JSON.stringify( stats_rsp["stats"] ) );
	
	
	
	// Insert some more records
	console.log( "Inserting more records into the table..." );
	var records = [];
	for (var i = 1; i < 8; i++)
	{
		var record = {
			col1 : (i + 10.1),
			col2 : ("string " + i),
			group_id : "Group 2" // unique from the first group of records
		};
		records.push( record );
	}
	gpudb.insert_records( table_name, records );
	
	
	// Find all unique values of a given column
	var unique_rsp = gpudb.aggregate_unique( table_name, group_id, 0 )
	console.log( "Unique of values in <" + group_id + ">: " );
	console.log( JSON.stringify( unique_rsp['data'] ) );
	
	// Aggregate values of a given column by grouping by its values
	var column_names = [ col2 ];
	var group_by_rsp = gpudb.aggregate_group_by( table_name, column_names, 0 )
	console.log( "Group by results: " );
	console.log( JSON.stringify( group_by_rsp['data'] ) );
	
	// Second group by
	var column_names = [ group_id, "count(*)", "sum(" + col1 + ")", "avg(" + col1 + ")" ];
	group_by_rsp = gpudb.aggregate_group_by( table_name, column_names, 0 )
	console.log( "Second group by results: " );
	console.log( JSON.stringify( group_by_rsp['data'] ) );
	
	// Third group by
	var column_names = [ group_id, "sum(" + col1 + "*10)" ];
	group_by_rsp = gpudb.aggregate_group_by( table_name, column_names, 0 )
	console.log( "Third group by results: " );
	console.log( JSON.stringify( group_by_rsp['data'] ) );
	
	
	// Insert some more records
	console.log( "Inserting more records into the table..." );
	var records = [];
	for (var i = 4; i < 10; i++)
	{
		var record = {
			col1 : (i + 0.6),
			col2 : ("string 2" + i),
			group_id : "Group 1"
		};
		records.push( record );
	}
	gpudb.insert_records( table_name, records );
	
	
	// Perform a histogram calculation
	var start = 1.1;
	var end = 2;
	var interval = 1;
	var histogram_rsp = gpudb.aggregate_histogram( table_name, col1, start, end, interval )
	console.log( "Histogram results: " );
	console.log( JSON.stringify( histogram_rsp ) );
	
	
	// Drop the original table (will automatically drop all views of it)
	gpudb.clear_table( table_name );
	
	// Check that no view of that table is available anymore.
	// Using a callback function to check the error status of the query.
	gpudb.show_table( view_name, "",
		function( err, data ) // callback function
		{
			if (err !== null)
			{
				console.log( "View <" + view_name + "> not available as expected." );
			}
			else
				console.log( "View <" + view_name + "> unexpectedly found: " + err)
		}
	);

};





/**
 
Expected Output:
================

example.js:28 Establishing a connection with the database...

example.js:78 Record IDs for newly inserted records: 002010009a100000_0000000000000000,002010009a100000_0000000000000001,002010009a100000_0000000000000002,002010009a100000_0000000000000003,002010009a100000_0000000000000004,002010009a100000_0000000000000005,002010009a100000_0000000000000006,002010009a100000_0000000000000007,002010009a100000_0000000000000008,002010009a100000_0000000000000009

example.js:82 Retrieved records: 

example.js:83 [{"col1":0.1,"col2":"string 0","group_id":"Group 1"},{"col1":1.1,"col2":"string 1","group_id":"Group 1"},{"col1":2.1,"col2":"string 2","group_id":"Group 1"},{"col1":3.1,"col2":"string 3","group_id":"Group 1"},{"col1":4.1,"col2":"string 4","group_id":"Group 1"},{"col1":5.1,"col2":"string 5","group_id":"Group 1"},{"col1":6.1,"col2":"string 6","group_id":"Group 1"},{"col1":7.1,"col2":"string 7","group_id":"Group 1"},{"col1":8.1,"col2":"string 8","group_id":"Group 1"},{"col1":9.1,"col2":"string 9","group_id":"Group 1"}]

example.js:88 Number of filtered records: 1

example.js:92 Filtered records: 

example.js:93 [{"col1":1.1,"col2":"string 1","group_id":"Group 1"}]

example.js:101 Number of records filtered by the second expression: 9

example.js:105 Second set of filtered records: 

example.js:106 [{"col1":0.1,"col2":"string 0","group_id":"Group 1"},{"col1":1.1,"col2":"string 1","group_id":"Group 1"},{"col1":2.1,"col2":"string 2","group_id":"Group 1"},{"col1":3.1,"col2":"string 3","group_id":"Group 1"},{"col1":4.1,"col2":"string 4","group_id":"Group 1"},{"col1":5.1,"col2":"string 5","group_id":"Group 1"},{"col1":6.1,"col2":"string 6","group_id":"Group 1"},{"col1":7.1,"col2":"string 7","group_id":"Group 1"},{"col1":8.1,"col2":"string 8","group_id":"Group 1"}]

example.js:116 Number of records filtered by list: 3

example.js:120 Records filtered by a list: 

example.js:121 [{"col1":1.1,"col2":"string 1","group_id":"Group 1"},{"col1":2.1,"col2":"string 2","group_id":"Group 1"},{"col1":5.1,"col2":"string 5","group_id":"Group 1"}]

example.js:130 Number of records filtered by range: 4

example.js:134 Records filtered by a range: 

example.js:135 [{"col1":1.1,"col2":"string 1","group_id":"Group 1"},{"col1":2.1,"col2":"string 2","group_id":"Group 1"},{"col1":3.1,"col2":"string 3","group_id":"Group 1"},{"col1":4.1,"col2":"string 4","group_id":"Group 1"}]

example.js:141 Statistics of values in <col1>: {"count":10,"mean":4.6,"sum":46}

example.js:146 Inserting more records into the table...

example.js:162 Unique of values in <group_id>: 

example.js:163 {"column_1":["Group 1","Group 2"],"column_headers":["group_id"]}

example.js:168 Group by results: 

example.js:169 {"column_1":["string 0","string 8","string 9","string 2","string 5","string 6","string 1","string 3","string 7","string 4"],"column_2":[1,1,1,2,2,2,2,2,2,2],"column_headers":["col2","count"]}

example.js:174 Second group by results: 

example.js:175 {"column_1":["Group 2","Group 1"],"column_2":[7,10],"column_3":[98.69999999999999,46],"column_4":[14.1,4.6],"column_headers":["group_id","count(*)","sum(col1)","avg(col1)"]}

example.js:180 Third group by results: 

example.js:181 {"column_1":["Group 1","Group 2"],"column_2":[460,987],"column_headers":["group_id","sum(col1*10)"]}

example.js:185 Inserting more records into the table...

example.js:204 Histogram results: 

example.js:205 {"counts":[1],"start":1.1,"end":2}

example.js:218 View <javascript_api_example_view> not available as expected.

**/
