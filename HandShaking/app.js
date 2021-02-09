const REQ_FORM = document.querySelector(".request-form");
const REQ_INPUT = document.querySelector(".request-input");

const REQ_GET_BTN = document.querySelector(".request-get-btn");
const REQ_GET_CRED = document.querySelector(".request-get-credential");

const REQ_POST_BTN = document.querySelector(".request-post-btn");
const REQ_POST_CRED = document.querySelector(".request-post-credential");
const REQ_POST_DATA = document.querySelector(".request-post-data");

const SETTING_SAVE = document.querySelector(".save-btn");
const SAVE_NOTI = document.querySelector(".save-noti");

const RES_TEXT = document.querySelector(".response-text");


// fill inputs.
const savedURL = localStorage.getItem("req-url");
if ( savedURL && savedURL !== '' ){
	REQ_INPUT.value = savedURL;
}

REQ_POST_DATA.value = JSON.stringify({yourData:53});


// add event listener
REQ_GET_BTN.addEventListener("click", (e) => {
	axios.get(REQ_INPUT.value, {withCredentials:REQ_GET_CRED.value})
	.then( (res) => {
		RES_TEXT.textContent = JSON.stringify(res);
	});
});

REQ_POST_BTN.addEventListener("click", (e) => {
	axios.post(REQ_INPUT.value, REQ_POST_DATA.value, {withCredentials:REQ_POST_CRED.value})
	.then( (res) => {
		RES_TEXT.textContent = JSON.stringify(res);
	})
});

SETTING_SAVE.addEventListener("click", (e) => {
	localStorage.setItem("req-url", REQ_INPUT.value);

	SAVE_NOTI.textContent = `saved : ${localStorage.getItem("req-url")}`;
	setTimeout( () => { SAVE_NOTI.textContent=''; }, 2000);
})