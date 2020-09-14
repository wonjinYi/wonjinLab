window.addEventListener('DOMContentLoaded', main);

let AUDIOS = {
	bun : new Audio('res/bun.wav'),
	cheese : new Audio('res/cheese.wav'),
	lettuce : new Audio('res/lettuce.wav'),
	patty : new Audio('res/patty.wav'),
	sauce : new Audio('res/sauce.wav'),
}
let TARGET = {};
let BLOCKS = [];
let dest = 0; // the destination where a clone returns.

let clone; // html element
let isDraggingStarted = false;
let oldMouseY = 0;


async function main () {
	TARGET = {
		blockContainer : document.getElementById('block-container'),
		blocks : document.getElementsByClassName('block'),
	};
	
	// block setting
	let topSum = 0;
	for( let i=0; i<TARGET.blocks.length; i++ ) {
		BLOCKS.push(TARGET.blocks[i]);
		
		BLOCKS[i].style.top = topSum + 'px';
		topSum += BLOCKS[i].offsetHeight;
	}
	
	// warn
	if( confirm('wanna play Audio?\n소리 재생 ㄱ?') == false ) { AUDIOS = {}; }
	
	// change block.style.top when screen is resized
	TARGET.blockContainer.addEventListener('mousedown',startDrag);
	TARGET.blockContainer.addEventListener('touchstart',startDrag);
	TARGET.blockContainer.addEventListener('mouseup',endDrag);
	TARGET.blockContainer.addEventListener('touchend',endDrag);
	window.addEventListener('resize', relocateBlocks);

	
}

function startDrag (e) {
	e.preventDefault()
	
	if (window.innerWidth > 769) { oldMouseY = e.clientY; }
	else { oldMouseY = e.touches[0].clientY; }
	
	if (isDraggingStarted == true) { return 0; }
	else { isDraggingStarted = true; }
	
	// make clone
	dest = parseInt( (e.target.dataset).index );
	//console.log('start drag', BLOCKS[dest]);
	
	clone = document.createElement('div');
	clone.style.top = BLOCKS[dest].style.top;
	clone.style.zIndex = 53;
	clone.style.borderRadius = "100px";
	
	BLOCKS[dest].classList.forEach( className => clone.classList.add(className) ); // copy e.target -> clone
	BLOCKS[dest].className = '';
	BLOCKS[dest].classList.add("block", "empty");
	
	TARGET.blockContainer.insertBefore(clone, BLOCKS[dest]);
	TARGET.blockContainer.addEventListener('mousemove', moveBlock);
	TARGET.blockContainer.addEventListener('touchmove', moveBlock);
	
	(Object.keys(AUDIOS)).forEach( audio => {
		if ( clone.classList.contains(audio) ){
			AUDIOS[audio].play();
			return;
		}
	})
	
	
	//console.log(BLOCKS[dest].dataset.index);
}

function moveBlock(e) {
	
	//console.log('move ', e.clientY, oldMouseY,e.touches[0].clientY);
	
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
	if ( dest < BLOCKS.length-1 ) {
		if ( clone.offsetTop + clone.offsetHeight > centerOf(BLOCKS[dest+1]) ) {
			swapClassList( BLOCKS[dest], BLOCKS[dest+1] );
			dest++;
		}
	}
	// 위로 보내기
	if ( dest > 0 ) {
		if ( clone.offsetTop < centerOf(BLOCKS[dest-1]) ) {
			swapClassList( BLOCKS[dest], BLOCKS[dest-1] );
			dest--;
		}
	}
}


function endDrag(e) {
	console.log('END drag', BLOCKS[dest]);
	
	// remove clone
	BLOCKS[dest].classList.remove('empty');
	clone.classList.forEach( className => BLOCKS[dest].classList.add(className) ); // copy clone -> e.target
	clone.className = '';
	console.log('remove clone classlist ', clone.classList);
	clone.remove();
	
	TARGET.blockContainer.removeEventListener('mousemove', moveBlock);
	TARGET.blockContainer.removeEventListener('touchmove', moveBlock);
	
	isDraggingStarted = false;
}




function relocateBlocks(e) {
	let topSum = 0;
	Array.prototype.forEach.call( BLOCKS, block => {
		block.style.top = topSum + 'px';
		topSum += block.offsetHeight;
	});
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