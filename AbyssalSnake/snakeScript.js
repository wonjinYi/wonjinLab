document.addEventListener("DOMContentLoaded", main);

async function main(){
	
	//그냥 콘솔에 환영메시지 띄워주는 함수임. 쓸모없음.
	hiDeveloper();
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Constant can be handled
	const TARGET = { 
		score : document.getElementById('score'), 
		field : document.getElementById('field'), 
		onscreen_key : document.getElementById('onscreen_keyboard')
	};
		
	const FIELD_SIZE={	
		width:21,
		height:21	
	}; 
	const INITIAL_UPDATE_INTERVAL = 200;

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Define Game Object
	let Score = {
		drawScore : async function(snakeLength, target){
			let str = '';
			str += '<h3>SCORE</h3>';
			str += '<h5>'+snakeLength+'</h5>';
			
			target.innerHTML = str;
		}	
	};
	let Field = {
		// 0 : 빈 공간 ( element class 없음 )
		// 1 : 뱀 머리 ( element class : snakehead )
		// 2 : 뱀 몸통 ( element class : snakebody )
		// 3 : 먹이 ( element class : food )
		view : [],
		
		initView : async function(FIELD_SIZE){
			// view를 FIELD_SIZE에 따라 2차원 배열로 구성
			// 모든 셀은 0 (빈 공간)으로 초기화
			for(let i=0; i<FIELD_SIZE.height; i++){
				let tmp = new Array(FIELD_SIZE.width);
				for(let k=0; k<tmp.length; k++){
					tmp[k]=0;
				}
				
				this.view.push(tmp);
			}
		},
		updateView : async function(FIELD_SIZE, snakePos, foodPos){
				// 모든 셀을 0으로 초기화
				for(let i=0; i<FIELD_SIZE.height; i++){
					for(let k=0; k<FIELD_SIZE.width; k++){
						this.view[i][k] = 0;
					}
				}

				// 먹이 위치 표시
				this.view[foodPos.row][foodPos.col] = 3;
			
				// 뱀의 위치 표시
				this.view[snakePos[0].row][snakePos[0].col] = 1
				for(let i=1; i<snakePos.length; i++){
					this.view[snakePos[i].row][snakePos[i].col] = 2;
				}

				
		
		},
		drawView : async function(FIELD_SIZE, target){
			let str = '';
			
			str+='<table id="field"><tbody>';
			for(let i=0; i<FIELD_SIZE.height; i++){
				str+='<tr>';
				for(let k=0; k<FIELD_SIZE.width; k++){
					if(this.view[i][k] == 0){ str+='<td></td>';}
					else if(this.view[i][k] == 1){ str+='<td class="snakehead"></td>';}
					else if(this.view[i][k] == 2){ str+='<td class="snakebody"></td>';}
					else if(this.view[i][k] == 3){ str+='<td class="food"></td>';}
					else { console.log("======== "+i+" , "+k+" : 필드그리기 실패 ========"); }
				}
				str+='</tr>';
			}
			str+='</tbody></table>';
			target.innerHTML = str;
		}
	};

	let Snake = {
		
		position : [],	// Snake.position의 구성에 대한 설명. Snake.position[0]은 언제나 머리이다
						// [{머리}, {몸통1}, {몸통2}, ... ,{몸통n (꼬리)}]
		recentRemovedPosition : {}, // 가장 최근에 화면에서 삭제된 position이다(잉여분). 이 부분은 길이신장 시 확장될 꼬리로 사용한다.
		
		length : 5,
		direction : 'up',
		activateKeydown : true,	// 키 입력->방향 전환후, 위치정보가 업데이트 되기 전에 새로운 키입력이 들어오는 것을 방지
								// true : 현재 키입력 받을 수 있음(활성화됨), false : 현재 키입력 받을 수 없음(비활성화)
		
		initPosition : async function(FIELD_SIZE){
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
		lengthen : async function(){
			this.length += 1;
			this.position.push(this.recentRemovedPosition);
		}
	};
	let Food = {
		position : {row:0, col:0},
		isExist : false, // false:필드에 없다, true:필드에 있다
		
		feed : async function(FIELD_SIZE, snakePos, snake){
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
	
	let gameover = false; // true : 게임오버됨 , false : 게임 진행중
	let updateInterval = INITIAL_UPDATE_INTERVAL;
	
	//게임환경 초기 설정
	await Snake.initPosition(FIELD_SIZE);
	await Food.feed(FIELD_SIZE, Snake.position);
	
	await Field.initView(FIELD_SIZE)
	await Field.updateView(FIELD_SIZE, Snake.position, Food.position);
	await Field.drawView(FIELD_SIZE, TARGET.field);
	
	window.addEventListener('keydown', function (e){
		if(Snake.activateKeydown==true){ Snake.turn(e.keyCode); }
	});
	
	//게임 메인루프
	let intervalId = setInterval(async function(){
		
		
		await Snake.updatePosition();
		await detectCollision(Snake, Food, FIELD_SIZE,intervalId);
		await Food.feed(FIELD_SIZE, Snake.position);
		await Field.updateView(FIELD_SIZE, Snake.position, Food.position);
		await Field.drawView(FIELD_SIZE, TARGET.field);
		await Score.drawScore(Snake.length, TARGET.score);
		
		
	},updateInterval);
	
	//while(gameover==false){
		//먹이유무 체크 -> 먹이생성, 길이 1증감
		//머리가 벽/몸에 닿았는지 체크 -> 게임종료 및 루프 탈출
	//}
	
	//게임오버 후 점수 표시 + 대문으로 돌아가기 기능
	
}

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
async function detectCollision(Snake, Food, FIELD_SIZE,intervalId){
		let snakeHead = Snake.position[0];
		
		//먹이와 충돌 -> 먹이 없애고, 뱀 길이 1 신장
		if(isSamePos(snakeHead, Food.position)){
			Food.isExist = false;
			await Snake.lengthen();
		}

		//벽과 충돌 -> 게임오버
		else if(snakeHead.row<0 || snakeHead.row>FIELD_SIZE.height-1 || snakeHead.col<0 || snakeHead.col>FIELD_SIZE.width-1){
			clearInterval(intervalId);
			alert('아 lnx적분하고싶다');
			
			location.replace("index.html");
			
		}
	
		//자기 몸과 충돌 -> 게임오버
		for(let i=1; i<Snake.length ; i++){
			if(isSamePos(snakeHead, Snake.position[i])){
				clearInterval(intervalId);
				alert('아 lnx적분하고싶다');
			
				location.replace("index.html");
			}
		}
}

function isSamePos(snakeHead, food){	// 두 position의 값이 같은지 확인. 
										// 리턴값 true : 같다(겹친다), false : 다르다(안겹친다)
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