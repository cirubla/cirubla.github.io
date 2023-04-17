(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();