(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();