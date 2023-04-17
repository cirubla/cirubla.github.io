(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();