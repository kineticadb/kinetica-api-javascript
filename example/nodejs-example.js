var GPUdb = require("../nodejs/GPUdb.js");

console.log("Establishing a connection with GPUdb...");
var host = "localhost";
var gpudb = new GPUdb(`http://${host}:9191`); // Single host
var gpudbHA = new GPUdb( [`http://${host}:9191`,
                          `http://${host}:9192`
                         ] ); // Multiple hosts as a single list

var operation_number = 0;

/*
 * A mechanism for making sure that the previous operation
 * performed has completed before starting the current operation.
 */
var next_operation = function() {
    if (operation_number < operations.length) {
        operations[operation_number++]();
    }
}


var build_callback = function(success, error) {
    return function(err, response) {
        if (err === null) {
            if (success !== undefined) {
                success(response);
            }

            next_operation();
        } else {
            if (error !== undefined) {
                error(err);
                next_operation();
            } else {
                console.log(err);
            }
        }
    };
}

// Need global scoping for the type ID and table name
var type_id;
var table_name = "my_table";

var operations = [
    // Clear the table from the database, in case it was created
    // by a previous run of the example program
    function() {
        gpudb.clear_table( table_name, null, {"no_error_if_not_exists": "true"},
                           build_callback() );
    },

    // Register the data type for the table with GPUdb and get the type's ID
    function() {
        var my_type = new GPUdb.Type("my_type",
                new GPUdb.Type.Column("col1", "double"),
                new GPUdb.Type.Column("col2", "string"),
                new GPUdb.Type.Column("group_id", "string"));

        my_type.create(gpudb, build_callback( function( response ) {
            type_id = response;
        } ));
    },

    // Create the table
    function() {
        gpudb.create_table( table_name, type_id, {}, build_callback() );
    },

    // Generate the records to be inserted and insert them
    function() {
        var records = [];

        for (var i = 0; i < 10; i++) {
            records.push({
                col1: i + 0.1,
                col2: "string " + i,
                group_id: "Group 1"
            });
        }

	var insert_options = { "return_record_ids" : "true" }
        gpudb.insert_records( table_name, records, insert_options, build_callback(function(response) {
            console.log("Record IDs for newly inserted records: " + response.record_ids);
        }));
    },

    // Fetch the records from the table
    function() {
        gpudb.get_records( table_name, 0, -9999, {}, build_callback(function(response) {
            console.log("Retrieved records: ");
            console.log(response.data);
        }));
    },

    // Perform a filter operation on the table
    function() {
	var view_name = "view_1";
	var expression = ("col1 = 1.1");
        gpudb.filter( table_name, view_name, expression, {}, build_callback(function(response) {
            console.log("Number of filtered records: " + response.count);
        }));
    },

    // Fetch the records from the view (like reading from a regular table)
    function() {
        gpudb.get_records("view_1", 0, -9999, {}, build_callback(function(response) {
            console.log("Filtered records: ");
            console.log(response.data);
        }));
    },

    // Drop the view
    function() {
        gpudb.clear_table("view_1", null, {}, build_callback());
    },

    // Perform a filter operation on the table on two column_names
    function() {
        gpudb.filter( table_name, "view_1", "col1 <= 9 and group_id = 'Group 1'", {}, build_callback(function(response) {
            console.log("Number of records filtered by the second expression: " + response.count);
        }));
    },

    // Fetch the records from the view
    function() {
        gpudb.get_records("view_1", 0, -9999, {}, build_callback(function(response) {
            console.log("Second set of filtered records: ");
            console.log(response.data);
        }));
    },

    // Perform a filter by list operation
    function() {
	var view_name = "view_2";
	var column_values_map = {
	    col1 : [ "1.1", "2.1", "5.1" ]
	};
        gpudb.filter_by_list( table_name, view_name, column_values_map, {}, build_callback(function(response) {
            console.log("Number of records filtered by list: " + response.count);
        }));
    },

    // Fetch the records from the second view
    function() {
        gpudb.get_records("view_2", 0, -9999, {}, build_callback(function(response) {
            console.log("Records filtered by a list: ");
            console.log(response.data);
        }));
    },

    // Perform a filter by range operation
    function() {
        gpudb.filter_by_range( table_name, "view_3", "col1", 1, 5, {}, build_callback(function(response) {
            console.log("Number of records filtered by range: " + response.count);
        }));
    },

    // Fetch the records from the third view
    function() {
        gpudb.get_records("view_3", 0, -9999, {}, build_callback(function(response) {
            console.log("Records filtered by range: ");
            console.log(response.data);
        }));
    },

    // Perform an aggregate operation (statistics: sum, mean, count)
    function() {
        gpudb.aggregate_statistics( table_name, "col1", "sum,mean,count", {}, build_callback(function(response) {
            console.log("Statistics of values in 'col1': " + JSON.stringify(response.stats));
        }));
    },

    // Insert some more records
    function() {
        console.log("Inserting more records into the table...");
        var records = [];

        for (var i = 1; i < 8; i++) {
            records.push({
                col1: i + 10.1,
                col2: "string " + i,
                group_id: "Group 2"
            });
        }

        gpudb.insert_records( table_name, records, {}, build_callback());
    },

    // Find all unique values of a given column
    function() {
        gpudb.aggregate_unique( table_name, "group_id", 0, -9999, {}, build_callback(function(response) {
            console.log("Unique values in 'group_id': ");
            console.log(response.data);
        }));
    },

    // Aggregate values of a given column by grouping by its values
    function() {
        var column_names = [ "col2" ];
        gpudb.aggregate_group_by( table_name, column_names, 0, -9999, {}, build_callback(function(response) {
            console.log("Group by results: ");
            console.log(response.data);
        }));
    },

    // Second group by
    function() {
        var column_names = [ "group_id", "count(*)", "sum(col1)", "avg(col1)" ];
        gpudb.aggregate_group_by( table_name, column_names, 0, -9999, {}, build_callback(function(response) {
            console.log("Second group by results: ");
            console.log(response.data);
        }));
    },

    // Third group by
    function() {
        gpudb.aggregate_group_by( table_name, [ "group_id", "sum(col1*10)" ], 0, -9999, {}, build_callback(function(response) {
            console.log("Third group by results: ");
            console.log(response.data);
        }));
    },

    // Insert some more records
    function() {
        console.log("Inserting more records into the table...");
        var records = [];

        for (var i = 4; i < 10; i++) {
            records.push({
                col1: i + 0.6,
                col2: "string 2" + i,
                group_id: "Group 1"
            });
        }

        gpudb.insert_records( table_name, records, {}, build_callback());
    },

    // Perform a histogram calculation
    function() {
	var start = 1.1;
	var end = 2;
	var interval = 1;
        gpudb.aggregate_histogram( table_name, "col1", start, end, interval, {}, build_callback(function(response) {
            console.log("Histogram results: ");
            console.log(response);
        }));
    },

    // Drop the original table (will automatically drop all views of it)
    function() {
        gpudb.clear_table( table_name, null, {}, build_callback());
    },

    // Check that no view of that table is available anymore.
    function() {
        gpudb.show_table("view_3", {}, build_callback(function(response) {
            console.log("Should not get here!");
        }, function(error) {
            console.log("View 'view_3' not available as expected.");
        }));
    }
];

next_operation();




/*
Expected Output:
================

Establishing a connection with GPUdb...
Record IDs for newly inserted records: 0010300000000000_0000000000000000,0010300000000000_0000000000000001,0010300000000000_0000000000000002,0010300000000000_0000000000000003,0010300000000000_0000000000000004,0010300000000000_0000000000000005,0010300000000000_0000000000000006,0010300000000000_0000000000000007,0010300000000000_0000000000000008,0010300000000000_0000000000000009
Retrieved records:
[ { col1: 0.1, col2: 'string 0', group_id: 'Group 1' },
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' },
  { col1: 6.1, col2: 'string 6', group_id: 'Group 1' },
  { col1: 7.1, col2: 'string 7', group_id: 'Group 1' },
  { col1: 8.1, col2: 'string 8', group_id: 'Group 1' },
  { col1: 9.1, col2: 'string 9', group_id: 'Group 1' } ]
Number of filtered records: 1
Filtered records:
[ { col1: 1.1, col2: 'string 1', group_id: 'Group 1' } ]
Number of records filtered by the second expression: 9
Second set of filtered records:
[ { col1: 0.1, col2: 'string 0', group_id: 'Group 1' },
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' },
  { col1: 6.1, col2: 'string 6', group_id: 'Group 1' },
  { col1: 7.1, col2: 'string 7', group_id: 'Group 1' },
  { col1: 8.1, col2: 'string 8', group_id: 'Group 1' } ]
Number of records filtered by list: 3
Records filtered by a list:
[ { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' } ]
Number of records filtered by range: 4
Records filtered by range:
[ { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' } ]
Statistics of values in 'col1': {"count":10,"mean":4.6,"sum":46}
Inserting more records into the table...
Unique values in 'group_id':
{ column_1: [ 'Group 1', 'Group 2' ],
  column_headers: [ 'group_id' ] }
Group by results:
{ column_1:
   [ 'string 0',
     'string 1',
     'string 2',
     'string 3',
     'string 4',
     'string 5',
     'string 6',
     'string 7',
     'string 8',
     'string 9' ],
  column_2: [ 1, 2, 2, 2, 2, 2, 2, 2, 1, 1 ],
  column_headers: [ 'col2', 'count(*)' ] }
Second group by results:
{ column_1: [ 'Group 1', 'Group 2' ],
  column_2: [ 10, 7 ],
  column_3: [ 46, 98.69999999999999 ],
  column_4: [ 4.6, 14.1 ],
  column_headers: [ 'group_id', 'count(*)', 'sum(col1)', 'avg(col1)' ] }
Third group by results:
{ column_1: [ 'Group 1', 'Group 2' ],
  column_2: [ 460, 987 ],
  column_headers: [ 'group_id', 'sum(col1*10)' ] }
Inserting more records into the table...
Histogram results:
{ counts: [ 1 ], start: 1.1, end: 2 }
View 'view_3' not available as expected.

*/
