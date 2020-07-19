window.addEventListener('DOMContentLoaded', main);

async function main(){
	const TARGET={
		article : document.getElementById('jjoriping')
	};
	const SOURCE={
		submitted : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/2/public/full?alt=json',
		subject_type : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/3/public/full?alt=json'
	}
	const COLUMNS = ['제출자','과제유형','제목', '서비스url','메모'];
	
	const SUBMITTED_LIST = await makeArrayFromJson(SOURCE.submitted, COLUMNS);
	const SUBJECT_TYPE = await async function(url){
		const res = await fetch(url);
		
		let temp = await res.json();
		temp = temp['feed']['entry'];
	
		let _DATA = [];
		for(var i=0; i<Object.keys(temp).length; i++){
				_DATA[i] = temp[i]['gsx$유형']['$t'];
		}
		
		return _DATA; 
													}(SOURCE.subject_type)
	
	// -----------------------------------------------------------
	
	let str = '';
	for(let i=0; i<SUBJECT_TYPE.length; i++){
		str += makeHtmlString(SUBJECT_TYPE[i], SUBMITTED_LIST);
	}
	TARGET['article'].innerHTML = str;
	
	
}
function makeHtmlString(subjectType, arr){
	// html 구문 만들기
	let tmp = ''; // 해당 subjectType안에 리스트가 하나라도 있는지 확인하기 위한 초기문자열
	
	let str = '';
	str += '<div id="'+subjectType+'" class="type-container">'
	str += '<h2 class="type">'+subjectType+'</h2>';
	str += '<ul>';
	tmp = str;
	for(let i=0; i<arr.length; i++){
		if(arr[i]["과제유형"] == subjectType){
			str += 	'<li class="list">';
			str +=		'<a class="title" href="'+arr[i]['서비스url']+'" target="_blank">'+arr[i]['제목']+'</a>';
			str += 		' by '+arr[i]['제출자'];
			
			if(arr[i]['메모'] != ''){str += ' "'+arr[i]['메모']+'"';}
			str +=	'</li>';
		}
	}
	if(str == tmp){ return ''; } // 리스트 하나도없으면 과제유형 안보여줌
	
	str += '</ul>';
	str += '</div>';

	return str;
}
async function makeArrayFromJson(url, columns){

	const res = await fetch(url);
  	let temp = await res.json();
 	temp = temp['feed']['entry'];

	let _DATA = [];
	for(var i=0; i<Object.keys(temp).length; i++){
	
		_DATA[i]={};
		for(var k=0; k<Object.keys(columns).length; k++){
			_DATA[i][columns[k]] = temp[i]['gsx$'+columns[k]]['$t'];
		}
	}
	
	return _DATA;
}