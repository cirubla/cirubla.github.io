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