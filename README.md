# js table

![JSTable screenshot](./Screenshot.2024-09-18.at.01.28.20.png)

## about
this sample web project is a sample of css styling of a database table records data in json format.

the html markup is produced by JSTable javascript class, used here in this project with javascript source code and no 3rd party dependencies.

## future improvements
I apologize, here is still no pagination bar. this will appear here later, hope so)).

## how to use

### how to set json data for the table
in the file www/index.html, on line 28,
there is the url to json file, containing table rows data in json format.
"/data/table.json"

You can set Your own url of any published in web json data of some table records.

### how to set columns in the table
in the file www/js/JSTable.js there is the javascript class JSTable,

on lines 36 til 45, there is the html template for table header row,

and on lines 51 til 60 there is the html template for the each one table body row. 

feel free to adjust number of columns and source json properties values as columns text.

Columns widths:
in file www/css/jstable.css, on line 47:

grid-template-columns: here You can specify the widths for each column in the table, separated by emptyspaces.

for more informations, how to specify columns widths, feel free to read css3 documentation 
about "grid layout". 


### styling
in file www/css/jstable.css from the top, there are css variables specified, 
those enable fast applying some basic look and feel customization. 


### urls, images sources, paths
in this project, the urls are relative, without domain name, 
however here was supposed, that the www folder is published as root folder for the domain.

so, the www/index.html file is published like http://example.com/index.html or http://example.com/

I guess, for this project to be available when this www folder is published under a sub-url, the leading slashes in the urls here in this project must be removed, or better replaced with this sub-url.

e.g. https://example.com/myproject/jstable-example/

then, e.g. in the www/index.html on line 5:

&lt;link rel="stylesheet" href="/css/jstable.css"&gt;

must be:

&lt;link rel="stylesheet" href="/myproject/jstable-example/css/jstable.css"&gt;


