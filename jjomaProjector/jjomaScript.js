window.addEventListener('DOMContentLoaded', main);

async function main(){
	const TARGET={
		article : document.getElementById('jjoriping')
	};
	const SOURCE={
		submitted : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/2/public/full?alt=json',
		assignment_type : 'https://spreadsheets.google.com/feeds/list/1ZPg6mfEvkzk-8fBvSTfLzNr5CuD5XT9HP2X6FmXbgTU/3/public/full?alt=json'
	};
	const COLUMNS = {
		submitted : ['제출자', '과제순서', '큰유형', '작은유형', '제목', '서비스url','메모'],
		assignment_type : ['큰유형', '작은유형', '설명']
	};
	
	const SUBMITTED_LIST = await makeArrayFromJson(SOURCE.submitted, COLUMNS.submitted);
	const ASSIGNMENT_TYPE = await makeArrayFromJson(SOURCE.assignment_type, COLUMNS.assignment_type);
	/*
	const SUBJECT_TYPE = await async function(url){
		const res = await fetch(url);
		
		let temp = await res.json();
		temp = temp['feed']['entry'];

		let _DATA = [];
		for(var i=0; i<Object.keys(temp).length; i++){
				_DATA[i] = temp[i]['gsx$큰유형']['$t'];
		}
		
		return _DATA; 
													}(SOURCE.subject_type)
	*/
	// -----------------------------------------------------------
	
	//nsole.log(ASSIGNMENT_TYPE);
	
	// 지금 당장 출력을 위해서만 사용. 곧 사라져야됨.
	let tempAssignType = [];
	for(let i=0; i<ASSIGNMENT_TYPE.length; i++){
		tempAssignType.push(ASSIGNMENT_TYPE[i]["큰유형"]);
	}
	tempAssignType = Array.from( new Set(tempAssignType) );
	console.log(tempAssignType);
	let str = '';
	for(let i=0; i<tempAssignType.length; i++){
		str += makeStructuerdString(tempAssignType[i], SUBMITTED_LIST);
	}
	
	/*
	let str = '';
	for(let i=0; i<ASSIGNMENT_TYPE.length; i++){
		str += makeStructuerdString(ASSIGNMENT_TYPE[i], SUBMITTED_LIST[i]);
	}
	*/
	
	TARGET['article'].innerHTML = str;
	
	
}


function makeStructuerdString(category, arr){
	// html 구문 만들기
	let tmp = ''; // 해당 subjectType안에 리스트가 하나라도 있는지 확인하기 위한 초기문자열
	
	//임시로 사용.
	let subjectType = category;
	console.log(subjectType);
	console.log(arr);
	
	let str = '';
	str += 	'<div id="'+subjectType+'" class="type-container">'
	str += 		'<h2 class="type">'+subjectType+'</h2>';
	str += 		'<ul>';
	tmp = str;
	for(let i=0; i<arr.length; i++){
		if(arr[i]["큰유형"] == subjectType){
			str += 	'<li class="list">';
			str +=		'<a class="title" href="'+arr[i]['서비스url']+'" target="_blank">'+arr[i]['제목']+'</a>';
			str += 		' by '+arr[i]['제출자'];
			
			if(arr[i]['메모'] != ''){str += ' "'+arr[i]['메모']+'"';}
			str +=	'</li>';
		}
	}
	if(str == tmp){ return ''; } // 해당 과제유형에 제출된과제 하나도없으면 과제유형 안보여줌
	
	str += 		'</ul>';
	str += 		'</div>';

	return str;
}

async function makeArrayFromJson(url, columns){

	const res = await fetch(url);
  	let temp = await res.json();
 	temp = temp['feed']['entry'];

	let _DATA = [];
	for(var i=0; i<Object.keys(temp).length; i++){
	
		_DATA[i]={};
		for(var k=0; k<Object.keys(columns).length; k++){;
			_DATA[i][columns[k]] = temp[i]['gsx$'+columns[k]]['$t'];
		}
	}
	//nsole.log(_DATA);
	return _DATA;
}