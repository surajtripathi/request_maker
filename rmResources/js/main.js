var k=2;
function httpRequestAsync(pUrl, pMethod, pData, requestHeaders, pCallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            pCallback(xmlHttp);
        }
        else if(xmlHttp.status==404){
        	pCallback(xmlHttp);  
        } else if(xmlHttp.status==301){
        	pCallback(xmlHttp);  
        }
    }
    var url = window.location.href+'debug?reqUrl='+encodeURIComponent(pUrl) + '&reqMethod='+ pMethod +'&reqData='+pData+"&reqHeaders="+requestHeaders;
    xmlHttp.open('GET', url, true); // true for asynchronous 
    xmlHttp.send();
}
function resposeHandler(response) {
	var textArea = document.getElementsByName('responseData');
	//console.log(document.responseText = response);
	textArea[0].value = response.responseText;
	document.getElementById("responseHeadersText").value=response.getAllResponseHeaders();

}

window.onload = function(){
	document.getElementById('submitButtom').addEventListener("click", function(event){
		event.preventDefault();
		var form = document.forms['myForm'];
		var url = form.elements['url'].value;
		var method = form.elements['method'].value;
		var data = form.elements['requestData'].value;
		var headersElement = document.getElementsByClassName('headers');
		var requestHeaders = {};
		for(var i=0; i< headersElement.length; i++){
			requestHeaders[headersElement[i].value] = form.elements["headersValue"+headersElement[i].name].value;
		}
		//console.log("requestHeaders : " + JSON.stringify(requestHeaders));
		httpRequestAsync(url, method, data, JSON.stringify(requestHeaders), resposeHandler);
	});
	
	document.getElementById("addHeaderButton").addEventListener("click", function(enent){
		event.preventDefault();
		var ul = document.getElementById("list");
		var li = document.createElement('li');
		li.setAttribute("style", "margin-top:5px;")
		var div1 = document.createElement('div');
		div1.setAttribute("class", "col-sm-5");
		//div1.setAttribute("style","margin-left: 0px");
		var div2 = document.createElement('div');
		div2.setAttribute("class", "col-sm-5");
		var input1 = document.createElement('input');
		input1.setAttribute("type", "text");
		input1.setAttribute("name", k);
		input1.setAttribute("placeholder", "Header");
		//input1.setAttribute("size", "24");
		input1.setAttribute("class", "headers form-control");
		var input2 = document.createElement('input');
		input2.setAttribute("type", "text");
		input2.setAttribute("name", "headersValue"+k);
		input2.setAttribute("placeholder", "Value");
		//input2.setAttribute("size", "24");
		input2.setAttribute("class","form-control")
		var button = document.createElement("button")
		button.setAttribute("class", "removeButton btn")
		button.appendChild(document.createTextNode("remove"));
		k++;
		div1.appendChild(input1);
		div2.appendChild(input2);
		li.appendChild(div1);
		li.appendChild(div2);
		li.appendChild(button);
		ul.appendChild(li);
		button.addEventListener("click", function(event){
			event.preventDefault();
			var parent;
			var superParent;
			parent = event.srcElement.parentElement;
			superParent = parent.parentElement;
			superParent.removeChild(parent);
		});
	});
	document.getElementsByClassName("removeButton")[0].addEventListener("click", function(event){
		event.preventDefault();
		var parent;
		var superParent;
		parent = event.srcElement.parentElement;
		superParent = parent.parentElement;
		superParent.removeChild(parent);
	});
}