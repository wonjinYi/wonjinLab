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
		submitted : ['제출자', '큰유형', '작은유형', '제목', '서비스url','메모'],
		assignment_type : ['큰유형', '작은유형', '설명']
	};
	
	const CATEGORY_KEY = {
		main : "큰유형",
		sub : "작은유형"
	};
	
	const SUBMITTED_LIST = await separateRowFromJson(SOURCE.submitted, COLUMNS.submitted);
	const ASSIGNMENT_TYPE = await separateRowFromJson(SOURCE.assignment_type, COLUMNS.assignment_type);
	
	let data = [];
	
	console.log(SUBMITTED_LIST);
	console.log(ASSIGNMENT_TYPE);
	
	let tmp = getSubCategory(ASSIGNMENT_TYPE, CATEGORY_KEY, "스네이크");
	console.log(tmp);
	
	let str = '';
	for(let i=0; i<ASSIGNMENT_TYPE.length; i++){
		//str += makeStructuerdString(ASSIGNMENT_TYPE[i], SUBMITTED_LIST[i]);
	}
	
	const ROOT_CATEGORY_SET = getRootCategory(ASSIGNMENT_TYPE, CATEGORY_KEY);
	for(let i=0; i<ROOT_CATEGORY_SET.length; i++){
		
		const subCategory = getSubCategory(ASSIGNMENT_TYPE, CATEGORY_KEY, ROOT_CATEGORY_SET[i]);
		categorizeItems(data, SUBMITTED_LIST, CATEGORY_KEY, ROOT_CATEGORY_SET[i], subCategory);
	}
	
	console.log(data);
	//TARGET['article'].innerHTML = str;
	
	
}

/*
data = {
	main : {
		sub : {
			assignment : " string ",
			items : [row, row, row, ... , row]
		}
		sub : {
			assignment : " string ",
			items : [row, row, row, ... , row]
		}
	}
}

data.main.sub.item
예시 ) data.스네이크.게임.item -> 스네이크-게임 카테고리에 속하는 모든 row리턴.
*/

function categorizeItems(data, source, CATEGORY_KEY, mainCategory, subCategory  ){
	data[mainCategory] = {};
	
	// _data[] 객체에 서브카테고리 속성 추가
	for(let i=0; i<subCategory.length; i++){
		data[ mainCategory ][ subCategory[i] ] = {
			items : []
		};
	}
	
	//console.log(data[mainCategory]);
	
	// 각 서브카테고리에 해당하는 row를, item속성에 넣어주기
	for(let i=0; i<source.length; i++){
		//console.log("test : "+i);
		for(let k=0; k<subCategory.length; k++){
			
			if(source[i][CATEGORY_KEY.sub] == subCategory[k]){
				( (data[ mainCategory ][ subCategory[k] ]).items ).push( source[i] );
				break;
			}
			
		}
	}
	
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

async function separateRowFromJson(url, columns){

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

function getRootCategory(source, CATEGORY_KEY){
	let tmp = [];
	for(let i=0; i<source.length; i++ ){
		tmp.push(source[i][CATEGORY_KEY.main]);
	}
	
	tmp = Array.from(new Set(tmp));
	console.log("=====getroot : "+tmp);
	return tmp;
}

function getSubCategory(category, CATEGORY_KEY, mainCategoryValue){
	let subCategory = [];
	
	for(let i=0; i<category.length; i++){
		
		if(category[i][CATEGORY_KEY.main] == mainCategoryValue){
			subCategory.push(category[i][CATEGORY_KEY.sub]);
		}
	}
	
	if(subCategory==""){ return null; }
	else { return subCategory; }
}