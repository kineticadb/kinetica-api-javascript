# GPUdb Javascript API Changelog

## Version 7.1

### Version 7.1.4.0 - TBD

#### Added
##### NodeJS API
-   A new class, `GPUdb.FileHandler`, to handle uploading and downloading
    files to KiFS.  It has the following useful methods:
    -   ``upload``: Uploads files or file objects to KiFS
    -   ``download``: Downloads KiFS file data
    -   ``download_and_save``: Downloads KiFS files into the local filesystem

#### Notes
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.



### Version 7.1.3.0 - 2021-03-05

#### Notes
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.



### Version 7.1.2.0 - 2021-01-25

#### Notes
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.



### Version 7.1.1.0 - 2020-10-28

#### Added
##### JavaScript API
-   GPUdb methods for adding custom headers per endpoint call:
    -   ``add_http_header()``
    -   ``remove_http_header()``
    -   ``get_http_headers()``

##### NodeJS API
-   GPUdb methods for adding custom headers per endpoint call:
    -   ``add_http_header()``
    -   ``remove_http_header()``
    -   ``get_http_headers()``


### Version 7.1.0.0 - 2020-08-18

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


## Version 7.0

### Version 7.0.20.0 - TBD

#### JavaScript API

##### Added
-   GPUdb methods for adding custom headers per endpoint call:
    -   ``add_http_header()``
    -   ``remove_http_header()``
    -   ``get_http_headers()``

##### Fixed
-   Updated the examples to not clear *all* tables, but just the table
    being used in the example.


#### NodeJS API

##### Added
-   GPUdb methods for adding custom headers per endpoint call:
    -   ``add_http_header()``
    -   ``remove_http_header()``
    -   ``get_http_headers()``

##### Fixed
-   Updated the examples to not clear *all* tables, but just the table
    being used in the example.
-   Buffer deprecation warning (using Buffer.from instead of new Buffer()).


#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.19.0 - 2020-08-24

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.18.0 - 2020-07-30

#### Notes
-   Version release
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.17.0 - 2020-07-06

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.

### Version 7.0.16.0 - TBD

#### Fixed
-   Occassional data corruption issue with replacing '\U' with '\u'.

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.15.0 - 2020-04-27

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.14.0 - 2020-03-25

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.



### Version 7.0.13.0 - 2020-03-10

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.



### Version 7.0.12.0 - 2020-01-17

#### Note
-   Check CHANGELOG-FUNCTIONS.md for endpoint related changes.


### Version 7.0.5.0 - 2019-06-26

#### Added
-   Minor documentation and some options for some endpoints

#### Changed
-   Parameters for /visualize/isoschrone


### Version 7.0.4.0 - 2019-05-24

-   Added property, `force_infinity_nan_conversion_to_null`, to GPUdb that
    forces quoted string versions of "Infinity", "-Infinity", and "NaN"
    to null when decode query response.


### Version 7.0.3.0 - 2019-05-02

-   Version release


### Version 7.0.2.0 - 2019-04-17

-   Version release


### Version 7.0.0 - 2019-01-31

-   Version release


## Version 6.2

### Version 6.2.0.0 - 2018-04-17

-   Added a convenience method get_geo_json() that returns a GeoJSON object
    from a table (to both the JavaScript and NodeJS APIs).


## Version 6.1.0 - 2017-10-05

-   Releasing version


## Version 6.0.0 - 2017-01-24

-   Releasing version


## Version 5.4.0 - 2016-11-29

-   Releasing version


## Version 5.2.0 - 2016-10-12

-   Added nullable column support


## Version 5.1.0 - 2016-05-06

-   Updated documentation generation


## Version 4.2.0 - 2016-04-11

-   Refactor generation of the APIs
