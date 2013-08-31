var app_id = chrome.i18n.getMessage("@@extension_id");
var body = $('body');
var userpanel;
var username;

if($(".dark").length!=0)
	beginCreateAuchUserPanel();
else
{
	if(window.location.href.split('/')[3]!="company")
		beginCreateNotAuchUserPanel();
}


function beginCreateAuchUserPanel()
{
	userpanel = $('.userpanel')[0];
	username = $(".dark").get(0).text;

	$.ajax({
	  url: 'chrome-extension://'+app_id+'/html/panel.html',
	  success: createAuchUserPanel
	});

	$("#layout").on('click', hidePanels);
}

function beginCreateNotAuchUserPanel()
{
	$.ajax({
	  url: 'chrome-extension://'+app_id+'/html/noauch_panel.html',
	  success: createNotAuchUserPanel
	});
}

function createNotAuchUserPanel(content)
{
	body.prepend(content);
	// content.css
	
	$("#pl_bt_search").html(
		'<a href="http://habrahabr.ru/search/"><img class="pl_topbt" src="chrome-extension://'+app_id+'/html/graphics/find.png"/></a>'
	)
	
	$("#pl_bt_search").on("click", search_click);
}

// var showNew = true;
// var showTracker = true;
function createAuchUserPanel(content)
{	
	chrome.storage.local.get("pl_attach_panel", function(data)
	{
		body.prepend(content);
		
		if(!data.pl_attach_panel)
			$("#topbar").css('position','absolute');
			
			
		createTopbar();
		updateTopBar();
		
		chrome.storage.local.get("pl_show_new", function(data)
		{
			if(data.pl_show_new || data.pl_show_new == undefined)
			{
				var count =	localStorage.getItem("pl_count_new");
				if(count)
				{
					$("#pl_bt_new").append('<span class="pl_msg_panel_new">'+count+'</span>');
					$("#pl_bt_new").css("background-color", "rgba(0, 0, 0, 0.2)");
				}
				getCountNewFeed();
			}
			else
			{
				$("#pl_bt_new").remove();
			}
		});
		
		chrome.storage.local.get("pl_show_tracker", function(data)
		{
			if(!data.pl_show_tracker && data.pl_show_tracker != undefined)
				$("#pl_bt_tracker").remove();
		});
	});
	// }
}

function createTopbar()
{
	var bt_user = $("#pl_username");
	bt_user.html(
		'<a href="http://habrahabr.ru/users/' + username + '/"><b>' + username + '</b>'+
		'<img class="pl_morebt" src="chrome-extension://'+app_id+'/html/graphics/more.png"/>'+
		'</a>'
	);
	bt_user.on("click",username_click);
	
	$("#pl_fav_link").prepend(
		'<a href="http://habrahabr.ru/users/' + username +'/favorites/">Избранное</a>'
	);
	
	$("#pl_bt_msg").html(
		'<span title="Сообщения"><img class="msg_bts_img" src="chrome-extension://'+app_id+'/html/graphics/message.png"/></span>'
	)
	
	$("#pl_bt_tracker").html(
		'<span title="Треккер"><img class="msg_bts_img" src="chrome-extension://'+app_id+'/html/graphics/tracker.png"/></span>'
	)
	
	
	
	var bt_search = $("#pl_bt_search");
	bt_search.html(
		'<a href="http://habrahabr.ru/search/"><img class="search_img" src="chrome-extension://'+app_id+'/html/graphics/find.png"/></a>'
	)
	bt_search.on("click", search_click);
	
	$("#pl_my").html(
		'<a href="http://habrahabr.ru/users/'+ username +'/topics/">Мое</a>'
	)
	
	$("#pl_comments").html(
		'<a href="http://habrahabr.ru/users/'+ username +'/comments/">Комментарии</a>'
	)
	
	$("#pl_bt_new").html(
		'<span title="Новое"><img class="msg_bts_img" src="chrome-extension://'+app_id+'/html/graphics/post.png"/></span>'
	)
}

function updateTopBar()
{
	var pl_count = $('.count');
	for(i=0;i<pl_count.length;i++)
	{
		if(pl_count[i].parentNode.className=="bottom")
		{
			if(pl_count[i].href=="http://habrahabr.ru/tracker/")
			{
				// $("#pl_tracker").append('<a class="pl_count">'+pl_count[i].text+'</a>');
				
				var count = pl_count[i].text.slice(1);
				if(count<99)
					count="+"+count;
				else
					count=99+"+";
				
				$("#pl_bt_tracker").append('<span class="pl_msg_panel_new">'+count+'</span>');
				$("#pl_bt_tracker").css("background-color", "rgba(24, 39, 75, 0.14)");
			}
			
			if(pl_count[i].href=="http://habrahabr.ru/conversations/")
			{
				$("#pl_bt_msg").append('<span class="pl_msg_panel_new">'+pl_count[i].text+'</span>');
				$("#pl_bt_msg").css("background-color", "rgba(0, 0, 0, 0.309804)");
				
				// $("#pl_conf").append('<a class="pl_count">'+pl_count[i].text+'</a>');
				
			}
		}
	}
	
	
	var url_out=$('a:contains("выйти")').attr('href');
	$("#pl_logout").html(
		'<a href="'+url_out+'">Выйти</a>'
	)
	 
	$(".search").remove();
	
	$.get('http://habrahabr.ru/api/profile/'+username, function(data) {
		var xml = $.parseXML(data);
		var karma = $(xml).find('karma').text();
		var rating = $(xml).find('rating').text();
		
		$("#pl_a_prof_username").html(
			'<a href="http://habrahabr.ru/users/' + username + '/" style="width: 180px;">' +
				'<span class="pl_karma">'+karma+'</span>'+
				'<span class="pl_rating">'+rating+'</span>'+				
			'</a>'
		)
	});
}


function getCountNewFeed()
{
	$.get('http://habrahabr.ru/feed/new/',function(data){
		var html = $.parseHTML(data);
		var count = $(html).find('.count_new').text();
		
		if(!localStorage.getItem("pl_count_new"))
		{
			$("#pl_bt_new").append('<span class="pl_msg_panel_new">'+count+'</span>');
			$("#pl_bt_new").css("background-color", "rgba(0, 0, 0, 0.2)");
		}
		
		localStorage.setItem("pl_count_new", count);
	});
}


function hidePanels()
{
	$("#pl_profile").css('display', 'none');
	$("#pl_search").css('display', 'none');
	
	$("#pl_usrnm").removeClass("profile-active");
	$("#pl_bt_search").removeClass("profile-active");
}

function username_click()
{
	var prf = $("#pl_profile");
	var dsp = prf.css('display');
	hidePanels();
	
	if(dsp=='none')
	{
		prf.css('display', 'block');
		$("#pl_usrnm").addClass("profile-active");
	}
	else
		hidePanels();
	return false;
}

function search_click()
{
	var srch = $("#pl_search");
	var dsp = srch.css('display');
	hidePanels();
	
	if(dsp=='none')
	{
		srch.css('display', 'block');
		$("#pl_search_inp").focus();
		$("#pl_bt_search").addClass("profile-active");

	}
	else
		hidePanels();
	return false;
}