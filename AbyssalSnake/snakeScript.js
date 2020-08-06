document.addEventListener("DOMContentLoaded", main);



function main(){
	
	//hi developer!!
	hiDeveloper();
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Constant can be handled
	const TARGET = { 
		article : document.getElementById('article'),
		score : document.getElementById('score'), 
		field : document.getElementById('field'), 
		onscreen_keyboard : document.getElementById('onscreen_keyboard'),
		
		left_key : document.getElementById("left_key"),
		right_key : document.getElementById("right_key")
	};
		
	const FIELD_SIZE={	
		width:21,
		height:21	
	}; 
	const INITIAL_UPDATE_INTERVAL = 300;
	const RANK_SIZE = 10;
	
	//ranking data ( contains highest 10 scores )
	let rank = []
	let rankExist = localStorage.getItem('rankExist');
	if(rankExist == null){
		for(let i=0; i<RANK_SIZE; i++){
			rank[i] = {name:'no-name', score:0, time:'no-time'}
		}
		localStorage.setItem('rank', JSON.stringify(rank));
		localStorage.setItem('rankExist', true);
	}
	else {
		rank = JSON.parse( localStorage.getItem('rank') );
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Define Game Object
	let Score = {
		drawScore : function(snakeLength, target){
			target.innerHTML = snakeLength;
		}	
	};
	let Field = {

		view : [], 	// virtual view used on back
					// 0 : empty space ( have no element class )
					// 1 : snake head ( element class : snakehead )
					// 2 : snake body ( element class : snakebody )
					// 3 : food ( element class : food )
		
		DOMtable : [],	// REAL Field table on DOM
		
		
		initView(FIELD_SIZE, TARGET){
			// set 2-dim array 'view[]', by FIELD_SIZE
			// All cells are initialized 0 (means empty space)
			for(let i=0; i<FIELD_SIZE.height; i++){
				let tmp = new Array(FIELD_SIZE.width);
				for(let k=0; k<tmp.length; k++){
					tmp[k]=0;
				}
				
				this.view.push(tmp);
			}			
		},
		initDOMtable(FIELD_SIZE, TARGET){
			const row = TARGET.getElementsByTagName('tr');
			for(let i=0; i<FIELD_SIZE.height; i++){
				this.DOMtable.push(row[i].children);
			}
		},
		
		createTableOnDOM(FIELD_SIZE, target){
			let str = '';
			
			str+='<table id="field"><tbody>';
			for(let i=0; i<FIELD_SIZE.height; i++){
				str+='<tr>';
				for(let k=0; k<FIELD_SIZE.width; k++){
					if(this.view[i][k] == 0){ str+='<td></td>';}
					else if(this.view[i][k] == 1){ str+='<td class="snakehead"></td>';}
					else if(this.view[i][k] == 2){ str+='<td class="snakebody"></td>';}
					else if(this.view[i][k] == 3){ str+='<td class="food"></td>';}
					else { console.log("======== "+i+" , "+k+" : Fail to create Table ========"); }
				}
				str+='</tr>';
			}
			str+='</tbody></table><p>Press LEFT or Right ( [LEFT]:normal [RIGHT]:hardcore )</p>';
			target.innerHTML = str;
			
		},
		updateView(FIELD_SIZE, snakePos, foodPos){
			// Set All cells "0"
			for(let i=0; i<FIELD_SIZE.height; i++){
				for(let k=0; k<FIELD_SIZE.width; k++){
					this.view[i][k] = 0;
				}
			}

			// record food position , on view
			this.view[foodPos.row][foodPos.col] = 3;

			// record snake position , on view
			this.view[snakePos[0].row][snakePos[0].col] = 1
			for(let i=1; i<snakePos.length; i++){
				this.view[snakePos[i].row][snakePos[i].col] = 2;
			}
		},
		drawView(FIELD_SIZE, target){
			let cell;
			for(let i=0; i<FIELD_SIZE.height; i++){
				for(let k=0; k<FIELD_SIZE.width; k++){
					cell = this.DOMtable[i][k];
					
					cell.removeAttribute("class");
					
					if(this.view[i][k] == 0){ }
					else if(this.view[i][k] == 1){ cell.classList.add('snakehead');}
					else if(this.view[i][k] == 2){ cell.classList.add('snakebody');}
					else if(this.view[i][k] == 3){ cell.classList.add('food');}
					else { console.log("======== "+i+" , "+k+" : Fail to draw Field ========"); }
				}
			}
		}
	};

	let Snake = {
		
		position : [],	// Snake.position의 구성에 대한 설명. Snake.position[0]은 언제나 머리이다
						// [{머리}, {몸통1}, {몸통2}, ... ,{몸통n (꼬리)}]
		recentRemovedPosition : {}, // 가장 최근에 화면에서 삭제된 position이다(잉여분). 이 부분은 길이신장 시 확장될 꼬리로 사용한다.
		
		length : 2,
		direction : 'up',
		activateKeydown : true,	// 키 입력->방향 전환후, 위치정보가 업데이트 되기 전에 새로운 키입력이 들어오는 것을 방지
								// true : 현재 키입력 받을 수 있음(활성화됨), false : 현재 키입력 받을 수 없음(비활성화)
		
		initPosition : function(FIELD_SIZE){
			let rowCenter = parseInt(FIELD_SIZE.height / 2);
			let colCenter = parseInt(FIELD_SIZE.width / 2);
			for(let i=0; i<this.length; i++){
				let tmp = {};
				tmp.row = rowCenter+i;
				tmp.col = colCenter;
				this.position.push(tmp);
			}
		},
		updatePosition : function() {
			//turn할 때 비활성화된 키입력을 다시 활성화
			this.activateKeydown = true;
			
			// 머리로 사용할 새로운 position 결정
			let tmp = {};
			tmp.row = this.position[0].row;
			tmp.col = this.position[0].col;

			if		(this.direction == 'up')	{ tmp.row = ( this.position[0].row ) - 1; }
			else if	(this.direction == 'down')	{ tmp.row = ( this.position[0].row ) + 1; }
			else if	(this.direction == 'left')	{ tmp.col = ( this.position[0].col ) - 1; }
			else if	(this.direction == 'right')	{ tmp.col = ( this.position[0].col ) + 1; }
			else { console.log(this.direction + " : snake updatePosition 실행 실패"); }

			// 새로운 머리 추가 + 맨 뒤 꼬리 하나 삭제
			this.position.unshift(tmp);
			this.recentRemovedPosition = this.position.pop();
		},
		turn : function(keyCode) {
			// position이 update되기 전 까지 키입력 비활성화
			this.activateKeydown = false;
	
			if(keyCode == 37 && this.direction != 'right'){ this.direction = 'left'; }
			else if(keyCode == 38 && this.direction != 'down'){this.direction = 'up'; }
			else if(keyCode == 39 && this.direction != 'left'){this.direction = 'right'; }
			else if(keyCode == 40 && this.direction != 'up'){this.direction = 'down'; }
		
		},
		lengthen : function(){
			this.length += 1;
			this.position.push(this.recentRemovedPosition);
		}
	};
	let Food = {
		position : {row:0, col:0},
		isExist : false, // false:필드에 없다, true:필드에 있다
		
		feed : function(FIELD_SIZE, snakePos, snake){
			if(this.isExist == false){
				let tmp={};
				let flag = false; // tmp값과 snake.posision의 겹치는지 여부 판단 ( false : 판단 전-아직 판단안됨 or 판단 후-겹치지 않음 , true : 겹침  )

				// 현재 뱀 위치와 겹치지 않는, 위치를 랜덤으로 생성함
				while(true){
					flag = false;
					tmp.row = Math.floor(Math.random() * FIELD_SIZE.height);
					tmp.col = Math.floor(Math.random() * FIELD_SIZE.width);

					for(let i=0; i<snakePos.length; i++){
						if(isSamePos(tmp, snakePos[i])){
							flag = true;
						}
					}

					// 안겹치면 반복문 종료, 겹치면 다시 새로운 값 뽑기
					if(flag==false){break;}
					else{continue;}
				}
				this.position.row = tmp.row;
				this.position.col = tmp.col;

				this.isExist = true;
			}
		}
	};
	

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	let updateInterval = INITIAL_UPDATE_INTERVAL;
	let intervalId = 0;
	
	// Set initial Game info & Field
	initialSetting(FIELD_SIZE, TARGET, Snake, Food, Field);

	
	// eventListener to start game & select difficulty
		// keyboard event (for PC browser)
	window.addEventListener('keydown', function(e){
		if(e.keyCode == 37 || e.keyCode == 39){
			let mode = '';
			if(e.keyCode == 37 ){ mode = 'normal'; }
			else if(e.keyCode == 39 ){ mode = 'hardcore'; }

			intervalId = setLoop(FIELD_SIZE, TARGET, Snake, Food, Field, Score, mode, updateInterval, rank);
			this.removeEventListener("keydown",arguments.callee);
		}
	});
		// Arrow Button TouchEvent( for Mobile browser )
	TARGET.onscreen_keyboard.addEventListener('mousedown', function(e){
		if(e.target == TARGET.left_key || e.target == TARGET.right_key){
			let mode = '';
			if(e.target == TARGET.left_key){ mode = 'normal'; }
			else if(e.target == TARGET.right_key){ mode = 'hardcore'; }

			intervalId = setLoop(FIELD_SIZE, TARGET, Snake, Food, Field, Score, mode, updateInterval, rank);
			this.removeEventListener("mousedown",arguments.callee);
		}
	});

	
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//set initial game environment
function initialSetting(FIELD_SIZE, TARGET, Snake, Food, Field){
	Snake.initPosition(FIELD_SIZE);
	Food.feed(FIELD_SIZE, Snake.position);
	Snake.updatePosition();
	
	Field.initView(FIELD_SIZE, TARGET.field)
	Field.updateView(FIELD_SIZE, Snake.position, Food.position);
	Field.createTableOnDOM(FIELD_SIZE, TARGET.field)
	Field.initDOMtable(FIELD_SIZE, TARGET.field)
	
	Field.drawView(FIELD_SIZE, TARGET.field);
}

function setLoop(FIELD_SIZE, TARGET, Snake, Food, Field, Score, mode, updateInterval, rank){
	//set hard mode
	if(mode == 'hardcore'){ updateInterval -= 200; }
	
	//addEventListener that reads key input
		// keyboard event (for PC browser)
	window.addEventListener('keydown', (e)=>{
		if(Snake.activateKeydown==true){ Snake.turn(e.keyCode); }
	}); 
		// Arrow Button Event( for Mobile browser )
	Array.from(document.querySelectorAll('.key')).forEach((node) => {
		node.addEventListener('mousedown', (e) => {
			const keyCode = parseInt(node.getAttribute('data-keycode'), 10);
			if(Snake.activateKeydown==true){ Snake.turn(keyCode); }
		});
	});

	
	// SET game Main Loop
	let intervalId = setInterval(function(){
		Snake.updatePosition();
		
		const gameover = detectCollision(Snake, Food, FIELD_SIZE,intervalId);
		if(gameover){ closeGame(intervalId, Snake.length, rank, TARGET); }
		
		Food.feed(FIELD_SIZE, Snake.position);
		Field.updateView(FIELD_SIZE, Snake.position, Food.position);
		Field.drawView(FIELD_SIZE, TARGET.field);
		Score.drawScore(Snake.length, TARGET.score);
	},updateInterval);

	return intervalId;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

function closeGame(intervalId, score, rank, TARGET){

	clearInterval(intervalId);
	alert('\n======== SCORE : '+score+' ========\n');

	let isRanker = checkRanker(rank, score);

	if(isRanker == false){
		alert('You do not deserve to enter the abyss. GET OUT FROM HERE');
		location.replace("index.html");
	}
	else{
		alert('Not enough, but well done');

		// set rank submit page
		let str= '';
		str += 	'<div id="rank_submit">';
		str += 		'<h2>YOU ARE THE RANKER</h2>';
		str += 		'<p><strong>Score : '+score+'</strong></p>';
		str += 		'<p>Submit your name if you want to be a ranker</p>';
		str +=		'<div>';
		str +=			'<input type="text" id="name_input" placeholder="Write your name" name="rankname"></input>';
		str += 			'<a id="submit_btn">Submit</a>';
		str +=		'</div>';
		str +=	'</div>';

		TARGET.article.innerHTML = str;

		// submit button add click eventlistener
		document.getElementById('submit_btn').addEventListener("click",function(e){
			let target = document.getElementById('name_input');

			if( (target.value).includes(' ') == false && target.value!=''){
				writeRank(rank, score, target.value);
				location.replace("index.html");
			}
			else {
				alert("There is no text, or contains space. Space is not allowed");
			}
		});
	}
}

function detectCollision(Snake, Food, FIELD_SIZE,intervalId){
		
	let snakeHead = Snake.position[0];
	let _gameover = false; // true : shutdown game , false : keep going game

	//When Snake head hit the Food -> remove Food on gameField, Snake length increased by 1
	if(isSamePos(snakeHead, Food.position)){
		Food.isExist = false;
		Snake.lengthen();
	}
	
	//When Snake head hit the wall -> gameover
	if(snakeHead.row<0 || snakeHead.row>FIELD_SIZE.height-1 || snakeHead.col<0 || snakeHead.col>FIELD_SIZE.width-1){
		_gameover = true;
	}

	//When Snake head hit its body -> gameover
	if(_gameover == false){
		for(let i=1; i<Snake.length ; i++){
			if(isSamePos(snakeHead, Snake.position[i])){
				_gameover = true;
				break;
			}
		}
	}
	
	return _gameover;
}

//Check user is in TOP10 score
function checkRanker(rank,snakeLength){
	if(rank[rank.length-1]['score'] <= snakeLength){
		return true;
	}
	return false;
}

function writeRank(rank, _score , _name){
	let date = new Date();
	let currentTime = '';
	currentTime = date.getDate()+'.'+(date.getMonth()+1)+'.'+(date.getFullYear())+' '+date.getHours()+':'+date.getMinutes();
	
	for(let i=0; i<rank.length; i++){
		if( _score >= rank[i]['score'] ){
			rank.splice(i, 0, {name:_name, score:_score, time:currentTime});
			rank.pop();
			localStorage.setItem('rank', JSON.stringify(rank));
			alert('Your score is saved succesfully');
			break;
		}
	}
}

function isSamePos(snakeHead, food){	// Check if two positions have the same value
										// return ---- true : same(overlap), false : different(no overlap)
	if(snakeHead.row == food.row && snakeHead.col == food.col){
		return true;
	}
	return false;
}


function hiDeveloper(){
	console.log("아 lnx적분하고싶다");
	console.log("□□□□□□□□□■")
	console.log("■□□□□□□□□")
}