window.addEventListener('DOMContentLoaded', main);

let TARGET = {};
let BLOCKS = [];
let dest = 0; // the destination where a clone returns.

let clone; // html element
let isDraggingStarted = false;
let oldMouseY = 0;


async function main(){
	TARGET = {
		blockContainer : document.getElementById('block-container'),
		blocks : document.getElementsByClassName('block'),
	};
	
	// block setting
	let topSum = 0;
	for(let i=0; i<TARGET.blocks.length; i++){
		BLOCKS.push(TARGET.blocks[i]);
		
		BLOCKS[i].style.top = topSum + 'px';
		topSum += BLOCKS[i].offsetHeight;
	}
	
	// change block.style.top when screen is resized
	TARGET.blockContainer.addEventListener('mousedown',startDrag);
	TARGET.blockContainer.addEventListener('mouseup',endDrag);
	window.addEventListener('resize', relocateBlocks);

	
}

function startDrag(e){
	e.preventDefault()
	oldMouseY = e.clientY;
	
	if (isDraggingStarted == true) { return 0; }
	else { isDraggingStarted = true; }
	
	// make clone
	dest = (e.target.dataset).index;
	console.log('start drag', BLOCKS[dest]);
	
	
	clone = document.createElement('div');
	clone.style.top = BLOCKS[dest].style.top;
	clone.style.zIndex = 53;
	clone.style.borderRadius = "100px";
	BLOCKS[dest].classList.forEach( className => clone.classList.add(className) ); // copy e.target -> clone
	BLOCKS[dest].classList.forEach( className => BLOCKS[dest].classList.remove(className) ); 
	BLOCKS[dest].classList.add("block", "empty");
	
	TARGET.blockContainer.insertBefore(clone, BLOCKS[dest]);
	TARGET.blockContainer.addEventListener('mousemove', moveBlock);
	
	console.log(BLOCKS[dest].dataset.index);
}

function moveBlock(e){
	console.log('MOVE MOVE', e.clientY - oldMouseY, clone.style.top);

	clone.style.top = (clone.offsetTop + ( e.clientY - oldMouseY )) + 'px';
	oldMouseY = e.clientY;
}


function endDrag(e){
	console.log('END drag', BLOCKS[dest]);
	
	// remove clone
	//const selectedElement = document.getElementsByClassName('empty')[0];
	BLOCKS[dest].classList.remove('empty');
	clone.classList.forEach( className => BLOCKS[dest].classList.add(className) ); // copy clone -> e.target
	clone.classList.forEach( className => clone.classList.remove(className) );
	clone.remove();
	
	TARGET.blockContainer.removeEventListener('mousemove', moveBlock);
	
	isDraggingStarted = false;
}

function relocateBlocks(e){
	console.log('resize');
	let topSum = 0;
	Array.prototype.forEach.call( BLOCKS, block => {
		block.style.top = topSum + 'px';
		topSum += block.offsetHeight;
	});
}