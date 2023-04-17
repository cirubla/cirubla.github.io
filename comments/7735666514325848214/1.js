(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();