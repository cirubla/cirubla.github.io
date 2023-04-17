(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();