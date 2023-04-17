(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();