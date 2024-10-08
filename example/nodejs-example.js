var GPUdb = require("../nodejs/GPUdb.js");

var url = (process.argv.length <= 2) ? "http://localhost:9191" : process.argv[2];
var user = (process.argv.length <= 3) ? "" : process.argv[3];
var pass = (process.argv.length <= 4) ? "" : process.argv[4];

console.log("Establishing a connection with Kinetica...");
var db = new GPUdb([url], {"username": user, "password": pass});         // Single host
var dbHA = new GPUdb([url, url], {"username": user, "password": pass});  // Multiple hosts as a single list

// Used for uploading and downloading files to and from KiFS
var fileHandler = new GPUdb.FileHandler(db);

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
var kifs_dir_name = "nodejs_example_dir";
var upload_filename = __dirname + "/_data/example_data.txt";

var operations = [
    // Clear the table from the database, in case it was created
    // by a previous run of the example program
    function() {
        db.clear_table( table_name, null, {"no_error_if_not_exists": "true"},
                           build_callback() );
    },

    // Register the data type for the table with GPUdb and get the type's ID
    function() {
        var my_type = new GPUdb.Type("my_type",
                new GPUdb.Type.Column("col1", "double"),
                new GPUdb.Type.Column("col2", "string"),
                new GPUdb.Type.Column("group_id", "string"));

        my_type.create(db, build_callback( function( response ) {
            type_id = response;
        } ));
    },

    // Create the table
    function() {
        db.create_table( table_name, type_id, {}, build_callback() );
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
        db.insert_records( table_name, records, insert_options, build_callback(function(response) {
            console.log("Record IDs for newly inserted records: " + response.record_ids);
        }));
    },

    // Fetch the records from the table
    function() {
        db.get_records( table_name, 0, -9999, {}, build_callback(function(response) {
            console.log("Retrieved records: ");
            console.log(response.data);
        }));
    },

    // Perform a filter operation on the table
    function() {
	var view_name = "view_1";
	var expression = ("col1 = 1.1");
        db.filter( table_name, view_name, expression, {}, build_callback(function(response) {
            console.log("Number of filtered records: " + response.count);
        }));
    },

    // Fetch the records from the view (like reading from a regular table)
    function() {
        db.get_records("view_1", 0, -9999, {}, build_callback(function(response) {
            console.log("Filtered records: ");
            console.log(response.data);
        }));
    },

    // Drop the view
    function() {
        db.clear_table("view_1", null, {}, build_callback());
    },

    // Perform a filter operation on the table on two column_names
    function() {
        db.filter( table_name, "view_1", "col1 <= 9 and group_id = 'Group 1'", {}, build_callback(function(response) {
            console.log("Number of records filtered by the second expression: " + response.count);
        }));
    },

    // Fetch the records from the view
    function() {
        db.get_records("view_1", 0, -9999, {}, build_callback(function(response) {
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
        db.filter_by_list( table_name, view_name, column_values_map, {}, build_callback(function(response) {
            console.log("Number of records filtered by list: " + response.count);
        }));
    },

    // Fetch the records from the second view
    function() {
        db.get_records("view_2", 0, -9999, {}, build_callback(function(response) {
            console.log("Records filtered by a list: ");
            console.log(response.data);
        }));
    },

    // Perform a filter by range operation
    function() {
        db.filter_by_range( table_name, "view_3", "col1", 1, 5, {}, build_callback(function(response) {
            console.log("Number of records filtered by range: " + response.count);
        }));
    },

    // Fetch the records from the third view
    function() {
        db.get_records("view_3", 0, -9999, {}, build_callback(function(response) {
            console.log("Records filtered by range: ");
            console.log(response.data);
        }));
    },

    // Perform an aggregate operation (statistics: sum, mean, count)
    function() {
        db.aggregate_statistics( table_name, "col1", "sum,mean,count", {}, build_callback(function(response) {
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

        db.insert_records( table_name, records, {}, build_callback());
    },

    // Find all unique values of a given column
    function() {
        db.aggregate_unique( table_name, "group_id", 0, -9999, {}, build_callback(function(response) {
            console.log("Unique values in 'group_id': ");
            console.log(response.data);
        }));
    },

    // Aggregate values of a given column by grouping by its values
    function() {
        var column_names = [ "col2" ];
        db.aggregate_group_by( table_name, column_names, 0, -9999, {}, build_callback(function(response) {
            console.log("Group by results: ");
            console.log(response.data);
        }));
    },

    // Second group by
    function() {
        var column_names = [ "group_id", "count(*)", "sum(col1)", "avg(col1)" ];
        db.aggregate_group_by( table_name, column_names, 0, -9999, {}, build_callback(function(response) {
            console.log("Second group by results: ");
            console.log(response.data);
        }));
    },

    // Third group by
    function() {
        db.aggregate_group_by( table_name,
                                  [ "group_id", "sum(col1*10)" ],
                                  0, -9999, {},
                                  build_callback(function(response) {
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

        db.insert_records( table_name, records, {}, build_callback());
    },

    // Perform a histogram calculation
    function() {
	var start = 1.1;
	var end = 2;
	var interval = 1;
        db.aggregate_histogram( table_name, "col1", start, end, interval, {}, build_callback(function(response) {
            console.log("Histogram results: ");
            console.log(response);
        }));
    },

    // Drop the original table (will automatically drop all views of it)
    function() {
        db.clear_table( table_name, null, {}, build_callback());
    },

    // Check that no view of that table is available anymore.
    function() {
        db.show_table("view_3", {}, build_callback(function(response) {
            console.log("Should not get here!");
        }, function(error) {
            console.log("View 'view_3' not available as expected.");
        }));
    },

    // Create a KiFS directory
    function() {
    	var options = {"no_error_if_exists": "true"};
	    db.create_directory( kifs_dir_name, options, build_callback(function(response) {
            console.log("KiFS directory '" + kifs_dir_name + "' has been created!");
        }, function(error) {
            console.error("Error during directory creation!");
        }));
    },

    // Upload a file to KiFS
    function() {
        console.log( "Attempting to upload file '" + __filename.replace(`${__dirname}/`, '') + "'" );
        var kifs_home = "/";
        var options = { file_encoding: 'base64' };

        // Upload the file
        fileHandler.upload( [ __filename ], kifs_dir_name, options,
                            build_callback(function(response) {
                                console.log("File has been uploaded");
                            }, function(error) {
                                console.log("Error in uploading file!");
                            } ) );
    },

    // Show the files
    function() {
	    db.show_files( [ kifs_dir_name ], {}, build_callback(function(response) {
            console.log("Files in KiFS directory '" + kifs_dir_name + "': "
                        + JSON.stringify( response ) );
        }, function(error) {
            console.error("Error during /show/files!");
        }));
    },
];

next_operation();




/*
Expected Output:
================

Establishing a connection with Kinetica...
Record IDs for newly inserted records: 0002000000000766_0000000000000000,0002000000000766_0000000000000001,0002000000000766_0000000000000002,0002000000000766_0000000000000003,0002000000000766_0000000000000004,0002000000000766_0000000000000005,0002000000000766_0000000000000006,0002000000000766_0000000000000007,0002000000000766_0000000000000008,0002000000000766_0000000000000009
Retrieved records:
[
  { col1: 0.1, col2: 'string 0', group_id: 'Group 1' },
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' },
  { col1: 6.1, col2: 'string 6', group_id: 'Group 1' },
  { col1: 7.1, col2: 'string 7', group_id: 'Group 1' },
  { col1: 8.1, col2: 'string 8', group_id: 'Group 1' },
  { col1: 9.1, col2: 'string 9', group_id: 'Group 1' }
]
Number of filtered records: 1
Filtered records:
[ { col1: 1.1, col2: 'string 1', group_id: 'Group 1' } ]
Number of records filtered by the second expression: 9
Second set of filtered records:
[
  { col1: 0.1, col2: 'string 0', group_id: 'Group 1' },
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' },
  { col1: 6.1, col2: 'string 6', group_id: 'Group 1' },
  { col1: 7.1, col2: 'string 7', group_id: 'Group 1' },
  { col1: 8.1, col2: 'string 8', group_id: 'Group 1' }
]
Number of records filtered by list: 3
Records filtered by a list:
[
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 5.1, col2: 'string 5', group_id: 'Group 1' }
]
Number of records filtered by range: 4
Records filtered by range:
[
  { col1: 1.1, col2: 'string 1', group_id: 'Group 1' },
  { col1: 2.1, col2: 'string 2', group_id: 'Group 1' },
  { col1: 3.1, col2: 'string 3', group_id: 'Group 1' },
  { col1: 4.1, col2: 'string 4', group_id: 'Group 1' }
]
Statistics of values in 'col1': {"count":10,"mean":4.6,"sum":46}
Inserting more records into the table...
Unique values in 'group_id':
{
  column_1: [ 'Group 1', 'Group 2' ],
  column_headers: [ 'group_id' ],
  column_datatypes: [ 'string' ]
}
Group by results:
{
  column_1: [
    'string 3', 'string 1',
    'string 6', 'string 5',
    'string 4', 'string 8',
    'string 2', 'string 9',
    'string 0', 'string 7'
  ],
  column_headers: [ 'col2' ],
  column_datatypes: [ 'string' ]
}
Second group by results:
{
  column_1: [ 'Group 2', 'Group 1' ],
  column_2: [ 7, 10 ],
  column_3: [ 98.69999999999999, 46 ],
  column_4: [ 14.099999999999998, 4.6 ],
  column_headers: [ 'group_id', 'count(*)', 'sum(col1)', 'avg(col1)' ],
  column_datatypes: [ 'string', 'long', 'double', 'double' ]
}
Third group by results:
{
  column_1: [ 'Group 1', 'Group 2' ],
  column_2: [ 460, 987 ],
  column_headers: [ 'group_id', 'sum(col1*10)' ],
  column_datatypes: [ 'string', 'double' ]
}
Inserting more records into the table...
Histogram results:
{
  counts: [ 1 ],
  start: 1.1,
  end: 2,
  info: {},
  request_time_secs: 0.00116
}
View 'view_3' not available as expected.
KiFS directory 'nodejs_example_dir' has been created!
Attempting to upload file 'nodejs-example.js'
File has been uploaded
Files in KiFS directory 'nodejs_example_dir': {"file_names":["nodejs_example_dir/nodejs-example.js"],"sizes":[14072],"users":["admin"],"creation_times":[1725813614162],"info":{"multipart_uploads":"{\"uploads_in_progress\":[]}"},"request_time_secs":0.00014}
*/
