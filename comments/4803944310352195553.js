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