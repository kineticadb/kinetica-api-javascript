Kinetica JavaScript API
=======================


This repository contains the *Kinetica* client-side API for both *JavaScript*
and *Node.js*, as well as examples of each.


JavaScript
----------

The *JavaScript* API consists of a single file in this repository:

* ``<javascript/GPUdb.js>``

The example HTML files that demonstrate the API are here:

* ``<example/example.html>``
* ``<example/example.js>``

To run the example, copy the project, making sure to maintain the directory
structure (*example.html* references *GPUdb.js* by relative path), and load
*example.html* into a web browser.  Processing output will be logged to the
browser's web console.

The *JavaScript* documentation can be found at:

* **Complete API**: <http://www.kinetica.com/docs/6.2/api/javascript/GPUdb.html>
* **Tutorial**: <http://www.kinetica.com/docs/6.2/tutorials/js_guide.html>


Node.js
-------

The *Node.js* API consists of two files in this repository:

* ``<nodejs/GPUdb.js>``
* ``<nodejs/package.json>``

The example *Node.js* program that demonstrates the API is here:

* ``<example/nodejs-example.js>``

To run the example, copy the project, making sure to maintain the directory
structure (*nodejs-example.js* references *GPUdb.js* by relative path), and run
the following at the command line from within the *example* directory:

    node nodejs-example.js

Processing will be logged to standard output.

The following rpm packages are required for using the library:

* ``nodejs``
* ``npm`` (the *Node.js* package manager)

The *Node.js* module documentation can be found at:

* **Complete API**: <http://www.kinetica.com/docs/6.2/api/nodejs-mod/GPUdb.html>
* **Tutorial**: <http://www.kinetica.com/docs/6.2/tutorials/nodejs_guide.html>


-----

For changes made to the client-side API, please read *CHANGELOG.md*.  For
changes made to the functions available in the database, please refer to
*CHANGELOG-FUNCTIONS.md*.

