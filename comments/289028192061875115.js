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