(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();