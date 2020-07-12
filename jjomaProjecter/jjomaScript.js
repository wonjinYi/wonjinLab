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
				//_DATA[i][columns[k]] = temp['feed']['entry'][i]['gsx$'+columns[k]]['$t'];
		}
		
		return _DATA; 
													}(SOURCE.subject_type)
	
	console.log(SUBJECT_TYPE);
	
	let str = '';
	for(let i=0; i<SUBJECT_TYPE.length; i++){
		str += makeHtmlString(SUBJECT_TYPE[i], SUBMITTED_LIST);
	}
	TARGET['article'].innerHTML = str;
	
	
}
function makeHtmlString(subjectType, arr){
	let str = '';
	str += '<div id="'+subjectType+'" class="type-container">'
	str += '<h2 class="type">'+subjectType+'</h2>';
	str += '<ul>';
	for(let i=0; i<arr.length; i++){
		if(arr[i]["과제유형"] == subjectType){
			str += 	'<li class="list">';
			str +=		'<a class="title" href="'+arr[i]['서비스url']+'" target="_blank">'+arr[i]['제목']+'</a>';
			str += 		' by '+arr[i]['제출자']+' " '+arr[i]['메모']+' "';
			str +=	'</li>';
		}
	}
	str += '</ul>';
	str += '</div>';
	return str;
}
async function makeArrayFromJson(url, columns){

	const res = await fetch(url);
  	let temp = await res.json();
 	temp = temp['feed']['entry'];
	console.log(temp);

	let _DATA = [];
	for(var i=0; i<Object.keys(temp).length; i++){
	
		_DATA[i]={};
		for(var k=0; k<Object.keys(columns).length; k++){
			_DATA[i][columns[k]] = temp[i]['gsx$'+columns[k]]['$t'];
			//_DATA[i][columns[k]] = temp['feed']['entry'][i]['gsx$'+columns[k]]['$t'];
		}
	}
	console.log(_DATA);
	//console.log(_DATA[1]['제출자']["$t"]);
	
	return _DATA;
}