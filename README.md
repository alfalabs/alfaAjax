# alfaAjax
JavaScript replacement of jQuery.ajax()

Each method has two callbacks: `sucessCb` and `errorCb`. On timeout event is handled by `errorCb`

```javascript
  alfaAjax.get( url, options, successCb, errorCb)
  
  alfaAjax.post( url, options, successCb, errorCb)

  alfaAjax.mode( url, options, successCb, errorCb) // mode is passed in options={mode:'PUT'}
```
above methods use `XmlHttpRequest` and default data type JSON


```javascript
  alfaAjax.jsonp( url, options, successCb, errorCb)
```
  this method is using \<script\> tag and JSONP

  options:
  ```
  var defaults = {
      mode: 'GET',
      type: 'json',
      timeout: 25000,
      contentType: 'application/json',
      data: null
  }
```
See sample code how to use, in `alfa-ajax.html` also sample partial code for NodeJS server is provided in `app.js`
