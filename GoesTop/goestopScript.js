window.addEventListener('DOMContentLoaded', main);

const CARDS = [	"1_G", "1_T", "1_P1", "1_P2",
				"2_Y", "2_T", "2_P1", "2_P2",
				"3_G", "3_T", "3_P1", "3_P2",
				"4_Y", "4_T", "4_P1", "4_P2",
				"5_Y", "5_T", "5_P1", "5_P2",
				"6_Y", "6_T", "6_P1", "6_P2",
				"7_Y", "7_T", "7_P1", "7_P2",
				"8_G", "8_Y", "8_P1", "8_P2",
				"9_Y", "9_T", "9_P1", "9_P2",
				"10_Y", "10_T", "10_P1", "10_P2",
				"11_G", "11_PP", "11_P1", "11_P2",
				"12_G", "12_Y", "12_T", "12_PP",
				"X_PP1", "X_PP2", "X_PPP" ];


function main(){
	const TARGET = {
		body : document.getElementsByTagName('body'),
		card_container : document.getElementById('card-container')
	};
	let drawNum = 10;
	
	let myCards = {
		G : [],
		Y : [],
		T : [],
		P : []
	}
	
	organizeCards(myCards, drawCard(drawNum), TARGET);
	updateCardContainer(myCards);
	
	//temp button for test -------------------------------------
	document.getElementById('temp-btn').addEventListener('click',(e)=>{
		drawNum = parseInt(document.getElementById('temp-input').value);
		console.log(drawNum);
		for(let key in myCards){myCards[key] = [];}
		organizeCards(myCards, drawCard(drawNum), TARGET);
		
		updateCardContainer(myCards);
		console.log(myCards);
	});
		//console.log(myCards);
	//temp button for test -------------------------------------
	

}


function organizeCards(myCards, drawn, TARGET){
	//classitication 
	for(let i=0; i<drawn.length; i++){
		for(let key in myCards){
			if(drawn[i].includes(key)){
				myCards[key].push(drawn[i]);
				break;
			}
		}
		
	}
}

function updateCardContainer(myCards){
	//make HTML elements by classified cards ( "myCards" Object )
	const LINE_BREAK_NUM = 10
	const OVERLAP_SPACE = {horizon:30, vertical:40};
	
	for(let key in myCards){
		
		let str = '';
		for(let i=0; i<myCards[key].length; i++){
			const rest = i%LINE_BREAK_NUM;
			
			if(rest == 0){str += '<div class="cards-line">';}
			
			str += '<img src="card_img/'+myCards[key][i]+'.png" ';
			str += 		'class="card" ';
			str +=		'style="left:-'+(OVERLAP_SPACE.horizon* (i%LINE_BREAK_NUM) )+'px;';
			str +=				'position:relative;';
			str +=		'"';
			str += '>';
			
			if(rest == 9){str += '</div>';}
			else if (i==myCards[key].lenth-1){str += '</div>';}
			/*	
			0	1	2	3	4	5	6	7	8	9
			10	11	12	13	14	15	16	17	18	19
			20	21	22	23	24	25	26	27	28	29
			*/
			
		}
		
		
		// If there are cards in current Class(key), update the Element.
		if(str!=''){
			let _marginRight = 0;
			
			// set negative margin of .cards class.
			// If there were line breaking, these margin is max value ( = LINE_BREAK_NUM * OVERLAP_SPACE )
			// BUT, there were not that, margin is determined by the number of element(card)
			if(myCards[key].length >= LINE_BREAK_NUM){_marginRight = (-1) * LINE_BREAK_NUM * OVERLAP_SPACE.horizon;}
			else {_marginRight = (-1) * ( (myCards[key].length)%LINE_BREAK_NUM ) * OVERLAP_SPACE.horizon; }
			
			document.getElementById(key).innerHTML = str;
			document.getElementById(key).style.marginRight = _marginRight + 'px';
		}
		else{
			document.getElementById(key).innerHTML = '<div class="dummy"></div>';
		}
		
		// If there were line Breaking, overlap .card-line element vertically
		if(myCards[key].length>LINE_BREAK_NUM){
			const CARDS_LINE = ( document.getElementById(key) ).getElementsByTagName('div');
			//console.log(CARDS_LINE);
			for(let i=0; i<CARDS_LINE.length - 1; i++ ){
				CARDS_LINE[i].style.top = ( (CARDS_LINE.length - 1 - i) * OVERLAP_SPACE.vertical ) + 'px';
				//console.log("hi",i,CARDS_LINE[i].style.top);
			}
			//document.getElementById(key).style.marginTop -= (CARDS_LINE.length - 1) * OVERLAP_SPACE.vertical;
		}
		
	}
}

function drawCard(num){ // 'draw' means 'select a random card'. NOT DRAWING A PAINT!!!!!
	let drawnCards = [];
	
	for(let i=0; i<num; i++){
		while(true){
			let index = Math.floor(Math.random() * CARDS.length);
			if(drawnCards.includes(CARDS[index]) == false){
				drawnCards.push(CARDS[index]);
				break;
			}	
		}
	}
	
	return drawnCards;
}

function range(start, end){
	let arr=[];
	for(let i=start; i<end; i++){
		arr.push(i);
	}
	
	return arr;
}

