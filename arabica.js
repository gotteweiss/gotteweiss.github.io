window.onload = function(){
    const RENDER_URL = 'https://render-arabica-roj6lv6npq-lz.a.run.app/text-to-svg/';
    //const RENDER_URL = 'http://localhost:3000/text-to-svg/';
    
    var phoneticResultDiv = document.getElementById('phonetic-result');
    var resultDiv = document.getElementById('result');
    var resultArDiv = document.getElementById('result-ar');
    var sourceText = '';
    var arabicText = '';
    var sourceArText = '';
    var cyrillicText = '';

    var sourceTextArea = document.getElementById('source-text');
    var sourceArTextArea = document.getElementById('source-text-ar');


    var updateText = function(){
	sourceText = sourceTextArea.value;
	sourceText = sourceText.replace(/i/i, 'і');
	
	var p = cyrillicToPhonetic(sourceText);
	arabicText = phoneticToArabic(p);
	resultDiv.innerHTML = arabicText;
	    
	sourceArText = sourceArTextArea.value;
	cyrillicText = arabicToPhonetic(sourceArText);
	resultArDiv.innerHTML = cyrillicText;
    };
    
    sourceTextArea.onkeyup = updateText;
    sourceTextArea.onfocus = function(){
	sourceTextArea.select();
    };
	
    sourceArTextArea.onkeyup = updateText;
    sourceArTextArea.onfocus = function(){
	sourceArTextArea.select();
    };

    resultDiv.onclick = function(){
	var range = document.createRange();
	range.setStart(resultDiv, 0);
	range.setEnd(resultDiv, 1); 	
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
    };
	
    resultArDiv.onclick = function(){
	var range = document.createRange();
	range.setStart(resultArDiv, 0);
	range.setEnd(resultArDiv, 1); 	
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
    };

    document.getElementById('btn-copy').onclick = function(){
	navigator.clipboard.writeText(arabicText);
    };
	
    document.getElementById('btn-copy-ar').onclick = function(){
	navigator.clipboard.writeText(cyrillicText);
    };
    
    updateText();

    function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
    }
    
    async function downloadSVG(){
	const form = document.createElement("form");
	form.style['display'] = 'none';

	const txt = document.createElement("textarea"); 
	txt.name = 'text';
	txt.value = arabicText;

	const fname = document.createElement("input"); 
	fname.name = 'filename';
	fname.value = sourceText.substring(0,16);
	
	form.method = "POST";
	form.action = RENDER_URL;
	form.appendChild(txt);
	form.appendChild(fname);

	document.body.appendChild(form);
	
	form.submit();
    }
    document.getElementById('btn-download-svg').onclick = downloadSVG;

};

