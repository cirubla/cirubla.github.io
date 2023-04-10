function assert(bCondition, sDesc)
{
  if(!bCondition)
  {
    sDesc = (sDesc || "Assertion failed!");
    throw (typeof Error !== "undefined") ? new Error(sDesc) : sDesc;
  }
}

window.g_bIsTest = !!location.search.match(/(?:\?|&)test=1/);
function isTest()
{
  return window.g_bIsTest;
}

function isBlogAdmin()
{
  return (new Cookie("blog_admin")).loadInt() === 1;
}


function dump(sDesc)
{
  console.log("======== Program-Think DUMP ========\n" + sDesc);
}

function reportError(sDesc)
{
  console.log("======== Program-Think ERROR ========\n" + sDesc);
  (typeof ga === "function") && ga("send", "exception", {"exDescription":sDesc});  // ga is 'Google Analytics'
}

if(typeof window.onerror === "object")
{
  window.onerror = function(sDesc, sUrl, nLine, nColumn, oErr) { return reportError(sDesc) && false }
}


// Object class

if(!Object.keys)  // For browser compatibility
{
  Object.keys =
    (function()
     {
       "use strict";
       var hasOwnProperty = Object.prototype.hasOwnProperty,
           hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString"),
           dontEnums =
           [
             "toString", "toLocaleString", "valueOf", "hasOwnProperty",
             "isPrototypeOf", "propertyIsEnumerable", "constructor"
           ], dontEnumsLen = dontEnums.length;

       return function(obj)
       {
         (typeof obj !== "object") && (typeof obj !== "function" || obj === null)
           && assert(false, "Object.keys: Invalid 'obj'!");

         var result = [];
         for(var prop in obj) { hasOwnProperty.call(obj, prop) && result.push(prop) }
         if(hasDontEnumBug)
         {
           for(var i=0; i<dontEnumsLen; i++){ hasOwnProperty.call(obj, dontEnums[i]) && result.push(dontEnums[i]) }
         }
         return result;
       };
     }()
    );
}  // Object.keys() end


// Number class

if(!Number.isInteger)  // For browser compatibility
{
  Number.isInteger = function(value)
  {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
}

Number.cmp = function(a, b)
{
  assert(typeof a === "number" && typeof b === "number", "Number.cmp: Invalid argument type!");
  return a == b ? 0 : (a>b ? 1 : -1);
}

function intToStr(nInput, nWidth, sPrefix)
{
  assert(typeof nInput === "number" && nInput >= 0, "intToStr: Invalid 'nInput'!");
  assert(typeof nWidth === "number" && nWidth > 0, "intToStr: Invalid 'nWidth'!");
  assert(typeof sPrefix === "string" && sPrefix.length > 0, "intToStr: Invalid 'sPrefix'!");
  var sText = String(nInput);
  while(sText.length < nWidth) { sText = sPrefix + sText }
  return sText;
}


// String class

if(!String.prototype.startsWith)  // For browser compatibility
{
  String.prototype.startsWith = function(sTarget, nPos)
  {
    nPos = nPos || 0;
    return this.indexOf(sTarget, nPos) === nPos;
  };
}

if(!String.prototype.endsWith)  // For browser compatibility
{
  String.prototype.endsWith = function(sTarget, nPos)
  {
    var sSub = this.toString();
    ( typeof nPos !== 'number' || !isFinite(nPos) || Math.floor(nPos) !== nPos || nPos > sSub.length )
      && (nPos = sSub.length);
    nPos -= sTarget.length;
    var nLastPos = sSub.lastIndexOf(sTarget, nPos);
    return (nLastPos !== -1) && (nLastPos === nPos);
  };
}

if(!String.prototype.trim)  // For browser compatibility
{
  String.prototype.trim = function()
  {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
}

String.prototype.multiReplace = function(arrSyntax)  // helper
{
  assert(Array.isArray(arrSyntax), "String.multiReplace: Invalid 'arrSyntax'!");
  var sRtn = this;
  $.each(arrSyntax, function(i, syntax){ sRtn = sRtn.replace(syntax[0], syntax[1]) });
  return sRtn;
};

String.prototype.count = function(regex)  // helper
{
  return (this.match(regex) || []).length;
};


String.prototype.formatHex = function()  // helper
{
  var sHex = "";
  for(var i=0; i<this.length; i++)
  {
    var sCode = this.charCodeAt(i).toString(16);
    sHex += ((sCode.length % 2) ? ("0"+sCode) : sCode) + " ";
  }
  return sHex;
}

String.prototype.mergeCJK = function()
{
  var sProc = "";
  for(var i=0; i<this.length; i++)
  {
    var ch = this.charAt(i);
    sProc.indexOf(ch) == -1 && String.isCJKChar(this.charCodeAt(i)) && (sProc += ch);
  }
  return sProc;
};

String.prototype.htmlTrimTag = function()  // HTML helper
{
  var arrSyntax =  // for security, some chars replace with full width
  [
    [/<\s*br\s*\/?\s*>/gi, "\n"],  // keep '<br>' before trim HTML tag, '\n' as placeholder
    [/<\s*\/\s*[a-z0-9]+\s*>/gi, ""],  // HTML end tag
    [/<\s*[a-z0-9]+(?:\s+\w+\s*=\s*(?:"[^>"]*"|'[^>']*'|[^>]*))*\s*>/gi, ""],  // HTML begin tag
    [/&#(\d+);/g, function(sMatch, s1){ return String.fromCharCode(parseInt(s1)) }],
    [/<|&lt;/g, "&#65308;"],
    [/>|&gt;/g, "&#65310;"],
    [/"|&quot;/g, "&#65282;"],
    [/'/g, "&#65287;"],
    [/[\u0600-\u06FF]/g, ""],
    [/ |\r|&nbsp;/g, "\t"]  // '\t' as placeholder
  ];
  return this.multiReplace(arrSyntax).trim();
};

String.isCJKChar = function(nCode)
{
  return (0x4E00 <= nCode) && (nCode <= 0x9FFF);
};


// Array class

Array.isArray = Array.isArray || function(arg)  // For browser compatibility
{
  return Object.prototype.toString.call(arg) === '[object Array]';
};

Array.prototype.last = function()
{
  assert(this.length >= 1, "Array.last: Invalid 'length'!");
  return this[this.length - 1];
};

Array.prototype.insert = function(nIndex, item)  // helper
{
  this.splice(nIndex, 0, item);
};

Array.prototype.asyncEach = function(nTimeSpan, fnProc, fnComplete)
{
  assert(typeof nTimeSpan === "number" && nTimeSpan > 0,
         "Array.asyncEach: Invalid 'nTimeSpan': '" + nTimeSpan + "'");
  assert(fnProc && typeof fnProc === "function", "Array.asyncEach: Invalid 'fnProc'!");
  assert(!fnComplete || typeof fnProc === "function", "Array.asyncEach: Invalid 'fnComplete'!");

  var self = this, nCur = 0;
  asyncLoop(
    function()
    {
      try
      {
        assert(nCur <= self.length, "Array.asyncEach: Invalid 'nCur': '"+ nCur +"'");
        if(nCur < self.length)
        {
          fnProc(nCur, self[nCur]);
          nCur++;
          return true;
        }
        else  // nCur == self.length
        {
          fnComplete && fnComplete();
          return false;
        }
      }
      catch(err)
      {
        reportError("Array.asyncEach: Catch exception:\n" + err);
        return false;
      }
    },
    nTimeSpan,
    "Array.asyncEach"
  );
};  // asyncEach() end


// Date class

Date.parseISO = function(str)  // For browser compatibility
{
  /* 0 = whole string
     1 = year
     2 = month
     3 = day
     4 = whole time part
     5 = hour
     6 = minute
     7 = second
     8 = millisecond (with dot)
     9 = whole timezone
     10 = offset sign (+ or -)
     11 = offset hours
     12 = offset minutes (with colon) */
  var reISO = /^(\d{4})-(\d\d)-(\d\d)(T(\d\d):(\d\d):(\d\d)(\.\d{1,3})?(Z|([+-])(\d\d)(:\d\d)?)?)?$/;
  var results = reISO.exec(str), sErr = "Date.parseISO: Invalid ";
  if(!results) { return null }

  var nYear = Number(results[1]), nMonth = Number(results[2])-1, nDate = Number(results[3]);
  assert(0<=nMonth && nMonth<12, sErr + "month:" + nMonth);
  assert(1<=nDate && nDate<=31, sErr + "date:" + nDate);
  if(!results[4]) { return new Date(Date.UTC(nYear, nMonth, nDate)) }

  var nHour = Number(results[5]), nMinute = Number(results[6]), nSecond = Number(results[7]);
  assert(0<=nHour && nHour<24, sErr + "hour:" + nHour);
  assert(0<=nMinute && nMinute<60, sErr + "minute:" + nMinute);
  assert(0<=nSecond && nSecond<=60, sErr + "second:" + nSecond);
  var nMilliSecond = results[8] ? Number((results[8]+"000").substr(1,3)) : 0;
  if(!results[9]) { return new Date(nYear, nMonth, nDate, nHour, nMinute, nSecond, nMilliSecond) }

  results[11] && (nHour -= Number(results[10] + results[11]));
  results[12] && (nMinute -= Number(results[10] + results[12].substr(1)));
  return new Date(Date.UTC(nYear, nMonth, nDate, nHour, nMinute, nSecond, nMilliSecond));
}  // parseISO() end

Date.prototype.format = function(sStyle)  // inner helper
{
  var arrFlags =
  [
    [ /%Y/g,  String(this.getFullYear()) ],
    [ /%0m/g, intToStr(this.getMonth()+1, 2, "0") ],
    [ /%m/g,  String(this.getMonth()+1) ],
    [ /%0d/g, intToStr(this.getDate(), 2 , "0") ],
    [ /%d/g,  String(this.getDate()) ],
    [ /%w/g,  String(this.getDay()) ],
    [ /%0H/g, intToStr(this.getHours(), 2 , "0") ],
    [ /%H/g,  String(this.getHours()) ],
    [ /%0M/g, intToStr(this.getMinutes(), 2, "0") ],
    [ /%M/g,  String(this.getMinutes()) ],
    [ /%0S/g, intToStr(this.getSeconds(), 2, "0") ],
    [ /%S/g,  String(this.getSeconds()) ],
    [ /%0f/g, intToStr(this.getMilliseconds(), 3, "0") ],
    [ /%f/g,  String(this.getMilliseconds()) ],
    [ /%%/g,  "%" ]
  ];
  return sStyle.multiReplace(arrFlags);
}

if(!Date.prototype.toISOString)  // For browser compatibility
{
  Date.prototype.toISOString = function()
  {
    return this.getUTCFullYear() +
      '-' + intToStr(this.getUTCMonth() + 1, 2, "0") +
      '-' + intToStr(this.getUTCDate(), 2, "0") +
      'T' + intToStr(this.getUTCHours(), 2, "0") +
      ':' + intToStr(this.getUTCMinutes(), 2, "0") +
      ':' + intToStr(this.getUTCSeconds(), 2, "0") +
      '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      'Z';
  };
}


// Math class

Math.log2 = Math.log2 || function(x)  // For browser compatibility
{
  return Math.log(x) * Math.LOG2E;
};


// Url class

function Url(sUrl)
{
  this.bValid = false;

  function _getDefaultPort(sProtocol)
  {
    if (sProtocol === 'file') { return ''; }
    assert(sProtocol.match(/https?/), "_getDefaultPort: Invalid 'sProtocol': " + sProtocol);
    return "http" == sProtocol ? 80 : 443;
  }
  function _parseQueryString(sQueryString)
  {
    if(!sQueryString) { return {} }

    assert(sQueryString.charAt(0) == "?", "_parseQueryString: Invalid 'sQueryString': " + sQueryString);
    var mapParams = {}, arrParams = sQueryString.substr(1).split("&");
    for(var i=0; i<arrParams.length; i++)
    {
      var results = arrParams[i].match(/^(\w+)=([^\?=#]*)$/);
      if(results && 3 == results.length)
      {
        var sName = results[1], sValue = results[2].replace(/\+/g, "%20");
        try { mapParams[sName] = decodeURIComponent(sValue) }
        catch(err) { mapParams[sName] = "" }  // decode failed
      }
    }
    return mapParams;
  }

  if(null == sUrl)
  {
    var sProtocol = location.protocol.toLowerCase();
    this.sProtocol = sProtocol.substring(0, sProtocol.length - 1);  // trim ':'
    this.sHost = location.hostname;
    this.nPort = location.port || _getDefaultPort(this.sProtocol);
    this.sPath = location.pathname || "/";
    this.mapParams = _parseQueryString(location.search);
    this.sHash = location.hash || "";
    this.bValid = true;
  }
  else
  {
    var results = sUrl.match(Url.getRegexp());
    if(results && 7 == results.length)
    {
      this.sProtocol = results[1].toLowerCase();
      this.sHost = results[2];
      this.nPort = results[3] || _getDefaultPort(this.sProtocol);
      this.sPath = results[4] || "/";
      this.mapParams = _parseQueryString(results[5]);
      this.sHash = results[6] || "";
      this.bValid = true;
    }
  }
}  // Url() end

Url.prototype.getParam = function(sName)
{
  return (this.bValid && (sName in this.mapParams)) ? this.mapParams[sName] : null;
}

Url.getRegexp = function()
{
  var regexp = /(https?)\:\/\/([\w\-]+(?:\.[\w\-]+)+)(?:\:(\d+))?(\/[\w\-\/\.\+\(\)\*%!@~=\,\:]*)?(\?(?:[\w\-]+=[\w\-\/\.\+\(\)\*%!@~\,\:]*)?(?:&[\w\-]+=[\w\-\/\.\+\(\)\*%!@~\,\:]*)*)?(#[\w\-\/\.\+\(\)\*%!@~=\,\:&]*)?/i;
  return regexp;
}

Url.getRegexpStr = function(needEscape)
{
  var str = Url.getRegexp().toString();
  str = str.substring(1, str.length - 2);
  return needEscape ? str.replace(/&/g, "&amp;") : str;
}

Url.getDomain = function()
{
  return "program-think.blogspot.com";
}

Url.isMirror = function()
{
  return !(location.hostname.match(/^program\-think\.blogspot\.(?:\w+|com\.\w+|co\.\w+)$/i));
}

Url.getFeedUrlPrefix = function()
{
  return "/feeds";
}

Url.preprocess = function(sText, sExcludeChars, func)
{
  assert(typeof sText === "string", "Url.preprocess: Invalid type of 'sText'!");
  assert(typeof sExcludeChars === "string", "Url.preprocess: Invalid type of 'sExcludeChars'!");
  assert(func && typeof func === "function", "Url.preprocess: Invalid type of 'func'!");

  var sUrlPattern = Url.getRegexpStr(true);
  var regex = new RegExp("(^|"+sExcludeChars+")" + "("+sUrlPattern+")" + "($|"+sExcludeChars+")", "g");
  sText = sText.replace(regex, func);
  return sText.replace(regex, func);  // to process overlap
}


// Radix encode & decode

Radix64 =  // Can NOT handle negative numbers and float number.
{
  toStr : function(nNum)
  {
    assert(!isNaN(nNum) && isFinite(nNum), "Radix64: The input number is invalid!");
    assert(nNum >= 0, "Radix64: Can't convert negative numbers!");
    assert(Math.floor(nNum) == nNum, "Radix64: Can't convert float number!");

    var sResult = "";
    while(true)
    {
      sResult = this._sRixits.charAt(nNum % 64) + sResult;
      nNum = Math.floor(nNum / 64);
      if(0 == nNum) { break }
    }
    return sResult;
  },

  toInt : function(sRadix64)
  {
    var nResult = 0;
    for(var i=0; i<sRadix64.length; i++)
    {
      var nIndex = this._sRixits.indexOf(sRadix64.charAt(i));
      assert(nIndex >= 0, "Radix64: The input string is invalid!");
      nResult = nResult * 64 + nIndex;
    }
    return nResult;
  },

     //       0       8       16      24      32      40      48      56     63
  _sRixits : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_~"
};


// Date & time helper functions

function delayRun(func, nTimeSpan)  // 'nTimeSpan' is milliseconds
{
  assert(func && typeof func === "function", "delayRun: Invalid type of 'func'!");
  assert(typeof nTimeSpan === "number" && nTimeSpan > 0, "delayRun: Invalid 'nTimeSpan': '" + nTimeSpan + "'");
  var timer = setTimeout(
    function()
    {
      try
      {
        clearTimeout(timer);
        func();
      }
      catch(err)
      {
        reportError("delayRun: Catch exception:\n" + err);
      }
    },
    nTimeSpan
  );
}

function asyncLoop(func, nTimeSpan, sTask)  // 'nTimeSpan' is milliseconds
{
  assert(func && typeof func === "function", "asyncLoop: Invalid type of 'func'!");
  assert(typeof nTimeSpan === "number" && nTimeSpan > 0, "asyncLoop: Invalid 'nTimeSpan': '" + nTimeSpan + "'");
  sTask = sTask || "";

  //isTest() && dump("asyncLoop: start " + sTask);
  var timer = setInterval(
    function()
    {
      try
      {
        if(func() === false)
        {
          clearInterval(timer);
          //isTest() && dump("asyncLoop: stop " + sTask);
        }
      }
      catch(err)
      {
        clearInterval(timer);
        reportError("asyncLoop: Catch exception:\n" + err);
      }
    },
    nTimeSpan
  );
}

function asyncCallChain(arrFunc, nTimeSpan)  // 'nTimeSpan' is milliseconds
{
  assert(Array.isArray(arrFunc), "asyncCallChain: Invalid 'arrFunc'!");
  assert(typeof nTimeSpan === "number" && nTimeSpan > 0, "asyncCallChain: Invalid 'nTimeSpan': '" + nTimeSpan + "'");
  arrFunc.asyncEach(
    nTimeSpan,
    function(n, func)
    {
      assert(func && typeof func === "function", "asyncCallChain: Invalid function in 'arrFunc[" + n +" ]'!");
      func();
    }
  );
}

function getCurrentMS()
{
  return (new Date()).getTime();
}

function getArticleTime()
{
  var $post_timestamp = $(".post-toolbar .post-timestamp");
  assert(1 == $post_timestamp.length, "getArticleTime: Invalid DOM!");
  return Date.parseISO($post_timestamp.attr("data"));
}

function getMinTime()
{
  return Date.parseISO("2009-01-15T00:00:00Z");
}

function getDatePickerOpts()
{
  var dateOpts =
  {
    dateFormat: "yy-mm-dd",
    showOtherMonths: false,
    changeYear: true,
    changeMonth: true,
    minDate: "2009-01-15",
    maxDate: new Date(),
    defaultDate: new Date(),
    nextText: "",
    prevText: "",
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    dayNames: ["", "", "", "", "", "", ""],
    currentText: "今天"
  };
  dateOpts.monthNamesShort = dateOpts.monthNames;
  dateOpts.dayNamesShort = dateOpts.dayNamesMin;
  return dateOpts;
}

function getRelativeTimeDesc(dt)
{
  var nMinutes = Math.round( (getCurrentMS()-dt.getTime()) / 1000 / 60 );
  if(nMinutes < 10) { return "刚才" }
  else if(nMinutes < 20) { return "10分钟前" }
  else if(nMinutes < 30) { return "20分钟前" }
  else if(nMinutes < 60) { return "半小时前" }
  else if(nMinutes < 60 * 24) { return Math.floor(nMinutes / 60) + "小时前" }
  else if(nMinutes < 60 * 24 * 7) { return Math.floor(nMinutes / 60 / 24) + "天前" }
  else { return dt.format("%Y年%m月%d日") }
}


// BBCode global functions

function getImgHost(sUrl)
{
  var arrImgHosts =
  [
    [/\/\/lh\d+\.googleusercontent\.com\/|\/\/blob-s-docs\.googlegroups\.com\/|\/\/\d+\.bp\.blogspot\.com\//i, "Google"],
    [/\/\/pbs\.twimg\.com\//i, "Twitter"],
    [/\/\/i\.imgur\.com\/\w+\.(?:jpe?g|png|gif)$/i, "Imgur"],
    [/\/\/go\.imgs\.co\/u\/[\w\/]+?\.(?:jpe?g|png|gif)$/i, "IMGs"],
    [/\/\/(?:\w+\.)?chinadigitaltimes\.net\/.+?\.(?:jpe?g|png|gif)$/i, "中国数字时代"],
    [/\/\/mmbiz\.qpic\.cn\//i, "微信"],
    [/\/\/\w+\.sinaimg\.cn\//i, "新浪"],
    [/\/\/img\d+\.ph\.126\.net\//i, "网易"],
    [/\/\/img\d+\.laibafile\.cn\/p\//i, "天涯论坛"]
    // TODO: add more sites
  ];
  for(var i=0; i<arrImgHosts.length; i++)
  {
    if(sUrl.match(arrImgHosts[i][0])) { return arrImgHosts[i][1] }
  }
  return sUrl.match(/\.(?:jpe?g|png|gif|webp|svg)$/i) ? "N/A" : null;
}

function renderBBCode(sText, mapOpts)
{
  assert(sText.search(/[<>"']/) == -1, "renderBBCode: Invalid char!");

  mapOpts = mapOpts || {};
  var nMaxImgNum = ("maxImgNum" in mapOpts ? mapOpts.maxImgNum : 5);

  function _escape(str)  // reserved
  {
    return str;
  }

  function _forceHTTPS(sUrl)
  {
    var oUrl = new Url(sUrl);
    if("https" == oUrl.sProtocol) { return sUrl }

    var arrHosts =  // famous domains that support HTTPS
    [
      /(?:\w+\.)?wikipedia\.org/i,
      /(?:\w+\.)?google\.(?:\w+|com\.\w+|co\.\w+)/i,
      /(?:\w+\.)?github\.(?:com|io)/i,
      /program\-think\.blogspot\.(?:\w+|com\.\w+|co\.\w+)/i
    ];
    for(var i=0; i<arrHosts.length; i++)
    {
      if(oUrl.sHost.match(arrHosts[i])) { return sUrl.replace(/^http:/i, "https:") }
    }
    return sUrl;
  }  // _forceHTTPS() end

  // function _renderImg(sImgUrl)
  // {
  //   var sImgProxyService = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy";
  //   var sImgProxyUrl = sImgProxyService + "?container=focus"
  //       + "&refresh=" + (3600 * 24 * 365) + "&url=" + encodeURIComponent(sImgUrl);
  //   return "<div class='bbcode image'><center>"
  //     + "<img class='icon' src='" + sImgProxyUrl + "&resize_w=128' alt='正在载入缩略图 ...'/>"
  //     + "<div style='overflow:auto;'><img class='real' style='display:none;'/></div>"
  //     + "<a class='show-real' href='javascript:;'>切换到原始图</a>"
  //     + "<a class='show-icon' href='javascript:;' style='display:none;'>切换到缩略图</a></center>"
  //     + "图片服务器&#65306;" + (getImgHost(sImgUrl) || "N/A") + "<br/>"
  //     + "图片的原始网址&#65306;<u>" + sImgUrl + "</u></div>";
  // }
  function _renderImg(sImgUrl)
  {
    var fingerprint = new Url(sImgUrl).getParam('fp');
    var sImgProxyUrl = sImgUrl;
    if (fingerprint != null) {
      sImgProxyUrl = '../../images/' + fingerprint;
      var regex = new RegExp('fp='+fingerprint, "g");
      sImgUrl = sImgUrl.replace(regex, "");
    }
    return "<div class='bbcode image'><center>"
      + "<img class='icon' src='" + sImgProxyUrl + "&resize_w=256' alt='正在载入缩略图 ...'/>"
      + "<div style='overflow:auto;'><img class='real' style='display:none;'/></div>"
      + "<a class='show-real' href='javascript:;'>切换到原始图</a>"
      + "<a class='show-icon' href='javascript:;' style='display:none;'>切换到缩略图</a></center>"
      + "图片服务器&#65306;" + (getImgHost(sImgUrl) || "N/A") + "<br/>"
      + "图片的原始网址&#65306;<u>" + sImgUrl + "</u></div>";
  }

  var sUrlPattern = Url.getRegexpStr(true), sTextPattern = "[^\\[\\]]+", nImgCount = 0;
  var arrSyntax =
  [
    [
      new RegExp("([^\\[\\]0-9>])((?:([0-9]+)楼)?([0-9]+)单元)([^\\[\\]<])", "g"),
      function(sMatch, s1, s2, s3, s4, s5)
      {
        return s1 + "<a class='bbcode goto' href='javascript:;' top='" + (s3 || "") + "' sub='" + s4 + "'>" + s2 + "</a>" + s5;
      }
    ],
    [
      new RegExp("\\[img\\](" + sUrlPattern + ")\\[\\/img\\]", "g"),
      function(sMatch, s1)
      {
        nImgCount++;  // anti spam DOS attack
        return (nImgCount <= nMaxImgNum) ? _renderImg(_forceHTTPS(s1)) : _forceHTTPS(s1);
      }
    ],
    [
      // new RegExp("\\[url\\](" + sUrlPattern + ")\\[\\/url\\]", "g"),
      // function(sMatch, s1)
      // {
      //   var sUrl = _forceHTTPS(s1);
      //   return "<a href='" + sUrl + "' class='bbcode simple' target='_blank' rel='nofollow'>" + sUrl + "</a>";
      // }
      new RegExp("\\[url\\](" + sUrlPattern + ")\\[\\/url\\]", "g"),
      function(sMatch, s1)
      {
        var sUrl = _forceHTTPS(s1);
        if (sUrl.startsWith("https://program-think.blogspot.com/")) 
        {
          var relativePath = sUrl.replace("https://program-think.blogspot.com/", '');
          return "<a href='../../" + relativePath + "' class='bbcode simple' target='_blank' rel='nofollow' title='" + sUrl + "'>" + relativePath + "</a>";
        }

        return "<a href='" + sUrl + "' class='bbcode simple' target='_blank' rel='nofollow'>" + sUrl + "</a>";
      }
    ],
    [
      // new RegExp("\\[url=(" + sUrlPattern + ")\\](" + sTextPattern + ")\\[\\/url\\]", "g"),
      // function(sMatch, s1, s2, s3, s4, s5, s6, s7, s8)
      // {
      //   var sUrl = _forceHTTPS(s1), sText = _escape(s8);
      //   return "<a href='" + sUrl + "' class='bbcode text' target='_blank' rel='nofollow'>" + sText + "</a>";
      // }
      new RegExp("\\[url=(" + sUrlPattern + ")\\](" + sTextPattern + ")\\[\\/url\\]", "g"),
      function(sMatch, s1, s2, s3, s4, s5, s6, s7, s8)
      {
        var sUrl = _forceHTTPS(s1), sText = _escape(s8);
        if (sUrl.startsWith("https://program-think.blogspot.com/")) 
        {
          var relativePath = sUrl.replace("https://program-think.blogspot.com/", '');
          return "<a href='../../" + relativePath + "' class='bbcode text' target='_blank' rel='nofollow' title='" + sUrl + "'>" + sText + "</a>";
        }
        return "<a href='" + sUrl + "' class='bbcode text' target='_blank' rel='nofollow'>" + sText + "</a>";
      }
    ],
    [
      new RegExp("\\[b\\](" + sTextPattern + ")\\[\\/b\\]", "g"),
      function(sMatch, s1){ return "<b class='bbcode'>" + _escape(s1) + "</b>" }
    ],
    [
      new RegExp("\\[i\\](" + sTextPattern + ")\\[\\/i\\]", "g"),
      function(sMatch, s1){ return "<i class='bbcode'>" + _escape(s1) + "</i>" }
    ],
    [
      new RegExp("\\[center\\](" + sTextPattern + ")\\[\\/center\\]", "g"),
      function(sMatch, s1){ return "<center class='bbcode'>" + _escape(s1) + "</center>" }
    ],
    [
      new RegExp("\\[quote\\](" + sTextPattern + ")\\[\\/quote\\]", "g"),
      function(sMatch, s1)
      {
        var sContent = _escape(s1).trim(), sTag = (sContent.indexOf("\n") == -1 ? "span" : "div");
        return "<" + sTag + " class='bbcode quote'>" + sContent + "</" + sTag + ">";
      }
    ],
    [
      new RegExp("\\[del\\](" + sTextPattern + ")\\[\\/del\\]", "g"),
      function(sMatch, s1){ return "<del class='bbcode'>" + _escape(s1) + "</del>" }
    ]
  ];  // arrSyntax[] end

  {
    var nImgCount = 0;
    function _makeTag(sMatch, s1, s2, s3, s4, s5, s6, s7, s8, s9)
    {
      var sUrl = _forceHTTPS(s2), bIsImg = getImgHost(sUrl);
      bIsImg && nImgCount++;  // anti spam DOS attack
      var sTag = (bIsImg && nImgCount <= nMaxImgNum) ? "img" : "url";
      return (s1 + "["+sTag+"]" + sUrl + "[/"+sTag+"]" + s9);
    }
    var sPunct = "\\s:,\\u2000-\\u206F\\u3000-\\u303F\\uFF00-\\uFFEF", sCJK = "\\u4E00-\\u9FFF";
    sText = Url.preprocess(sText, "["+sPunct+sCJK+"]", _makeTag);
  }

  sText = sText.multiReplace(arrSyntax);
  (sText.indexOf("[/") >= 0) && (sText.indexOf("]") >= 0)
    && (sText = sText.multiReplace(arrSyntax));  // nest bbcode
  return sText;
}  // renderBBCode() end


// Cookie class

Cookie.getExpireDays = function()
{
  var nExpireDays = (new Cookie("expire_days")).loadInt();
  if(null == nExpireDays || nExpireDays <= 0)
  {
    nExpireDays = 365;
    (new Cookie("expire_days")).saveInt(nExpireDays, nExpireDays);
  }
  return nExpireDays;
}

function Cookie(sName)
{
  this.sName = sName;
  this.regex = new RegExp("^(?:.+?;)?\\s*"+sName+"\\s*=\\s*([^;]+)\\s*(?:;|$)", "");
}

Cookie.prototype.isExisted = function()
{
  return document.cookie.match(this.regex) ? true : false;
}

Cookie.prototype.load = function()
{
  var results = document.cookie.match(this.regex);
  if(!results || results.length != 2) { return null }
  return decodeURIComponent(results[1]);
}

Cookie.prototype.save = function(sValue, nExpireDays)
{
  if(isNaN(nExpireDays) || nExpireDays <= 0) { nExpireDays = Cookie.getExpireDays() }
  var sCookie = this.sName + "=" + encodeURIComponent(sValue);
  var dt = new Date();
  dt.setTime(dt.getTime() + nExpireDays * 24 * 60 * 60 * 1000);
  sCookie += ";expires=" + dt.toUTCString();
  sCookie += ";path=/";
  document.cookie = sCookie;
  return this.isExisted();
}

Cookie.prototype.loadInt = function()
{
  var nNum = parseInt(this.load());
  return isNaN(nNum) ? null : nNum;
}

Cookie.prototype.saveInt = function(nNum, nExpireDays)
{
  return isNaN(nNum) ? false : this.save(""+nNum, nExpireDays);
}

// To minimize encodeURIComponent() output and keep readability,
// use this format in cookie:  key1(value1)key2(value2)

Cookie.prototype.loadMap = function()
{
  var sMap = this.load();
  if(!sMap) { return {} }

  var arrPairs = sMap.split(")");
  var map = {};
  for(var i=0; i<arrPairs.length-1; i++)
  {
    var results = arrPairs[i].match(/^(.+?)\((.+)$/);
    if(results && 3 == results.length)
    {
      var sKey = results[1];
      assert(sKey.length > 0, "Cookie.loadMap: Invalid key!");
      map[sKey] = results[2];
    }
  }
  return map;
}

Cookie.prototype.saveMap = function(map, nExpireDays)
{
  if(!map) { return false }
  var sMap = "";
  for(var sKey in map) { sMap += sKey + "("+map[sKey]+")" }
  return this.save(sMap, nExpireDays);
}

// Config helper

function hadConfig()
{
  return (new Cookie("options")).isExisted();
}

function loadConfig()
{
  var mapDefaultConfig =
  {
    "article.font-size" : "100",
    "article.inner-index" : "true",

    "comments.font-size" : "100",
    "comments.bbcode-img" : "auto",  // unused
    "comments.limit-height" : "true",

    "tweets.font-size" : "100",
    "tweets.init-num" : "120",
    "tweets.auto-load" : "true",
    "tweets.auto-load-timeout" : "5",

    "side-toolbar.show" : "true",
    "side-toolbar.drag" : "true",
    "side-toolbar.drag-pos" : ""
  };

  var mapConfig = (new Cookie("options")).loadMap();
  if(!mapConfig) { return mapDefaultConfig }

  for(var sKey in mapDefaultConfig)
  {
    (sKey in mapConfig) || (mapConfig[sKey] = mapDefaultConfig[sKey]);
  }
  return mapConfig;
}  // loadConfig() end

function saveConfig(mapConfig)
{
  return (new Cookie("options")).saveMap(mapConfig);
}


// Extend jQuery

jQuery.fn.extend({
  hasAttr: function(sAttrName)
  {
    assert(typeof sAttrName === "string" && sAttrName, "jQuery.hasAttr: Invalid 'sAttrName'!");
    var attr = this.attr(sAttrName);
    return (typeof attr !== typeof undefined && attr !== false);
  },

  inScreen: function(bFully)
  {
    var nPageTop = jQuery(window).scrollTop(), nPageBottom = nPageTop + jQuery(window).height();
    var nThisTop = this.offset().top, nThisBottom = nThisTop + this.height();
    return bFully
      ? (nPageTop <= nThisTop && nThisBottom <= nPageBottom)
      : (nThisTop <= nPageBottom && nPageTop <= nThisBottom);
  },

  scrollTo: function(sScrollType)
  {
    jQuery("html,body").animate({ scrollTop: this.offset().top }, sScrollType);
    return this;
  },

  adjustPosition: function(offset)
  {
    var x = offset.left, y = offset.top;
    x = (x<0) ? 0 : x;
    y = (y<0) ? 0 : y;
    ( x > jQuery(window).width()-this.width() ) && ( x = jQuery(window).width()-this.width() );
    ( y > jQuery(window).height()-this.height() ) && ( y = jQuery(window).height()-this.height() );
    this.css({ left:x, top:y });
    return { left:x, top:y };
  },

  asyncEach: function(nTimeSpan, fnProc, fnComplete)
  {
    assert(typeof nTimeSpan === "number" && nTimeSpan > 0,
           "jQuery.asyncEach: Invalid 'nTimeSpan': '" + nTimeSpan + "'");
    assert(typeof fnProc === "function" && fnProc, "jQuery.asyncEach: Invalid 'fnProc'!");
    assert(!fnComplete || typeof fnProc === "function", "jQuery.asyncEach: Invalid 'fnComplete'!");
    this.get().asyncEach(nTimeSpan, function(n, item){ fnProc(jQuery(item)) }, fnComplete);
  },

  doClick: function()
  {
    var offset = this.offset();
    var event = jQuery.Event("mousedown", { which:1, pageX:offset.left, pageY:offset.top });
    this.trigger(event);
    return this;
  }
});


// jQueryUI helper

Tooltip =
{
  content : function(callback){ callback($(this).attr("title").replace(/\n/g, "<br/>")) },
  open: function(event, ui, nTimeout)
  {
    ui.tooltip.hover(function(){ $(this).hide("fade") });
    (nTimeout > 0) && delayRun(function(){ ui.tooltip.hide("fade") }, nTimeout);
  }
};


// GUI helper

function showBottomTip(sText, nTimeout)
{
  assert(typeof sText === "string" && sText, "showBottomTip: Invalid 'sText'!");
  assert(typeof nTimeout === "number" && nTimeout >= 0, "showBottomTip: Invalid 'nTimeout': " + nTimeout);

  var $element = jQuery("#bottom-tip");
  $element.html(sText).show();
  sText = $element.html();  // Save tip text
  (nTimeout > 0) && delayRun(function(){ $element.html() == sText && hideBottomTip() }, nTimeout);
}

function hideBottomTip()
{
  jQuery("#bottom-tip").hide().html("");
}

function layoutReset()
{
  $("#sidebar").show();
  $("#main").css("width", "67%");
  $("#comments").show();
  $("#Header1").show();

  var mapConfig = loadConfig();
  ("true" == mapConfig["side-toolbar.show"]) && $("#side-toolbar").show();

  $(".maximize").show();
  $(".minimize").hide();
}

// Search helper

function parseSearchKeywords(sParam)
{
  if(!sParam) { return [] }

  var sValidChar = "\\w\\u4E00-\\u9FFF\\u2000-\\u206F\\u3000-\\u303F\\uFF00-\\uFFEF\\.";
  var reInclude = new RegExp("(?:^|\\s)(?:(["+sValidChar+"]+)|\"(["+sValidChar+"\\s]+)\")(?:\\s|$)", "");
  var arrKeywords = [];

  while(true)
  {
    var sOld = sParam;
    sParam = sParam.replace(
      reInclude,
      function(sMatch, s1, s2)
      {
        s1 && arrKeywords.push(s1);
        s2 && arrKeywords.push(s2);
        return " ";
      }
    );
    if(sParam == sOld) { break }
  }

  return arrKeywords;
}  // parseSearchKeywords() end

function keywordToRegexp(sKeyword)
{
  var arrCharMap =
  [
    [/\:/g, "\\:"],
    [/\//g, "\\/"],
    [/\./g, "\\."],
    [/\-/g, "\\-"],
    [/\+/g, "\\+"],
    [/\*/g, "\\*"],
    [/\,/g, "\\,"],
    [/\(/g, "\\("],
    [/\)/g, "\\)"],
    [/\?/g, "\\?"],
    [/\s/g, "\\s"]
  ];
  return new RegExp(sKeyword.multiReplace(arrCharMap), "gi");
}

function highlightSearchKeywords(arg, arrKeywords)
{
  if(!arrKeywords) { return }

  function _highlight(sMatch)
  {
    return (sMatch.search(/\sclass='highlight'/) != -1) ? sMatch : ("<span class='highlight'>" + sMatch + "</span>")
  }

  if(typeof arg === "string")
  {
    var sHtml = arg;
    $.each(arrKeywords, function(i, sKeyword){ sHtml = sHtml.replace(keywordToRegexp(sKeyword), _highlight) });
    return sHtml;
  }
  else if(arg instanceof jQuery)  //TODO: NOT used
  {
    var $element = arg;
    var sOldHtml = $element.html();
    var sNewHtml = sOldHtml;
    $.each(arrKeywords, function(i, sKeyword){ sNewHtml = sNewHtml.replace(keywordToRegexp(sKeyword), _highlight) });
    (sNewHtml != sOldHtml) && $element.html(sNewHtml);
    return sNewHtml != sOldHtml;
  }
}  // highlightSearchKeywords() end

function reportHttpError(sOperType, xhr, sErrType)
{
  if("notmodified" === sErrType) { return "" }

  var sDesc = sOperType+"&#65292;";
  if("timeout" === sErrType) { sDesc += "网络传输超时&#65281;" }
  else if("parsererror" === sErrType) { sDesc += "无法解析网页数据&#65281;" }
  else
  {
    if(0 == xhr.status) { sDesc += "网络连接异常&#65281;" }
    else if(400 <= xhr.status && xhr.status < 600) { sDesc += "服务器返回 HTTP " + xhr.status + " 错误&#65281;" }
    else { sDesc += "出现未知错误&#65281;" }
  }

  showBottomTip("<b>"+sDesc+"</b>", 5000);
  return sDesc;
}


// Author class

function Author(json)
{
  this.sName = "";
  this.sHomeUrl = "";
  this.sAvatarUrl = "";
  this.bIsAnonymous = true;
  this.sign = '';

  if(json)
  {
    this.sName = json.name.$t;
    let url = json.gd$image.src.replace("http://", "https://"); // Force HTTPS
    const index = url.indexOf('?cache=');
    if (index != -1) {
      this.sign = url.substring(index + 7);
      url = url.substring(0, index);
    }

    this.sAvatarUrl = url;
    this.bIsAnonymous = !!this.sAvatarUrl.match(/\/\/img1\.blogblog\.com\/img\/(?:anon36\.png|blank\.gif)$/i);
    ("uri" in json) && (this.sHomeUrl = json.uri.$t);
  }
  this.normalize();
}

Author.prototype.normalize = function()
{
  // Force HTTPS
  this.sAvatarUrl.startsWith("//") && (this.sAvatarUrl = "https:" + this.sAvatarUrl);
  this.sAvatarUrl.startsWith("http://") && (this.sAvatarUrl = this.sAvatarUrl.replace(/^http:/i, "https:"));
  this.sHomeUrl.startsWith("http://www.blogger.com/") && this.isLogined()
    && (this.sHomeUrl = this.sHomeUrl.replace(/^http:/i, "https:"));

  // Change name
  this.isAnonymous() && ("Anonymous" == this.sName) && (this.sName = "匿名");
  this.sName = this.sName.htmlTrimTag().replace(/\n|&#12288;/g, "\t");  // '\t' as placeholder

  // Change avatar image
  if (this.sAvatarUrl.indexOf("//img1.blogblog.com/img/blank.gif") > 0) {
    this.sAvatarUrl = this.sign === '' ? 'https://img1.blogblog.com/img/anon36.png' : ('../../images/avatar/' + this.sign);
  }

  this.isAdmin() && (this.sAvatarUrl = '../../images/thinker.jpg');

  return this;
}


// Author.prototype.normalize = function()
// {
//   // Force HTTPS
//   this.sAvatarUrl.startsWith("//") && (this.sAvatarUrl = "https:" + this.sAvatarUrl);
//   this.sAvatarUrl.startsWith("http://") && (this.sAvatarUrl = this.sAvatarUrl.replace(/^http:/i, "https:"));
//   this.sHomeUrl.startsWith("http://www.blogger.com/") && this.isLogined()
//     && (this.sHomeUrl = this.sHomeUrl.replace(/^http:/i, "https:"));

//   // Change name
//   this.isAnonymous() && ("Anonymous" == this.sName) && (this.sName = "匿名");
//   this.sName = this.sName.htmlTrimTag().replace(/\n|&#12288;/g, "\t");  // '\t' as placeholder

//   // Change avatar image
//   (this.sAvatarUrl.indexOf("//img1.blogblog.com/img/blank.gif") > 0)
//     && (this.sAvatarUrl = "https://img1.blogblog.com/img/anon36.png");

//   var sAdminAvatarUrl
//       = "https://lh6.googleusercontent.com/-fpaYncBYqKs/Th477aX8reI/AAAAAAAAAco/nkud5M9T64w/s48/Thinker.jpg";
//   this.isAdmin() && (this.sAvatarUrl = sAdminAvatarUrl);

//   return this;
// }

Author.prototype.isAnonymous = function()
{
  return this.bIsAnonymous;
}
Author.prototype.isLogined = function()
{
  return !this.bIsAnonymous;
}
Author.prototype.isAdmin = function()
{
  return this.isLogined() && "https://www.blogger.com/profile/11741356469378252621" == this.sHomeUrl;
}

Author.prototype.getKey = function()
{
  return this.isAnonymous() ? ("匿名" == this.sName ? "" : this.sName) : this.sHomeUrl;
}

Author.prototype.isEqual = function(other)
{
  return this.isAnonymous() ? (this.sName == other.sName) : (this.sHomeUrl == other.sHomeUrl);
}

// Comment class

function Comment(json)
{
  this.nId = null;
  this.sId = "";
  this.sLongId = "";
  this.sParentLongId = "";

  this.bIsDeleted = false;
  this.bIsBanned = false;  // banned by Google/Blogger
  this.bIsInstruction = false;

  this.nSpamType = 0;  // 0: NOT spam;  >0:  @see 'getSpamTypeDesc()'
  this.nTextGroupId = null;
  this.sRepeatUrl = "";
  this.oWordInfo = null;

  this.sText = "";
  this.sUrl = "";
  this.oAuthor = null;
  this.dtCreate = null;
  this.sItemControlClass = "";

  this.nTopIndex = null;
  this.nSubIndex = null;


  if(null == json) { return }

  for(var i=0; i<json.link.length; i++)
  {
    if("alternate" == json.link[i].rel)
    {
      this.sUrl = json.link[i].href;
    }
    else if("self" == json.link[i].rel)
    {
      var results = json.link[i].href.match(/\/default\/(\d+)\?v=2$/);
      results && (2 == results.length) && (this.sLongId = results[1]);
    }
    else if("related" == json.link[i].rel)
    {
      var results = json.link[i].href.match(/\/default\/(\d+)\?v=2$/);
      results && (2 == results.length) && (this.sParentLongId = results[1]);
    }
  }

  var sTime = null;
  for(var i=0; i<json.gd$extendedProperty.length; i++)
  {
    if("blogger.itemClass" == json.gd$extendedProperty[i].name)
    {
      this.sItemControlClass = json.gd$extendedProperty[i].value;
    }
    else if("blogger.contentRemoved" == json.gd$extendedProperty[i].name)
    {
      this.bIsDeleted = ("true" == json.gd$extendedProperty[i].value);
    }
    else if("blogger.displayTime" == json.gd$extendedProperty[i].name)
    {
      sTime = json.gd$extendedProperty[i].value;
    }
  }

  if(this.sUrl)
  {
    this.sUrl = this.sUrl.replace(/(\?|&)showComment=/i, "$1comment=").replace(/#c\d+$/i, "");
    this.sId = (new Url(this.sUrl)).getParam("comment");
    this.nId = parseInt(this.sId);
    assert(!isNaN(this.nId), "Comment: Invalid comment url!");
    this.dtCreate = new Date(this.nId);
  }
  else
  {
    assert(this.bIsDeleted, "Comment: Unknown json data!");
    if("published" in json)
    {
      this.dtCreate = Date.parseISO(json.published.$t);
      assert(this.dtCreate, "Comment: Parse failed! " + json.published.$t);
      this.nId = this.dtCreate.getTime();
      this.sId = "" + this.nId;
    }
  }

  this.oAuthor = new Author(json.author[0]);
  this.sText = json.content.$t;
  this.oAuthor.isAnonymous() && (this.oWordInfo = new WordInfo(this.sText));

  this.normalize();
}  // Comment() end

Comment.mapArticles = null;
Comment.initArticlesMap = function(nInitLoadNum)
{
  if(null === Comment.mapArticles) { Comment.mapArticles = {} }
  else { return }

  nInitLoadNum = isNaN(nInitLoadNum) ? 8 : nInitLoadNum;
  $.ajax({
    url: Url.getFeedUrlPrefix() + "/posts/summary?alt=json&max-results=" + nInitLoadNum,
    dataType: "json",
    success: function(json)
    {
      function _procLink(i, link)
      {
        if("alternate" != link.rel) { return true }
        Comment.mapArticles[(new Url(link.href)).sPath] = "&#12298;" + link.title + "&#12299;";
        return false;
      }
      ("feed" in json) && ("entry" in json.feed)
        && $.each(json.feed.entry, function(i, entry){ $.each(entry.link, _procLink) });
    },
    timeout: 1000 * 48
  });
}

Comment.prototype.normalize = function()
{
  this.oAuthor ? this.oAuthor.normalize() : (this.oAuthor = new Author(null));
  this.sUrl.startsWith("http://") && (this.sUrl = this.sUrl.replace(/^http:/i, "https:"));  // force HTTPS
  this.sText = ( (this.bIsDeleted || this.bIsBanned)
                 ? ""
                 : this.sText.htmlTrimTag().replace(/\n{3,}/g, "\n\n") );
  this.oAuthor.isAdmin() && this.sText.match(/^\s*\{\s*"type"\s*\:/) && (this.bIsInstruction = true);
  return this;
}

Comment.prototype.isTop = function()
{
  return "" === this.sParentLongId;
}
Comment.prototype.isSub = function()
{
  return "" !== this.sParentLongId;
}

Comment.prototype.getSpamTypeDesc = function()
{
  if(10 == this.nSpamType)
  { return "发布该留言的登录用户&#65292;存在&#12304;恶意刷屏&#12305;或&#12304;垃圾广告&#12305;的行为&#65292;已经被拉黑&#12290;" }
  else if(11 == this.nSpamType)
  { return "该留言的&#12304;用户名&#12305;冒充博主&#12290;" }
  else if(20 == this.nSpamType)
  { return "该留言的&#12304;发布时间&#12305;&#65292;同时出现了大量&#12304;匿名评论&#12305;&#12290;" }
  else if(30 == this.nSpamType && this.nTextGroupId && this.nTextGroupId != this.nId)
  { return "该留言的内容与 &#8220;<a href='#"+this.nTextGroupId+"'>这条</a>&#8221; 相似&#12290;" }
  else if(31 == this.nSpamType)
  { return "留言中的某个网址&#65288;" + this.sRepeatUrl + "&#65289;多次重复出现&#65292;疑似垃圾广告" }
  else if(40 == this.nSpamType)
  { return "留言内容的&#12304;信噪比&#12305;太差&#12290;" }
  else { assert(false, "getSpamTypeDesc: Invalid 'nSpamType'!") }
}

Comment.getTruncateFlag = function()
{
  // "&nbsp;" has been trimmed in String.prototype.htmlTrimTag, use it as flag.
  return "&nbsp;......";
}

Comment.truncate = function(sText, mapOpts)
{
  mapOpts = mapOpts || {};
  var nColumnWidth = ("columnWidth" in mapOpts ? mapOpts.columnWidth : 100);
  var nMaxLineNum = ("maxLineNum" in mapOpts ? mapOpts.maxLineNum : 6);

  var mapConfig = loadConfig();
  if(hadConfig() && "false" == mapConfig["comments.limit-height"]) { return sText }  // user disable truncate

  var nCutPos = 0;
  for(var ln=0, cl=0; nCutPos<sText.length && ln<nMaxLineNum; nCutPos++)
  {
    cl += (sText.charCodeAt(nCutPos) < 128 ? 1 : 2);  // ASCII is half width char
    ("\n" == sText.charAt(nCutPos) || cl >= nColumnWidth) && (ln += 1) && (cl = 0);
  }

  // for minimize height, cut after first image url
  {
    var sTemp = sText.substr(0, nCutPos), sFlag = "\r";
    // Process simple image url
    function _addFlag(sMatch, s1, s2, s3, s4, s5, s6, s7, s8, s9)
    {
      return s1 + s2 + (getImgHost(s2) ? sFlag : "") + s9;
    }
    var sPunct = "\\s:,\\u2000-\\u206F\\u3000-\\u303F\\uFF00-\\uFFEF", sCJK = "\\u4E00-\\u9FFF";
    sTemp = Url.preprocess(sTemp, "["+sPunct+sCJK+"]", _addFlag);
    // Process image BBCode
    sTemp = sTemp.replace("[/img]", "[/img]" + sFlag);

    var nFlagPos = sTemp.indexOf(sFlag);
    if(nFlagPos > 0)
    {
      sTemp = sTemp.substr(0, nFlagPos);
      return sTemp + ((sTemp.length < sText.length) ? "\n" + Comment.getTruncateFlag() : "");
    }
  }

  return sText.substr(0, nCutPos) + _smartExpand(sText.substr(nCutPos));

  function _smartCut(sText)
  {
    (sText.length > nColumnWidth * 2) && (sText = sText.substr(0, nColumnWidth * 2));
    var nPos = sText.indexOf("[");
    (nPos != -1) && (sText = sText.substr(0, nPos));

    var arrRegex = [ /\n/, /[\s\?\!&#12288;&#12290;&#65311;&#65281;]/, /[\,\:;&#65292;&#65306;&#65307;&#12289;]/ ];  // order by priority
    for(var i=0; i<arrRegex.length; i++)
    {
      var nPos = sText.search(arrRegex[i]);
      if(nPos >= 0)
      {
        sText = sText.substr(0, nPos);
        break;
      }
    }
    return sText;
  }

  function _smartExpand(sText)
  {
    if( (sText.length <= nColumnWidth) && (sText.count(/\n/g) <= 2) ) { return sText }

    var nTagEnd1 = sText.indexOf("[/");
    if(-1 == nTagEnd1 || sText.indexOf("[") < nTagEnd1)  // NOT found partial BBCode
    {
      return _smartCut(sText) + Comment.getTruncateFlag();
    }
    var nTagEnd2 = sText.indexOf("]", nTagEnd1 + 2);
    if(-1 == nTagEnd2)  // invalid BBCode syntax
    {
      return _smartCut(sText) + Comment.getTruncateFlag();
    }
    // Process partial BBCode
    var sBBCode = sText.substring(0, nTagEnd2 + 1);
    ( (sBBCode.length > nColumnWidth) || (sBBCode.count(/\n/g) > 2) )  // cut content, add end tag
      && (sBBCode = _smartCut(sBBCode) + sText.substring(nTagEnd1, nTagEnd2 + 1));
    return sBBCode + Comment.getTruncateFlag();
  }
}  // truncate() end

Comment.prototype.getContentHtml = function(mapOpts)
{
  mapOpts = mapOpts || {};
  var bShowSpam = ("showSpam" in mapOpts ? mapOpts.showSpam : false);  // manual show
  var bTruncate = ("truncate" in mapOpts ? mapOpts.truncate : true);  // manual expand
  !("maxImgNum" in mapOpts) && (mapOpts.maxImgNum = (this.oAuthor.isLogined() ? 12 : 6));

  var sSelfDeleted = "<span class='deleted-comment'>这个用户删除了自己的评论 :(</span>";
  var sHtml = "";
  if(this.nSpamType > 0)
  {
    sHtml += "<b>此评论被&#8220;反刷屏程序&#8221;自动隐藏</b>&#65292;原因&#65306;" + this.getSpamTypeDesc();
    sHtml += ( bShowSpam
               ? "<hr style='border:1px solid Black;'/>"
               : "<span class='restore spam'><a class='load' href='javascript:;'>查看内容</a></span>" );
    if(!bShowSpam) { return sHtml }
    this.bIsDeleted && (sHtml += sSelfDeleted);
  }
  else if(this.bIsBanned)
  {
    return "<span class='banned-comment'>这个用户的评论被 Google 判定垃圾广告&#65292;所以无法显示 :(<br/>"
      + "博主会定期清理博客管理界面的&#8220;垃圾评论&#8221;&#65292;如果确认为&#12304;误判&#12305;&#65292;会把这条评论恢复出来&#12290;</span>";
  }
  else if(this.bIsDeleted)
  {
    return sSelfDeleted;
  }

  var sText = this.sText;
  bTruncate && (sText = Comment.truncate(sText, mapOpts));
  var sTruncateTip = (bTruncate && sText.endsWith(Comment.getTruncateFlag()))
      ? ("<div style='margin:15px 0px;'><hr style='border:1px solid Black;'/>"
         + "<b>&#65288;此评论太长&#65292;已截断&#65292;<a class='read-more' href='javascript:;'>展开评论全文</a>&#65289;</b></div>")
      : "";

  (0 == this.nSpamType) && (sText = renderBBCode(sText, mapOpts));
  sHtml += sText.replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;") + sTruncateTip;
  return (sHtml || "&nbsp;");
}  // getContentHtml() end


Comment.prototype.showFull = function(mapOpts)
{
  mapOpts = mapOpts || {};
  var nHotValue = ("hotValue" in mapOpts ? mapOpts.hotValue : null);
  var sHotTitle = ("hotTitle" in mapOpts ? mapOpts.hotTitle : "");
  var sStarList = ("starList" in mapOpts ? mapOpts.starList : "");
  var nMaxAuthorLen = ("maxAuthorLen" in mapOpts ? mapOpts.maxAuthorLen : 20);
  var bShowSpam = ("showSpam" in mapOpts ? mapOpts.showSpam : false);  // manual show
  var sSubComments = ("subComments" in mapOpts ? mapOpts.subComments : "");

  this.normalize();  // for robust

  var sClass = (this.isSub() ? "sub" : "top") + (this.nSpamType>0 ? " spam" : "");
  var nIndex = (this.isSub() ? this.nSubIndex : this.nTopIndex);
  var sAuthor = this.oAuthor.sName;
  var sAuthorHex = (isTest() ? (" hex='"+sAuthor.formatHex()+"'") : "");  // dump HEX
  (sAuthor.length > nMaxAuthorLen) && (sAuthor = sAuthor.substr(0, nMaxAuthorLen) + "\t...");  // truncate
  sAuthor = sAuthor.replace(/\t/g, "&nbsp;");  // do it AFTER truncate

  var sUserClass = (this.oAuthor.isLogined() ? " logined" : "") + (this.oAuthor.isAdmin() ? " blog-author" : "");
  var sDate = (this.dtCreate ? this.dtCreate.format("%Y年%m月%d日") : "");
  var sTime = (this.dtCreate ? this.dtCreate.format("%0H:%0M:%0S") : "");
  isBlogAdmin() && (sDate = this.dtCreate.format("%Y年%m月%d日 %0H:%0M:%0S"));
  isBlogAdmin() && (sTime = "");
  var sCounter = this.nTopIndex+"楼" + (this.isSub() ? this.nSubIndex+"单元" : "");
  var sDelLink = "https://www.blogger.com/delete-comment.g?blogID=5235590154125226279&amp;postID=" + this.sLongId;
  var sGoLevel = (this.isSub()
                  ? "&nbsp;<a class='go-level-current' href='javascript:;' title='跳到本楼'>&nbsp;&#8896;&nbsp;</a>&nbsp;"
                  : "<select class='go-level' update='0'><option>电梯</option></select>");

  // var sActions = ( (0 == this.nSpamType || bShowSpam)
  //                  ? ("<div class='comment-actions'>"
  //                     + "<a class='reply-btn' href='javascript:;'>回复"+this.nTopIndex+"楼</a>"
  //                     + "<a class='item-control blog-admin "+this.sItemControlClass+"' "
  //                     + "href='"+sDelLink+"' style='display:none;'>删除</a>"
  //                     + "<span class='menubars' update='0'/>"
  //                     + "<a class='add-btn' href='javascript:;'>另开新楼</a>"
  //                     + "<a class='go-level-down' href='javascript:;' title='跳到热度排名的&#12304;后一个&#12305;楼层'>&nbsp;&#65310;&nbsp;</a>"
  //                     + sGoLevel
  //                     + "<a class='go-level-up' href='javascript:;' title='跳到热度排名的&#12304;前一个&#12305;楼层'>&nbsp;&#65308;&nbsp;</a>"
  //                     + (isBlogAdmin() ? "<a class='mark-spam' href='javascript:;'>&#12288;SPAM&#12288;</a>" : "")
  //                     + "</div>")
  //                  : "" );
  var title = $('.post-title.entry-title'); //after
  var source = title.children(":first").attr('href'); //after
  var relayUrl = source + "?comment=" + this.sId;
  var sActions = ( (0 == this.nSpamType || bShowSpam)
                   ? ("<div class='comment-actions'>"
                      + "<a class='reply-btn' title='跳转到原始页面回复' target='_blank' href='" + relayUrl + "'>回复"+this.nTopIndex+"楼</a>"
                      + "<a class='item-control blog-admin "+this.sItemControlClass+"' "
                      + "href='"+sDelLink+"' style='display:none;'>删除</a>"
                      + "<span class='menubars' update='0'/>"
                      + "<a class='add-btn' title='跳转到原始页面评论' target='_blank' title='" + source + "' href='" + source + "#comments'>另开新楼</a>"
                      + "<a class='go-level-down' href='javascript:;' title='跳到热度排名的&#12304;后一个&#12305;楼层'>&nbsp;&#65310;&nbsp;</a>"
                      + sGoLevel
                      + "<a class='go-level-up' href='javascript:;' title='跳到热度排名的&#12304;前一个&#12305;楼层'>&nbsp;&#65308;&nbsp;</a>"
                      + (isBlogAdmin() ? "<a class='mark-spam' href='javascript:;'>&#12288;SPAM&#12288;</a>" : "")
                      + "</div>")
                   : "" );
  var sReplies = ( sSubComments
                   ? ("<div class='comment-replies thread-expanded'>"
                      + "<a class='thread-toggle' href='javascript:;'/>"
                      + "<div class='comment-thread'>"
                      + "<ol class='sub'>" + sSubComments + "</ol></div>"
                      + "</div>")
                   : "" );
                   
  // if (!this.defaultAvatar) {
  //   this.defaultAvatar = function(event) {
  //     console.log(event);
  //   }
  // }
  var sHtml =
      "<li class='comment "+sClass+"' data='"+this.sId+"' index='"+nIndex+"' "
      + (nHotValue ? ("hot='"+nHotValue+"'") : "") + ">"
      + "<a name='"+this.sId+"'>&nbsp;</a>"
      + "<div class='avatar-image-container'><img src='"+this.oAuthor.sAvatarUrl+"'></div>"
      + "<div id='c"+this.sLongId+"' class='comment-block'>"
      + "<div class='comment-header'>"
      + "<cite class='user"+sUserClass+"'"+sAuthorHex+">"
      + (this.oAuthor.sHomeUrl
         ? ("<a href='"+this.oAuthor.sHomeUrl+"' target='_blank' rel='nofollow'>" + sAuthor + "</a>")
         : sAuthor)
      + "</cite>"
      + "<span class='star' update='0'>" + sStarList + "</span>"
      + "<span class='datetime' title='"+sTime+"'>"
      + ((this.bIsDeleted || this.bIsBanned) ? sDate : ("<a href='"+this.sUrl+"'>" + sDate + "</a>"))
      + "</span>"
      + "<span class='counter'>"
      + ((this.bIsDeleted || this.bIsBanned) ? sCounter : ("<a href='"+this.sUrl+"'>" + sCounter + "</a>"))
      + "</span>"
      + ((this.isSub() || this.nSpamType > 0) ? "" : ("<span class='hot'>" + sHotTitle + "</span>"))
      + "</div>"  // comment-header
      + "<div class='comment-content'>" + this.getContentHtml(mapOpts) + "</div>"
      + sActions
      + "</div>"  // comment-block
      + sReplies
      + "</li>";
  return sHtml;
}  // showFull() end

Comment.prototype.showSummary = function(mapOpts)
{
  mapOpts = mapOpts || {};
  var nMaxAuthorLen = ("maxAuthorLen" in mapOpts ? mapOpts.maxAuthorLen : 20);

  this.normalize();  // for robust
  Comment.initArticlesMap();

  var sAuthor = this.oAuthor.sName;
  (sAuthor.length > nMaxAuthorLen) && (sAuthor = sAuthor.substr(0, nMaxAuthorLen) + "\t...");  // truncate
  sAuthor = sAuthor.replace(/\t/g, "&nbsp;");  // AFTER truncate
  ("highlightAuthor" in mapOpts) && (sAuthor = highlightSearchKeywords(sAuthor, mapOpts.highlightAuthor));
  var sUserClass = (this.oAuthor.isLogined() ? " logined" : "") + (this.oAuthor.isAdmin() ? " blog-author" : "");
  var sTime = this.dtCreate.format("%0H:%0M:%0S");
  var $comment = $(
    "<div id='comment-"+this.sId+"'>"
      + "<div class='comment-header'>"
      + "<img class='avatar' src='"+this.oAuthor.sAvatarUrl+"'/>"
      + "<cite class='author"+sUserClass+"'>" + sAuthor + "</cite>"
      + "<span class='datetime' title='"+sTime+"'>" + getRelativeTimeDesc(this.dtCreate) + "</span></div>"
      + "<div class='comment-article'/>"
      + "<div class='comment-text'><a/></div>"
      + "</div>");
  {
    var oUrl = new Url(this.sUrl);
    assert(oUrl.bValid, "Comment.showSummary: Invalid url: " + this.sUrl);
    var sUrl = oUrl.sPath + "?comment=" + oUrl.getParam("comment");  // relative path

    ("keywords" in mapOpts) && (sUrl += "&q=" + encodeURIComponent(mapOpts.keywords.join(" ")));
    ("scope" in mapOpts) && (sUrl += "&scope=" + mapOpts.scope);

    var $comment_link = $comment.find(".comment-text a");
    $comment_link.attr("href", sUrl);
    ($comment_link[0].pathname != location.pathname)  // NOT current page
      && $comment_link.attr("target", "_blank");

    var sLongText = this.sText.replace(/\[\/?\w+\]|\[(?:URL|IMG)=[^\]]*\]/gi, " ");
    var sShortText = Comment.truncate(sLongText, mapOpts);
    sShortText.endsWith(Comment.getTruncateFlag())
      && $comment_link.tooltip({
        content: function(callback) { callback($(this).attr("title").replace(/\n/g, "<br/>")) },
        open: function(event, ui) { ui.tooltip.hover(function(){ $(this).hide("fade") }) }
      }).attr("title", sLongText);

    ("highlightText" in mapOpts) && (sShortText = highlightSearchKeywords(sShortText, mapOpts.highlightText));
    $comment_link.html(sShortText.replace(/\n/g, "<br/>"));
  }  // comment link
  while(true)
  {
    var $comment_article = $comment.children(".comment-article");
    if($comment_article.html() !== "") { break }

    var sArticlePath = (new Url(this.sUrl)).sPath;
    if(sArticlePath in Comment.mapArticles)
    {
      function pollingTitle()
      {
        return (Comment.mapArticles[sArticlePath] !== "")
          ? (!!$comment_article.html(Comment.mapArticles[sArticlePath]) && false)
          : true;
      }
      (Comment.mapArticles[sArticlePath] !== "")
        ? $comment_article.html(Comment.mapArticles[sArticlePath])
        : asyncLoop(pollingTitle, 1000, "pollingTitle");
      break;
    }

    Comment.mapArticles[sArticlePath] = "";  // set flag
    $.ajax({
      url: Url.getFeedUrlPrefix() + "/posts/summary?alt=json&path=" + encodeURIComponent(sArticlePath),
      dataType: "json",
      success: function(json)
      {
        function _procLink(i, link)
        {
          if("alternate" != link.rel) { return true }
          $comment_article.html( Comment.mapArticles[sArticlePath] = "&#12298;" + link.title + "&#12299;" );
          return false;
        }
        ("feed" in json) && ("entry" in json.feed) && json.feed.entry.length
          && $.each(json.feed.entry[0].link, _procLink);
      },
      timeout: 1000 * 24
    });
    break;
  }  // while() end
  return $comment;
}  // Comment.prototype.showSummary() end


// WordInfo class

function WordInfo(sText)
{
  assert(typeof sText === "string", "WordInfo: Invalid 'sText'!");
  (sText.length > 1024) && (sText = sText.substr(0, 1024));

  this.arrWords = [];
  this.mapCounter = {};
  this.nWordNum = 0;

  this.nRawLen = sText.length;
  sText = WordInfo.trimUrl(sText, null);
  this.nUrlLen = this.nRawLen - sText.length;

  function _trimSyntax(sText)
  {
    var arrSyntax =
    [
      [/\[\/?\w+\]|\[(?:URL|IMG)=[^\]]*\]/gi, " "],  // bbcode
      [/(?:\s|^)[a-f0-9]{8,128}(?:\s|$)/gi, " hex "]  // hex string
    ];
    var sRtn = "";
    $.each(sText.split("\n"), function(i, sLine){ sRtn += sLine.multiReplace(arrSyntax) + " " });
    return sRtn;
  }
  sText = _trimSyntax(sText).trim();

  this.nTrimCount = 0;
  var sWord = "";
  for(var i=0; i<sText.length; i++)
  {
    var ch = sText.charAt(i), nCode = sText.charCodeAt(i);
    if(97 <= nCode && nCode <= 122) { sWord += ch }  // 'a'~'z'
    else if(65 <= nCode && nCode <= 90)  { sWord += String.fromCharCode(nCode + 32) }  // 'A'~'Z'
    else if(65345 <= nCode && nCode <= 65370) { sWord += String.fromCharCode(nCode - 65248) }  // 'ａ'~'ｚ'
    else if(65313 <= nCode && nCode <= 65338) { sWord += String.fromCharCode(nCode - 65216) }  // 'Ａ'~'Ｚ'
    else if(48 <= nCode && nCode <= 57)  { sWord += ch }  // '0'~'9'
    else
    {
      if(sWord)
      {
        this.addWord(sWord);
        sWord = "";
      }
      String.isCJKChar(nCode) ? this.addWord(ch) : this.nTrimCount++;
    }
  }
  sWord && this.addWord(sWord);

  var map = this.mapCounter;
  this.arrWords.sort(function(a, b){ return Number.cmp(map[a], map[b]) * -1 });
}  // WordInfo() end

WordInfo.prototype.addWord = function(sWord)
{
  if(sWord.length > 64 || sWord.match(/^[a-z0-9]{1,2}$/))  // trim noise
  {
    this.nTrimCount += sWord.length;
    return;
  }

  this.nWordNum++;
  if(sWord in this.mapCounter)
  {
    this.mapCounter[sWord] += 1;
  }
  else
  {
    this.mapCounter[sWord] = 1;
    this.arrWords.push(sWord);
  }
}

WordInfo.prototype.isSimilarity = function(wiOther, nCritical)
{
  if(!this.arrWords.length || !wiOther.arrWords.length) { return false }

  var wiShort = this, wiLong = wiOther;
  if(this.arrWords.length > wiOther.arrWords.length)
  {
    wiLong = this;
    wiShort = wiOther;
  }
  if(wiLong.arrWords.length / wiShort.arrWords.length > 2.0) { return false }

  nCritical *= (this.nWordNum + wiOther.nWordNum);
  var nCount = 0;
  var nRatio = 5, nCheckPos = Math.floor(wiShort.arrWords.length/nRatio);
  for(var i=0; i<wiShort.arrWords.length; i++)
  {
    if(nCheckPos >= 1 && nCheckPos == i && nCount < nCritical/nRatio) { return false }
    var sWord = wiShort.arrWords[i];
    if(sWord in wiLong.mapCounter)
    {
      nCount += wiShort.mapCounter[sWord] + wiLong.mapCounter[sWord];
      if(nCount > nCritical) { return true }
    }
  }
  return false;
}  // isSimilarity() end

WordInfo.trimUrl = function(sText, fnRepl)
{
  fnRepl = fnRepl || function(sMatch, s1, s2, s3, s4, s5, s6, s7, s8, s9){ return s1 + "  " + s9 };
  var sPunct = "\\s:,\\[\\]=\\u2000-\\u206F\\u3000-\\u303F\\uFF00-\\uFFEF", sCJK = "\\u4E00-\\u9FFF";
  var sExclude = "[" + sPunct + sCJK + "]";
  var sUrlPattern = Url.getRegexpStr(true);
  var regex = new RegExp("(^|"+sExclude+")" + "("+sUrlPattern+")" + "($|"+sExclude+")", "g");
  sText = sText.replace(regex, fnRepl);
  return sText.replace(regex, fnRepl);  // process overlap
}


// DomainName

function DomainName(sName)
{
  assert(typeof sName === "string" && sName.length >= 3, "DomainName: Invalid 'sName'!");
  this.sName = sName;
  this.arrLetters = [];
  this.mapCounter = {};

  for(var i=0; i<this.sName.length; i++)
  {
    var ch = this.sName.charAt(i);
    if('.' == ch) { continue }
    if(ch in this.mapCounter)
    {
      this.mapCounter[ch] += 1;
    }
    else
    {
      this.mapCounter[ch] = 1;
      this.arrLetters.push(ch);
    }
  }
  var map = this.mapCounter;
  this.arrLetters.sort(function(a, b){ return Number.cmp(map[a], map[b]) * -1 });
}

DomainName.prototype.sameAs = function(dnOther)
{
  if(this.sName == dnOther.sName) { return true }

  var dnShort = this, dnLong = dnOther;
  if(this.arrLetters.length > dnOther.arrLetters.length)
  {
    dnLong = this;
    dnShort = dnOther;
  }

  // optimize
  if(dnLong.arrLetters.length / dnShort.arrLetters.length > 2.0) { return false }
  for(var i=0; i<dnShort.arrLetters.length; i++)
  {
    if(dnLong.sName.indexOf(dnShort.arrLetters[i]) == -1) { return false }
  }

  var sLongName = dnLong.sName, sShortName = dnShort.sName, arrCommon = [];
  for(var i=0; i<dnLong.arrLetters.length; i++)
  {
    var ch = dnLong.arrLetters[i];
    if(sShortName.indexOf(ch) == -1)
    {
      sLongName = sLongName.replace(new RegExp(ch, "g"), "");
      if(sLongName == sShortName) { return true }
    }
    else
    {
      arrCommon.push(ch);
    }
  }

  var nTryNum = Math.floor(arrCommon.length / 3);
  for(var i=0; i<nTryNum; i++)
  {
    var re = new RegExp(arrCommon[i], "g");
    sLongName = sLongName.replace(re, "");
    sShortName = sShortName.replace(re, "");
    if(sLongName == sShortName) { return true }
  }
  return false;
}  // sameAs() end


// Anti spam utilities

function UserAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};  // reserved
  this.reAdminName = /^(博主)?[编編煸][程桯埕随隋隨]{2}想(的?博客|博主)?$/;
  this.mapBannedUserId =
  {
    "18141030690147245751" : null,
    "05790139454850952051" : null,
    "02119400702675800143" : null,
    "10630984068291402792" : null,
    "11816960879702029740" : null,
    "07413446777379638323" : null,
    "15207830749420122221" : null,
    "00615794917048730966" : null,
    "04409539673294542610" : null,
    "08847861307049076010" : null,
    "05905946985285695901" : 1561289469774,
    "13981560392385541852" : 1561172577533,
    "05292423574133415627" : 1562364379478,
    "09912882299755624050" : null,
    "11686161736171066379" : null
  };
  this.mapFakedAdminId =
  {
    "08847861307049076010" : null,
    "05905946985285695901" : null,
    "13981560392385541852" : null
  };
}

UserAnalyzer.prototype.isFakedAdmin = function(sName)
{
    if(sName.length < 4) { return ("博主" == sName) }  // optimize
    var sCJK = sName.substring(0, 10).replace(/[^\u4E00-\u9FFF]/g, "");
    if("博主" == sCJK) { return true }
    if(sCJK.length >= 4 && sCJK.match(this.reAdminName)) { return true }
    return false;
}

UserAnalyzer.prototype.getSpamType = function(comment)
{
  var author = comment.oAuthor;
  if(author.isAnonymous())
  {
    return this.isFakedAdmin(author.sName) ? 11 : 0;
  }
  else  // logined
  {
    var nPos = author.sHomeUrl.lastIndexOf("/");
    assert(nPos > 0, "UserAnalyzer.getSpamType: Invalid 'sHomeUrl'!");
    var sUserId = author.sHomeUrl.substr(nPos + 1);

    if((sUserId in this.mapFakedAdminId) && this.isFakedAdmin(author.sName)) { return 11 }
    if(sUserId in this.mapBannedUserId)
    {
      var nCommentId = this.mapBannedUserId[sUserId];
      if(typeof nCommentId === "number") { return (comment.nId > nCommentId) ? 10 : 0 }
      return 10
    }
    return 0;
  }
}  // getSpamType() end


function TimeGroupAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};
  this.m_nRoundRange = ("range" in mapOpts ? mapOpts.range : 900);  // default is a quarter
  this.m_nOffset = ("offset" in mapOpts ? mapOpts.offset : 300);  // default is 5 minutes
  var nBase = getMinTime().getTime() / 1000;

  this.m_arrGroups = [];
  var nGroupNum = Math.floor(this.m_nRoundRange / this.m_nOffset);
  for(var i=0; i<nGroupNum; i++)
  {
    this.m_arrGroups.push({ nBase: nBase + i * this.m_nOffset, map:{} });
  }
}

TimeGroupAnalyzer.prototype.calcKey = function(group, nTime)
{
  var nSeconds = nTime / 1000;
  assert(nSeconds > group.nBase, "TimeGroupAnalyzer.calcKey: Invalid 'nTime'!");
  return Math.floor( (nSeconds - group.nBase) / this.m_nRoundRange );
}

TimeGroupAnalyzer.prototype.addTime = function(nTime)
{
  var tga = this;
  $.each(
    this.m_arrGroups,
    function(i, group)
    {
      var nKey = tga.calcKey(group, nTime);
      (nKey in group.map) ? group.map[nKey].push(nTime) : (group.map[nKey] = [nTime]);
    }
  );
}

TimeGroupAnalyzer.prototype.getSimilarNum = function(nTime)
{
  var nMax = 0, tga = this;
  $.each(
    this.m_arrGroups,
    function(i, group)
    {
      var nKey = tga.calcKey(group, nTime);
      (nKey in group.map) && (group.map[nKey].length > nMax) && (nMax = group.map[nKey].length);
    }
  );
  return nMax;
}

TimeGroupAnalyzer.prototype.getSimilarTimes = function(nTime)
{
  var arrMax = [], tga = this;
  $.each(
    this.m_arrGroups,
    function(i, group)
    {
      var nKey = tga.calcKey(group, nTime);
      (nKey in group.map) && (group.map[nKey].length > arrMax.length) && (arrMax = group.map[nKey]);
    }
  );
  return arrMax;
}


function TextGroupAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};  // reserved
  this.mapTextGroup = {};
}

TextGroupAnalyzer.prototype.addComment = function(comment, mapOpts)
{
  if(comment.bIsDeleted || comment.bIsBanned) { return null }
  assert(comment.oWordInfo, "TextGroupAnalyzer.addComment: The 'comment.oWordInfo' is null!");

  mapOpts = mapOpts || {};
  var nCritical = ( ("critical" in mapOpts) ? mapOpts.critical : (comment.isTop() ? 0.9 : 0.85) );

  for(var nGroupId in this.mapTextGroup)
  {
    var group = this.mapTextGroup[nGroupId];
    if( !comment.oWordInfo.isSimilarity(group.oWordInfo, nCritical) ) { continue }
    group.arrCommentId.push(comment.nId);
    return nGroupId;
  }
  // NOT found similar, create new group
  var nGroupId = comment.nId;
  this.mapTextGroup[nGroupId] = { oWordInfo:comment.oWordInfo, arrCommentId:[comment.nId] };
  return nGroupId;
}

TextGroupAnalyzer.prototype.getSimilarNum = function(comment)
{
  var nGroupId = comment.nTextGroupId;
  if(null === nGroupId) { return 0 }
  return (nGroupId in this.mapTextGroup) ? this.mapTextGroup[nGroupId].arrCommentId.length : 0;
}

TextGroupAnalyzer.prototype.getSimilarId = function(comment)
{
  var nGroupId = comment.nTextGroupId;
  if(null === nGroupId) { return [] }
  return (nGroupId in this.mapTextGroup) ? this.mapTextGroup[nGroupId].arrCommentId : [];
}


function UrlAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};
  this.nCritical = ("critical" in mapOpts ? mapOpts.critical : 3);

  this.mapUrl = {};
  this.mapDomain = {};
  this.bIsTest = isTest();
}

UrlAnalyzer.prototype.isSpam = function(comment)
{
  assert(!comment.sRepeatUrl, "UrlAnalyzer.isSpam: The 'sRepeatUrl' NOT empty!");
  comment.sRepeatUrl = (this.find(comment.oAuthor.sName, true) || this.find(comment.sText, false));
  return !!comment.sRepeatUrl;
}

UrlAnalyzer.prototype.find = function(sText, bMatchNormal)
{
  var ua = this, sTarget = "";
  function _addUrl(sUrl)
  {
    sUrl = sUrl.replace(/^https?\:\/\/|#.*$/g, "");
    if( sUrl.startsWith(Url.getDomain()) || sUrl.search(/^(?:\d{1,3}\.){3}\d{1,3}(?:$|\/|\:)/) == 0 )
    { return 1 }  // white list
    return (sUrl in ua.mapUrl) ? (ua.mapUrl[sUrl] += 1) : (ua.mapUrl[sUrl] = 1);
  }

  function _replUrl(sMatch, s1, s2, s3, s4, s5, s6, s7, s8, s9)
  {
    (_addUrl(s2) >= ua.nCritical || bMatchNormal) && (sTarget = s2);
    return s1 + "  " + s9;
  }

  sText = WordInfo.trimUrl(this.escape(sText), _replUrl);
  !sTarget && $.each(
    sText.split(/\n|https?\:\/\/|[^\w\-\.]{20,}/g),
    function(i, s){ return !(sTarget = ua.procLine(s, bMatchNormal)) }
  );
  return sTarget;
}  // find() end

UrlAnalyzer.prototype.procLine = function(sLine, bMatchNormal)
{
  var ua = this;
  function _addDomain(sDomain, results)
  {
    assert(sDomain.length > 0 && results, "_addDomain");

    var map = ua.mapDomain;
    if(sDomain in map)
    {
      var nNum = (map[sDomain] += 1);
      ua.bIsTest && (3 == ua.nCritical) && dump("_addDomain: " + nNum + " (" + sDomain + ")");
      return nNum;
    }

    var dn = new DomainName(sDomain);
    for(var s in map)
    {
      if(!dn.sameAs(new DomainName(s))) { continue }
      var nNum = (map[s] += 1);
      isTest() && (3 == ua.nCritical) && dump("_addDomain: " + nNum + " (" + sDomain + ")  (" + s + ")");
      return nNum;
    }
    return (map[sDomain] = 1);
  }  // _addDomain() end

  function _doMatch(sText)
  {
    // optimize
    if(sText.length <= 3 || sText.search(/[a-z]/) == -1) { return 0 }
    if(Url.getDomain() == sText) { return 1 }

    var results = sText.match(/(?:[a-z_\-]{2,}\.){2,3}[a-z_\-]{2,}/);
    return results ? _addDomain(sText, results) : 0;
  }

  var arrFields = sLine.split(/[^\a-z_\-\.]/g), sPartial = "";
  for(var i=0; i<arrFields.length; i++)
  {
    var sField = arrFields[i], nNum = 0;
    if(sPartial && (nNum = _doMatch(sPartial + sField)) > 0)
    {
      if(nNum >= ua.nCritical || bMatchNormal) { return sPartial + sField }
    }
    else if((nNum = _doMatch(sField)) > 0)
    {
      if(nNum >= ua.nCritical || bMatchNormal) { return sField }
    }
    (nNum > 0) ? (sPartial = "") : (sPartial += sField);
  }
  return "";
}  // procLine() end

UrlAnalyzer.prototype.escape = function(sText)
{
  sText = sText.trim().multiReplace([ [/@|&#65294;/g, "."], [/&#65293;/g, "-"], [/&#65343;/g, "_"] ]);

  var sRtn = "";
  for(var i=0; i<sText.length; i++)
  {
    var ch = sText.charAt(i), nCode = sText.charCodeAt(i);
    if(65 <= nCode && nCode <= 90) { sRtn += String.fromCharCode(nCode + 32) }  // 'A'~'Z'
    else if(65345 <= nCode && nCode <= 65370) { sRtn += String.fromCharCode(nCode - 65248) }  // 'ａ'~'ｚ'
    else if(65313 <= nCode && nCode <= 65338) { sRtn += String.fromCharCode(nCode - 65216) }  // 'Ａ'~'Ｚ'
    else { sRtn += ch }
  }
  return sRtn;
}


function TextFeatureAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};
  this.nTrimRatio = ("trimRatio" in mapOpts ? mapOpts.trimRatio : 0.85);
  this.nMinWordRatio = ("minWordRatio" in mapOpts ? mapOpts.minWordRatio : 0.25);
  this.nMaxWordRatio = ("maxWordRatio" in mapOpts ? mapOpts.maxWordRatio : 0.9);

  this.bIsTest = isTest();
}

TextFeatureAnalyzer.prototype.isSpam = function(comment)
{
  if(comment.bIsDeleted || comment.bIsBanned) { return false }
  assert(comment.oWordInfo, "TextFeatureAnalyzer.isSpam: The 'comment.oWordInfo' is null!");

  if(comment.sText.length >= 6)
  {
    var wi = comment.oWordInfo;
    if( (wi.nRawLen >= 200) && (wi.nTrimCount / wi.nRawLen > this.nTrimRatio) ) { return true }
    if(0 == wi.nWordNum)
    {
      return 0 == wi.nUrlLen;
    }
    else
    {
      var nRatio = wi.arrWords.length / wi.nWordNum;
      return (nRatio < this.nMinWordRatio) || ( (wi.nWordNum >= 150) && (nRatio > this.nMaxWordRatio) );
    }
  }
  else
  {
    return comment.sText.search(/[a-z\u4E00-\u9FFF]/i) == -1;
  }
}


function ManualAnalyzer(mapOpts)
{
  mapOpts = mapOpts || {};  // reserved
  this.mapSpam = {};
}

ManualAnalyzer.prototype.parseSpamList = function(sHtml)
{
  try
  {
    var nBegin = sHtml.lastIndexOf("<!--BANNED");
    if(nBegin > 0)
    {
      nBegin += 10
      var nEnd = sHtml.indexOf("-->", nBegin);
      assert(nEnd > 0, "ManualAnalyzer.parseSpamList: NOT found '-->'!");
      var mapSpam = this.mapSpam, lst = JSON.parse(sHtml.substring(nBegin, nEnd));
      $.each(lst, function(i, nId){ mapSpam[nId] = true });
    }
  }
  catch(err)
  {
    reportError("ManualAnalyzer.parseSpamList: " + err);
  }
}

ManualAnalyzer.prototype.addCommentId = function(nCommentId)
{
  this.mapSpam[nCommentId] = true;
}

ManualAnalyzer.prototype.isSpam = function(comment)
{
  if(comment.bIsDeleted || comment.bIsBanned) { return false }
  return this.mapSpam[comment.nId];
}

ManualAnalyzer.prototype.getBannedJson = function()
{
  var sJson = "", lst = [];
  for(var nId in this.mapSpam) { lst.push(nId) }
  lst.sort();
  $.each(lst, function(i, nId){ sJson += (sJson ? "," : "") + nId + ((9==(i%10)) ? "\n" : "") });
  return "<!--BANNED\n[" + sJson + "]\n-->";
}

Tooltip =
{
  content : function(callback){ callback($(this).attr("title").replace(/\n/g, "<br/>")) },
  open: function(event, ui, nTimeout)
  {
    ui.tooltip.hover(function(){ $(this).hide("fade") });
    (nTimeout > 0) && delayRun(function(){ ui.tooltip.hide("fade") }, nTimeout);
  }
};

jQuery(function($)
{
  $(document).ready(
    function()
    {
      try
      {
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) 
        {
          $('.sidebar.section').attr('style', 'display:none;');
          $('#main').attr('style', 'width: 100%;');
        }
      }
      catch(err)
      {
        reportError("init: Catch exception:\n" + err);
      }
    }
  );
});