
//window.addEventListener('DOMContentLoaded', main);

//function main(){
let app = new Vue({
	el : '#app',
	data : {
		message : '안녕하세요'
	}

});

let app2 = new Vue({
	el: '#app-2',
	data : {
		message : '로드된 시간 '+ new Date() +'aa'
	}
});

var app3 = new Vue({
	el: '#app-3',
	data: {
		seen : true
	}
});

var app4 = new Vue({
	el: '#app-4',
	data: {
		todos: [
			{ text : 'learn javascript'},
			{ text : 'learn vue'},
			{ text : 'make somthing awesome'}
		]
	}
});

let app5 = new Vue({
	el : '#app-5',
	data : {
		message : '안녕하세요 VUE.JS!'
	},
	methods : {
		reverseMessage : function(){
			this.message = this.message.split('').reverse().join('');
			alert(this.message);
		}
	}
});

let app6 = new Vue({
	el : '#app-6',
	data : {
		message : 'HIHI Vue'
	}
});


/////////////////////////
// 컴포넌트

Vue.component('todo-item', {
	props:['todo'],
	template : '<li>{{ todo.text }} in {{ todo.id }}</li>'
});
let app7 = new Vue({
	el : '#app-7',
	data : {
		groceryList : [
			{ id:0, text:'Vegetables' },
			{ id:1, text:'Cheese' },
			{ id:2, text:'whatever' }
		]
	}
});

///////////////////

let data = { 
	newTodoText : '',
	visitCount : 0,
	hideCompletedTodos : false,
	todos : [],
	error : null,
	text : ''
};

Object.freeze(data);
let app8 = new Vue({
	el : '#app-8',
	data : data,
	methods : {
		appendNemo : function(){this.text += 'o';}
	}
});















//}