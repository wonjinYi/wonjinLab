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
	const drawNum = 8;
	
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
		for(let key in myCards){myCards[key] = [];}
		organizeCards(myCards, drawCard(drawNum), TARGET);
		updateCardContainer(myCards);
	});
	console.log(myCards);
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

	const overlapSpace = 30;
	
	for(let key in myCards){
		let marginValue = 0;
		let str = '';
		for(let i=0; i<myCards[key].length; i++){
			//str += '<img src="card_img/'+myCards[key][i]+'.png" position>';
			
			str += '<img src="card_img/'+myCards[key][i]+'.png" ';
			str +=		'style="left:-'+(overlapSpace*i)+'px;';
			str +=				'position:relative;';
		//	str +=				'z-index:'+i+';';
			str +=		'"';
			str += '>';
			
			marginValue += overlapSpace*i;
			
		}
		
		
		// If there are cards in current Class(key), update the Element.
		if(str!=''){
			document.getElementById(key).innerHTML = str;
			document.getElementById(key).style.width -= (-1)*marginValue + 'px';
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


