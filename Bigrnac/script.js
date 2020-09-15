window.addEventListener('DOMContentLoaded', main);

let AUDIOS = {
	bun : new Audio('res/bun.mp3'),
	cheese : new Audio('res/cheese.mp3'),
	lettuce : new Audio('res/lettuce.mp3'),
	patty : new Audio('res/patty.mp3'),
	sauce : new Audio('res/sauce.mp3'),
	onion : new Audio('res/onion.mp3'),
	pickle : new Audio('res/pickle.mp3'),
	full : new Audio('res/full_new.mp3'),
}
let ELEMENT = {};
let BLOCKS = [];
let RESIZEBARS = [];
let target = 0; // For swap : the destination where a clone returns.
				// For row resize : upper element.
let MODE = ''; // swap  OR  row-resize
let clone; // html element
let isDraggingStarted = false;
let oldMouseY = 0;


async function main () {
	ELEMENT = {
		blockContainer : document.getElementById('block-container'),
		blocks : document.getElementsByClassName('block'),
	};
	
	// block setting
	let topSum = 0;
	for( let i=0; i<ELEMENT.blocks.length; i++ ) {
		BLOCKS.push(ELEMENT.blocks[i]);
		
		BLOCKS[i].style.top = topSum + 'px';
		topSum += BLOCKS[i].offsetHeight;
	}
	
	// create Resizing bars
	topSum = 0;
	for ( let i=0; i<BLOCKS.length-1; i++ ) {
		RESIZEBARS.push( document.createElement('div') );
		RESIZEBARS[i].classList.add('resize-bar');
		
		ELEMENT.blockContainer.insertBefore(RESIZEBARS[i], BLOCKS[i+1]);
		
		RESIZEBARS[i].style.top = ( BLOCKS[i+1].offsetTop - parseInt(RESIZEBARS[i].offsetHeight/2) ) + 'px';
	}
	
	// warn
	if( confirm('wanna play Audio?\n소리 재생 ㄱ?') == false ) { AUDIOS = {}; }
	
	// change block.style.top when screen is resized
	ELEMENT.blockContainer.addEventListener('mousedown',startDrag);
	ELEMENT.blockContainer.addEventListener('touchstart',startDrag);
	ELEMENT.blockContainer.addEventListener('mouseup',endDrag);
	ELEMENT.blockContainer.addEventListener('touchend',endDrag);
	
	window.addEventListener('resize', resizeScreen);
}


function startDrag (e) {
	e.preventDefault()
	
	if (isDraggingStarted == true) { return 0; }
	else { isDraggingStarted = true; }
	
	if (window.innerWidth > 769) { oldMouseY = e.clientY; }
	else { oldMouseY = e.touches[0].clientY; }
	
	
	// SWAP =====================================================================================
	if( BLOCKS.includes( e.target ) ) {
		
		MODE = 'swap';
		Array.prototype.forEach.call( RESIZEBARS, bar => bar.classList.add('disable') );
		
		// make clone
		target = parseInt( (e.target.dataset).index );

		clone = document.createElement('div');
		clone.style.top = BLOCKS[target].style.top;
		clone.style.zIndex = 53;
		clone.style.borderRadius = "100px";

		BLOCKS[target].classList.forEach( className => clone.classList.add(className) ); // copy e.target -> clone
		BLOCKS[target].className = '';
		BLOCKS[target].classList.add("block", "empty");

		ELEMENT.blockContainer.insertBefore(clone, BLOCKS[target]);
		ELEMENT.blockContainer.addEventListener('mousemove', moveBlock);
		ELEMENT.blockContainer.addEventListener('touchmove', moveBlock);

		(Object.keys(AUDIOS)).forEach( audio => {
			if ( clone.classList.contains(audio) ){
				AUDIOS[audio].play();
				return;
			}
		})
	}
	
	// RESIZE ==============================================================================
	else if( RESIZEBARS.includes( e.target ) ) {
		MODE = 'row-resize';
		alert('resize bar - mouse down');
	}
}

function moveBlock(e) {
	
	// SWAP =====================================================================================
	if( MODE == 'swap' ) {
		let newPosition = 0;
		if (window.innerWidth > 769) { 
			clone.style.top = (clone.offsetTop + ( e.clientY - oldMouseY )) + 'px';
			oldMouseY = e.clientY; 
		}
		else { 
			clone.style.top = (clone.offsetTop + ( e.touches[0].clientY - oldMouseY )) + 'px';
			oldMouseY = e.touches[0].clientY; 
		}


		// 밑으로 보내기
		if ( target < BLOCKS.length-1 ) {
			if ( clone.offsetTop + clone.offsetHeight > centerOf(BLOCKS[target+1]) ) {
				swapClassList( BLOCKS[target], BLOCKS[target+1] );
				target++;
			}
		}
		// 위로 보내기
		if ( target > 0 ) {
			if ( clone.offsetTop < centerOf(BLOCKS[target-1]) ) {
				swapClassList( BLOCKS[target], BLOCKS[target-1] );
				target--;
			}
		}
	}
	
	// RESIZE ==============================================================================
	else if( MODE = 'row-resize' ) {
		
	}
	
}


function endDrag(e) {
	
	// SWAP =====================================================================================
	if( MODE == 'swap' ) {
		Array.prototype.forEach.call( RESIZEBARS, bar => bar.classList.remove('disable') );
		
		// remove clone
		BLOCKS[target].classList.remove('empty');
		clone.classList.forEach( className => BLOCKS[target].classList.add(className) ); // copy clone -> e.target
		clone.className = '';
		console.log('remove clone classlist ', clone.classList);
		clone.remove();

		ELEMENT.blockContainer.removeEventListener('mousemove', moveBlock);
		ELEMENT.blockContainer.removeEventListener('touchmove', moveBlock);

		// initial status check
		// 빵 패티 피클 양파 빵 패티 치즈 소스 양상추 빵
		const kkiro = ['bun', 'patty', 'pickle', 'onion', 'bun', 'patty', 'cheese', 'sauce', 'lettuce', 'bun'];
		for(let i=0; i<BLOCKS.length; i++){
			if(BLOCKS[i].classList.contains(kkiro[i]) == false){break;}
			else { if(i==BLOCKS.length-1){ AUDIOS['full'].play(); } }
		}
	}
	
	// RESIZE ==============================================================================
	else if( MODE = 'row-resize' ) {

	}
	
	
	isDraggingStarted = false;
}




function resizeScreen(e) {
	let topSum = 0;
	for(let i=0; i<BLOCKS.length; i++){
		// relocate BLOCKS
		BLOCKS[i].style.top = topSum + 'px';
		topSum += BLOCKS[i].offsetHeight;
		
		// relocate RESIZEBARS
		if( i != BLOCKS.length-1 ){ 
			RESIZEBARS[i].style.top = ( BLOCKS[i+1].offsetTop - parseInt(RESIZEBARS[i].offsetHeight/2) ) + 'px';
		}
	}

}
		
function centerOf(block) {
	const height = block.offsetHeight;
	const top = block.offsetTop;
	
	return (top + height/2);
}

function copyClassList(src, dest){
	// copy to dest from src
	res.classList.forEach( className => {
		dest.classList.add(className);
	});
}
						  
function swapClassList(src, dest){
	// swap src <-> dest
	let temp = [];
	
	src.classList.forEach( className => temp.push(className) );
	
	// clear src & copy to src
	src.className = '';
	dest.classList.forEach( className => src.classList.add(className) );
	
	// clear dest & copy to dest
	dest.className = '';
	temp.forEach( className => dest.classList.add(className) );
}