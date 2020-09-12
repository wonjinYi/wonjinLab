window.addEventListener('DOMContentLoaded', main);

let TARGET;
let clone;
let isDraggingStarted = false;

async function main(){
	TARGET = {
		body : document.getElementsByTagName('body'),
		blockContainer : document.getElementById('block-container'),
		blocks : document.getElementsByClassName('block'),
	};
	
	// block setting
	let topSum = 0;
	Array.prototype.forEach.call( TARGET.blocks, block => {
		block.style.top = topSum + 'px';
		topSum += block.offsetHeight;
		
		TARGET.blockContainer.addEventListener('mousedown',startDrag);
		TARGET.blockContainer.addEventListener('mouseup',endDrag);
	});
	
	// change block.style.top when screen is resized
	window.addEventListener('resize', relocateBlocks);

	
}

function startDrag(e){
	e.preventDefault()
	
	if (isDraggingStarted == true) { return 0; }
	else { isDraggingStarted = true; }
	
	const selectedElement = e.target;
	console.log('start drag', selectedElement);
	
	clone = document.createElement('div');
	clone.style.top = selectedElement.style.top;
	clone.style.zIndex = 53;
	selectedElement.classList.forEach( className => clone.classList.add(className) );
	selectedElement.classList.forEach( className => selectedElement.classList.remove(className) );
	selectedElement.classList.add("block", "empty");
	
	TARGET.blockContainer.insertBefore(clone, selectedElement);
	
	TARGET.blockContainer.addEventListener('mousemove', moveBlock);
}

function moveBlock(e){
	//console.log('MOVE MOVE', e.target, e.clientX, e.clientY);
	clone.style.top = e.clientY + 'px';
}

function endDrag(e){
	console.log('END drag', e.target);
	
	const selectedElement = document.getElementsByClassName('empty')[0];
	selectedElement.classList.remove('empty');
	clone.classList.forEach( className => selectedElement.classList.add(className) );
	clone.classList.forEach( className => clone.classList.remove(className) );
	clone.remove();
	
	TARGET.blockContainer.removeEventListener('mousemove', moveBlock);
	
	isDraggingStarted = false;
}

function relocateBlocks(e){
	console.log('resize');
	let topSum = 0;
	Array.prototype.forEach.call( TARGET.blocks, block => {
		block.style.top = topSum + 'px';
		topSum += block.offsetHeight;
	});
}