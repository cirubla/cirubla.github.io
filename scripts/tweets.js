jQuery(function($)
{
  // Module variables
  var m_mapTweets = {};
  var m_nMinCommentId = null;
  var m_nMaxCommentId = null;

  var m_nInitNum = 0;
  var m_bLoading = false;

  var m_nAutoLoadTimeout = null;
  var m_nAutoLoadCount = null;

  var m_nSpamNum = 0;
  var m_nNoiseNum = 0;
  // anti spam DOS attack
  var m_spamManual = new ManualAnalyzer();
  var m_spamUser = new UserAnalyzer();
  var m_spamTimeGroup = new TimeGroupAnalyzer({ range:900, offset:90 });
  var m_spamTextGroup = new TextGroupAnalyzer();
  var m_spamTextUrl = new UrlAnalyzer({ critical:2 });
  var m_spamTextFeature = new TextFeatureAnalyzer();
  var m_nTimeGroupCritical = 12;


  window.g_loadTweets = function(bInit, bAuto)
  {
    m_bLoading = true;
    var sFeedUrl = Url.getFeedUrlPrefix() + "/comments/full?alt=json&v=2&orderby=published";
    var bLoadOld = false;
    if(bInit)
    {
      sFeedUrl += "&max-results=" + m_nInitNum;
      if(m_nMinCommentId !== null)
      {
        bLoadOld = true;
        sFeedUrl += "&published-max=" + (new Date(m_nMinCommentId-1)).toISOString();
        $("#tweets .comments-loading").html("检测到刷屏&#65292;加载更早的评论...");
      }
      else
      {
        $("#tweets .comments-loading").html("正在加载...");
      }
    }
    else
    {
      if(null === m_nMaxCommentId) { return }
      sFeedUrl += "&published-min=" + (new Date(m_nMaxCommentId+1)).toISOString();
      $("#tweets .comments-loading").html("正在刷新...");
    }

    $.ajax({
      url: sFeedUrl,
      dataType: "json",
      success: function(json)
      {
        loadComplete(json, bInit, bLoadOld);
      },
      error: function(xhr, sStatus)
      {
        (!bAuto && !bInit)  // Manual refresh
          && reportHttpError("获取最新评论出错", xhr, sStatus);
      },
      complete: function()
      {
        m_bLoading = false;
        $("#tweets .comments-loading").html("");
        (!bAuto && !bInit)  // Manual refresh
          && $("#tweets .comments-toolbar .refresh").show();
      },
      timeout: 1000 * 30
    });
  }  // g_loadTweets() end

  function updateCreateTime()
  {
    $("#tweets .comment-block .comment-header .datetime").each(
      function(nIndex)
      {
        var sId = $(this).closest(".comment-block").attr("id");
        var nCommentTime = parseInt(sId.substr(8));  // Trim "comment-"
        assert(!isNaN(nCommentTime), "updateCreateTime: Invalid 'id' attr!");
        $(this).html( getRelativeTimeDesc(new Date(nCommentTime)) );
      }
    );
  }

  function updateArticleTitle()
  {
    var bNotFoundComment = false;
    $("#tweets .comments-content .comment-text a").each(
      function(nIndex)
      {
        var $comment_link = $(this);
        if(location.pathname == $comment_link[0].pathname)
        {
          var $comment_block = $comment_link.closest(".comment-block");
          var sCommentId = $comment_block.attr("id").substr(8);  // Trim "comment-";
          $comment_link.attr("href", "#" + sCommentId);
          $comment_block.children(".comment-article").html("&#65288;该评论已经在当前页面中&#65289;");

          (0 == $("#comment-holder li.comment[data='" + sCommentId + "']").length) && (bNotFoundComment = true);
        }
      }
    );
    bNotFoundComment && window.g_loadNewComments();  // Notify comment module to refresh
  }

  function loadComplete(json, bInit, bLoadOld)
  {
    saveTweets(json, bInit, bLoadOld);
    updateCreateTime();

    if(!bInit)
    {
      updateArticleTitle();
      return;
    }

    if($("#tweets .comments-content .comment-block").length < m_nInitNum)
    {
      delayRun(function(){ g_loadTweets(true, false) }, 200);
    }
    else
    {
      $("#tweets .comments-toolbar .refresh").show();
      (new Url(null)).getParam("comment") && $("#comments #comments-loading").is(":visible")
        && $("#comments").scrollTo("fast");  // Make comment loading progressbar visible

      asyncLoop(  // Wait comments UI load complete
        function(){ return $("#comments #comment-holder").is(":visible") ? (!!updateArticleTitle() && false) : true },
        500,
        "pollingCommentsUI"
      );
    }
  }  // loadComplete() end

  function saveTweets(json, bInit, bLoadOld)
  {
    if(!("feed" in json) || !("entry" in json.feed)) { return }

    var arrId = [];
    for(var n=json.feed.entry.length-1; n>=0; n--)  // from old to new
    {
      var comment = new Comment(json.feed.entry[n]);
      if(comment.bIsInstruction || comment.nId in m_mapTweets) { continue }

      m_mapTweets[comment.nId] = comment;
      arrId.push(comment.nId);
      ( (null===m_nMinCommentId) || (comment.nId < m_nMinCommentId) ) && (m_nMinCommentId = comment.nId);
      ( (null===m_nMaxCommentId) || (comment.nId > m_nMaxCommentId) ) && (m_nMaxCommentId = comment.nId);

      // anti spam DOS attack
      m_spamManual.isSpam(comment) && (comment.nSpamType = 40);
      (0 == comment.nSpamType) && (comment.nSpamType = m_spamUser.getSpamType(comment));
      if(comment.oAuthor.isAnonymous())
      {
        m_spamTimeGroup.addTime(comment.nId);  // for ALL anonymous
        // The value of 'nSpamType', @see 'getSpamTypeDesc()'
        (0 == comment.nSpamType) && m_spamTextUrl.isSpam(comment) && (comment.nSpamType = 31);
        (0 == comment.nSpamType) && m_spamTextFeature.isSpam(comment) && (comment.nSpamType = 40);
        (0 == comment.nSpamType) && (comment.nTextGroupId = m_spamTextGroup.addComment( comment, {critical:0.6} ));
      }
    }
    bLoadOld && arrId.sort(function(a, b){ return Number.cmp(a, b) * -1 });  // reverse sort
    showTweets(arrId, bInit, bLoadOld);

    (m_nSpamNum > 0 || m_nNoiseNum > 0) && $("#tweets hr").show();
    (m_nSpamNum > 0) && $("#tweets .spam-count").html(m_nSpamNum).parent().show();
    (m_nNoiseNum > 0) && $("#tweets .noise-count").html(m_nNoiseNum).parent().show();
  }  // saveTweets() end

  function showTweets(arrCommentId, bInit, bLoadOld)
  {
    var $content = $("#tweets .comments-content");
    var nHiddenCount = 0;

    for(var i=0; i<arrCommentId.length; i++)
    {
      var comment = m_mapTweets[arrCommentId[i]];
      if(comment.nSpamType > 0)
      {
        m_nSpamNum++;
        nHiddenCount++;
        continue;
      }
      if(comment.oAuthor.isAnonymous())  // anti spam DOS attack
      {
        if(m_spamTimeGroup.getSimilarNum(comment.nId) >= m_nTimeGroupCritical)
        {
          comment.nSpamType = 20;  // @see 'getSpamTypeDesc()'
          m_nSpamNum++;
          nHiddenCount++;
          continue;
        }
        else if(comment.nTextGroupId && m_spamTextGroup.getSimilarNum(comment) >= 2)
        {
          comment.nSpamType = 30;  // @see 'getSpamTypeDesc()'
          m_nSpamNum++;
          nHiddenCount++;
          continue;
        }
      }
      if(comment.sText.mergeCJK().length <= 6)  // Too short, lacks info
      {
        m_nNoiseNum++;
        nHiddenCount++;
        continue;
      }

      var $comment_block = comment.showSummary({ columnWidth:40, maxLineNum:5 }).addClass("comment-block");
      var sHtml = (nHiddenCount > 0
                   ? "<div class='comment-block ignore' data='"+nHiddenCount+"'>"
                     + "&#65288;此处自动过滤了 "+nHiddenCount+" 条&#65289;</div>"
                   : "");
      bLoadOld ? $content.append($comment_block) : $content.prepend($comment_block);
      (nHiddenCount > 0) && (nHiddenCount = 0);

      if(!bInit)
      {
        $comment_block.css("background-color", "LightYellow");
        delayRun(function(){ $comment_block.css("background-color", "White") }, 1000*10);
      }
    }  // for() end
  }  // showTweets() end

  function initAutoLoad(mapConfig)
  {
    if(mapConfig["tweets.auto-load"] != "true")
    {
      $("#tweets .comments-auto-load .disable").show();
      return;
    }

    var nMinutes = parseInt(mapConfig["tweets.auto-load-timeout"]);
    (isNaN(nMinutes) || nMinutes<=0) && (nMinutes = 5);

    $("#tweets .comments-auto-load .enable .timeout").html(nMinutes);
    $("#tweets .comments-auto-load .enable").show();

    m_nAutoLoadTimeout = nMinutes * 60;
    m_nAutoLoadCount = m_nAutoLoadTimeout;

    var nInterval = 5;
    setInterval(
      function()
      {
        if(!m_bLoading)
        {
          m_nAutoLoadCount -= nInterval;
          if(m_nAutoLoadCount <= 0)
          {
            m_nAutoLoadCount = m_nAutoLoadTimeout;
            g_loadTweets(false, true);
          }
        }
      },
      1000 * nInterval
    );
  }  // initAutoLoad() end

  function loadManualBannedId()
  {
    m_spamManual.parseSpamList($(".post .post-body").html());

    $.ajax({
      url: Url.getFeedUrlPrefix() + "/posts/full?alt=json&max-results=1",  // only get newest post
      dataType: "json",
      success: function(json)
      {
        ("feed" in json) && ("entry" in json.feed) &&
          m_spamManual.parseSpamList(json.feed.entry[0].content.$t);
      },
      error: function(xhr, sStatus)
      {
      },
      complete: function()
      {
        var mapConfig = loadConfig();
        m_nInitNum = parseInt(mapConfig["tweets.init-num"]);
        assert(!isNaN(m_nInitNum), "init: Invalid 'init-num' attr!");
        (m_nInitNum < 10) && (m_nInitNum = 10);
        (m_nInitNum > 100) && (m_nInitNum = 100);

        g_loadTweets(true, false);
        initAutoLoad(mapConfig);
      },
      timeout: 1000 * 40
    });
  }  // loadManualBannedId() end

  function init()
  {
    if(location.pathname.match(/^\/p\/\w+\.html$/))  // This is page, NOT article
    {
      $("#tweets").closest(".widget").hide();
      return;
    }

    loadManualBannedId();
    Comment.initArticlesMap(8);

    $("#tweets .comments-toolbar .refresh").click(
      function()
      {
        $(this).hide();
        g_loadTweets(false, false);
      }
    );
    setInterval(updateCreateTime, 1000 * 60 * 10);
  }  // init() end

  $(document).ready(
    function() { try { init() } catch(err) { reportError("init: Catch exception: " + err) } }
  );
});