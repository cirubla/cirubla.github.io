(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();