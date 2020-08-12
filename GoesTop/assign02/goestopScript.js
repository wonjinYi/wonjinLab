window.addEventListener('DOMContentLoaded', main);

const CARDS = [	
	"1_G", "1_T", "1_P1", "1_P2",
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
	"X_PP1", "X_PP2", "X_PPP" 
];


let cardPool = [];
CARDS.forEach( card => { cardPool.push(card); } );

const PLAYERS_NUM = 2; // The number of game players

//Options for card alignment
const LINE_BREAK_NUM = 10
const OVERLAP_SPACE = { horizon:30, vertical:40 };



function main(){
	let players = initPlayers(PLAYERS_NUM);
	let drawNum = 15;
	
	for(let i=0; i<PLAYERS_NUM; i++){
		organizeCards(players[i].cards, drawCard(drawNum, i) );
		players[i].status.score = updateScore(players[i].cards);
		
		updateCardContainer(players[i]);
	}
	updateBak(	players.map( (player) => { return player.container.status;	} ), 
				players.map( (player) => { return player.status; 			} ) );
	
	for(let i=0; i<PLAYERS_NUM; i++){
		updateStatusContainer(players[i].container.status, players[i].status);
	}

	
	
	//temp code for test -------------------------------------
	
	const temp_btn = document.getElementsByClassName('redraw-btn');
	const temp_input= document.getElementsByClassName('redraw-input');
	for(let i=0; i<temp_btn.length; i++){
		temp_input[i].value = 15;
		temp_btn[i].addEventListener('click',(e)=>{
			drawNum = parseInt(temp_input[i].value);
			
			for(let key in players[i].cards){
				const abab = players[i].cards[key].length;
				for(let k=0; k<abab; k++){
					let temp=players[i].cards[key].pop();
					//console.log('temp : ' + temp);
					cardPool.push(temp);
				}
				//players[i].cards[key] = [];
			}
			//console.log(cardPool.length);
			//console.log(players[i].cards);

			organizeCards(players[i].cards, drawCard(drawNum, i));
			players[i].status.score = updateScore(players[i].cards);
			updateCardContainer(players[i]);
			updateStatusContainer(players[i].container.status, players[i].status);
			//console.log('------------------------');
			//console.log(players[i].cards);
		});
	}

	//temp code for test -------------------------------------
	

}

function initPlayers(PLAYERS_NUM){
	const root = document.getElementsByClassName('test-module');
	let _players = [];
	
	for(let i=0; i<PLAYERS_NUM; i++){
		let player = {
			container:{},
			cards:{},
			status:{}
		};
		
		player.container.status = root[i].getElementsByClassName('status-main-container')[0];
		player.container.cards = root[i].getElementsByClassName('card-main-container')[0];
		player.cards = {	
			G : [],
			Y : [],
			T : [],
			P : []
		};
		player.status.score = 0;
		player.status.bak = [];
		
		_players.push(player);
	}
	
	return _players;
}

function drawCard(num, PLAYER_INDEX){ // 'draw' means 'select a random card'. NOT DRAWING A PAINT!
	let drawnCards = [];
	
	for(let i=0; i<num; i++){
		while(true){
			const index = Math.floor(Math.random() * cardPool.length);
			const card = cardPool[index];
			if(drawnCards.includes(card) == false){
				drawnCards.push(card);
				cardPool.splice(index,1);
				break;
			}	
		}
	}
	
	return drawnCards;
}

function organizeCards(playerCards, drawnCards){
	//const KEYS = ['G', 'Y', 'T', 'P'];
	
	//classitication 
	for(let i=0; i<drawnCards.length; i++){
		for(let key in playerCards){
			if(drawnCards[i].includes(key)){
				playerCards[key].push(drawnCards[i]);
				break;
			}
		}
	}
}

function updateCardContainer(player){
	const CARDS = player.cards;
	const CARDS_CONTAINER = player.container.cards;
	
	for(let key in CARDS){
		//make HTML elements from classified cards ( "players[i].cards" Object )
		let str = '';
		for(let i=0; i<CARDS[key].length; i++){
			const rest = i%LINE_BREAK_NUM;
			
			if(rest == 0){str += '<div class="cards-line">';}
			
			str += '<img src="../card_img/'+CARDS[key][i]+'.png" ';
			str += 		'class="card" ';
			str +=		'style="left:-'+(OVERLAP_SPACE.horizon* (i%LINE_BREAK_NUM) )+'px;';
			str +=				'position:relative;';
			str +=		'"';
			str += '>';
			
			if(rest == 9){str += '</div>';}
			else if (i==CARDS[key].lenth-1){str += '</div>';}
		}
		
		
		// If there are cards in current Class(key), update the Element.
		if(str!=''){
			CARDS_CONTAINER.getElementsByClassName(key)[0].innerHTML = str;
			
			// set negative margin-right of .cards class
				// If there is line breaking, Its margin is max value ( = LINE_BREAK_NUM * OVERLAP_SPACE )
				// BUT, there is not line breaking, margin is determined by the number of element(card)
			let _marginRight = 0;
			if(CARDS[key].length >= LINE_BREAK_NUM){ _marginRight = (-1) * LINE_BREAK_NUM * OVERLAP_SPACE.horizon; }
			else { _marginRight = (-1) * ( (player.cards[key].length)%LINE_BREAK_NUM ) * OVERLAP_SPACE.horizon; }
			CARDS_CONTAINER.getElementsByClassName(key)[0].style.marginRight = _marginRight + 'px';
		
			// Vertical Overlap & negative margin-top  ::  If there is line Breaking, overlap .card-line element vertically
			if(CARDS[key].length>LINE_BREAK_NUM){
				// overlap
				const CARDS_LINE = ( CARDS_CONTAINER.getElementsByClassName(key)[0] ).getElementsByClassName('cards-line');
				for(let i=0; i<CARDS_LINE.length - 1; i++ ){
					CARDS_LINE[i].style.top = ( (CARDS_LINE.length - 1 - i) * OVERLAP_SPACE.vertical ) + 'px';
				}
				
				// negative margin-top
				CARDS_CONTAINER.getElementsByClassName(key)[0].style.marginTop = (-1)*(CARDS_LINE.length-1)*OVERLAP_SPACE.vertical + 'px'; 
			}
			
		}
		// If there are no cards, current .card-sub-container fill with .dummy or div
		else {
			if (key == 'Y' || key == 'T'){
				CARDS_CONTAINER.getElementsByClassName(key)[0].innerHTML = '<div class="dummy"></div>';
			}
			else {
				CARDS_CONTAINER.getElementsByClassName(key)[0].innerHTML = '<div></div>';
			}
		} 

	}
}

function updateScore(CARDS){
	let score = 0;
	
	//Regular score condition
	//
	let Pcnt = 0;
	CARDS.P.forEach( (card)=>{ Pcnt += card.match(/P/g).length; });
	console.log('p : '+(Pcnt));
	if( Pcnt >= 10 ){ 
		score += Pcnt-9; 
		console.log('P', score);
				  
	}
	//Y, T
	if( CARDS.Y.length >= 5 ){ score += CARDS.Y.length-4; console.log('Y', score);}
	if( CARDS.T.length >= 5 ){ score += CARDS.T.length-4; console.log('T', score);}
	//G
	if( CARDS.G.length == 5){ score += 15; console.log('G', score);}
	else if ( CARDS.G.length == 4 ){ score += 4; }
	else if ( CARDS.G.length == 3 ){
		if( CARDS.G.includes('12_G') ){ score += 2; }
		else { score += 3; }
	}
	
	//Special score condition
	//고도리
	if( containsAll(CARDS.Y, ['2_Y', '4_Y', '8_Y']) ){ score += 5; console.log('고도리', score)}
	//홍단
	if( containsAll(CARDS.T, ['1_T', '2_T', '3_T']) ){ score += 3; console.log('홍', score)}
	//초단
	if( containsAll(CARDS.T, ['4_T', '5_T', '7_T']) ){ score += 3; console.log('초', score)}
	//청단
	if( containsAll(CARDS.T, ['6_T', '9_T', '10_T']) ){ score += 3; console.log('청', score)}
	
	return score;
}
function updateBak(){
	// determine bak
	let _bak = [];
	//Math.max.apply(null, STATUS.map( (element)=>{return element.score;} ));
	
	return _bak;
	
}
function updateStatusContainer(STATUS_CONTAINER, STATUS){
	console.log(STATUS_CONTAINER, STATUS);
	
	
	// set .score-text
	STATUS_CONTAINER.getElementsByClassName('score-text')[0].textContent = STATUS.score;
	
	// update .bak
	for(let i=0; i<STATUS.bak.length; i++){
		STATUS_CONTAINER.getElementsByClassName(STATUS.bak[i])[0].classList.add('actived-bak');
	}
	
}



function containsAll(arr, elements){
	for(let i=0; i<elements.length; i++){
		if( arr.includes(elements[i]) == false ){
			return false;
		}
	}	
	return true;
}

function range(start, end){
	let arr=[];
	for(let i=start; i<end; i++){
		arr.push(i);
	}
	
	return arr;
}
