(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();