(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();