(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();