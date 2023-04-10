window.g_loadAllComments = function() {
  if (window.isCommentInited) {
    return {
      feed: {}
    }
  }

  var comments = atob('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');
  var inputArray = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) {
    inputArray[i] = comments.charCodeAt(i);
  }
  var outputArray = pako.inflate(inputArray);
  window.isCommentInited = true;
  return JSON.parse(new TextDecoder("utf-8").decode(outputArray));
}