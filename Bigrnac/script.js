window.addEventListener('DOMContentLoaded', main);

const TARGET={
	body : document.getElementsByTagName('body'),
	blocks : document.getElementsByClassName('block'),
};
let clone;

async function main(){
	let topSum = 0;
	
	Array.prototype.forEach.call( TARGET.blocks, block => {
		block.style.top = topSum + 'px';
		topSum += block.offsetHeight;
		
		document.addEventListener('mousedown',startDrag);
		document.addEventListener('mouseup',endDrag);
	});

	
}

function startDrag(e){
	const selectedElement = e.target;
	console.log('start drag', selectedElement);
	
	clone = document.createElement('div');
	clone.style.top = e.clientY + 'px';
	clone.style.zIndex = 53;
	selectedElement.classList.forEach( className => {
		console.log(className);
		clone.classList.add(className);
	});
	selectedElement.classList.forEach( className => selectedElement.classList.remove(className) );
	
	
	selectedElement.classList.add("block", "empty");
	
	
	TARGET.body[0].insertBefore(clone, selectedElement);
	
	document.addEventListener('mousemove', moveBlock);
}

function moveBlock(e){
	console.log('MOVE MOVE', e.target, e.clientX, e.clientY);
	//e.target
	clone.style.top = e.clientY + 'px';
	//e.target.style.left = e.clientX + 'px';
}

function endDrag(e){
	console.log('END drag', e.target);
	
	const selectedElement = document.getElementsByClassName('empty')[0];
	selectedElement.classList.remove('empty');
	clone.classList.forEach( className => selectedElement.classList.add(className) );
	clone.classList.forEach( className => clone.classList.remove(className) );
	
	clone.remove();
	document.removeEventListener('mousemove', moveBlock);
}