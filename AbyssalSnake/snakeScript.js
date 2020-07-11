document.addEventListener("DOMContentLoaded", main);

async function main(){
	
	hiDeveloper();
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Constant can be handled
	const TARGET = { 
		article : document.getElementById('article') 
	};
		
	const FIELD_SIZE={	
		width:21,
		height:21	
	};

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	// Define Game Object
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

				// 뱀의 위치 표시
				this.view[snakePos[0].row][snakePos[0].col] = 1
				for(let i=1; i<snakePos.length; i++){
					this.view[snakePos[i].row][snakePos[i].col] = 2;
				}

				// 먹이 위치 표시
				this.view[foodPos.row][foodPos.col] = 3;
		
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
		position : [],
		length : 5,
		direction : 'up',
		
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
			let tmp = {};
			tmp.row = this.position[0].row;
			tmp.col = this.position[0].col;
			//console.log(this.direction);
			if		(this.direction == 'up')	{ tmp.row = ( this.position[0].row ) - 1; }
			else if	(this.direction == 'down')	{ tmp.row = ( this.position[0].row ) + 1; }
			else if	(this.direction == 'left')	{ tmp.col = ( this.position[0].col ) - 1; }
			else if	(this.direction == 'right')	{ tmp.col = ( this.position[0].col ) + 1; }
			else { console.log(this.direction + " : snake updatePosition 실행 실패"); }
			//console.log('update direction : '+this.direction);
			this.position.unshift(tmp);
			this.position.pop();
		},
		turn : function(keyCode) {
			console.log(this.direction +'    '+keyCode);
			if(keyCode == 37 && this.direction != 'right'){ this.direction = 'left'; }
			else if(keyCode == 38 && this.direction != 'down'){this.direction = 'up'; }
			else if(keyCode == 39 && this.direction != 'left'){this.direction = 'right'; }
			else if(keyCode == 40 && this.direction != 'up'){this.direction = 'down'; }
			//console.log(this.direction);
		}
	};
	let Food = {
		position : {row:0, col:0},
		isExist : false, // false:필드에 없다, true:필드에 있다
		
		feed : async function(FIELD_SIZE, snakePos){
			let tmp={};
			let flag = false; // tmp값 snake.posision 겹침여부 판단 ( false : 판단 전-아직 판단안됨 or 판단 후-겹치지 않음 , true : 겹침  )
			//랜덤으로 위치 결정함. 일단 임의의값 넣음
			
			while(true){
				flag = false;
				tmp.row = Math.floor(Math.random() * FIELD_SIZE.height);
				tmp.col = Math.floor(Math.random() * FIELD_SIZE.width);
				
				for(let i=0; i<snakePos.length; i++){
					if(tmp.row == snakePos[i].row && tmp.col == snakePos[i].col){
						flag = true;
					}
				}
				
				// 안겹치면 반복문 종료, 겹치면 다시 ㄱ
				if(flag==false){break;}
				else{continue;}
			}

			
			this.position.row = tmp.row;
			this.position.col = tmp.col;
			
			isExist = true;
		}
	};
		
	
	let gameover = false; // true : 게임오버됨 , false : 게임 진행중
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	//게임환경 초기 설정
	await Snake.initPosition(FIELD_SIZE);
	await Food.feed(FIELD_SIZE, Snake.position);
	
	await Field.initView(FIELD_SIZE)
	await Field.updateView(FIELD_SIZE, Snake.position, Food.position);
	await Field.drawView(FIELD_SIZE, TARGET.article);
	
	window.addEventListener('keydown', function (e){
		Snake.turn(e.keyCode);
	});
	
	//게임 메인루프
	//await setInterval(Snake.updatePosition, 300);
	//await setInterval(Field.updateView, 300, FIELD_SIZE, Snake.position, Food.position);
	//await setInterval(Field.drawView, 300, FIELD_SIZE, TARGET.article);
	setInterval(async function(){
		await Snake.updatePosition();
		await Field.updateView(FIELD_SIZE, Snake.position, Food.position);
		await Field.drawView(FIELD_SIZE, TARGET.article);
	},300);
	
	//while(gameover==false){
		//먹이유무 체크 -> 먹이생성, 길이 1증감
		//머리가 벽/몸에 닿았는지 체크 -> 게임종료 및 루프 탈출
	//}
	
	//게임오버 후 점수 표시 + 대문으로 돌아가기 기능
	
}

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

function roundSingleDigit(num){
	return Math.round(num/10) * 10;
}

function sleep (delay) {
   var start = new Date().getTime();
   while (new Date().getTime() < start + delay);
}

function hiDeveloper(){
	console.log("A snake is on Abyss");
	console.log("□■")
}