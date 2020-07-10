document.addEventListener("DOMContentLoaded", main);

function main(){
	const FIELD_SIZE={	width:21
						,height:21	};
	let field = [] 
	let Snake = {
		position : [],
		length : 0,
		direction : '',
		
		init : function( 외부에서 설정한 상수값 ) {
			// 적절히 Snake에 대한 초기값 세팅
		},
		turn : function( 적절한 인수 ) {
			// 방향전환
		}
	};
		
	let snake = new Snake();
	let foodPosition = [];
	
	let gameover = false; // true : 게임오버됨 , false : 게임 진행중
	
	//initGame
	
	//게임 메인루프
	while(gameover==false){
		//먹이유무 체크 -> 먹이생성, 길이 1증감
		//머리가 벽/몸에 닿았는지 체크 -> 게임종료 및 루프 탈출
		//방향키 눌림 -> 방향전환
		//뱀 이동
		//화면 새로그리기
	}
	
	//게임오버 후 점수 표시 + 대문으로 돌아가기 기능
	
}

function printField(target, FIELD_SIZE, snakePos, foodPos){
	let str = '';
	str+='<table id="field"><tbody>';
	for(let i=0; i<FIELD_SIZE.width; i++){
		str+='<tr>';
		
		for(let k=0; k<FIELD_SIZE.height; k++){
			if(snakePos.x==i && snakePos.y==k){
				//실제 필드 뿌리기
			}
		}
			
		str+='</tr>';
	}
	str+='</tbody></table>';
		
	target.innerHTML = str;
}