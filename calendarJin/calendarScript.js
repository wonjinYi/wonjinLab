window.addEventListener('DOMContentLoaded', main);

function main(){
	
	const THEAD = document.getElementById("table_head");
	const TBODY = document.getElementById("table_body");
	const T_HEAD = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const T_SIZE = {'width' : T_HEAD.length, 'height' : 6};
	
	//사용가능한 년/월 미리 정하기
	const SELECT_YEAR = document.getElementById("select_year");
	const SELECT_MONTH = document.getElementById("select_month");
	const yearOption = range(1950, 2050);
	//const monthOption = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const monthOption = range(1,13);
	
	//초기 페이지 구성
		// --- 셀렉트 박스 옵션추가
	addOption(SELECT_YEAR, yearOption);
	addOption(SELECT_MONTH, monthOption);
		// --- 달력 그리기
	drawHeaderView(THEAD, T_HEAD, T_SIZE);
	drawBodyView(TBODY, T_HEAD, T_SIZE);
	
	
}


//요일 영역 그리기
function drawHeaderView(THEAD, T_HEAD, T_SIZE){
	let str = '';
	
	str += "<tr>";
	for(let i=0; i<T_SIZE['width']; i++){
		str += "<td>"+T_HEAD[i]+"</td>";
	}
	str += "</tr>"
	
	THEAD.innerHTML = str;
}

//날짜 영역 그리기
function drawBodyView(TBODY, T_HEAD, T_SIZE){
	let str = '';
	
	for(let i=0; i<T_SIZE['height']; i++){
		str += "<tr>";
		for(let k=0; k<T_SIZE['width']; k++){
			str += "<td>"+0+"</td>";
		}
		str += "</tr>";
	}
	
	TBODY.innerHTML = str;
}

// select 요소에 옵션을 추가
function addOption(target, arr){
	let str = '';
	
	for(let i=0; i<arr.length; i++){
		str += "<option value=\""+arr[i]+"\">"+arr[i]+"</option>";
	}
	
	target.innerHTML = str;
}

// 범위 안의 숫자를 요소로 하는 배열 반환. range(처음 숫자, 마지막숫자+1)
function range(start, end){
	let arr=[];
	for(let i=start; i<end; i++){
		arr.push(i);
	}
	
	return arr;
}