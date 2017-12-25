"use strict";

function sort(key,array,dir) {
    /* Sorts an array of objects by an object key */
    dir = dir || 1;
    array.sort(function(h, i) {
        return h[key].toLowerCase() < i[key].toLowerCase() ? -1 * dir : (h[key].toLowerCase() > i[key].toLowerCase() ? 1 * dir : 0);
    });
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function scrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
}

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if(e.keyCode == 40) {
            toggle('reveal');
        } else if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function touchmove(e) {
    preventDefault(e);
}

function wheel(e) {
    // for IE
    //if(ie) {
    //preventDefault(e);
    //}
}

function disable_scroll() {
    window.onmousewheel = document.onmousewheel = wheel;
    document.onkeydown = keydown;
    document.body.ontouchmove = touchmove;
}

function enable_scroll() {
    window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
}

function scrollPage() {
    scrollVal = scrollY();

    if(noscroll && !ie) {
        if(scrollVal < 0) return false;
        window.scrollTo( 0, 0 );
    }

    if(classie.has(container, 'notrans')) {
        classie.remove( container, 'notrans' );
        return false;
    }

    if(isAnimating) {
        return false;
    }

    if(scrollVal <= 0 && isRevealed) {
        toggle(0);
    }
    else if(scrollVal > 0 && !isRevealed){
        toggle(1);
    }
}

function toggle(reveal) {
    /* Fancy Header -> Post Transition */
    isAnimating = true;

    if(reveal) {
        classie.add(container, 'modify');
        setTimeout(function() {
            $('nav.container').css('background', '#000');
//            $('nav.container').css('z-index', 1);
        }, 500);
    } else {
        noscroll = true;
        disable_scroll();
        classie.remove( container, 'modify');
        setTimeout(function() {
            $('nav.container').css('background', 'transparent');
        }, 250);
//        $('nav.container').css('z-index', 2);
    }

    /* simulate the end of the transition */
    setTimeout(function() {
        isRevealed = !isRevealed;
        isAnimating = false;
        if(reveal) {
            noscroll = false;
            enable_scroll();
        }
    }, 1200 );
}

function goRight() {
    if(curPost < posts.length - 1) {
        curPost++;
        rDir = 'Right';
        render();
    }
    arrowCleanup();
}

function goLeft() {
    if(curPost > 0) {
        curPost--;
        rDir = 'Left';
        render();
    }
    arrowCleanup();
}

function arrowCleanup() {
    if(curPost == posts.length - 1) { $('#ar').velocity({opacity: 0}); }
    else { $('#ar').velocity({opacity: 1}); }
    if(curPost == 0) { $('#al').velocity({opacity: 0}); }
    else { $('#al').velocity({opacity: 1}); }
}

function catChange(s) {
    var filter = {catSlug: s};
    posts = sjf.exec(filter, postContext.posts);
    posts = _.values(posts);
    curPost = 0;
    render();
    arrowCleanup();
}

function subCatChange(x,s) {
    var filter = {catSlug: x, subcatSlug: s};
    posts = sjf.exec(filter, postContext.posts);
    posts = _.values(posts);
    curPost = 0;
    render();
    arrowCleanup();
}

function staticCatChange(x) {
    $('article.static-post').each(function() {
        if($(this).attr('data-category') != x) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function staticSubCatChange(x,s) {
    $('article.static-post').each(function() {
        if($(this).attr('data-category') != x || $(this).attr('data-subcategory') != s) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function fixRedirect() {
    if(window.location.hash) {
        var tp = window.location.hash.split('/');
        if (tp[3]) {
            /* Navigate to Single Post */
            window.location.href = blogUrl+'/'+tp[3]+'/';
        }
        else if(tp[2]) {
            /* Navigate to Subcategory */
            staticSubCatChange(tp[1], tp[2]);
        }
        else if(tp[1]) {
            /* Navigate to Category */
            staticCatChange(tp[1]);
        }
        $('.underlay').hide();
        $('#menu li').hide();
        $('.menu ul li ul').hide();
        $('.mobile-only').hide();
    }
}

function checkHash() {
    if(window.location.hash) {
        var tp = window.location.hash.split('/');
        if(tp[3]) {
            if(fallback) {
//                window.location.href = blogUrl+'/'+tp[3]+'/';
            }
            /* Navigate to Single Post */
            for(var i = 0; i < postContext.posts.length; i++) {
                if('#!'+postContext.posts[i].url == window.location.hash) {
                    curPost = i;
                    render();
                    arrowCleanup();
                    scrollPage();
                    break;
                }
            }
        }
        else if(tp[2]) {
            /* Navigate to Subcategory */
            subCatChange(tp[1], tp[2]);
            scrollPage();
        }
        else if(tp[1]) {
            /* Navigate to Category */
            catChange(tp[1]);
            scrollPage();
        }
        else {
            /* Default State in case of malformed URL */
            curPost = 0;
            posts = postContext.posts;
            render();
            arrowCleanup();
            scrollPage();
        }
    } else {
        /* This is the default state */
        curPost = 0;
        posts = postContext.posts;
        render();
        arrowCleanup();
        scrollPage();
    }
}

function getContext() {
    $('article.static-post').each(function() {
        var me = 0, hasSub = 0, hasCat = 0;
        var content = $(this).find('.fullPost').html();
        content = parseGhost(content);
        var catSlug;
        if(category) {
            catSlug = category.toLowerCase();
            catSlug = catSlug.replace(new RegExp(" ", "g"), function($0) { return "-" });
        }
        var subcatSlug;
        if(subcategory) {
            subcatSlug = subcategory.toLowerCase();
            subcatSlug = subcatSlug.replace(new RegExp(" ", "g"), function($0) { return "-" });
        }
        $(this).attr('data-category', catSlug);
        $(this).attr('data-subcategory', subcatSlug);

        if(category && subcategory) {
            /* Find out if category hasCat exists */
            for(var i=0; i<categories.length; i++) {
                if(categories[i].name == category) {
                    hasCat = 1;
                    me = i;
                }
            }
            /* If the category doesn't exist, push it */
            if(!hasCat) {
                var tCat = {};
                tCat['name'] = category;
                tCat['link'] = '/'+catSlug;
                var tSub = {};
                tSub['name'] = subcategory;
                tSub['link'] = '/'+catSlug+'/'+subcatSlug+'/';
                tCat['subcategory'] = [tSub];
                categories.push(tCat);
                sort('name', categories);
            } else {
                /* See if subcategory exists */
                for(var i=0; i<categories[me].subcategory.length; i++) {
                    if(categories[me].subcategory[i].name == subcategory) {
                        hasSub = 1;
                    }
                }
                /* If subcategory doesn't exist */
                if(!hasSub) {
                    var tSub = {};
                    tSub['name'] = subcategory;
                    tSub['link'] = '/'+catSlug+'/'+subcatSlug+'/';
                    var tSubs = categories[me].subcategory;
                    tSubs.push(tSub);
                    sort('name', tSubs);
                    categories[me].subcategory = tSubs;
                }
            }

            menu['category'] = categories;
        }

        if(!fallback) {
            /* Push Posts Context for Single Page App */
            var post = {}, author = {}, handle = {};
            var title = decodeHtml($(this).find('h1').html());
            var titleSlug = $(this).find('.boxContainer a').attr('href');
            var thanks = decodeHtml($(this).find('p.thanks').html());
            thanks = parseSocial(thanks);
            post['subtitle'] = decodeHtml(subtitle);
            if(!cover && blogCover) {
                cover = blogCover;
            }
            $('body').append('<img class="hideMe" src="'+cover+'">');
            post['cover'] = decodeHtml(cover);
            post['category'] = decodeHtml(category);
            post['subcategory'] = decodeHtml(subcategory);
            post['title'] = decodeHtml(title);
            post['date'] = $(this).find('span.thisDate').html();
            post['tagged'] = $(this).find('p.tagged').html();
            post['catSlug'] = catSlug;
            post['subcatSlug'] = subcatSlug;
            post['titleSlug'] = titleSlug;
            post['url'] = '/'+catSlug+'/'+subcatSlug+titleSlug;
            post['summary'] = decodeHtml($(this).find('p.excerpt').html());
            post['content'] = content;
            author['name'] = decodeHtml($(this).find('span.thisAuthor').html());
            author['avatar'] = $(this).find('div.authorImage').html();
            author['caption'] = decodeHtml($(this).find('div.authorLocation').html());
            author['signoff'] = thanks;
            author['facebook'] = facebook;
            author['twitter'] = twitter;
            author['gplus'] = gplus;
            author['pinterest'] = pinterest;
            author['github'] = github;
            var handleLink = $(this).find('div.authorWebsite').html();
            handle['name'] = handleLink;
            handle['link'] = handleLink;
            author['handle'] = handle;
            post['author'] = author;
            posts.push(post);
        }
    });
    if(fallback) {
        /* Attach menu to static page */
        $('body').prepend(buildMenu(menu));
        bindMenu();
        $('nav').css('background', '#000');
    }
}

function render(v) {
    /* Router / History / State */

    // if(!v) {
    //     /* Get our new post URL */
    //     //window.location.hash = '!'+posts[curPost].url;
    //     history.pushState({"curPost": curPost},null,blogUrl+'/#!'+posts[curPost].url);
    // }

    /* Update Window Title */
    window.document.title = posts[curPost].title + " - " + blogTitle;

    /* New Disqus identifiers on each render */
    var tp = window.location.hash.split('/');
    disqus_identifier = tp[3];
    disqus_url = blogUrl+'/'+disqus_identifier+'/';

    /* Refresh view */
    $('#container').html(menuHtml + buildPost(posts[curPost]));
    $('.bg-img').append('<img src="'+prevImg+'" class="prev">');
    $('.bg-img img').css('opacity', 1);
//    $('.prev').fadeOut(500);
    $('.prev').velocity({opacity: 0});
    prevImg = posts[curPost].cover;
    bindMenu();

    /* Aesthetics */
    if(joomba){
//        $('header div.title').css('margin-top', '-'+$('header div.title').outerHeight() / 2 + 'px');
//        $('header div.title').css('left', '5%');
    }
    $('header div.title').velocity("transition.slide"+rDir+"In");
//  $('.spinner img').css('opacity', 0);
//  $('.spinner').velocity({opacity: 0});
    setTimeout(function() {
        $('div.arrow-down').css('opacity', 0.85);
//      $('.spinner').css('display', 'none');
    }, 500);

    /* Add fluidbox to images */
    $('.content img:not(.face)').each(function() {
        $(this).wrap("<a class='gallery' href='"+$(this).attr('src')+"'></a>");
    });
    $('.gallery').fluidbox();
    $('a.gallery').parent().css('position', 'relative');
    $('a.gallery').parent().css('z-index', '99');
    $('a.gallery').click(function() {
        if($(this).parent().css('z-index') == 99) {
            $(this).parent().css('z-index', '100');
        } else {
            $(this).parent().css('z-index', '99');
        }
    });

    /* Highlight Code Blocks */
    $('.content code').each(function() {
        $(this).addClass('language-css language-markup');
    });
    Prism.highlightAll();

    /* Handle posts without tags */
    if($('.title p.tagged > a').length == 0) {
        $('.title p.tagged').hide();
    }

    /* Bind Swipe Functions to slider */
    $("header").swipe({
        swipeLeft:function() {
            if(scrollY() == 0)
                goRight();
        },
        swipeRight:function() {
            if(scrollY() == 0)
                goLeft();
        },
        swipeUp:function(e) {
            if(scrollY() == 0)
                toggle('reveal');
        },
        threshold:100
    });

    /* Bind category changes to menu links */
    $('a[data-cat]').off(evType).bind(evType, function(e) {
        window.location.hash = '#!'+$(this).attr('data-cat');
        checkHash();
        e.preventDefault();
    });

    if(disqus_shortname) {
        /* Reload Disqus */
        if(window.DISQUS) {
            DISQUS.reset({
                reload: true,
                config: function() {
                    this.page.identifier = disqus_identifier;
                    this.page.url = disqus_url;
                }
            });
        }
    }

    /* Add custom language (If Present) */
    if(lang) {
        $.each(lang, function(i, item) {
            $('span.lang'+i).each(function() {
                $(this).html(item);
            });
        });
    }

    /* Return to top of page & disable scroll */
    var pageScroll = scrollY();
    noscroll = pageScroll === 0;
    disable_scroll();
    if(pageScroll) {
        isRevealed = true;
        classie.add(container, 'notrans');
        classie.add(container, 'modify');
    }

    /* Bind scroll to transition */
    $(window).off('scroll');
    window.addEventListener('scroll', scrollPage);
    $('.trigger').off(evType).bind(evType, function() {
        toggle('reveal');
    });
}

function parseGhost(string) {
    /* Resets Globals (in case of no value in post) */
    subtitle = '';
    cover = '';
    category = '';
    subcategory = '';
    /* Replaces above globals with content from post & removes declarations from {{fullpost}} */
    string = string.replace(
        new RegExp( "^.*subtitle\\s*:.*$", "igm" ),
        function($0) {
            if(!subtitle) {
                var i = $0.indexOf(':');
                subtitle = $0.substr(i+1, $0.length);
                subtitle = subtitle.replace(/(<([^>]+)>)/ig,"").trim();
                return '';
            }
            return $0;
        });
    string = string.replace(
        new RegExp( "^.*cover\\s*:.*$", "igm" ),
        function($0) {
            if(!cover) {
                var i = $0.indexOf(':');
                cover = $0.substr(i+1, $0.length).trim();
                /* Hacky way of reverting underscore pairs in URLs that get parsed as markdown bold */
                cover = cover.replace(new RegExp("<em>", "g"), function($0) { return "_" });
                cover = cover.replace(new RegExp("<\\/em>", "g"), function($0) { return "_" });
                /*----------------------------------------------------------------------------------*/
                cover = cover.replace(/(<([^>]+)>)/ig,"").trim();
                return '';
            }
            return $0;
        });
    string = string.replace(
        new RegExp( "^.*subcategory\\s*:.*$", "igm" ),
        function($0) {
            if(!subcategory) {
                var i = $0.indexOf(':');
                subcategory = $0.substr(i+1, $0.length).trim();
                subcategory = subcategory.replace(/(<([^>]+)>)/ig,"").trim();
                return '';
            }
            return $0;
        });
    string = string.replace(
        new RegExp( "^.*category\\s*:.*$", "igm" ),
        function($0) {
            if(!category) {
                var i = $0.indexOf(':');
                category = $0.substr(i+1, $0.length).trim();
                category = category.replace(/(<([^>]+)>)/ig,"").trim();
                return '';
            }
            return $0;
        });
    return string.trim();
};

function parseSocial(string) {
    /* Resets Globals (in case of no value in post) */
    facebook = '';
    twitter = '';
    gplus = '';
    pinterest = '';
    github = '';
    /* Replaces above globals with content from post & removes declarations from {{fullpost}} */
    string = string.replace(
        new RegExp( "^.*facebook\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            facebook = $0.substr(i+1, $0.length);
            facebook = facebook.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
    string = string.replace(
        new RegExp( "^.*twitter\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            twitter = $0.substr(i+1, $0.length);
            twitter = twitter.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
    string = string.replace(
        new RegExp( "^.*gplus\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            gplus = $0.substr(i+1, $0.length);
            gplus = gplus.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
    string = string.replace(
        new RegExp( "^.*pinterest\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            pinterest = $0.substr(i+1, $0.length);
            pinterest = pinterest.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
    string = string.replace(
        new RegExp( "^.*github\\s*:.*$", "igm" ),
        function($0) {
            var i = $0.indexOf(':');
            github = $0.substr(i+1, $0.length);
            github = github.replace(/(<([^>]+)>)/ig,"").trim();
            return '';
        });
    return string.trim();
};

function bindMenu() {
    /* Responsive Menu */
    $(window).resize(function(){
        if ($(window).width() > 1000) {
            $('.menu li').show();
            $('.menu ul').show();
            $('.mobile-only').hide();
            $('.underlay').hide();
            $('nav ul:not(.full)').each(function() {
                $(this).css('min-width', $(this).parent().width()+'px');
            });
        }
        else {
            $('#menu li').hide();
            $('.menu ul li ul').hide();
            $('.mobile-only').hide();
        }
    });

    /* Mobile Menu toggler */
    $('#collapse').bind(evType, function(){
        $('.underlay').toggle();
        $('#menu li').toggle();
        $('.menu ul li ul').hide();
        $('.mobile-only').hide();
        return false;
    });

    /* Mobile Menu Subcategory togglers */
    $('.hasChildren').bind(evType, function(ev) {
        if ($(window).width() < 1000) {
            $('.menu ul li ul').not(this).hide();
            $(this).siblings().toggle();
            ev.preventDefault();
            return false;
        }
    });
    $('nav ul:not(.full)').each(function() {
        $(this).css('min-width', $(this).parent().width()+'px');
    });
}
