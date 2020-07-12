window.addEventListener('DOMContentLoaded', main);

async function main(){
	
	//let DATA=[];
	const SOURCE={
		submitted : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/2/public/full?alt=json',
		subject_type : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/3/public/full?alt=json'
	}
	const COL = ['제출자','과제유형','서비스url'];
	
	const SUBMITTED_LIST = await makeArrayFromJson(SOURCE.submitted, COL);
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
	
}
async function makeHtmlString(subjectType, arr){
	let str = '';
	str += '<div id="'+subjectType+'">'
	str += '<h1 class="title">'+subjectType+'<h1>';
	str += '<ul>';
	for(let i=0; i<arr.length; i++){
		str += '<li>'+arr[i]['$t']+'</li>';
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