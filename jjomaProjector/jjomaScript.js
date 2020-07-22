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
	
	console.log(SUBMITTED_LIST);
	console.log(ASSIGNMENT_TYPE);
	
	let data = {};
	
	//카테고리 구조화
	const ROOT_CATEGORY_SET = getRootCategory(ASSIGNMENT_TYPE, CATEGORY_KEY);
	for(let i=0; i<ROOT_CATEGORY_SET.length; i++){
		const subCategory = getSubCategory(ASSIGNMENT_TYPE, CATEGORY_KEY, ROOT_CATEGORY_SET[i]);
		categorizeItems(data, SUBMITTED_LIST, CATEGORY_KEY, ROOT_CATEGORY_SET[i], subCategory);
	}
	
	//html스트링 만들기
	for(let i=0; i<ROOT_CATEGORY_SET.length; i++){
		makeHtmlString( ROOT_CATEGORY_SET[i] , (data[ROOT_CATEGORY_SET[i]]) );
	}
	
	console.log(data);
	//TARGET['article'].innerHTML = str;
	
	
}


function makeHtmlString(mainCategory, assignment){
	let subCategoryLength = (Object.keys(assignment)).length
	// html 구문 만들기
	let tmp = ''; // 해당 subjectType안에 리스트가 하나라도 있는지 확인하기 위한 초기문자열
	
	let str = '';
	str += 	'<div id="'+mainCategory+'" class="type-container">'
	str += 		'<h2 class="type">'+mainCategory+'</h2>';
	tmp = str;
	
	for(let i=0; i<subCategoryLength; i++){
		if(subCategoryLength!=1){
			str += '<a class="subTitle">'+assignment
		}
		str += 		'<ul>';
	
	
	
	
	str += 		'</ul>';
	}
	
	str += 		'</div>';

	return str;
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
		data[ mainCategory ][ subCategory[i].categoryName ] = {
			description : subCategory[i].description,
			items : []
		};
	}
	
	// 각 서브카테고리에 해당하는 row를, item속성에 넣어주기
	for(let i=0; i<source.length; i++){
		for(let k=0; k<subCategory.length; k++){
			if(source[i][CATEGORY_KEY.sub] == subCategory[k].categoryName ){
				( (data[ mainCategory ][ subCategory[k].categoryName ]).items ).push( source[i] );
				break;
			}
			
		}
	}
	
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
	
	return tmp;
}

function getSubCategory(category, CATEGORY_KEY, mainCategoryValue){
	let subCategory = [];
	
	for(let i=0; i<category.length; i++){
		if(category[i][CATEGORY_KEY.main] == mainCategoryValue){
			subCategory.push({ categoryName : category[i][CATEGORY_KEY.sub], description : category[i]['설명'] });
		}
	}
	
	if(subCategory==""){ return null; }
	else { return subCategory; }
}