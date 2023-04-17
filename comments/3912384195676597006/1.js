(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();