Kinetica JavaScript API
=======================


This repository contains the *Kinetica* client-side API for both *JavaScript*
and *Node.js*, as well as examples of each.

At high level, the difference between the JavaScript and the Node.js APIs is:

*   The JavaScript API allows synchronous calls:
    *   If the user provides a callback, the API will make an asynchronous call.
    *   If the user does not provide a callback, then the API will make a
        synchronous call, although doing this is discouraged.
*   The Node.js API uses promises:
    *   If the user provides a callback, the API will use it (and make an asynchronous
        calls).
    *   If the user does not provide a callback, the API will return a promise (also
        asynchronous).



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

* **Complete API**: <https://docs.kinetica.com/7.1/api/javascript/>
* **Tutorial**: <https://docs.kinetica.com/7.1/guides/js_guide/>


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

* **Complete API**: <https://docs.kinetica.com/7.1/api/nodejs-mod/>
* **Tutorial**: <https://docs.kinetica.com/7.1/guides/nodejs_guide/>


-----

For changes made to the client-side API, please read *CHANGELOG.md*.  For
changes made to the functions available in the database, please refer to
*CHANGELOG-FUNCTIONS.md*.

