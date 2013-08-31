var attach_panel;
var show_new;
var show_tracker;

// var isAttach = localStorage.getItem("pl_attach_panel");


document.addEventListener('DOMContentLoaded', function()
{
	attach_panel = document.getElementById("attach_panel");
	show_new = document.getElementById("show_new");
	show_tracker = document.getElementById("show_tracker");
	
	document.querySelector('#attach_panel').addEventListener('change', saveSettings);
	document.querySelector('#show_new').addEventListener('change', saveSettings);
	document.querySelector('#show_tracker').addEventListener('change', saveSettings);

	restoreCheckBox(attach_panel, "pl_attach_panel");
	restoreCheckBox(show_new, "pl_show_new");
	restoreCheckBox(show_tracker, "pl_show_tracker");
});

function restoreCheckBox(element, storagevar)
{
	var strvar = localStorage.getItem(storagevar);
	if(strvar==null)
	{
		strvar = true;
		localStorage.setItem(storagevar, strvar);
	}
	if(strvar=="true")	element.checked = true;
	if(strvar=="false")	element.checked = false;
}

function saveSettings(evt)
{
	chrome.storage.local.set(
		{"pl_attach_panel":attach_panel.checked,
		"pl_show_new":show_new.checked,
		"pl_show_tracker":show_tracker.checked
		}
	);
	var name = 'pl_'+evt.target.id
	localStorage.setItem(name, evt.target.checked);
}