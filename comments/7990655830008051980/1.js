(function(){
  var comments = atob('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');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();