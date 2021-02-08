const REQ_FORM = document.querySelector(".request-form");
const REQ_INPUT = document.querySelector(".request-input");
const REQ_BTN = document.querySelector(".request-btn");

const SETTING_SAVE = document.querySelector(".save-btn");
const SAVE_NOTI = document.querySelector(".save-noti");

const RES_TEXT = document.querySelector(".response-text");

if( REQ_FORM ){
	
	// load saved request url
	const savedURL = localStorage.getItem("req-url");
	if ( savedURL !== '' ){
		REQ_INPUT.value = savedURL;
	}
	
	// add event listener
	REQ_FORM.addEventListener("submit", (e) => {
		e.preventDefault();
		
		axios.post(REQ_INPUT.value,{test:1}, {withCredentials:true})
		.then( (res) => {
			RES_COOKIE.textContent = document.cookie;
			RES_TEXT.textContent = JSON.stringify(res);
		})
	});
	
	SETTING_SAVE.addEventListener("click", (e) => {
		localStorage.setItem("req-url", REQ_INPUT.value);
		
		SAVE_NOTI.textContent = `saved : ${localStorage.getItem("req-url")}`;
		setTimeout( () => { SAVE_NOTI.textContent=''; }, 2000);
	})
}