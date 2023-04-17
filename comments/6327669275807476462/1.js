(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();