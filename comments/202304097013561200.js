window.g_loadAllComments = function() {
  if (window.isCommentInited) {
    return {
      feed: {}
    }
  }

  window.isCommentInited = true;
  return  {
      feed: {}
  }
}