var app_id = chrome.i18n.getMessage("@@extension_id");
var body = $('body');
var userpanel;
var username;


if($(".dark").length!=0)
	beginCreateAuchUserPanel();
else
	beginCreateNotAuchUserPanel();


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
	
	$("#pl_bt_search").html(
		'<a href="http://habrahabr.ru/search/"><img class="pl_topbt" src="chrome-extension://'+app_id+'/html/graphics/find.png"/></a>'
	)
}

function createAuchUserPanel(content)
{	
	body.prepend(content);
	createTopbar();
	updateTopBar();
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
		'<span><img class="pl_topbt" src="chrome-extension://'+app_id+'/html/graphics/message.png"/></span>'
	)
	
	$("#pl_bt_tracker").html(
		'<span><img class="pl_topbt" src="chrome-extension://'+app_id+'/html/graphics/tracker.png"/></span>'
	)
	
	$("#pl_bt_search").html(
		'<a href="http://habrahabr.ru/search/"><img class="pl_topbt" src="chrome-extension://'+app_id+'/html/graphics/find.png"/></a>'
	)
	
	$("#pl_my").html(
		'<a href="http://habrahabr.ru/users/'+ username +'/topics/">Мое</a>'
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
				$("#pl_bt_tracker").css("width", "70px");
			}
			
			if(pl_count[i].href=="http://habrahabr.ru/conversations/")
			{
				$("#pl_bt_msg").append('<span class="pl_msg_panel_new">'+pl_count[i].text+'</span>');
				$("#pl_bt_msg").css("background-color", "rgba(0, 0, 0, 0.309804)");
				$("#pl_bt_msg").css("width", "60px");
				
				// $("#pl_conf").append('<a class="pl_count">'+pl_count[i].text+'</a>');
				
			}
		}
	}
	
	
	
	$("#pl_logout").html(
		'<a href="'+$(".top")[0].getElementsByTagName("a")[2].toString()+'">Выйти</a>'
	)
	 
	$(".search").remove();
	var logo = $(".logo");
	logo.attr("class","pl_logo");
	$(".sidebar_right").css('right','0');
	$(".sidebar_right").css('margin-top','50px');
	// logo.css("background-image", 'url("chrome-extension://'+app_id+'/html/logo.png")');
	
	$.get('http://habrahabr.ru/api/profile/'+username, function(data) {
		var xml = $.parseXML(data);
		var karma = $(xml).find('karma').text();
		var rating = $(xml).find('rating').text();
		
		$("#pl_a_prof_username").html(
			'<a href="http://habrahabr.ru/users/' + username + '/">' +
				'<h2>'+username+'</h2>'+
				'<span class="pl_karma">'+karma+'</span>'+
				'<span class="pl_rating">'+rating+'</span>'+				
			'</a>'
		)
	});
}

function hidePanels()
{
	$("#pl_profile").css('display', 'none');
}

function username_click()
{
	var prf = $("#pl_profile");
	
	if(prf.css('display')=='none')
		prf.css('display', 'block');
	else
		prf.css('display', 'none');		
	return false;
}