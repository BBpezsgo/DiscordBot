//setTagStr(document,'ntw_common_js')
var str_pages = parent.pages_js;
var str_main = parent.str_main;

function setTagStr(obj, page)
{
	var e, ee;
	var i, n;
	var items;
	if( (undefined==str_pages) || (undefined == str_main) )
	{
		return;
	}
	if( (undefined == obj) || (undefined == page) )
	{
		return;
	}
	for ( tag in str_pages[page] )
	{
		try
		{
			if(!window.ActiveXObject)
			{
				items = obj.getElementsByName(tag);
				if(items.length > 0)
				{
					for(i = 0; i < items.length; i++)
					{
						items[i].innerHTML = str_pages[page][tag];
					}
				}
				else
				{
					obj.getElementById(tag).innerHTML = str_pages[page][tag];
				}
			}
			else
			{
				items = obj.all[tag];
				if(undefined != items.length && items.length > 0)
				{
					for(i = 0; i < items.length; i++)
					{
						items[i].innerHTML = str_pages[page][tag];
					}
				}
				else
				{
					items.innerHTML = str_pages[page][tag];
				}
			}
		}
		catch(e)
		{
			continue;
		}
	}

	for ( btn in str_main.btn )
	{
		try
		{
			obj.forms[0][btn].value = str_main.btn[btn];
		}
		catch(e)
		{
			continue;
		}
	}
}

function GetMinWidth()
{
	var i=Math.ceil((window.screen.width - 182)*0.55) - 6;
    return i;
}

function LoadHelp(helpFileName) 
{
       if(window.parent != window)
	   {
		   	if (window.parent.topFrame.hl != helpFileName)
			{
		        window.parent.topFrame.hl = helpFileName;
				window.parent.helpFrame.location.href = "/help/" + helpFileName;
			}
	   }
       return true;   
	   }

function resize(obj)
{
var minWidth = GetMinWidth();
if (window.document.body.offsetWidth > minWidth)
    {
        obj.document.getElementById('autoWidth').style.width = "100%";
    }
 else
    {
        obj.document.getElementById('autoWidth').style.width = minWidth;
    }
        return true; 
}

function resizeHelp(obj)
{
if (window.document.body.offsetWidth > 290)
    {
        obj.document.getElementById('autoWidth').style.width = "100%";
    }
 else
    {
        obj.document.getElementById('autoWidth').style.width = 290;
    }
    return true; 
}

function elementDisplay(obj, tag, disStr)
{
    	try
        {		
    		if(!window.ActiveXObject)
            {
				items = obj.getElementsByName(tag);
				if(items.length > 0)
				{
					for(i = 0; i < items.length; i++)
					{
						items[i].style.display = disStr;
					}
				}
				else
				{
					obj.getElementById(tag).style.display = disStr;
				}				
    		}
			else
			{
				items = obj.all[tag];
				if(undefined != items.length && items.length > 0)
				{
					for(i = 0; i < items.length; i++)
					{
						items[i].style.display = disStr;
					}
				}
			}
		}
		catch(e)
		{
    		return;
		}
}

function disableTag(obj, tag, type)
{
	try
	{
		var items = obj.getElementsByTagName(tag);
	}
	catch(e)
	{
		return;
	}
	if (type == undefined)
	{
		for (var i = 0; i < items.length; i++)
		{
			items[i].disabled = true;
		}
	}
	else
	{
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].type == type)
				items[i].disabled = true;
		}		
	}
}

function LoadNext(FileName)
{
	if(window.parent != window)
		window.parent.mainFrame.location.href = FileName;
		return true; 
}