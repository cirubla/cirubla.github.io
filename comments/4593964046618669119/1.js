(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();