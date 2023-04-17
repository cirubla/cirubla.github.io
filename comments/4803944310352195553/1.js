(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();