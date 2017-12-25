"use strict";

/* DISQUS SHORTNAME */
var disqus_shortname = '';

/* Joomba Boomba */
var joomba = 0;

/* Browser Sniffing */
var ie = (function(){
    var undef,rv = -1; // Return value assumes failure.
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    } else if (trident > 0) {
        var rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
    }

    return ((rv > -1) ? rv : undef);
}());

var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
var fallback = ((!iOS && window.innerWidth > 1000 && indexPage) ? false : true);
var evType = (iOS ? 'touchstart' : 'click');

var subtitle, cover, category, subcategory, facebook, twitter, gplus, pinterest, github, prevImg, realCover;
var categories = [], menu = {}, posts = [];
var blogTitle = $('.blogTitle').html();
var blogUrl = $('.blogUrl').html();
var blogCover = $('.blogTitle').attr('data-img');
var blogDescription = $('.blogDescription').html();
menu['title'] = blogTitle;

if(joomba) {
    fallback = true;
}

/* If a shortname hasn't been defined explicitly in this file, lets try to get it from the {{@blog.description}} */
if(!disqus_shortname) {
    blogDescription = blogDescription.replace(
        new RegExp( "^.*shortname\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            disqus_shortname = $0.substr(i+1, $0.length);
            disqus_shortname = disqus_shortname.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
}


/* Build Menu Constructor */
var temp = $('#menu-template').html();
temp = temp.replace(new RegExp( "{-{-{", "g" ), function($0) { return "\{\{\{" });
temp = temp.replace(new RegExp( "{-{", "g" ), function($0) { return "\{\{" });
var buildMenu = Handlebars.compile(temp);

if(fallback) {
    /* Parse away the special metadata inside posts */
    if(!indexPage) {
        $('.content').html(parseGhost($('.content').html()));
        $('div.title subCover').attr('src', cover);
        if(cover) {
            $('img.subCover').attr('src', cover);
        }
    }
}

/* Build our data model from the Ghost DOM */
if(!indexPage) {
    $('#posts').load('/ article.static-post', function() {
        getContext();
    });
} else {
    getContext();
}

/* Single Page App version of the theme */
if(!fallback)
{
    var sjf = new simpleJSONFilter();
    var curPost = 0, rDir = "Right", scrollVal, isRevealed, noscroll, isAnimating, dis, disqus_identifier, disqus_url;
    var keys = [32, 37, 38, 39, 40], wheelIter = 0;
    var postContext = { "posts": posts };
    var docElem = window.document.documentElement,
        container = document.getElementById( 'container' );

    /* Launch Single Page App. Hide static fallback */
    $('article.static-post').hide();

    /* Build the Menu */
    var buildMenu = Handlebars.compile(temp);
    var menuHtml = buildMenu(menu);

    /* Build Post HTML constructor Object */
    var mainTemp = $('#post-template').html();
    mainTemp = mainTemp.replace(new RegExp( "{-{-{", "g" ), function($0) { return "\{\{\{" });
    mainTemp = mainTemp.replace(new RegExp( "{-{", "g" ), function($0) { return "\{\{" });
    var buildPost = Handlebars.compile(mainTemp);

    $(document).ready(function(){
        checkHash();
        arrowCleanup();
        Prism.highlightAll();
    });

    /* Bind Left/Right keys to next / previous blog post */
    $(document).keydown(function(e) {
        if(scrollY() == 0)
        {
            if(e.which == 37)
            {
                goLeft();
            }
            else if(e.which == 39)
            {
                goRight();
            }
        }
    });
}
else /* Fallback static version of the theme */
{
    /* New Disqus identifiers on each render */
    var tmp = window.location.href.split('/');
    if(tmp[tmp.length - 1]) {
        disqus_identifier = tmp[tmp.length - 1];
    } else {
        disqus_identifier = tmp[tmp.length - 2];
    }
    disqus_url = blogUrl+'/'+disqus_identifier+'/';

    /* Hide container for Single Page App */
    $('div.container').hide();

    /* Add WOW animations to posts on the static index page */
    if(!iOS) {
        new WOW().init();
    }

    /* Check for hashbang */
    if(window.location.hash) {
        var tp = window.location.hash.split('/');
        if (tp[3]) {
            /* Navigate to Single Post */
            window.location.href = blogUrl+'/'+tp[3]+'/';;
        }
        else if(tp[2]) {
            /* Navigate to Subcategory */
            staticSubCatChange(tp[1], tp[2]);
        }
        else if(tp[1]) {
            /* Navigate to Category */
            staticCatChange(tp[1]);
        }
    }

    /* Fix social links */
    var thanks = decodeHtml($('p.thanks').html());
    thanks = parseSocial(thanks);
    $('p.thanks').html(thanks+'&nbsp;');
    if(facebook) {
        $('a.facebook').attr('href', 'http://fb.me/'+facebook);
    } else {
        $('a.facebook').hide();
    }
    if(twitter) {
        $('a.twitter').attr('href', 'http://twitter.com/'+twitter);
    } else {
        $('a.twitter').hide();
    }
    if(gplus) {
        $('a.gplus').attr('href', 'http://plus.google.com/'+gplus);
    } else {
        $('a.gplus').hide();
    }
    if(pinterest) {
        $('a.pinterest').attr('href', 'http://pinterest.com/'+pinterest);
    } else {
        $('a.pinterest').hide();
    }
    if(github) {
        $('a.github').attr('href', 'http://github.com/'+github);
    } else {
        $('a.github').hide();
    }

    /* Handle posts without tags */
    if($('.title p.tagged > a').length == 0) {
        $('.title p.tagged').hide();
    }

    /* Add custom language (If Present) */
    if(lang) {
        $.each(lang, function(i, item) {
            $('span.lang'+i).each(function() {
                $(this).html(item);
            });
        });
    }

    /* Add fluidbox to all images except user's avatar */
    $('.content img:not(.face)').each(function() {
        $(this).wrap("<a class='gallery'></a>");
    });
//    $('.content img:not(.face)').each(function() {
//        $(this).wrap("<a class='gallery' href='"+$(this).attr('src')+"'></a>");
//    });
//    $('.gallery').fluidbox();
//    $('a.gallery').parent().css('position', 'relative');
//    $('a.gallery').parent().css('z-index', '99');
//    $('a.gallery').click(function() {
//        if($(this).parent().css('z-index') == 99) {
//            $(this).parent().css('z-index', '100');
//        } else {
//            $(this).parent().css('z-index', '99');
//        }
//    });

    $(window).scroll(function() {
        if(window.pageYOffset < 500 && !iOS) {
            $('img.subCover').css('top', '-'+parseInt(window.pageYOffset/4)+'px');
        }
    });

    /* Add markup highlighting to code */
    $('.content code').each(function() {
        $(this).addClass('language-css language-markup');
    });

    /* Show Title */
    $('.title').css('opacity', 1);

}

if(disqus_shortname) {
    /* Trigger Disqus (First Pageload) */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
}

/* Handle Back / Forward events */
window.onpopstate = function(event) {
    curPost = event.state.curPost;
    render(1);
};