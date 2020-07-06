window.addEventListener('DOMContentLoaded', main);


function main(){
	const TARGET = {	'year' 		: document.getElementById("select_year")
					, 	'month'		: document.getElementById("select_month")
					,	't_header' 	: document.getElementById("table_head")
					,	't_content'	: document.getElementById("table_body") };
		
	const T_HEAD_SET = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const T_SIZE = {'width' : T_HEAD_SET.length, 'height' : 6};
	
	
	/*
	const TARGET = {	'year' 		: document.getElementById("select_year")
					, 	'month'		: document.getElementById("select_month") 
				   	,	't_content'	: document.getElementById("table_body") 	};
	*/
	//const SELECTED_YEAR = TARGET['year'].options[TARGET['year'].selectedIndex].value
	//const SELECTED_MONTH = TARGET['month'].options[TARGET['month'].selectedIndex].value
	const DAY_SET = {'common'	:[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
					,'leaf'		:[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] };
	const BASE_SET = {'startPoint':5, 'year':1583}; //날짜 계산을 용이하게 하기 위한 '기준 년도의 1월1일의 <요일>' 을 사전정의함
													//기준년도(year)는 1583년도이고, 1583년의 1월1일은 토요일(startPoint)임
	//const T_SIZE = {'width' : 7, 'height' : 6};
	
	
	//사용가능한 년/월 미리 정하기
	const YEAR_OPTION = range(1950, 2050);
	const MONTH_OPTION = range(1,13);
	
	//초기 페이지 구성
		// --- 셀렉트 박스 옵션추가
	addOption(TARGET['year'], YEAR_OPTION);
	addOption(TARGET['month'], MONTH_OPTION);
		// --- 달력 헤더(요일부분) 그리기
	drawHeaderView(TARGET['t_header'], T_HEAD_SET, T_SIZE);
		// --- 달력 컨텐츠(날짜부분) 그리기
	setOptionSelectedTrue(TARGET['year'],"2020");
	setOptionSelectedTrue(TARGET['month'], "1");
	drawBodyView(TARGET, DAY_SET, BASE_SET, T_SIZE);
	
	//년도,월 SELECT BOX 이벤트리스너 등록
	TARGET['year'].addEventListener('change', function(e){
		drawBodyView(TARGET, DAY_SET, BASE_SET, T_SIZE);
	});
	TARGET['month'].addEventListener('change', function(e){
		drawBodyView(TARGET, DAY_SET, BASE_SET, T_SIZE);
	});
	
}

//요일 영역 그리기 (테이블 헤더 영역)
function drawHeaderView(target, T_HEAD_SET, T_SIZE){
	let str = '';
	
	str += "<tr>";
	for(let i=0; i<T_SIZE['width']; i++){
		str += "<td>"+T_HEAD_SET[i]+"</td>";
	}
	str += "</tr>"
	
	target.innerHTML = str;
}

//날짜 영역 그리기 (테이블 컨텐츠 영역))
function drawBodyView(TARGET, DAY_SET, BASE_SET, T_SIZE){
	const SELECTED_YEAR = TARGET['year'].options[TARGET['year'].selectedIndex].value
	const SELECTED_MONTH = TARGET['month'].options[TARGET['month'].selectedIndex].value

	let str = '';
	const tableValue = getCalendarValue(SELECTED_YEAR, SELECTED_MONTH, BASE_SET, DAY_SET, T_SIZE);

	for(let i=0; i<T_SIZE['height']; i++){
		str += "<tr>";
		for(let k=0; k<T_SIZE['width']; k++){
			if(tableValue[i][k]==0){
				str += "<td></td>";
			}
			else{
				str += "<td>"+tableValue[i][k]+"</td>";
			}
				
			
		}
		str += "</tr>";
	}
	
	TARGET['t_content'].innerHTML = str;
}

//해당 년+월의 달력의 형태를 모두 계산하여 반환
function getCalendarValue(YEAR, MONTH, BASE_SET, DAY_SET, T_SIZE){
	let yearType = 'common';
	let startPoint = 0;
	
	
	// yearType 결정 : 현재 선택된 YEAR가 윤년(leaf)인지 평년(common)인지?
	if		(YEAR%400 == 0)	{ yearType = 'leaf'; }
	else if	(YEAR%100 == 0)	{ yearType = 'common'; }
	else if	(YEAR%4 == 0)	{ yearType = 'leaf'; }
	else 					{ yearType = 'common'; }
	
	
	// 선택한 년도 1월 1일의 요일(시작요일)을 결정   					 0:월, 1:화, 2:수, 3:목, 4:금, 5:토, 6:일
	let numYear = YEAR - BASE_SET['year'] + 1;
	let numLeafyear = ( parseInt((YEAR-1)/4) - parseInt((YEAR-1)/100) + parseInt((YEAR-1)/400) ) // '선택된 년도까지의 윤년 수' 에서
						- ( parseInt((BASE_SET['year']-2)/4) - parseInt((BASE_SET['year']-1)/100) + parseInt((BASE_SET['year']-1)/400) ); // '기준년도 까지의 윤년 수' 빼기
	let numCommonyear = numYear - numLeafyear;
	
	let startPoint_ofJanFirst = (BASE_SET['startPoint'] + (( numCommonyear + numLeafyear*2 ) % 7)) % 7
		
	// 선택된 년도 + 선택한 월의 시작요일 결정
	let temp = 0;
	for(let i=0; i<MONTH-1; i++){
		temp += DAY_SET[yearType][i];
	}
	startPoint = ( startPoint_ofJanFirst + temp - 1 ) % 7;
	
	// 테이블에 표시할 배열 담기
	let tableValue = [];
	temp = [];
	
	for(let i=0; i<T_SIZE['height']; i++){
		temp = []
		for(let k=0; k<T_SIZE['width']; k++){
			if( ( (i*7)+k-startPoint >= 0 ) && ( (i*7)+k-startPoint < DAY_SET[yearType][MONTH-1] )  ){
				temp[k] = (i*7)+k-startPoint + 1 ;
			}
			else{
				temp[k] = 0;
			}
		}
		tableValue.push(temp);
	}

	return tableValue;
}

// select 요소에 옵션을 추가
function addOption(target, arr){
	let str = '';
	
	for(let i=0; i<arr.length; i++){
		str += "<option value=\""+arr[i]+"\">"+arr[i]+"</option>";
	}
	
	target.innerHTML = str;
}

// select 요소에서, 특정value를 가진 option요소에 대하여 selected=true 함
function setOptionSelectedTrue(element, target){
	for(let i=0; i<element.options.length; i++){
		if(element.options[i].value==target){
		  	element.options[i].selected = "selected";
			return 0;
		}
	}
}

// 범위 안의 숫자를 요소로 하는 배열 반환. range(처음 숫자, 마지막숫자+1)
function range(start, end){
	let arr=[];
	for(let i=start; i<end; i++){
		arr.push(i);
	}
	
	return arr;
}

