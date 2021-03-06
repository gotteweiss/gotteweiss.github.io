var vowels = new Set(['а', 'е', 'ё', 'і', 'о', 'у', 'ы', 'э', 'ю', 'я']);
var isVowel = (c) => vowels.has(c);

var iota = new Set(['е', 'ё', 'і', 'ю', 'я']);
var isIota = (c) => iota.has(c);

iotaToRegular = {'е' : 'э' , 'ё' : 'о' , 'і' : 'і' , 'ю' : 'у', 'я' : 'а'};

var consonants = new Set(['б','в','г','д','ж','з','й','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш']);
var isConsonant = (c) => consonants.has(c);

var isSemivowel = (c) => c == 'ў';

function isWord(c) {
    return isVowel(c) || isConsonant(c) || c == '\'' || c == 'ь' || c == 'ў';
}

function isSoft(s, i) {
    if (i >= s.length - 1 || !isWord(s[i+1]) || !isConsonant(s[i]))
	return false;
    var next = s[i+1];
    return next == 'ь' || isIota(next) ||
	(s[i] == 'д' && next == 'з' && isSoft(s, i+1)) ||
	((s[i]=='с' || s[i] == 'з') && next != 'г' && next != 'к' && next != 'х' && isSoft(s, i+1)) ||
	(s[i] == 'ц' && next == 'в' && isSoft(s, i+1)) ||
	(s[i] == 'д' && next == 'з' && i + 2 < s.length && s[i+2] == 'в' && isSoft(s, i+2));
    
}

function testIsSoft(){
    console.assert(isSoft('ціш', 0));
    console.assert(!isSoft('ціш', 2));
    console.assert(isSoft('лета', 0));
    console.assert(!isSoft('лета', 2));
    console.assert(!isSoft('лета', 3));
    console.assert(isSoft('дзень', 3));
    console.assert(isSoft('пень', 2));
    console.assert(isSoft('дзень', 0));
    console.assert(isSoft('змесці', 0));
    console.assert(isSoft('сцерці', 0));
    console.assert(!isSoft('скінуць', 0));
    console.assert(isSoft('дзверы', 0));
    console.assert(isSoft('цвёрды', 0));
    console.assert(!isSoft('цвёрды', 3));
}

//testIsSoft();

function getNext(s, i) {
    if (i + 1 < s.length && isWord(s[i+1]))
	return s[i+1];
    else return null;
}
function getNextNext(s, i) {
    if (i + 2 < s.length && isWord(s[i+1]) && isWord(s[i+2]))
	return s[i+2];
    else return null;
}

function isDouble(s, i) {
    if (!isConsonant(s[i]))
	return false;
    var next = getNext(s,i);
    if (next == null)
	return;
    return next == s[i];
}

function testIsDouble() {
    console.assert(isDouble('збожжа', 3));
}

testIsDouble();

function cyrillicToPhonetic(s) {
    var result = [];
    var s = s.toLowerCase();
    for (var i=0; i < s.length; i++){
	if (!isWord(s[i])) {
	    result[result.length] = s[i];
	    continue;
	}
	if (isVowel(s[i]) || isSemivowel(s[i])) {
	    if (isIota(s[i])) {
		if (s[i] != 'i' && (i == 0 || !isWord(s[i-1]) || !isConsonant(s[i-1])))
		    result[result.length] = 'й';
		result[result.length] = iotaToRegular[s[i]];
	    }
	    else
		result[result.length] = s[i];
	} else if (isConsonant(s[i])) {
	    var ph;
	    var dz = s[i] == 'д' && getNext(s,i) == 'з';
	    var ddz = s[i] == 'д' && getNext(s,i) == 'д' && getNextNext(s,i) == 'з';
	    var dzh = s[i] == 'д' && getNext(s,i) == 'ж';
	    if (dz || dzh) {
		ph = s[i] + s[i+1];
	    } else if (ddz) {
		ph = s[i+1] + s[i+2]  ;
	    } else {
		ph = s[i];
	    }
	    if (isSoft(s, i))
		ph += '\'';
	    if (isDouble(s,i)) {
		ph += '~';
		i += 1;
	    }
	    if (dz||dzh)
		i += 1;
	    result[result.length] = ph;
	} 
	
    }
    return result;
}



var p2a = {
    'а' : 'اَ',
    'б' : 'ب',
    'б\'' : 'اب',
    'в' : 'و',
    'в\'' : 'او',
    'г' : 'ه', //TODO: Ґ
    'г\'' : 'اه',
    'д' : 'د',
    'дж': 'ج',
    'дз': 'ࢮ', //TODO: праверыць
    'дз\'': 'اࢮ',    
    'ж' : 'ژ',
    'з' : 'ض',
    'з\'': 'ز',
    'і' : '\u0650',
    'й' : 'ي',    
    'к' : 'ق',
    'к\'': 'ك',        
    'л' : 'ل',
    'л\'' : 'ال',
    'м' : 'م',
    'м\'' : 'ام',
    'н' : 'ن',
    'н\'' : 'ان',
    'о' : 'وَ',
    'п' : 'پ',
    'п\'' : 'اپ',
    'р' : 'ر',
    'с' : 'ص',
    'с\'' : 'ث',    
    'т' : 'ط',
    'т\'': 'ت', //TODO: wtf?
    'у' : '\u064F',
    'ў' : 'و',
    'ф' : 'ف',
    'ф\'' : 'اف',
    'х' : 'ح',
    'х\'' : 'اح',
    'ц' : 'ࢯ', 
    'ц\'': 'اࢯ',
    'ч' : 'چ',
    'ш' : 'ش',
    'ы' : '\u0650',
    'э' : '\u064E',
};

var a2p = {
	'\u064E' : 'а', // Фатха
    'ب' : 'б',
    'و' : 'в',
    'ه' : 'г',
    'د' : 'д',
    'ج' : 'дж',
    'ࢮ' : 'дз',
    'ژ' : 'ж',
    'ض' : 'з',
    'ز' : 'зь',
    '\u0650' : 'і', // Кесра
    'ي' : 'й',    
    'ق' : 'к',
    'ك' : 'кь',        
    'ل' : 'л',
    'م' : 'м',
    'ن' : 'н',
    'پ' : 'п',
    'ر' : 'р',
    'ص' : 'с',
    'ث' : 'сь',    
    'ط' : 'т',
    'ت' : 'ть', //TODO: wtf?
    '\u064F' : 'у', // Дамма
    'ف' : 'ф',
    'ح' : 'х',
    'ࢯ' : 'ц', 
    'چ' : 'ч',
    'ش' : 'ш',
    '\u0627' : '', // Аліф
    '\u0652' : '', //Сукун
    '\u0651' : '2', // Шадда, пазначае падваенне
};

var punct2a = {
    ',' : '\u060C',
    '?' : '\u061F',
};

var a2punct = {
    '\u060C' : ',',
    '\u061F' : '?',
};

function isWordLetter(s){
    return s in mapping;
}


function phoneticToArabic(phoneticText){
    // TOTO: кантэкстуальныя формы
    var result = '';
  
    for (var i=0; i<phoneticText.length; i++){
	var p = phoneticText[i], dbl=false;
	if (p[p.length-1] == '~') {
	    p = p.substring(0, p.length-1);
	    dbl = true;
	}
	if (((i==0 || !isWord(phoneticText[i-1][0]))&&(   isVowel(phoneticText[i][0])
						      &&(    (phoneticText[i][0].toLowerCase() != 'а') 
							  && (phoneticText[i][0].toLowerCase() != 'о'))))){
	    result += '\u0627'; // Аліф, калі галосная на пачатку слова
	}
	if (p in p2a) {
	    result += p2a[p];
	    if (dbl)
		result += '\u0651'; // Шадда, пазначае падваенне
	    if ((isConsonant(phoneticText[i][0]) || isSemivowel(phoneticText[i][0])) &&
		(i == phoneticText.length - 1 || !isWord(phoneticText[i+1][0]) || isConsonant(phoneticText[i+1][0]) || isSemivowel(phoneticText[i+1][0]))) {
		result += '\u0652'; //Сукун, адсутнасць галоснага
	    }
	} else if (p in punct2a){
	    result += punct2a[p];  
	} else {
	    result += p;
	}
    }
    return result;
}

function arabicToPhonetic(arabicSourceText){
	var result = '';
	
	for (var i=0; i<arabicSourceText.length; i++){
	    var a = arabicSourceText[i];
		
		if (a in a2p) {
			result += a2p[a];
		}
		else if (a in a2punct){
			result += a2punct[a];
		} else {
			result += a;		 
		}
	}
	return result;
}

function cyrillicToArabic(s) {
    return phoneticToArabic(cyrillicToPhonetic(s));
}
