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