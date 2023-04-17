(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();