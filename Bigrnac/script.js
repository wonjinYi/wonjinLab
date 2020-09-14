window.addEventListener('DOMContentLoaded', main);

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
	
	// change block.style.top when screen is resized
	TARGET.blockContainer.addEventListener('mousedown',startDrag);
	TARGET.blockContainer.addEventListener('mouseup',endDrag);
	window.addEventListener('resize', relocateBlocks);

	
}

function startDrag (e) {
	e.preventDefault()
	oldMouseY = e.clientY;
	
	if (isDraggingStarted == true) { return 0; }
	else { isDraggingStarted = true; }
	
	// make clone
	dest = parseInt( (e.target.dataset).index );
	console.log('start drag', BLOCKS[dest]);
	
	clone = document.createElement('div');
	clone.style.top = BLOCKS[dest].style.top;
	clone.style.zIndex = 53;
	clone.style.borderRadius = "100px";
	
	BLOCKS[dest].classList.forEach( className => clone.classList.add(className) ); // copy e.target -> clone
	BLOCKS[dest].className = '';
	BLOCKS[dest].classList.add("block", "empty");
	
	TARGET.blockContainer.insertBefore(clone, BLOCKS[dest]);
	TARGET.blockContainer.addEventListener('mousemove', moveBlock);
	
	console.log(BLOCKS[dest].dataset.index);
}

function moveBlock(e) {
	//console.log('MOVE MOVE', e.clientY - oldMouseY, clone.style.top, clone.offsetTop);

	clone.style.top = (clone.offsetTop + ( e.clientY - oldMouseY )) + 'px';
	oldMouseY = e.clientY; 
	
	//console.log('move', dest, BLOCKS[dest].offsetTop, centerOf(BLOCKS[dest+1]));
	// 밑으로 보내기
	if ( dest < BLOCKS.length-1 ) {
		if ( clone.offsetTop + clone.offsetHeight > centerOf(BLOCKS[dest+1]) ) {
			swapClassList( BLOCKS[dest], BLOCKS[dest+1] );
			dest++;
			//console.log('아래아래아래아래아래!!!');
		}
	}
	// 위로 보내기
	if ( dest > 0 ) {
		if ( clone.offsetTop < centerOf(BLOCKS[dest-1]) ) {
			swapClassList( BLOCKS[dest], BLOCKS[dest-1] );
			dest--;
			console.log('위위우이위위위위위!!!');
		}
	}
}


function endDrag(e) {
	console.log('END drag', BLOCKS[dest]);
	
	// remove clone
	//const selectedElement = document.getElementsByClassName('empty')[0];
	BLOCKS[dest].classList.remove('empty');
	clone.classList.forEach( className => BLOCKS[dest].classList.add(className) ); // copy clone -> e.target
	clone.className = '';
	console.log('remove clone classlist ', clone.classList);
	clone.remove();
	
	TARGET.blockContainer.removeEventListener('mousemove', moveBlock);
	
	isDraggingStarted = false;
}




function relocateBlocks(e) {
	console.log('resize');
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