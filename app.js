let todos = [];
let done = [];

const todoForm = document.getElementById('todoAdd');
const todoInput = document.getElementById('todoAdd__input');
const todoList = document.getElementById('todoList');

new Sortable(todoList, {
	animation: 200,
	handle: '.todoList__listItem__handle',
	onEnd: function(/**Event*/ evt) {
		const oldTodo = todos[evt.oldIndex];
		todos.splice(evt.oldIndex, 1);
		todos.splice(evt.newIndex, 0, oldTodo);

		localStorage.setItem('todos', JSON.stringify(todos));
	},
});

function createListElement({ content, done, priority }) {
	// Full list element is a div
	let listItem = document.createElement('div');
	listItem.className = 'todoList__listItem';
	switch (priority) {
		case 1:
		case 2:
		case 3:
			listItem.classList.add(`imp_${priority}`);
			break;
	}
	// Todo Text
	let todoText = document.createElement('div');
	todoText.textContent = content;
	todoText.className = 'todoList__listItem__text';

	// Checkbox
	let checkbox = document.createElement('input'); // Checkbox element
	checkbox.type = 'checkbox';
	checkbox.className = 'todoList__listItem__checkbox';

	checkbox.onclick = function() {
		const index = Array.from(checkbox.parentNode.parentNode.children).indexOf(
			checkbox.parentNode,
		);

		todos[index]['done'] = checkbox.checked;
		if (checkbox.checked) {
			todoText.style.textDecoration = 'line-through';
		} else {
			todoText.style.textDecoration = 'none';
		}
		localStorage.setItem('todos', JSON.stringify(todos));
	};

	if (done) {
		checkbox.checked = true;
		todoText.style.textDecoration = 'line-through';
	}

	let imp_1 = document.createElement('div');
	imp_1.className = 'todoList__listItem__priority';
	imp_1.textContent = '1';
	imp_1.onclick = function() {
		const index = Array.from(imp_1.parentNode.parentNode.children).indexOf(imp_1.parentNode);
		imp_1.parentNode.classList.replace(`imp_${todos[index]['priority']}`, 'imp_1');
		todos[index]['priority'] = 1;
		localStorage.setItem('todos', JSON.stringify(todos));
	};
	let imp_2 = document.createElement('div');
	imp_2.className = 'todoList__listItem__priority';
	imp_2.textContent = '2';
	imp_2.onclick = function() {
		const index = Array.from(imp_2.parentNode.parentNode.children).indexOf(imp_2.parentNode);
		imp_1.parentNode.classList.replace(`imp_${todos[index]['priority']}`, 'imp_2');
		todos[index]['priority'] = 2;
		localStorage.setItem('todos', JSON.stringify(todos));
	};
	let imp_3 = document.createElement('div');
	imp_3.className = 'todoList__listItem__priority';
	imp_3.textContent = '3';
	imp_3.onclick = function() {
		const index = Array.from(imp_3.parentNode.parentNode.children).indexOf(imp_3.parentNode);
		imp_1.parentNode.classList.replace(`imp_${todos[index]['priority']}`, 'imp_3');
		todos[index]['priority'] = 3;
		localStorage.setItem('todos', JSON.stringify(todos));
	};
	// Handle used for moving
	let handle = document.createElement('div');
	let handle_icon = document.createElement('i');
	handle_icon.className = 'fa-solid fa-grip-lines';
	handle.appendChild(handle_icon);
	handle.className = 'todoList__listItem__handle';

	// Remove Button
	let removeButton = document.createElement('button');
	removeButton.textContent = '-';
	removeButton.className = 'todoList__listItem__remove';
	removeButton.onclick = function() {
		const index = Array.from(checkbox.parentNode.parentNode.children).indexOf(
			checkbox.parentNode,
		);
		todos.splice(index, 1);
		localStorage.setItem('todos', JSON.stringify(todos));
		update(todos);
	};

	// Adding to the main element
	listItem.appendChild(checkbox);
	listItem.appendChild(todoText);
	listItem.appendChild(imp_1);
	listItem.appendChild(imp_2);
	listItem.appendChild(imp_3);
	listItem.appendChild(removeButton);
	listItem.appendChild(handle);

	todoList.appendChild(listItem);
}

function update(tasksList) {
	todoList.innerHTML = ''; // Remove all existing children from todoList
	if (tasksList.length > 0) {
		for (let i = 0; i < tasksList.length; i++) {
			createListElement(tasksList[i]);
		}
	} else {
		let greeting = document.createElement('div');
		greeting.textContent = 'What are you going to do today?';
		greeting.className = 'todoList__greeting';
		todoList.appendChild(greeting);
	}
}

window.onload = async () => {
	todos = await JSON.parse(localStorage.getItem('todos'));
	if (todos) {
		update(todos);
	} else {
		todos = [];
	}
};

todoForm.onsubmit = e => {
	// When Enter Button Or Add Button Is Clicked
	e.preventDefault();
	const val = todoInput.value;
	todoInput.value = '';
	if (val.trim() != '') {
		if (todos.length == 0) {
			todoList.innerHTML = '';
		}
		const todo = { content: val, done: false, priority: 3 };
		todos.push(todo);
		localStorage.setItem('todos', JSON.stringify(todos));
		createListElement(todo);
	}
};
