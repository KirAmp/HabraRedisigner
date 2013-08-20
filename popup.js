 $(document).ready(function(){
    $('#bt_generate').click(function(e)
	{
		chrome.tabs.executeScript({file: 'js/jquery.js'});
		chrome.tabs.executeScript({file: 'js/redesign.js'});
	})
 });
