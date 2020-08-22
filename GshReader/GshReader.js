window.addEventListener('DOMContentLoaded', main);

async function main(){
	const TARGET={
		name : document.getElementsByClassName('name'),
		region : document.getElementsByClassName('region'),
		phone : document.getElementsByClassName('phone')
	};
	const SOURCE = 'https://spreadsheets.google.com/feeds/list/1R5i8g6SfcDbvuEQ8v_zkAQFfCAVZjmr8ajTlDJB_mmQ/1/public/full?alt=json';
	const COLUMNS = ['이름', '지역', '전화번호'];
	
	const DATA = await separateRowFromJson(SOURCE, COLUMNS);

	for(let i=0; i<DATA.length; i++){
		TARGET['name'][i].textContent = DATA[i]['이름'];
		TARGET['region'][i].textContent = DATA[i]['지역'];
		TARGET['phone'][i].textContent = DATA[i]['전화번호'];
	}
}

async function separateRowFromJson(SOURCE, COLUMNS){
	const FETCHED_SOURCE = await fetch(SOURCE);
  	let temp = await FETCHED_SOURCE.json();
 	temp = temp['feed']['entry'];

	let _DATA = [];
	for(var i=0; i<Object.keys(temp).length; i++){
		_DATA[i]={};
		for(var k=0; k<Object.keys(COLUMNS).length; k++){;
			_DATA[i][COLUMNS[k]] = temp[i]['gsx$'+COLUMNS[k]]['$t'];
		}
	}
	
	return _DATA;
}
