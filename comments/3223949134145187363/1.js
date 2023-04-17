(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();