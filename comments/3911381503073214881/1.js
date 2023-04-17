(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();