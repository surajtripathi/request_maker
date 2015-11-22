var k=2;
var save_url_history = {};
//var urlArray = [];
function save_RM(pUrl, pMethod, pData, pRequestHeaders) {
	var url = pUrl;
	var tempData = {
		url : url,
		method : pMethod,
		requestData : pData,
		requestHeaders : pRequestHeaders 
	};
	//urlArray[urlArray.length] = url;
	if(!save_url_history[url]){
		updateDataList(url);
	}
	save_url_history[url] = tempData;
	storeUrlHistoryInLocalStorage();
	//window.save_url_history_1 = save_url_history;
}
function getUrlHistoryFromLocalStorage(){
	if(typeof(Storage) !== 'undefined') {
		if((localStorage.getItem("urlHistory")) !== null) {
			save_url_history = JSON.parse(localStorage.getItem("urlHistory"));
			console.log("save url "+save_url_history);
			populateDataList(Object.keys(save_url_history));
		} else {
			//first time visit
			save_url_history = {}
		}
	}
}
function storeUrlHistoryInLocalStorage(){
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("urlHistory", JSON.stringify(save_url_history));
	}
}
function populateDataList(pUrls){
	var dataList = $("#urlDataList");
	dataList.empty();
	var urls = Object.keys(save_url_history);
	for(var i=0;i<urls.length;i++){
		var option = $("<option value='"+urls[i]+"'></option>");
		dataList.append(option);
	}		
}

function updateDataList(pUrl) {
	var option =$("<option value='"+pUrl+"'></option>");
	$("#urlDataList").append(option);
}

function addHeaderRow(pHeader,pValue){
	var ul = document.getElementById("list");
	var li = document.createElement('li');
	li.setAttribute("style", "margin-top:5px;");

	var div1 = document.createElement('div');
	div1.setAttribute("class", "col-sm-5");

	var div2 = document.createElement('div');
	div2.setAttribute("class", "col-sm-5");
	//create input box for header area
	var input1 = document.createElement('input');
	input1.setAttribute("type", "text");
	input1.setAttribute("name", k);
	input1.setAttribute("placeholder", "Header");
	input1.setAttribute("class", "headers form-control");
	if(pHeader){
		input1.setAttribute("value", pHeader);
	}
	//create input box for header value area
	var input2 = document.createElement('input');
	input2.setAttribute("type", "text");
	input2.setAttribute("name", "headersValue"+k);
	input2.setAttribute("placeholder", "Value");
	input2.setAttribute("class","form-control");
	if(pValue){
		input2.setAttribute("value", pValue);
	}
	//creat remove buttom for header
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
		removeHeaderRow(event);
	});
}
function removeHeaderRow(event){
	var parent;
	var superParent;
	parent = event.srcElement.parentElement;
	superParent = parent.parentElement;
	superParent.removeChild(parent);
}
function httpRequestAsync(pUrl, pMethod, pData, requestHeaders, pCallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            pCallback(xmlHttp);
        } else if(xmlHttp.status==404){
        	pCallback(xmlHttp);  
        } else if(xmlHttp.status==301){
        	pCallback(xmlHttp);  
        } else if(xmlHttp.status==400){
        	pCallback(xmlHttp);
        }
    }
    var url = window.location.href+'debug?reqUrl='+encodeURIComponent(pUrl) + '&reqMethod='+ pMethod +'&reqData='+pData+"&reqHeaders="+requestHeaders;
    xmlHttp.open('POST', url, true); // true for asynchronous 
    xmlHttp.send();
}
function makePOST_request(){
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
	save_RM(url, method, data, JSON.stringify(requestHeaders));
	httpRequestAsync(url, method, data, JSON.stringify(requestHeaders), resposeHandler);
}
function resposeHandler(response) {
	var textArea = document.getElementsByName('responseData');
	//console.log(document.responseText = response);
	textArea[0].value = response.responseText;
	document.getElementById("responseHeadersText").value=response.getAllResponseHeaders();

}
function eventListenerForUrlInputBox(event){
	if(event.keyCode == 13 || event.keyCode == 9){
		populateFormData( document.getElementById("urlArea").value);
		console.log("called");

	}
}
function populateFormData(pUrl){
	var formDataforSelectedUrl=save_url_history[pUrl];
	var form = document.forms['myForm'];
	form.elements['method'].value = formDataforSelectedUrl["method"];
	form.elements['requestData'].value = formDataforSelectedUrl["requestData"];
	var headers = JSON.parse(formDataforSelectedUrl["requestHeaders"]);
	var keys = Object.keys(headers);
	document.getElementById("list").innerHTML='';
	for(var  i=0; i<keys.length; i++) {
		addHeaderRow(keys[i], headers[keys[i]]);
	}

}
window.onload = function(){
	document.getElementById('submitButtom').addEventListener("click", function(event){
		event.preventDefault();
		makePOST_request();
	});
	
	document.getElementById("addHeaderButton").addEventListener("click", function(event){
		event.preventDefault();
		addHeaderRow();
	});
	document.getElementsByClassName("removeButton")[0].addEventListener("click", function(event){
		event.preventDefault();
		removeHeaderRow(event);
	});
	document.getElementById("urlArea").addEventListener('keyup',function(event){
		eventListenerForUrlInputBox(event);
	});
	document.getElementById("urlArea").addEventListener('keydown',function(event){
		eventListenerForUrlInputBox(event);
	});
	// document.getElementById('urlArea').addEventListener('click', function(event) {
	// 	console.log("click event logged");
	// 	if(save_url_history[document.getElementById("urlArea").value]){
	// 		populateFormData( document.getElementById("urlArea").value);
	// 	}
	// });
	console.log(JSON.stringify(navigator));
	getUrlHistoryFromLocalStorage();
}