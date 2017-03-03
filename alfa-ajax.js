/** alfa-ajax.js  (C)MIT alfalabs.net 17.3.3

    alfaAjax.get( url, options, successCb, errorCb)

    alfaAjax.post( url, options, successCb, errorCb)

    alfaAjax.mode( url, options, successCb, errorCb) // mode is passed in options={mode:'PUT'}

    alfaAjax.jsonp( url, options, successCb, errorCb)


    JSON is default data type for .get(), .put() and .mode() using XmlHttpRequest

    JSONP is for .jsonp() using <script> tag

    JSONP is based on http://stackoverflow.com/users/1212596/paul-draper

 */
var alfaAjax = (function () {


    var me = {};

    me.get = function (url, options, successCb, errorCb) {
        if (typeof options === 'function') { errorCb = successCb; successCb = options; options = {}; }
        var cfg = setCfg(options);
        cfg.mode = 'GET';
        xhrequest(url, cfg, successCb, errorCb);
    }

    me.post = function (url, options, successCb, errorCb) {
        if (typeof options === 'function') { errorCb = successCb; successCb = options; options = {}; }
        var cfg = setCfg(options);
        cfg.mode = 'POST';
        xhrequest(url, cfg, successCb, errorCb);
    }
    me.mode = function (url, options, successCb, errorCb) {
        if (typeof options === 'function') { errorCb = successCb; successCb = options; options = {}; }
        var cfg = setCfg(options);
        xhrequest(url, cfg, successCb, errorCb);
    }

    me.jsonp = function (url, options, successCb, errorCb) {
        if (typeof options === 'function') { errorCb = successCb; successCb = options; options = {}; }
        var cfg = setCfg(options);

        var log = _log('jsonpreq');

        var rqt = alfaTimeout('jsonpreq', cfg.timeout, function () {
            if (typeof errorCb === 'function') { errorCb({ message: 'jsonp TIMEOUT: ' + cfg.timeout + 'ms ' + url }); }
            else { log('TIMEOUT: ' + cfg.timeout + ' ' + url, 'w') }
            return;
        });

        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

        window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);

            if (rqt.isTimedOut(url)) { return; }  // exit without calling callback() because onTimedOut() already did it
            successCb(data);
        };


        var script = document.createElement('script');
        document.body.appendChild(script);

        script.onerror = function (err) {
            document.body.removeChild(script);
            if (rqt.isTimedOut(url)) { return; }  // exit without calling callback() because onTimedOut() already did it
            if (typeof errorCb === 'function') { errorCb({ message: '[jsonpreq] ERR3: ' + ' ' + url }); }
        }

        //try {
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName; // causes uncatchable error when src is bad
        //} catch (e) { console.log('zl\'apany!')}
    }

    return me;

    function setCfg(options) {

        var defaults = {
            mode: 'GET',
            type: 'json',
            timeout: 25000,
            contentType: 'application/json',
            data: null
        }

        var cfg = Object.assign({}, defaults, options);

        cfg.mode = cfg.mode.toUpperCase();

        return cfg;
    }

    
    ////////////////

    

    function xhrequest(url, cfg, successCb, errorCb) {
        var log = _log('xhrequest');

        var xhr = new XMLHttpRequest();

        var rqt = alfaTimeout('xhrequest', cfg.timeout, function () {
            xhr.abort();
            if (typeof errorCb === 'function') { errorCb({ message: '[xhrequest] TIMEOUT: ' + cfg.timeout + 'ms ' + url, xhr }); }
            else { log('TIMEOUT: ' + cfg.timeout + ' ' + url, 'w') }
        });

        //xhr.timeout = cfg.timeout;
        //xhr.ontimeout = function (xhr) { if (typeof errorCb === 'function') errorCb({ message: 'TIMEOUT: ' + cfg.timeout, xhr }) } <-- fires TOO LATE, after error callback !!!

        xhr.onreadystatechange = function () {

            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    if (rqt.isTimedOut('200 '+url)) { return; } //rqt.responded = true;
                    var data;
                    if (cfg.type === 'json') {
                        try { data = JSON.parse(xhr.response); } catch (e) { errorCb({ message: '[xhrequest] ERR4 ' + e.message, xhr }); return; } 
                    } else { data = xhr.response; }

                    successCb(data);
                }
                else {
                    if (rqt.isTimedOut()) { return; }  // exit without calling errorCb because onTimedOut() already did it
                    if (typeof errorCb === 'function') errorCb({ message: '[xhrequest] ERR1 ' + url, xhr })
                }
            }
        };

        xhr.onerror = function (err) {
            if (typeof errorCb === 'function') errorCb({ message: '[xhrequest] ERR2 ' + url, err });
            else { log(err, 'e'); }
        }

        xhr.open(cfg.mode, url, true);
        xhr.setRequestHeader('Content-Type', cfg.contentType);
        if (cfg.data !== null && cfg.contentType.indexOf('json') > -1) { cfg.data = JSON.stringify(cfg.data) }
        if (cfg.mode === 'GET') cfg.data = null;

        xhr.send(cfg.data);
    }

    // helper functions

    function alfaTimeout(requestName, t, onTimedOut) {

        requestName = requestName || 'unnamed';
        if (!Number.isInteger(t)) { console.error('alfaTimeout("' + requestName + '", t, cb) t is not Integer'); return; } // --- >

        var me = {};
        me.t = t;
        me.requestName = requestName;
        me.onTimedOut = onTimedOut;

        me.timedOut = false;
        me.responded = false;

        /** isTimedOut(txt) - called after response or error is received in callback function
         *   @param {String} [txt] - a text to be printed to console.log when timedOut is true
         *   @returns {Boolean}
         */
        me.isTimedOut = function (txt) {
            //console.info(me);
            if (me.timedOut) {
                if (txt) { console.log('[' + requestName + '] Response after timeout ' + txt) };
                return true;
            }
            me.responded = true;
            return false;
        }

        setTimeout(function () {
            if (!me.responded) {
                me.timedOut = true;
                if (!me.responded) me.onTimedOut();
            }
        }, me.t);

        return me;
    }

    function _log(moduleName) {
        var _moduleName = moduleName;
        return function (msg, m) {
            var txt = '[' + _moduleName + '] ';
            if (typeof msg === 'string') { txt = txt + msg; }
            else { txt = txt + ' obj:' }
            if (m === 'e') console.error(txt);
            else if (m === 'w') console.warn(txt);
            else console.log(txt);
            if (typeof msg === 'object') console.log(msg);
        }
    }

})();
