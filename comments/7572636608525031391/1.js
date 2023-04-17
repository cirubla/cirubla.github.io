(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();