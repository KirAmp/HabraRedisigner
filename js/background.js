chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
	if(changeInfo.status=="loading")
		begin(tabId);
});

function begin(tabId)
{
	chrome.tabs.get(tabId,function(tab)
	{
		var url = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
		if((url=="habrahabr.ru" || url=="auth.habrahabr.ru"))
		{		
			chrome.tabs.insertCSS(tab.id, {file:"css/styles.css"})
			chrome.tabs.executeScript(tab.id, {file: 'js/jquery.js'});
			chrome.tabs.executeScript(tab.id, {file: 'js/redesign.js'});
		}
	});
}