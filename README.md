<h3 align="center" style="margin:0px">
	<img width="200" src="https://2wz2rk1b7g6s3mm3mk3dj0lh-wpengine.netdna-ssl.com/wp-content/uploads/2018/08/kinetica_logo.svg" alt="Kinetica Logo"/>
</h3>
<h5 align="center" style="margin:0px">
	<a href="https://www.kinetica.com/">Website</a>
	|
	<a href="https://docs.kinetica.com/7.1/">Docs</a>
	|
	<a href="https://docs.kinetica.com/7.1/api/javascript/">JavaScript API Docs</a>
	|
	<a href="https://docs.kinetica.com/7.1/api/nodejs-mod/">Node.js API Docs</a>
	|
	<a href="https://join.slack.com/t/kinetica-community/shared_invite/zt-1bt9x3mvr-uMKrXlSDXfy3oU~sKi84qg">Community Slack</a>   
</h5>


# Kinetica JavaScript API

-  [Overview](#overview)
-  [JavaScript](#javascript)
-  [Node.js](#nodejs)
-  [Support](#support)
-  [Contact Us](#contact-us)
 

## Overview

This repository contains the *Kinetica* client-side API for both *JavaScript*
and *Node.js*, as well as examples of each.

At high level, the difference between the *JavaScript* and the *Node.js* APIs is:

*   The *JavaScript* API allows synchronous calls:
    *   If the user provides a callback, the API will make an asynchronous call.
    *   If the user does not provide a callback, then the API will make a
        synchronous call, although doing this is discouraged.
*   The *Node.js* API uses promises:
    *   If the user provides a callback, the API will use it (and make an asynchronous
        calls).
    *   If the user does not provide a callback, the API will return a promise (also
        asynchronous).

The documentation can be found at https://docs.kinetica.com/7.1/.

For changes to the client-side API, please refer to
[CHANGELOG.md](CHANGELOG.md).  For
changes to Kinetica functions, please refer to
[CHANGELOG-FUNCTIONS.md](CHANGELOG-FUNCTIONS.md).


## JavaScript

The *JavaScript* API consists of a single file in this repository:

* ``<javascript/GPUdb.js>``

The example HTML files that demonstrate the API are here:

* ``<example/example.html>``
* ``<example/example.js>``

To run the example, copy the project, making sure to maintain the directory
structure (``example.html`` references ``GPUdb.js`` by relative path), and load
``example.html`` into a web browser.  Processing output will be logged to the
browser's web console.

The *JavaScript* documentation can be found at:

* **Complete API**: <https://docs.kinetica.com/7.1/api/javascript/>
* **Tutorial**: <https://docs.kinetica.com/7.1/guides/js_guide/>


## Node.js

The *Node.js* API consists of two files in this repository:

* ``<nodejs/GPUdb.js>``
* ``<nodejs/package.json>``

The example *Node.js* program that demonstrates the API is here:

* ``<example/nodejs-example.js>``

To run the example, copy the project, making sure to maintain the directory
structure (``nodejs-example.js`` references ``GPUdb.js`` by relative path), and
run the following at the command line from within the ``example`` directory:

    node nodejs-example.js

Processing will be logged to standard output.

The following rpm packages are required for using the library:

* ``nodejs``
* ``npm`` (the *Node.js* package manager)

The *Node.js* module documentation can be found at:

* **Complete API**: <https://docs.kinetica.com/7.1/api/nodejs-mod/>
* **Tutorial**: <https://docs.kinetica.com/7.1/guides/nodejs_guide/>


## Support

For bugs, please submit an
[issue on Github](https://github.com/kineticadb/kinetica-api-javascript/issues).

For support, you can post on
[stackoverflow](https://stackoverflow.com/questions/tagged/kinetica) under the
``kinetica`` tag or
[Slack](https://join.slack.com/t/kinetica-community/shared_invite/zt-1bt9x3mvr-uMKrXlSDXfy3oU~sKi84qg).


## Contact Us

* Ask a question on Slack:
  [Slack](https://join.slack.com/t/kinetica-community/shared_invite/zt-1bt9x3mvr-uMKrXlSDXfy3oU~sKi84qg)
* Follow on GitHub:
  [Follow @kineticadb](https://github.com/kineticadb) 
* Email us:  <support@kinetica.com>
* Visit:  <https://www.kinetica.com/contact/>
