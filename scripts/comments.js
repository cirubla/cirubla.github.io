jQuery(function($)
{
  // Module variables
  var m_mapComments = {};
  var m_arrCommentId = [];
  var m_mapLongId = {};

  var m_arrLevelInfo = [];
  var m_nLevelUpdateTime = 0;

  var m_sPostId = null;
  var m_sEditorUrl = null;

  var m_mapAuthors = {};
  var m_nAuthorsUpdateTime = 0;

  var m_sMenuState = "reset";
  var m_nLastActiveTime = 0;
  // anti spam attack
  var m_spamManual = new ManualAnalyzer();
  var m_spamUser = new UserAnalyzer();
  var m_spamTextGroup = new TextGroupAnalyzer();
  var m_spamTextUrl = new UrlAnalyzer({ critical:10 });
  var m_spamTextFeature = new TextFeatureAnalyzer();
  var m_spamTimeGroup = new TimeGroupAnalyzer({ range:900, offset:300 });
  var m_nTimeGroupCritical = 20;


  function getComment(nCommentId)
  {
    assert(typeof nCommentId === "number", "getComment: Invalid type of 'nCommentId': '" + nCommentId + "'");
    assert(nCommentId in m_mapComments, "getComment: NOT found comment id: " + nCommentId);
    return m_mapComments[nCommentId];
  }

  function eachCommentId(arrCommentId, func)
  {
    assert(Array.isArray(arrCommentId), "eachCommentId: Invalid type of 'arrCommentId'!");
    assert(typeof func === "function" && func, "eachCommentId: Invalid type of 'func'!");
    $.each(arrCommentId, function(i, nId){ func(getComment(nId)) });
  }

  function findLevel(nCommentId, bFindSub)
  {
    for(var i=0; i<m_arrLevelInfo.length; i++)
    {
      if(m_arrLevelInfo[i].nId == nCommentId) { return i }
      if(bFindSub && $.inArray(nCommentId, m_arrLevelInfo[i].arrSubId) != -1) { return i }
    }
    assert(false, "findLevel: Invalid comment id: " + nCommentId);
  }

  function asyncEachTopLevel(fnProc, fnComplete)
  {
    assert(typeof fnProc === "function" && fnProc, "asyncEachTopLevel: Invalid 'fnProc'!");
    assert(!fnComplete || typeof fnProc === "function", "asyncEachTopLevel: Invalid 'fnComplete'!");

    var nTimeSpan = 20;
    if(m_arrLevelInfo.length > 50)
    {
      m_arrLevelInfo.asyncEach(nTimeSpan, fnProc, fnComplete)  // async call
    }
    else
    {
      $.each(m_arrLevelInfo, function(i, info){ fnProc(i, info) });  // sync call
      fnComplete && fnComplete();
    }
  }

  function asyncEachTopComment(sSelector, fnProc, fnComplete)
  {
    assert(typeof sSelector === "string" && sSelector, "asyncEachTopComment: Invalid 'sSelector'!");
    assert(typeof fnProc === "function" && fnProc, "asyncEachTopComment: Invalid 'fnProc'!");
    assert(!fnComplete || typeof fnProc === "function", "asyncEachTopComment: Invalid 'fnComplete'!");

    var $top_comment = $("#comments #comment-holder ol.top").children(sSelector);
    assert($top_comment.length <= m_arrLevelInfo.length,
           "asyncEachTopComment: Consistency check failed! The length is "
           + $top_comment.length + " & " + m_arrLevelInfo.length);

    var nTimeSpan = 30;
    ($top_comment.length > 50)
      ? $top_comment.asyncEach(nTimeSpan, fnProc, fnComplete)  // async call
      : ( $top_comment.each(function(){ fnProc($(this)) }) && fnComplete && fnComplete() );  // sync call
  }

  function sortTopComments(sAttr, bReverse)
  {
    // active in 3 minutes, temporarily disable sort levels
    if( $("#comments").inScreen(false) && (getCurrentMS() - m_nLastActiveTime < 1000 * 180) ) { return }

    showBottomTip("正在根据热度重排楼层&#65292;请稍候", 2000);

    var arrLevelInfo = [];  // make a copy without SPAM
    $.each( m_arrLevelInfo, function(i, info){ !getComment(info.nId).nSpamType && arrLevelInfo.push(info) } );
    arrLevelInfo.sort(function(a, b){ return Number.cmp(a[sAttr], b[sAttr]) * (bReverse ? -1 : 1) });

    var $top_ol = $("#comments #comment-holder ol.top:first");
    delayRun(
      function()
      {
        function _moveDOM(i, info)
        {
          var $top_comment = $top_ol.children("li.comment.top").eq(i);
          ($top_comment.attr("data") != String(info.nId))
            && $top_comment.before( $top_ol.children("li.comment.top[data='" + info.nId + "']") );
        }
        $.each(arrLevelInfo, _moveDOM);  // sort DOM
        hideBottomTip();

        var nCurCommentId = parseInt(location.hash.substring(1));
        if(!isNaN(nCurCommentId) && (nCurCommentId in m_mapComments))
        {
          var $cur_comment = $top_ol.find("li.comment[data='" + nCurCommentId + "']");
          !$cur_comment.length && assert(false, "sortTopComments: NOT found comment, id=" + nCurCommentId);
          ($cur_comment.length > 1) && assert(false, "sortTopComments: Repeat comment, id=" + nCurCommentId);
          $cur_comment.scrollTo("fast");
        }
      },
      50
    );
  }  // sortTopComments() end

  function findCommentsByUser(comment)
  {
    var arrResults = [];
    $.each( m_arrCommentId, function(i, nId){ comment.isEqual(getComment(nId)) && arrResults.push(nId) } );
    return arrResults;
  }

  function showEditor(comment)
  {
    comment && (location.hash = "#" + comment.nId);  // mark current comment
    if(!m_sEditorUrl) { return }

    var sParentId = (comment ? (comment.sParentLongId || comment.sLongId) : null);
    var sUrl = (sParentId ? m_sEditorUrl.replace(/#/, "&parentID=" + sParentId + "#") : m_sEditorUrl);
    function _getPopupOptions()
    {
      var nWidth  = $(".sidebar.section").width();
      var nHeight = (isBlogAdmin() ? 500 : 400);
      var nLeft   = window.screen.width - nWidth;
      var nTop    = window.screen.height - nHeight;
      return "width=" + nWidth + ",height=" + nHeight + ",left=" + nLeft + ",top=" + nTop
          + ",resizable=yes,scrollbars=yes,location=no,menubar=no,toolbar=no,status=no";
    }
    var wnd = window.open(sUrl, "new-comment-" + getCurrentMS(), _getPopupOptions());

    try { wnd.closed } catch(err) { return }  // for robust, test 'closed' property (IE 11 maybe fail)
    function _pollingWindow()  // wait editor window closed and load new comment
    {
      if(!wnd.closed) { return true }
      g_loadNewComments();
      window.g_loadTweets(false, true);
      return false;
    }
    asyncLoop(_pollingWindow, 500, "_pollingWindow");
  }

  function getMenuHtml(comment)
  {
    assert(m_arrCommentId.length && m_arrLevelInfo.length, "getMenuHtml: Invalid call!");

    var sUserThis = "只看此人的评论", sUserOthers = "隐藏此人的评论", sUserTip = "", sSearchUser = "";
    if(comment.oAuthor.isAnonymous())
    {
      if("匿名" == comment.oAuthor.sName)
      {
        sUserThis = "";
        sUserOthers = "隐藏所有匿名评论";
        sUserTip = "此人是&#12304;匿名&#12305;&#65288;未登录且没有设置网名&#65289;&#65292;对&#8220;匿名评论&#8221;完全无法区分作者&#65292;只能一起隐藏";
      }
      else
      {
        sUserTip = "此人是&#12304;未登录用户&#12305;&#65292;只能根据&#8220;用户名&#8221;进行过滤\n因此无法区分&#12304;同名&#12305;的情况";
        sSearchUser = "搜索与此人同名的评论";
      }
    }
    else
    {
      sUserTip = "此人是&#12304;登录用户&#12305;&#65292;可以进行精确的过滤";
      sSearchUser = "全站搜索此人的评论";
    }

    var sHtml = "<span class='menubar'><ul class='dropdown filter' style='width:50px;'>"
        + "<li style='background-color: transparent;'><a>过滤</a><ul>"
        + "<li class='reset'><a>显示全部评论</a></li>"
        + (sUserThis ? "<li class='user-this'><a title='"+sUserTip+"'>"+sUserThis+"</a></li>" : "")
        + "<li class='user-others'><a title='"+sUserTip+"'>"+sUserOthers+"</a></li>"
        //+ "<li class='time-before'><a>只看早于这条的评论</a></li>"
        //+ "<li class='time-after'><a>只看晚于这条的评论</a></li>"
        + "</ul></li></ul></span>";

    if(sSearchUser)
    {
      var reTrim = /[\/\\\(\)\[\]\{\}\|\?\!\*\+\-\,\:;"'<>~@#$%^&=]/g
      var sKeyword = ( comment.oAuthor.isLogined()
                       ? comment.oAuthor.sHomeUrl
                       : comment.oAuthor.sName.replace(reTrim, " ") );
      var sUrl = "/p/search.html?scope=comment-author"
          + (comment.oAuthor.isLogined() ? "-url" : "")
          + "&q=" + encodeURIComponent(sKeyword);
      sHtml += "<span class='menubar'><ul class='dropdown search' style='width:50px;'>"
        + "<li style='background-color: transparent;'><a>搜索</a>"
        + "<ul><li><a href='"+sUrl+"' target='_blank'>"+sSearchUser+"</a></li></ul></li>"
        + "</ul></span>";
    }

    if(comment.sText.search(/\[\/\w+\]/) > 0)
    {
      sHtml += "<span class='menubar'><ul class='dropdown bbcode' style='width:80px;'>"
        + "<li style='background-color: transparent;'><a>BBCode</a>"
        + "<ul><li class='bbcode-show'><a>显示 BBCode</a></li></ul></li>"
        + "</ul></span>";
    }
    return sHtml;
  }  // getMenuHtml() end

  function renderMenu($menubars)
  {
    $menubars.attr("update", getCurrentMS());

    var menu = $menubars.find(".dropdown").menu({ position: {my:"left top", at:"left bottom"} });
    $(menu).mouseleave(function(){ menu.menu("collapseAll") });
    $menubars.find("li a").each(
      function() { !$(this).hasAttr("href") && $(this).attr("href", "javascript:;") }
    ).click(function(){ menu.menu("collapseAll") });

    $menubars.find(".filter .user-this a").click(
      function()
      {
        var $cur_comment = $(this).closest("li.comment");
        var sCurUser = $cur_comment.find("cite.user:first").html();
        filterShow(
          function($comment){ return $comment.find("cite.user:first").html() == sCurUser },
          function(){ location.hash = "#" + $cur_comment.attr("data") },
          "user"
        );
      }
    );
    $menubars.find(".filter .user-others a").click(
      function()
      {
        var sCurUser = $(this).closest("li.comment").find("cite.user:first").html();
        filterHide(
          function($comment){ return $comment.find("cite.user:first").html() == sCurUser },
          function(){ location.hash = "#comments" }
        );
      }
    );
    $menubars.find(".filter .reset a").click(
      function()
      {
        filterReset();
        location.hash = "#" + $(this).closest("li.comment").attr("data");
      }
    );

    $menubars.find(".bbcode .bbcode-show a").click(
      function()
      {
        var nCommentId = parseInt($(this).closest("li.comment").attr("data"));
        alert(getComment(nCommentId).sText.replace(/\t/g, " "));
      }
    );

    function _setMenuState($menubars)
    {
      if("reset" == m_sMenuState)  // filterReset
      {
        $menubars.find(".filter .reset").hide();
      }
      else if(m_sMenuState.startsWith("show"))  // filterShow()
      {
        $menubars.find(".filter .reset").show();
        ("show.user" == m_sMenuState) && $menubars.find(".filter .user-this").hide();
      }
      else if("hide" == m_sMenuState)  // filterHide()
      {
        $menubars.find(".filter .reset").show();
      }
      else
      {
        assert(false, "_setMenuState: Invalid 'm_sMenuState'!");
      }
    }
    _setMenuState($menubars);
  }  // renderMenu() end

  function showRestoreLink($top_comment, sDesc)
  {
    assert($top_comment.is(":visible"), "showRestoreLink: The top comment is hidden!");
    assert(typeof sDesc === "string", "showRestoreLink: Invalid 'sDesc'!");
    (sDesc.length > 0) && (sDesc += "&#65292;");

    var $restore = null, arrId = [];
    $top_comment.find("li.comment.sub").each(
      function()
      {
        var $sub_comment = $(this);
        if($sub_comment.is(":visible"))
        {
          if(arrId.length > 0)
          {
            assert($restore, "showRestoreLink: The '$restore' is null!");
            $restore.attr("data", arrId.join(",")).find(".number").html(arrId.length);
            $restore = null;
            arrId = [];
          }
        }
        else  // '$sub_comment' is hidden
        {
          if(0 == arrId.length)
          {
            assert(!$restore, "showRestoreLink: The '$restore' is NOT null!");
            $restore = $("<li class='restore filter'><div>" + sDesc + "此处隐藏了<b class='number'/>条评论&#12290;"
                         + "<a href='javascript:;'>重新显示这些评论</a></div></li>");
            $sub_comment.before($restore);
          }
          arrId.push($sub_comment.attr("data"));
        }
      }
    );
    arrId.length && $restore.attr("data", arrId.join(",")).find(".number").html(arrId.length);
  }  // showRestoreLink() end

  function filterReset()
  {
    m_sMenuState = "reset";
    $.each(m_arrLevelInfo, function(i, info){ info.bVisible = true });

    var $comment_holder = $("#comments #comment-holder");
    $comment_holder.find("li.comment:hidden").show();
    $comment_holder.find("li.restore.filter").remove();
    $comment_holder.find(".comment-block.match").removeClass("match");

    m_nLevelUpdateTime = getCurrentMS();
    initAllGoLevel();
    showBottomTip("已经重新显示&#65306;所有被过滤的评论&#12290;", 3000);
  }

  function filterShow(fnCondition, fnComplete, sType)
  {
    assert(typeof fnCondition === "function" && fnCondition, "filterShow: Invalid 'fnCondition'!");
    assert(typeof fnComplete === "function" && fnComplete, "filterShow: Invalid 'fnComplete'!");
    assert(typeof sType === "string" && sType.length > 0, "filterShow: Invalid 'sType'!");
    m_sMenuState = "show." + sType;
    location.hash = "#comments";

    var nProcCount = 0;
    asyncEachTopComment(
      "li.comment.top:visible",
      function($top_comment)
      {
        var nLevel = findLevel(parseInt($top_comment.attr("data")), false);
        if(m_arrCommentId.length > 150)
        {
          nProcCount += m_arrLevelInfo[nLevel].arrSubId.length;
          var nPercent = Math.floor(1000 * nProcCount / m_arrCommentId.length) / 10;
          showBottomTip("正在过滤&#65292;已经完成 " + nPercent + "%&#65292;请稍候 ...", 0);
        }

        function _setMatch($comment)
        {
          $comment.show();
          ("user" == sType || "time" == sType) && $comment.children(".comment-block").addClass("match");
          ("user" == sType) && $comment.find(".filter:first .user-others").hide();
          return true;
        }

        if(fnCondition($top_comment))  // top comment match
        {
          _setMatch($top_comment);
          $top_comment.find("li.comment.sub").each(
            function(){ fnCondition($(this)) ? _setMatch($(this)) : $(this).hide() }
          );
          showRestoreLink($top_comment, "根据你的过滤条件");
        }
        else  // top comment NOT match
        {
          var bHad = false;
          $top_comment.find("li.comment.sub").each(
            function(){ fnCondition($(this)) ? (bHad = _setMatch($(this))) : $(this).hide() }
          );
          bHad ? showRestoreLink($top_comment, "根据你的过滤条件")
            : $top_comment.hide() && (m_arrLevelInfo[nLevel].bVisible = false);  // NOT found visible sub comment
        }
      },
      function()
      {
        var nNum = $("#comments #comment-holder li.comment:visible").length;
        showBottomTip("过滤完成&#65292;还剩下 " + nNum + " 条评论", 5000);
        m_nLevelUpdateTime = getCurrentMS();
        initAllGoLevel();
        fnComplete();
      }
    );
  }  // filterShow() end

  function filterHide(fnCondition, fnComplete)
  {
    assert(typeof fnCondition === "function" && fnCondition, "filterHide: Invalid 'fnCondition'!");
    assert(typeof fnComplete === "function" && fnComplete, "filterHide: Invalid 'fnComplete'!");
    m_sMenuState = "hide";
    location.hash = "#comments";

    var nProcCount = 0;
    asyncEachTopComment(
      "li.comment.top:visible",
      function($top_comment)
      {
        var nLevel = findLevel(parseInt($top_comment.attr("data")), false);
        if(m_arrCommentId.length > 150)
        {
          nProcCount += m_arrLevelInfo[nLevel].arrSubId.length;
          var nPercent = Math.floor(1000 * nProcCount / m_arrCommentId.length) / 10;
          showBottomTip("正在过滤&#65292;已经完成 " + nPercent + "%&#65292;请稍候 ...", 0);
        }

        if(fnCondition($top_comment))
        {
          $top_comment.hide();
          m_arrLevelInfo[nLevel].bVisible = false;
        }
        else
        {
          $top_comment.find("li.comment.sub").each(function(){ fnCondition($(this)) && $(this).hide() });
          showRestoreLink($top_comment, "根据你的过滤条件");
        }
      },
      function()
      {
        var nNum = $("#comments #comment-holder li.comment:visible").length;
        showBottomTip("过滤完成&#65292;还剩下 " + nNum + " 条评论", 5000);
        m_nLevelUpdateTime = getCurrentMS();
        initAllGoLevel();
        fnComplete();
      }
    );
  }  // filterHide() end

  function filterByTime(nMinTime, nMaxTime)
  {
    if(nMinTime > nMaxTime)
    {
      showBottomTip("<b>&#8220;时间范围&#8221;的设置有误&#8212;&#8212;&#8220;开始时间&#8221;必须小于或等于&#8220;结束时间&#8221;</b>", 5000);
      return;
    }
    filterReset();
    function _condition($comment)
    {
      var nTime = Math.floor(parseInt($comment.attr("data")) / 1000);
      return (nMinTime <= nTime && nTime <= nMaxTime);
    }
    filterShow(_condition, function(){ location.hash = "#comments" }, "time");
  }

  function initAllGoLevel()
  {
    var sHtml = "<option value=''>电梯</option>", nMaxWidth = String(m_arrLevelInfo.length).length, arrSpamRange = null;
    for(var i=0; i<m_arrLevelInfo.length; i++)
    {
      var info = m_arrLevelInfo[i];
      if(!info.bVisible) { continue }
      var commentTop = getComment(info.nId);
      if(commentTop.nSpamType > 0)
      {
        (null === arrSpamRange) ? (arrSpamRange = [i, i]) : (arrSpamRange[1] = i);
        continue;
      }

      if(arrSpamRange)  // show merge range
      {
        var sText = intToStr(arrSpamRange[0] + 1, nMaxWidth, " ").replace(/ /g, "&nbsp;");
        (arrSpamRange[0] != arrSpamRange[1]) && (sText += "&#8212;&#8212;" + (arrSpamRange[1] + 1));

        sHtml += "<option value='" + m_arrLevelInfo[arrSpamRange[0]].nId + "' class='spam'>"
          + sText + " 楼 (垃圾&#65295;刷屏)</option>";
        arrSpamRange = null;
      }

      var sText = intToStr(i+1, nMaxWidth, " ").replace(/ /g, "&nbsp;") + " 楼";
      var sTip = sText + ": " + commentTop.oAuthor.sName;
      info.arrSubId.length && (sText += " / " + info.arrSubId.length + " 回复");
      info.arrSubId.length && (sTip += "\n最后回复: " + getComment(info.arrSubId.last()).oAuthor.sName);
      sHtml += "<option value='" + info.nId + "' title='" + sTip + "'>" + sText + "</option>";
    }  // for() end

    $(".comment-actions .go-level").each(
      function()
      {
        $(this).html(sHtml).change(
          function()
          {
            ($(this).val().length > 0) && (location.hash = "#" + $(this).val());
            $(this)[0].selectedIndex = 0;
          }
        ).tooltip({
          position: { my:"left center", at:"right+20 center-20" },
          content: Tooltip.content,
          open: function(event, ui){ Tooltip.open(event, ui, 3000) }
        });
      }
    );
  }  // initAllGoLevel() end

  function goLevelCurrent($cur_comment)
  {
    assert($cur_comment.hasClass("sub"), "goLevelCurrent: Invalid class!");
    location.hash = "#" + $cur_comment.closest("li.comment.top").attr("data");
  }
  function goLevelUp($cur_comment)
  {
    assert($cur_comment.hasClass("top") || $cur_comment.hasClass("sub"), "goLevelUp: Invalid class!");
    if($cur_comment.hasClass("top"))
    {
      var $prev_comment = $cur_comment.prev();
      while($prev_comment.length > 0)
      {
        if($prev_comment.is(":visible"))
        {
          location.hash = "#" + $prev_comment.attr("data");
          return;
        }
        $prev_comment = $prev_comment.prev();
      }
      showBottomTip("当前楼层已经是最高&#65281;", 3000);
    }
    else
    {
      goLevelUp($cur_comment.closest("li.comment.top"));
    }
  }
  function goLevelDown($cur_comment)
  {
    assert($cur_comment.hasClass("top") || $cur_comment.hasClass("sub"), "goLevelDown: Invalid class!");
    if($cur_comment.hasClass("top"))
    {
      var $next_comment = $cur_comment.next();
      while($next_comment.length > 0)
      {
        if($next_comment.is(":visible"))
        {
          location.hash = "#" + $next_comment.attr("data");
          return;
        }
        $next_comment = $next_comment.next();
      }
      showBottomTip("当前楼层已经是最低&#65281;", 3000);
    }
    else
    {
      goLevelDown($cur_comment.closest("li.comment.top"));
    }
  }

  function saveComment(commentNew, bAddUI)
  {
    assert(typeof commentNew.nId === "number", "saveComment: Invalid type of comment id!");
    assert(!(commentNew.nId in m_mapComments), "saveComment: Repeat comment id!");
    assert(m_arrCommentId.length == Object.keys(m_mapComments).length,
           "saveComment: Consistency check failed! The length is "
           + m_arrCommentId.length + " & " + Object.keys(m_mapComments).length);
    m_mapComments[commentNew.nId] = commentNew;

    var bNeedSort = (m_arrCommentId.length && commentNew.nId < m_arrCommentId.last());  // for robust
    m_arrCommentId.push(commentNew.nId);
    bNeedSort && m_arrCommentId.sort();

    assert(!(commentNew.sLongId in m_mapLongId), "saveComment: Repeat long id!");
    m_mapLongId[commentNew.sLongId] = commentNew.nId;

    if(commentNew.bIsInstruction) { return }

    if(commentNew.isTop())
    {
      m_arrLevelInfo.push({ nId:commentNew.nId, arrSubId:[], bVisible:true, nHot:0.0 });
      commentNew.nTopIndex = m_arrLevelInfo.length;
      commentNew.nSubIndex = 0;
    }
    else  // is sub
    {
      if(commentNew.sParentLongId in m_mapLongId)  // find parent
      {
        var nParentId = m_mapLongId[commentNew.sParentLongId], commentTop = getComment(nParentId);
        m_arrLevelInfo[commentTop.nTopIndex - 1].arrSubId.push(commentNew.nId);
        commentNew.nTopIndex = commentTop.nTopIndex;
        commentNew.nSubIndex = m_arrLevelInfo[commentNew.nTopIndex - 1].arrSubId.length;
      }
      else  // NOT found parent, maybe banned by Google/Blogger
      {
        procBannedTopComment(commentNew, bAddUI)
      }
    }
    _detectSpam(commentNew);

    m_nLevelUpdateTime = getCurrentMS();
    bAddUI && initAllGoLevel();

    function _detectSpam(commentNew)  // anti spam attack
    // The value of 'nSpamType', @see 'getSpamTypeDesc()'
    {
      m_spamManual.isSpam(commentNew) && (commentNew.nSpamType = 40);
      (0 == commentNew.nSpamType) && (commentNew.nSpamType = m_spamUser.getSpamType(commentNew));
      if(commentNew.bIsDeleted) { return }
      if(commentNew.oAuthor.isLogined()) { return }  // TODO

      m_spamTimeGroup.addTime(commentNew.nId);  // for ALL anonymous comments
      (0 == commentNew.nSpamType) && m_spamTextFeature.isSpam(commentNew) && (commentNew.nSpamType = 40);
      (0 == commentNew.nSpamType) && m_spamTextUrl.isSpam(commentNew) && (commentNew.nSpamType = 31);
      if(0 == commentNew.nSpamType)
      {
        var nNum = m_spamTimeGroup.getSimilarNum(commentNew.nId);
        (nNum >= m_nTimeGroupCritical) && (commentNew.nSpamType = 20);
        if(nNum == m_nTimeGroupCritical)
        {
          var arrId = m_spamTimeGroup.getSimilarTimes(commentNew.nId);
          assert(arrId.length > 0, "_detectSpam: The 'arrId' is EMPTY!");
          eachCommentId(arrId, function(comment){ !comment.nSpamType && (comment.nSpamType = 20) });
        }
      }

      if(0 == commentNew.nSpamType)
      {
        commentNew.nTextGroupId = m_spamTextGroup.addComment(commentNew);
        var arrId = m_spamTextGroup.getSimilarId(commentNew);
        if(arrId.length >= 3)
        {
          assert(commentNew.nTextGroupId != commentNew.nId, "_detectSpam: Invalid 'nTextGroupId'");
          commentNew.nSpamType = 30;
          (3 == arrId.length) &&
            eachCommentId(arrId, function(comment){ (comment.nTextGroupId != comment.nId) && (comment.nSpamType = 30) });
        }
      }
    }  // _detectSpam() end
  }  // saveComment() end

  function procBannedTopComment(commentSub, bAddUI)  // TOP comment banned by Google/Blogger
  {
    var commentTop = new Comment(null);  // make a fake comment as placeholder
    commentTop.nId = 1 + (m_arrLevelInfo.length ? m_arrLevelInfo.last().nId : getArticleTime().getTime());
    commentTop.sId = String(commentTop.nId);
    commentTop.dtCreate = new Date(commentTop.nId);
    commentTop.sLongId = commentSub.sParentLongId;

    commentTop.bIsBanned = true;
    commentTop.sUrl = commentSub.sUrl.replace(commentSub.sId, commentTop.sId);

    commentTop.oAuthor = new Author(null);
    commentTop.oAuthor.sName = "匿名";
    commentTop.oAuthor.sAvatarUrl = "https://img1.blogblog.com/img/anon36.png";
    // commentTop.oAuthor.sAvatarUrl = "../../images/anon36.png";

    // Save banned parent
    assert(!(commentTop.nId in m_mapComments), "procBannedTopComment: Repeat parent id!");
    m_mapComments[commentTop.nId] = commentTop;
    m_arrCommentId.push(commentTop.nId);
    m_arrCommentId.sort();  // for robust
    m_mapLongId[commentTop.sLongId] = commentTop.nId;

    m_arrLevelInfo.push({ nId:commentTop.nId, arrSubId:[], bVisible:true, nHot:0.0 });
    commentTop.nTopIndex = m_arrLevelInfo.length;
    commentTop.nSubIndex = 0;

    // Save child
    m_arrLevelInfo[commentTop.nTopIndex - 1].arrSubId.push(commentSub.nId);
    commentSub.nTopIndex = commentTop.nTopIndex;
    commentSub.nSubIndex = m_arrLevelInfo[commentSub.nTopIndex - 1].arrSubId.length;

    if(!bAddUI) { return }

    // Show banned parent comment
    var $top_comment = $(commentTop.showFull()), $top_ol = $("#comments #comment-holder ol.top");
    assert(1 == $top_ol.length, "procBannedTopComment: Multi 'ol.top'!");
    $top_comment.appendTo($top_ol);
    assert(!$top_comment.find(".comment-replies").length, "procBannedTopComment: Found '.comment-replies'!");
    $top_comment.append("<div class='comment-replies thread-expanded'>"
                        + "<a class='thread-toggle' href='javascript:;'/>"
                        + "<div class='comment-thread'><ol class='sub'/></div>"
                        + "</div>");
    // Show child comment
    var $sub_ol = $top_comment.find(".comment-replies .comment-thread ol.sub");
    assert($sub_ol.length > 0, "procBannedTopComment: NOT found 'ol.sub'!");
    $sub_ol.append( $(commentSub.showFull({ starList: getAuthorStarList(commentSub) })) );

    calcAllHot();
    asyncEachTopLevel(
      function(n, info)
      {
        $top_ol.children("li.comment.top[data='" + info.nId + "']").attr("hot", info.nHot)
          .find(".hot:first").html(formatHotTitle(info.nHot));
      },
      function()
      {
        sortTopComments("nHot", true);
        m_nLevelUpdateTime = getCurrentMS();
        initAllGoLevel();
      }
    );
  }  // procBannedTopComment() end

  function updateTitle()
  {
    var sTitle = (m_arrCommentId.length ? (m_arrLevelInfo.length + "楼 / " + m_arrCommentId.length + "条") : "暂无");
    var nSpamCount = 0;
    eachCommentId(m_arrCommentId, function(comment){ comment.nSpamType && nSpamCount++ });
    var sSpamDesc = (nSpamCount ? " &#65288;自动隐藏了 " + nSpamCount + " 条&#8220;垃圾&#65295;刷屏&#8221;&#65289;" : "");

    $("#comments #comments-label").html(sTitle + "评论" + sSpamDesc);
    $(".post-toolbar .post-comment-link .comment-link").html("评论数&#65306;" + sTitle);
    $("#side-toolbar a.comment-number").html(
      m_arrCommentId.length >= 1000 ? (Math.floor(m_arrCommentId.length / 1000) + "K+") : m_arrCommentId.length
    );
  }

  window.g_loadNewComments = function(mapOpts)
  {
    mapOpts = mapOpts || {};
    var nMaxResults = ("maxResults" in mapOpts ? mapOpts.maxResults : 50);
    var fnOnData = ("onData" in mapOpts ? mapOpts.onData : null);
    var fnOnError = ("onError" in mapOpts ? mapOpts.onError : null);

    var nMinTime = 1 + (m_arrCommentId.length ? m_arrCommentId.last() : getArticleTime().getTime());
    assert(m_sPostId.match(/\d+/), "g_loadNewComments: Invalid 'm_sPostId'!");
    var sUrl = Url.getFeedUrlPrefix() + "/" + m_sPostId + "/comments/default"
        + "?alt=json&v=2&orderby=published&reverse=false&max-results=" + nMaxResults
        + "&published-min=" + new Date(nMinTime).toISOString();

    var $top_ol = $("#comments #comment-holder ol.top");
    assert(1 == $top_ol.length, "g_loadNewComments: Multi 'ol.top'!");
    var bAddUI = $top_ol.is(":visible");
    
    function success(json) 
    {
      if(!("feed" in json) || !("entry" in json.feed))
        {
          fnOnData && fnOnData(0);  // notify 'no more data'
          return;
        }
        //delayRun(function(){ window.g_loadTweets(false, true) }, 1000);  // Notify tweets module to refresh

        var nEntryNum = json.feed.entry.length;
        assert(nEntryNum > 0, "g_loadNewComments: The 'entry' is empty!");
        fnOnData && fnOnData(nEntryNum);
        $.each(json.feed.entry, _procJson);
    }
    
    
    var start = new Date().getTime();
    var TIMEOUT = 200;
    var _comments = window.g_loadAllComments();
    var delta = TIMEOUT - (new Date().getTime() - start);
    (delta > 10) ? setTimeout(() => success(_comments),delta) : success(_comments);

    // $.ajax({
    //   url: sUrl,
    //   dataType: "json",
    //   success: function(json)
    //   {
    //     if(!("feed" in json) || !("entry" in json.feed))
    //     {
    //       fnOnData && fnOnData(0);  // notify 'no more data'
    //       return;
    //     }
    //     //delayRun(function(){ window.g_loadTweets(false, true) }, 1000);  // Notify tweets module to refresh

    //     var nEntryNum = json.feed.entry.length;
    //     assert(nEntryNum > 0, "g_loadNewComments: The 'entry' is empty!");
    //     fnOnData && fnOnData(nEntryNum);
    //     $.each(json.feed.entry, _procJson);
    //   },
    //   error: function(xhr, sStatus)
    //   {
    //     reportHttpError("加载评论出错", xhr, sStatus);
    //     fnOnError && fnOnError("");
    //   },
    //   timeout: 1000 * 40
    // });  // ajax end

    function _procJson(i, entry)
    {
      var comment = new Comment(entry);
      if(comment.nId in m_mapComments) { return }

      if(comment.bIsDeleted && !comment.nId)  // for robust, make a fake comment id
      {
        comment.nId = 1 + (m_arrCommentId.length ? m_arrCommentId.last() : getArticleTime().getTime());
        comment.sId = "" + comment.nId;
        comment.dtCreate = new Date(comment.nId);
      }
      assert(comment.nId, "_procJson: Invalid url at entry[" + i + "]!");
      saveComment(comment, bAddUI);
      _showComment(comment);
    }

    function _showComment(comment)
    {
      if(!bAddUI || comment.bIsInstruction) { return }

      // create DOM
      var mapOpts = { starList: getAuthorStarList(comment) };
      if(comment.isTop())
      {
        var info = m_arrLevelInfo[comment.nTopIndex - 1];
        mapOpts.hotValue = info.nHot;
        mapOpts.hotTitle = formatHotTitle(info.nHot);
      }
      var $comment = $(comment.showFull(mapOpts));
      // append DOM
      if(comment.isSub())
      {
        var nParentId = m_arrLevelInfo[comment.nTopIndex - 1].nId;
        var $top_comment = $top_ol.children("li.comment[data='" + nParentId + "']");
        if($top_comment.length > 0)  // for robust
        {
          !$top_comment.find(".comment-replies").length
            && $top_comment.append("<div class='comment-replies thread-expanded'>"
                                   + "<a class='thread-toggle' href='javascript:;'/>"
                                   + "<div class='comment-thread'><ol class='sub'/></div>"
                                   + "</div>");
          $top_comment.find(".comment-replies .comment-thread ol.sub").append($comment);
        }
        else
        {
          assert(false, "addComment: NOT found top comment, parent id: " + nParentId);
        }
      }
      else  // is top
      {
        $comment.appendTo($top_ol);
      }
      (0 == comment.nSpamType) && $comment.children(".comment-block").addClass("unread");

      updateTitle();
      calcAllHot();
      asyncEachTopLevel(
        function(n, info)
        {
          $top_ol.children("li.comment.top[data='" + info.nId + "']").attr("hot", info.nHot)
            .find(".hot:first").html(formatHotTitle(info.nHot))
        },
        function(){ sortTopComments("nHot", true) }
      );
    }  // _showComment() end
  }  // g_loadNewComments() end

  function onHashChange()
  {
    var $comment_holder = $("#comments #comment-holder");
    $comment_holder.find(".comment-block.current").removeClass("current");

    var nCurCommentId = parseInt(location.hash.substring(1));
    if(!(nCurCommentId in m_mapComments)) { return }

    var $cur_comment = $comment_holder.find("li.comment[data='" + nCurCommentId + "']");
    if(0 == $cur_comment.length) { return }  //TODO: show hidden spam comment

    $cur_comment.children(".comment-block").addClass("current");
    if($cur_comment.is(":visible")) { return }

    // show hidden comments
    for(var i=0; i<m_arrLevelInfo.length; i++)
    {
      var info = m_arrLevelInfo[i];
      if(info.nId == nCurCommentId)  // current is top level
      {
        $cur_comment.show().scrollTo("fast").find("li.comment.sub").show();
        info.bVisible = true;
        return;
      }

      if($.inArray(nCurCommentId, info.arrSubId) != -1)  // current is sub level
      {
        $comment_holder.find("li.comment[data='" + info.nId + "']").show();
        $cur_comment.show().scrollTo("fast");
        return;
      }
    }
  }  // onHashChange() end

  function getAuthorStarList(comment)
  {
    if(comment.nSpamType > 0) { return "" }
    var sAuthorKey = comment.oAuthor.getKey();
    if(!sAuthorKey) { return "&#9733;" }  // anonymous WITHOUT name
    if(!(sAuthorKey in m_mapAuthors)) { return "" }

    var info = m_mapAuthors[sAuthorKey];
    var sStar = "";
    for(var i=0; i<Math.floor(info.nStar); i++) { sStar += "&#9733;" }
    return sStar;
  }

  function initAuthorHot()
  {
    m_mapAuthors = {};

    function _procComment(comment)
    {
      assert(comment.oAuthor, "initAuthorHot: Invalid 'oAuthor'!");
      if(comment.bIsDeleted || comment.nSpamType > 0) { return }

      var sKey = comment.oAuthor.getKey();
      if(!sKey) { return }
      (sKey in m_mapAuthors) ? m_mapAuthors[sKey].nCommentNum++
        : (m_mapAuthors[sKey] = { oAuthor:comment.oAuthor, nCommentNum:1 });
    }
    eachCommentId(m_arrCommentId, _procComment);

    for(var sKey in m_mapAuthors)
    {
      assert(sKey, "initAuthorHot: The 'sKey' is empty!");
      var info = m_mapAuthors[sKey], author = info.oAuthor;
      info.nUserWeight = (author.isAnonymous() ? 1.5 : (author.isAdmin() ? 6.0 : 3.0) );
      info.nStar = Math.log2(info.nCommentNum + 1);
      info.nHot = info.nUserWeight * info.nStar;
      info.sTip = "此人的用户类型权重&#65306;" + info.nUserWeight
        + "&#65288;" + (author.isAnonymous() ? "设了网名的匿名用户" : (author.isAdmin() ? "博主" : "登录用户") ) + "&#65289;"
        + "\n此人在本文的评论数&#65306;" + info.nCommentNum
        + "\n此人在本文的星级&#65306;" + (Math.round(info.nStar * 100) / 100) + " == log2(在本文的评论数+1)"
        + "\n此人每条评论的热度&#65306;" + (Math.round(info.nHot * 100) / 100) + " == 用户类型权重 * 在本文的星级";
    }
    m_nAuthorsUpdateTime = getCurrentMS();
  }  // initAuthorHot() end

  function formatHotTitle(nHot)
  {
    return "热度 " + Math.round(nHot * 10) / 10 + "&#8451;";
  }

  function getCommentHot(comment)
  {
    if(comment.bIsDeleted || comment.nSpamType > 0) { return 0.0 }

    var sAuthorKey = comment.oAuthor.getKey();
    if(!sAuthorKey) { return 1.0 }
    if(sAuthorKey in m_mapAuthors) { return m_mapAuthors[sAuthorKey].nHot }
    reportError("getCommentHot: Invalid 'sAuthorKey':" + sAuthorKey);
    return 1.0;
  }

  function setCommentHot($comment)
  {
    var nCommentId = parseInt($comment.attr("data"));
    assert(nCommentId in m_mapComments, "setHotInfo: Invalid comment id!");
    var oAuthor = getComment(nCommentId).oAuthor, sAuthorKey = oAuthor.getKey();

    if(!sAuthorKey)  // anonymous WITHOUT name
    {
      $comment.find(".comment-header:first .star").html("&#9733;").attr("update", getCurrentMS());
      var sTip = "此人的用户类型权重&#65306;1&#65288;无网名的匿名用户&#65289;"
          + "\n此人在本文的评论数&#65306;1"
          + "\n此人在本文的星级&#65306;1 == log2(在本文的评论数+1)"  // Math.log2(nCommentNum+1)
          + "\n此人每条评论的热度&#65306;1 == 用户类型权重 * 在本文的星级";
      $comment.children(".comment-block").find(".user, .star").attr("title", sTip);
      return;
    }

    if(sAuthorKey in m_mapAuthors)
    {
      var info = m_mapAuthors[sAuthorKey], sStar = "";
      for(var i=0; i<Math.floor(info.nStar); i++) { sStar += "&#9733;" }
      $comment.find(".comment-header:first .star").html(sStar).attr("update", getCurrentMS());
      $comment.children(".comment-block").find(".user, .star").attr("title", info.sTip);
    }
  }  // setCommentHot() end

  function calcAllHot()
  {
    initAuthorHot();

    function _calcLevel(info)
    {
      if(getComment(info.nId).nSpamType > 0)
      {
        info.nHot = 0.0;
        return;
      }

      info.nHot = getCommentHot(getComment(info.nId));  // top
      if(info.arrSubId.length > 0)  // sub
      {
        var mapUser = {};
        eachCommentId(
          info.arrSubId,
          function(comment)
          {
            if(comment.bIsDeleted || comment.nSpamType > 0) { return }
            var sKey = comment.oAuthor.getKey();
            if(!sKey)  // anonymous user WITHOUT name
            {
              info.nHot += 1.0;
            }
            else if(comment.oAuthor.isAdmin())  // blogger admin
            {
              info.nHot += getCommentHot(comment);
            }
            else  // logined user or anonymous user with name
            {
              var nNum = ((sKey in mapUser) ? ++mapUser[sKey] : (mapUser[sKey] = 1));
              info.nHot += ((nNum <= 5) ? getCommentHot(comment) : m_mapAuthors[sKey].nUserWeight);
            }
          });
      }
    }
    $.each(m_arrLevelInfo, function(i, info){ _calcLevel(info) });
  }

  function initToolbar()
  {
    var sHtml = "<span><a href='/p/search.html?scope=comment-content' target='_blank'>全站搜索评论</a></span>"
        + "<span class='filter'><a class='reset'>显示全部评论</a></span>"
        + "<span class='menubar'><ul class='dropdown filter-time' style='width:100px;'>"
        + "<li style='background-color: transparent;'><a>按时间过滤</a><ul>";
    var arrSpan =
    [
      [3600 * 2,       "2小时"],
      [3600 * 6,       "8小时"],
      [3600 * 24,      "1天"],
      [3600 * 24 * 3,  "3天"],
      [3600 * 24 * 7,  "1星期"],
      [3600 * 24 * 30, "1个月"]
    ];
    for(var i=0; i<arrSpan.length; i++)
    {
      sHtml += "<li><a class='menuitem' span='" + arrSpan[i][0] + "'>只看 最近" + arrSpan[i][1] + "</a></li>";
    }
    sHtml += "<li><a class='menuitem'>自定义时间段</a></li></ul></li></ul></span>";

    var $toolbar = $("#comments #comments-toolbar").html("<div>" + sHtml + "</div>");
    $toolbar.find(".filter").children("a").attr("href", "javascript:;");
    $toolbar.find(".filter .reset").click(function(){ filterReset() });

    var menu = $toolbar.find(".dropdown").menu({ position: {my:"left top", at:"left bottom"} });
    $(menu).mouseleave(function(){ menu.menu("collapseAll") });

    function showTimeRange()
    {
      var $range = $("<div class='filter-time-range'>"
                     + "<b>自定义时间过滤&#65306;</b>&#12288;"
                     + "开始 <input type='text' id='min-date'/> <select id='min-hour'/>&#12288;"
                     + "结束 <input type='text' id='max-date'/> <select id='max-hour'/>&#12288;"
                     + "<a id='search'>过滤</a></div>").appendTo($toolbar);
      $range.find("input").attr("size", "10").attr("readonly", true).attr("title", "日期")
        .datepicker(getDatePickerOpts()).val( (new Date()).format("%Y-%0m-%0d") );

      var sOptionHtml = "";
      for(var i=0; i<24; i++)
      {
        sOptionHtml += "<option value='" + intToStr(i, 2, "0") + "'>"
          + intToStr(i, 2, " ").replace(/ /g, "&nbsp;") + "</option>";
      }
      $range.find("#min-hour, #max-hour").html(sOptionHtml).attr("title", "小时");

      var $min_hour = $range.find("#min-hour").val("00");
      var $max_hour = $range.find("#max-hour").val("23");
      $range.children("a#search").click(
        function()
        {
          var dtMin = Date.parseISO($range.find("#min-date").val() + "T" + $min_hour.val() + ":00:00");
          var dtMax = Date.parseISO($range.find("#max-date").val() + "T" + $max_hour.val() + ":59:59");
          filterByTime(dtMin.getTime() / 1000, dtMax.getTime() / 1000);
        }
      ).attr("href", "javascript:;");
      menu.menu("collapseAll");
    }
    $toolbar.find(".filter-time li a.menuitem").click(
      function()
      {
        if($(this).hasAttr("span"))
        {
          var nSpan = parseInt($(this).attr("span")), nMaxTime = Math.floor(getCurrentMS() / 1000);
          assert(!isNaN(nSpan) && nSpan > 0, "initToolbar: Invalid 'span' attr!");
          menu.menu("collapseAll");
          delayRun(function(){ filterByTime(nMaxTime - nSpan, nMaxTime) }, 100);
        }
        else
        {
          showTimeRange();
          $(this).parent().hide();
        }
      }
    ).attr("href", "javascript:;");
  }  // initToolbar() end

  function complete()
  {
    $("#comments #comments-loading").remove();
    $("#blog-pager").show();
    initToolbar();
    m_nLevelUpdateTime = getCurrentMS();
    initAllGoLevel();
    // setInterval(function(){ g_loadNewComments() }, 1000 * 60 * 10);

    (parseInt($("#comments").attr("init_num")) <= m_arrCommentId.length)
      && m_arrCommentId.length && showBottomTip("本文的&#12304;全部评论&#12305;已经加载完成", 3000);

    if( ("onhashchange" in window) && ("addEventListener" in window) )
    {
      window.addEventListener("hashchange", onHashChange, false);

      var nCommentId = parseInt((new Url(null)).getParam("comment"));
      !isNaN(nCommentId) && (nCommentId in m_mapComments) && (location.hash = "#" + nCommentId);
      onHashChange();
    }
  }

  function setProgress(sType, nInc)
  {
    assert(typeof sType === "string", "setProgress: Invalid 'sType'!");
    assert(typeof nInc === "number" && nInc >= 0, "setProgress: Invalid 'nInc'!");

    var nLoadWeight = 2.0, nShowWeight = 1.0;
    if("load" == sType) { nInc *= nLoadWeight }
    else if("show" == sType) { nInc *= nShowWeight }
    else { assert(false, "setProgress: Invalid 'sType': " + sType) }

    var $comments = $("#comments"), nInitTotal = parseInt($comments.attr("init_num"));
    var nProcTotal = nInitTotal * (nShowWeight + nLoadWeight);

    var $progress_bar = $comments.find("#comments-loading #progress-bar");
    assert(1 == $progress_bar.length, "setProgress: NOT found DOM '#progress-bar'!");
    var nCurNum = parseInt($progress_bar.attr("data"));
    assert(!isNaN(nCurNum), "setProgress: Invalid 'data' attr!");
    nCurNum += nInc;

    var nPercent = Math.floor(nCurNum * 100 / nProcTotal);
    (nPercent > 100) && (nPercent = 100);  // @see 'procBannedTopComment'
    $progress_bar.attr("data", nCurNum).children("#progress-label").html(nPercent + "%");
    $progress_bar.progressbar({value: nPercent});

    return $progress_bar;
  }  // setProgress() end

  function loadAllComments()
  {
    assert(Array.isArray(m_arrCommentId), "loadAllComments: Invalid size of 'm_arrCommentId'!");

    var $comments = $("#comments"), nInitTotal = parseInt($comments.attr("init_num"));
    // m_spamManual.parseSpamList($(".post .post-body").html());
    m_spamManual.parseSpamList($(".post-content .post").html());
    setProgress("load", 0);
    (new Url(null)).getParam("comment") && $comments.scrollTo("fast");

    var bIsLoading = false, dtLastLoad = new Date(), nLoadNum = 0, nNetErrNum = 0;
    var mapOpts =
    {
      onData: function(nCommentNum)
      {
        bIsLoading = false;
        if(nCommentNum > 0)
        {
          dtLastLoad = new Date();
          nNetErrNum = 0;
          ((nLoadNum += nCommentNum) >= 50) && setProgress("load", nLoadNum) && (nLoadNum = 0);
          if(m_arrCommentId.length < nInitTotal) { return }
        }
        assert(!nCommentNum || m_arrCommentId.length >= nInitTotal, "loadAllComments.onData");
        dtLastLoad = null;  // flag of 'no more data'
      },
      onError: function(sDesc)
      {
        bIsLoading = false;
        sDesc ? reportError(sDesc) : nNetErrNum++;
      },
      maxResults: (nInitTotal < 800 ? 100 : 200)
    };

    var timer = setInterval(
      function()
      {
        if(false == bIsLoading)
        {
          bIsLoading = true;
          nNetErrNum && (mapOpts.maxResults = 50);
          g_loadNewComments(mapOpts);  // load again
          return;
        }
        if(!dtLastLoad)  // no more data
        {
          clearInterval(timer);  timer = null;
          asyncCallChain([calcAllHot, showAllComments], 50);
          return;
        }

        if( (nNetErrNum > 10) || (getCurrentMS() - dtLastLoad.getTime() > 1000 * 60) )  // load timeout
        {
          clearInterval(timer);  timer = null;

          var sHtml = "<br/>由于" + (nNetErrNum ? "网络故障" : " JS 脚本出错")
              + "&#65292;只有 " + m_arrCommentId.length + " 条评论被加载&#12290;"
              + "<span><br/><br/><a id='show'>显示已加载的这部分评论</a></span>";
          $comments.children("#comments-warning").append(sHtml)
            .find("a#show").attr("href", "javascript:;").click(
              function()
              {
                $(this).closest("span").remove();
                $comments.children("#comments-loading").prepend("<div>正在处理已加载的这部分评论</div>");
                asyncCallChain([calcAllHot, showAllComments], 50);
              }
            );
        }
      },
      100
    );  // setInterval() end
  }  // loadAllComments() end

  function showAllComments()
  {
    var $top_ol = $("#comments #comment-holder").show().children(".comment-thread").children("ol");
    updateTitle();

    // SYNC sort array
    var arrLevelInfo = m_arrLevelInfo.slice();
    arrLevelInfo.sort(function(a, b){ return Number.cmp(a.nHot, b.nHot) * -1 });

    var nLevel = 0, nCommentCount = 0, sLevelsHtml = "", nTimeSpan = 30, arrTopSpamId = [];
    asyncLoop(
      function()
      {
        var nBeginTime = getCurrentMS();
        while(nLevel < arrLevelInfo.length)
        {
          nCommentCount += _showLevel(arrLevelInfo[nLevel]);
          nLevel++;
          if(getCurrentMS() - nBeginTime > 500)
          {
            setProgress("show", nCommentCount) && (nCommentCount = 0);
            return true;
          }
        }

        sLevelsHtml && $top_ol.append(sLevelsHtml) && (sLevelsHtml = "");
        (nCommentCount > 0) && setProgress("show", nCommentCount) && (nCommentCount = 0);
        arrTopSpamId.length && $top_ol.append(_mergeSpam(arrTopSpamId));

        complete();
        return false;
      },
      nTimeSpan,
      "showAllComments"
    );  // asyncLoop end

    function _showLevel(info)
    {
      var nBufLen = 1024 * 128;
      (0 == getComment(info.nId).nSpamType)
        ? ((sLevelsHtml += _getLevelHtml(info)).length > nBufLen) && $top_ol.append(sLevelsHtml) && (sLevelsHtml = "")
        : arrTopSpamId.push(info.nId);  // merge multi top spam
      return (1 + info.arrSubId.length);
    }

    function _getLevelHtml(info)
    {
      assert(Array.isArray(info.arrSubId), "_getLevelHtml: Invalid 'arrSubId' type!");

      var commentTop = getComment(info.nId), sSubCommentHtml = "", arrSubSpamId = [];
      assert(0 == commentTop.nSpamType, "_getLevelHtml: Top comment is SPAM!");

      function _procSub(commentSub)
      {
        if(commentSub.nSpamType > 0)  // merge multi spam
        {
          arrSubSpamId.push(commentSub.nId);
          return;
        }
        arrSubSpamId.length && (sSubCommentHtml += _mergeSpam(arrSubSpamId)) && (arrSubSpamId = []);
        sSubCommentHtml += commentSub.showFull({ starList: getAuthorStarList(commentSub) });
      }
      eachCommentId(info.arrSubId, _procSub);
      arrSubSpamId.length && (sSubCommentHtml += _mergeSpam(arrSubSpamId));

      var mapOpts =
      {
        starList: getAuthorStarList(commentTop),
        hotValue: info.nHot,
        hotTitle: formatHotTitle(info.nHot),
        subComments: sSubCommentHtml
      };
      return commentTop.showFull(mapOpts);
    }  // _getLevelHtml() end

    function _mergeSpam(arrId)
    {
      var sHtml = "<li class='restore spam-merge'>";
      $.each(arrId, function(i, nId){ sHtml += "<a name='" + nId + "'> </a>" });
      var sSize = (arrId.length > 20 ? (arrId.length > 100 ? "150%" : "125%") : "100%");
      sHtml += "<span>此处有 <b style='font-size:" + sSize + ";'>" + arrId.length + "</b> 条评论"
        + "被判定为&#8220;垃圾或刷屏&#8221;&#65292;已经自动隐藏&#12290;<a class='load' href='javascript:;'>重新显示</a></span></li>";
      return sHtml;
    }
  }  // showAllComments() end

  function initEvent($comments)
  {
    $(window).scroll(function(){ $comments.inScreen(false) && (m_nLastActiveTime = getCurrentMS()) });
    $comments
      // 取消原本的弹窗功能,改为跳转到原页面
      // .on("click", ".comment-actions .add-btn", function(){ showEditor(null) })
      // .on("click", ".comment-actions .reply-btn",
      //     function()
      //     {
      //       var nCommentId = parseInt( $(this).closest("li.comment").attr("data") );
      //       assert(!isNaN(nCommentId), "initEvent: Invalid 'data' attr at 'li.comment'!");
      //       showEditor(getComment(nCommentId));
      //     }
      //    )
      .on("click", ".comment-actions .go-level-up", function(){ goLevelUp($(this).closest("li.comment")) })
      .on("click", ".comment-actions .go-level-down", function(){ goLevelDown($(this).closest("li.comment")) })
      .on("click", ".comment-actions .go-level-current", function(){ goLevelCurrent($(this).closest("li.comment")) })
      .on("click", ".comment-actions .mark-spam",
          function()
          {
            var nCommentId = parseInt( $(this).closest("li.comment").attr("data") );
            assert(!isNaN(nCommentId), "initEvent: Invalid 'data' attr at 'li.comment'!");
            m_spamManual.addCommentId(nCommentId);
            $(this).after($("<b class='mark-spam'>&#12288;BANNED&#12288;</b>")).remove();
          }
         )
      .on("click", ".spam-actions .show-banned",
          function(){ $(this).parent().children("#banned-code").val(m_spamManual.getBannedJson()) }
         )
      .on("mouseenter", "li.comment .comment-block",
          function()
          {
            _onMouseEnterComment($(this));
            $(this).children(".comment-actions").find(".menubars, .blog-admin").show();
          }
         )
      .on("mouseleave", "li.comment .comment-block",
          function(){ $(this).children(".comment-actions").find(".menubars, .blog-admin").hide() }
         )
      .on("click", ".comment-replies .thread-toggle", function(){ _toggleThread($(this)) })
      .on("click", ".comment-replies .restore.filter a", function(){ _showFilterComments($(this)) })
      .on("click", ".restore.spam-merge a.load", function(){ _loadSpamComments($(this)) })
      .on("click", ".comment-content .restore.spam a.load", function(){ _loadSpamComment($(this)) })
      .on("click", ".comment-content .read-more", function(){ _readMore($(this)) })
      .on("click", ".comment-content a.goto", function(evt){ _clickGotoLink(evt, $(this)) })
      .on("click", ".comment-content a.bbcode", function(evt){ _clickBBCodeLink(evt, $(this)) })
      .on("click", ".comment-content .bbcode.image .show-icon", function(){ _switchBBCodeIcon($(this)) })
      .on("click", ".comment-content .bbcode.image .show-real", function(){ _switchBBCodeImg($(this)) })
      .on("mouseenter", ".comment-content .bbcode",
          function(){ !$(this).hasAttr("title") && $(this).attr( "title", _getBBCodeTip($(this)) ) }
         )
      .mousemove(function(){ m_nLastActiveTime = getCurrentMS() });

    function _onMouseEnterComment($block)
    {
      var $comment = $block.closest("li.comment"), nCommentId = parseInt($comment.attr("data"));
      assert(!isNaN(nCommentId), "_onMouseEnterComment: Invalid 'data' attr!");

      var $menubars = $block.children(".comment-actions").children(".menubars");
      if($menubars.length>0 && $menubars.hasAttr("update"))
      {
        var nUpdateTime = parseInt($menubars.attr("update"));
        assert(!isNaN(nUpdateTime), "_onMouseEnterComment: Invalid 'update' attr at menubars!");
        (!$menubars.find(".menubar").length || nUpdateTime < m_nLevelUpdateTime)
          && renderMenu($menubars.html( getMenuHtml(getComment(nCommentId)) ));
      }

      var nUpdateTime = parseInt( $block.children(".comment-header").children(".star").attr("update") );
      assert(!isNaN(nUpdateTime), "_onMouseEnterComment: Invalid 'update' attr at star!");
      (nUpdateTime<m_nAuthorsUpdateTime) && !$comment.hasClass("spam") && setCommentHot($comment);
    }

    function _toggleThread($btn)
    {
      var $replies = $btn.closest(".comment-replies");
      if($replies.hasClass("thread-expanded"))
      {
        $replies.removeClass("thread-expanded").addClass("thread-collapsed");
      }
      else if($replies.hasClass("thread-collapsed"))
      {
        $replies.removeClass("thread-collapsed").addClass("thread-expanded");
      }
      else
      {
        assert(false, "_toggleThread: Invalid class!");
      }
    }

    function _showFilterComments($btn)
    {
      var $restore = $btn.closest("li.restore.filter"), $top_comment = $restore.closest("li.comment.top");
      $.each(
        $restore.attr("data").split(","),
        function(i, nId){ $top_comment.find("li.comment[data='" + nId + "']").show() }
      );
      $restore.remove();
    }

    function _loadSpamComments($btn)  // load multi
    {
      var $restore = $btn.closest(".restore.spam-merge"), sHtml = "";
      $restore.children("a").each(
        function()
        {
          var nCommentId = parseInt($(this).attr("name"));
          assert(!isNaN(nCommentId), "_loadSpamComments: Invalid 'name' attr!");
          sHtml += getComment(nCommentId).showFull();
        });
      $restore.after($(sHtml)).remove();
    }

    function _loadSpamComment($btn)  // load single
    {
      var $comment = $btn.closest(".restore.spam").closest("li.comment");
      var nCommentId = parseInt($comment.attr("data")), sHtml = "";
      assert(!isNaN(nCommentId), "_loadSpamComment: Invalid 'data' attr at 'li.comment'!");

      $comment.hasClass("top")
        && eachCommentId( m_arrLevelInfo[findLevel(nCommentId, false)].arrSubId,
                          function(subComment){ sHtml += subComment.showFull() } );
      sHtml = getComment(nCommentId).showFull({ showSpam: true, subComments: sHtml });
      $comment.after($(sHtml)).remove();
    }

    function _readMore($btn)
    {
      var $content = $btn.closest(".comment-content");
      var nCommentId = parseInt($content.closest("li.comment").attr("data"));
      assert(!isNaN(nCommentId), "_readMore: Invalid 'data' attr at 'li.comment'!");
      $content.html(getComment(nCommentId).getContentHtml({ showSpam: true, truncate: false }));
    }

    function _clickGotoLink(event, $btn)
    {
      event.preventDefault();
      var nTop = parseInt($btn.attr("top")), nSub = parseInt($btn.attr("sub"));
      if(isNaN(nSub)) { return }
      nSub -= 1;

      if(isNaN(nTop))  // current level
      {
        var nCommentId = parseInt($btn.closest("li.comment").attr("data"));
        var nTop = findLevel(nCommentId, true);
      }
      else
      {
        nTop -= 1;
      }
      if(nTop >= m_arrLevelInfo.length) { return }
      if(nSub >= m_arrLevelInfo[nTop].arrSubId.length) { return }
      location.hash = "#" + m_arrLevelInfo[nTop].arrSubId[nSub];
    }

    function _clickBBCodeLink(event, $btn)
    {
      var oUrl = new Url($btn.attr("href")), oUrlPage = new Url();
      if(oUrlPage.sHost == oUrl.sHost && oUrlPage.sPath == oUrl.sPath)  // current page
      {
        event.preventDefault();
        location.hash = "#" + (oUrl.getParam("comment") || "");
      }
    }

    function _switchBBCodeIcon($btn)
    {
      var $center = $btn.hide().closest("center");
      $center.find(".show-real, img.icon").show();
      $center.find("img.real, .size").hide();
    }
    function _switchBBCodeImg($btn)
    {
      var $center = $btn.hide().closest("center");
      $center.find(".show-icon").show();
      var $img_icon = $center.find("img.icon"), $img_real = $center.find("img.real");
      if(!$img_icon.prop("complete"))
      {
        $img_icon.attr("alt", "无法显示评论图片 :( 可能是: 图片网址有误 或 网络传输超时");
        return;
      }
      $img_icon.hide();
      $img_real.show();
      $center.find(".size").show();

      if($img_real.hasAttr("src")) { return }
      var sImgUrl = $img_icon.attr("src").replace(/&resize_w=\d+/, "");
      $img_real.attr("alt", "正在载入原始图 ......").attr("src", sImgUrl)
        .error(function(){ $(this).attr("alt", "图片无法加载 :( 可能是: 图片网址有误 或 网络传输超时") })
        .load(function(){ onImgLoad($(this)) });

      function onImgLoad($img)
      {
        var nFitWidth = $img.attr("alt", "").parent().width() - 8;
        if($img[0].clientWidth <= nFitWidth) { return }

        var sHtml = "<div class='size'><b>切换原始图的显示尺寸&#65306;</b><select>"
            + "<option value='" + $img[0].clientWidth + "'>适应图片尺寸</option>"
            + "<option value='" + nFitWidth + "'>适应窗口宽度</option></select></div>";
        $(sHtml).insertAfter($img).children("select")
          .change(function(){ $img.css( "max-width", parseInt($(this).val()) ) });
      }
    }  // _switchBBCodeImg() end

    function _getBBCodeTip($element)
    {
      var sUrlProto = "\n\n&#65288;网址必须以 http:// 或 https:// 开头&#65289;";
      var arrConfig =
      [
        [ "a", "simple",
          "超链接语法:\n评论中插入的网址会自动识别成可点击的超链\n"
          + "为避免误判&#65292;网址&#12304;两端&#12305;最好是空格或回车&#65292;&#12304;不能是&#12305;半角符号" + sUrlProto ],
        [ "a", "text", "超链接语法:\n[url=网址]标题文字[/url]" + sUrlProto ],
        [ null, "image",
          "评论中的网址&#65292;如果对应的是图片&#65292;会被智能识别并把图片嵌入到评论中&#12290;\n\n"
          + "&#65288;为保护读者隐私&#65292;嵌入的图片用&#12304;Google图片代理&#12305;加载&#12290;\n"
          + "因此&#65292;存放图片的服务器&#12304;不会&#12305;看到你的&#8220;访问者IP&#8221;及&#8220;浏览器信息&#8221;&#65289;" ],
        [ "b", null, "粗体语法:\n[b]带粗体的文字[/b]" ],
        [ "i", null, "斜体语法:\n[i]带斜体的文字[/i]" ],
        [ "center", null, "居中语法:\n[center]居中的文字[/center]" ],
        [ null, "quote", "引用语法:\n[quote]被引用的文字[/quote]" ],
        [ "del", null, "删除线语法:\n[del]带删除线的文字[/del]" ],
        [ "a", "goto", "XX单元\nX楼XX单元\n会自动识别成可点击的超链&#65292;点击后跳到相应评论" ]
      ];

      var sTipContent = "&#12304;BBCode 语法提示&#12305;\n";
      $.each(
        arrConfig,
        function(i, arrFields)
        {
          if(arrFields[0] && arrFields[0] != $element.prop("tagName").toLowerCase()) { return true }
          if(arrFields[1] && !$element.hasClass(arrFields[1])) { return true }
          return (sTipContent += arrFields[2]) && false;
        });
      return sTipContent;
    }  // _getBBCodeTip() end
  }  // initEvent() end

  function init($comments)
  {
    {
      var $editor_src = $("a#comment-editor-src");
      $editor_src.length && (m_sEditorUrl = $editor_src.attr("href"));
      assert(m_sEditorUrl, "init: Invalid 'm_sEditorUrl'!");
      (m_sEditorUrl.indexOf("#") == -1) && (m_sEditorUrl += "#");

      m_sPostId = (new Url(m_sEditorUrl)).getParam("postID");
      assert(m_sPostId, "init: NOT found 'postID' in 'm_sEditorUrl' attr!");
    }

    initEvent($comments);

    var nInitTotal = 0;
    if($comments.hasAttr("init_num"))
    {
      nInitTotal = parseInt($comments.attr("init_num"));
      assert(!isNaN(nInitTotal) && nInitTotal >= 0, "init: Invalid 'init_num' attr!");
    }
    else
    {
      $comments.attr("init_num", "0");
    }
    $("#side-toolbar a.comment-number").html(nInitTotal >= 1000 ? (Math.floor(nInitTotal / 1000) + "K+") : nInitTotal);

    if(nInitTotal > 0)
    {
      $comments.find("#comment-holder").html("<div class='comment-thread'><ol class='top'/></div>");
      $comments.children("#comments-loading").html("<div id='progress-bar' data='0'><div id='progress-label'/></div>");
      $("#blog-pager").hide();

      loadAllComments();
    }
    else
    {
      var sHtml = "<a name='comments'> </a>"
          + "<h4 id='comments-label'/>"
          + "<div id='comments-toolbar'/>"
          + "<div id='comments-warning'/>"
          + "<div id='comments-content'>"
          +   "<div id='comment-holder'><div class='comment-thread'><ol class='top'/></div></div>"
          + "</div>";  // comments-content
      $comments.html(sHtml).find("#comment-holder").show();
      complete();
    }

    // 'comment-actions' to add top comment
    {
      var sSpamTool = "<div class='spam-actions'><a class='show-banned' href='javascript:;'>BANNED CODE</a>"
          + "<br/><textarea id='banned-code' cols='100' rows='7' readonly='readonly'></textarea></div>";
      // var sHtml = "<div class='comment-actions top'><a class='add-btn' href='javascript:;'>添加评论</a></div>"
      //     + (isBlogAdmin() ? sSpamTool : ""); //source

      var title = $('.post-title.entry-title'); //after
      var source = title.children(":first").attr('href') + '#comments'; //after
      var sHtml = "<div class='comment-actions top'><a class='add-btn' title='跳转到原文评论' target='_blank' href='" + source + "'>添加评论</a></div>"
          + (isBlogAdmin() ? sSpamTool : ""); //after
      $comments.find("#comment-holder").after($(sHtml));
    }

    $("#ie-ver-lt-10").length  // IE version <= 9
      && $comments.children("#comments-warning").html("你的 IE 版本太老&#65292;赶紧升级或者换个浏览器吧&#65281;");
  }  // init() end

  $(document).ready(
    function()
    {
      try
      {
        var $comments = $("#comments");
        $comments.length && init($comments);
      }
      catch(err)
      {
        showBottomTip("<b>初始化评论界面出错&#65281;</b>", 0);
        reportError("init: Catch exception:\n" + err);
      }
    }
  );
});