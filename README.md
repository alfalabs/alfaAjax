# alfaAjax
### JavaScript ES3 replacement of jQuery.ajax()
I love jQuery!<br>$.Ajax() is great, but it was dropped from jquery.slim.js build. I need a basic functionality to handle JSON communication with server, so here it is. Please report any issues with it.<br>

### Syntax
```javascript
alfaAjax.mode(url [,options] ,successCb [,errorsCb]);
```
>  `url {String}` - url to call<br>
   `options {Object}` - optoins, see below. (optional argument)<br>
   `successCb {Function}` - callback function returning response data<br>
   `errorCb {Function}` - callback function returning error data  (optional argument, if not present, errors are logged to console)<br>

Each method has two callbacks: `sucessCb` and `errorCb`. On timeout event is handled by `errorCb`

```javascript
  alfaAjax.get( url, options, successCb, errorCb)
  
  alfaAjax.post( url, options, successCb, errorCb)

  alfaAjax.mode( url, options, successCb, errorCb) // mode is passed in options={mode:'PUT'}
```
above methods use `XmlHttpRequest` and default data type JSON <br>
options and defaults:
  ```
  var defaults = {
      mode: 'GET',
      type: 'json',
      timeout: 25000,
      contentType: 'application/json',
      data: null
  }
```
- - - 
```javascript
  alfaAjax.jsonp( url, options, successCb, errorCb)
```
this method is using \<script\> tag and JSONP <br>
options and defaults:
  ```
  var defaults = {
      timeout: 25000
  }
```
- - -
```javascript
alfaAjax.page(url, options) // options={data: myDdataObject}
```
this is not an AJAX method, it passes data to server and gets a web page in response,<br/> like `<form method="POST" action="`<i>url</i>`">` On server side, the data arrives as JSON and has to be parsed: `JSON.parse(req.body.data)`
- - - 
See sample code how to use, in [`alfa-ajax.html`](https://github.com/alfalabs/alfaAjax/blob/master/alfa-ajax.html) also sample partial code for NodeJS server is provided in [`app.js`](https://github.com/alfalabs/alfaAjax/blob/master/app.js)
