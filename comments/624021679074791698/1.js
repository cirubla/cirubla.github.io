(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();