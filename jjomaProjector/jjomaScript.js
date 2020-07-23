// 2020. 07. 23.(목) - 회사 프로젝트의 끝을 달려가는 날.
// 살면서 짠 코드중에 가장 마음에 안드는 코드이다.
// 중학교 3학년에 짠 플래시 스크립트가 이것보단 잘짰을거다.

// 더 공부해서 이 창피한 코드를 멋지게 개선하는 사람이 되자

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
	let str = '';
	for(let i=0; i<ROOT_CATEGORY_SET.length; i++){
		const subCategory = getSubCategory(ASSIGNMENT_TYPE, CATEGORY_KEY, ROOT_CATEGORY_SET[i]);
		str += makeHtmlString( (data[ROOT_CATEGORY_SET[i]]), ROOT_CATEGORY_SET[i], subCategory );
	}
	
	console.log(data);
	TARGET['article'].innerHTML = str;
	
	
}


function makeHtmlString(assignment, mainCategory, subCategory){
	// html 구문 만들기
	let tmp = ''; // 해당 subjectType안에 리스트가 하나라도 있는지 확인하기 위한 초기문자열
	
	let str = '';
	str += 	'<div id="'+mainCategory+'" class="main-container">'
	str += 		'<h2 class="main-category">'+mainCategory+'</h2>';
	tmp = str;
	
	for(let i=0; i<subCategory.length; i++){
		if(subCategory.length != 1){
			str += 	'<div class="sub-container">';
			//str += 		'<hr>'
			str += 		'<a class="sub-category">'+subCategory[i].categoryName+'</a>'
			//str += 		'<hr>'
			str += 	'</div>';
		}
		
		
		let _items = (assignment[subCategory[i].categoryName]).items ;
		str += 		'<ul>';
		for(let k=0; k < _items.length; k++ ){
			str += '<li class="item-list">';
			str +=		'<a class="title" href="'+_items[k]['서비스url']+'" target="_blank">'+_items[k]['제목']+'</a>';
			str += 		' by '+_items[k]['제출자'];
			
			if(_items[k]['메모'] != ''){str += ' "'+_items[k]['메모']+'"';}
			str +=	'</li>';
		}
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