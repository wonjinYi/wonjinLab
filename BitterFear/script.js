window.addEventListener('DOMContentLoaded', main);

async function main(){
	const TARGET={
		body : document.querySelector('body'),
		text_needRepayment : document.getElementById('text-needRepayment'),
		text_loanDate : document.getElementById('text-loanDate'),
		text_principle : document.getElementById('text-principle'),
		text_elapsedTime : document.getElementById('text-elapsedTime'),
		text_interestRate : document.getElementById('text-interestRate'),
		
		cell : document.getElementsByClassName('cell')
	};
	
	const preDefined={
		loanDate : new Date('2020-09-19T14:05:00'),
		principle : 30000,
		interestRate : 0.001,
		interestInterval : 'sec',
	}//
	let now;
	let elapsedTime;
	let needRepayment;
	
	// Initial set Constant value ONCE.
	TARGET.text_loanDate.textContent = preDefined.loanDate;
	TARGET.text_principle.textContent = `${preDefined.principle} 원`;
	TARGET.text_interestRate.textContent = `${preDefined.interestRate}% / ${preDefined.interestInterval}`;
	
	// LOOP to update data per 1 second.
	let intervalID = setInterval((e)=>{
		now = new Date();
		elapsedTime = parseInt(( now.getTime() - preDefined.loanDate.getTime() ) / 1000);
		needRepayment = parseInt( preDefined.principle * (1 + (preDefined.interestRate * elapsedTime)) );

		
		TARGET.text_elapsedTime.textContent = `${elapsedTime}초`;
		TARGET.text_needRepayment.textContent = `${needRepayment}원`;
	},1000);

	
	
	//joke.
	for(let i=0; i<TARGET.cell.length; i++){
		TARGET.cell[i].addEventListener('click', (e)=>{alert(`최재원님, ${needRepayment}원의 상환이 필요합니다. 상환 문의 이원진`)});
	}
	

	
}