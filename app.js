let todos = [];
let done = [];

const todoForm = document.getElementById("todoAdd");
const todoInput = document.getElementById("todoAdd__input");
const todoList = document.getElementById("todoList");

new Sortable(todoList, {
	//handle: "#todoList__listItem__handle",
	animation: 350,
	handle: ".todoList__listItem__handle",
	onEnd: function (/**Event*/ evt) {
		const oldTodo = todos[evt.oldIndex];
		todos.splice(evt.oldIndex, 1);
		todos.splice(evt.newIndex, 0, oldTodo);

		localStorage.setItem("todos", JSON.stringify(todos));
	},
});

function removeDuplicates(string, char) {
	return Array.from(new Set(string.split(char))).toString();
}

function createElement(content, done) {
	// Creates a single div elem with
	let listItem = document.createElement("div");
	listItem.className = "todoList__listItem"; // Classnames for styling

	let todoText = document.createElement("div");
	todoText.textContent = content;
	todoText.className = "todoList__listItem__text";

	let checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "todoList__listItem__checkbox";

	checkbox.onclick = function () {
		const index = Array.from(
			checkbox.parentNode.parentNode.children
		).indexOf(checkbox.parentNode);

		todos[index] = {
			content, // Same Content
			done: checkbox.checked,
		};
		if (checkbox.checked) {
			todoText.style.textDecoration = "line-through";
		} else {
			todoText.style.textDecoration = "none";
		}
		localStorage.setItem("todos", JSON.stringify(todos));
	};

	if (done) {
		checkbox.checked = true;
		todoText.style.textDecoration = "line-through";
	}

	let handle = document.createElement("div");
	let handle_icon = document.createElement("i");
	handle_icon.style.color = "grey";
	handle_icon.className = "fa-solid fa-bars";
	handle.appendChild(handle_icon);
	handle.className = "todoList__listItem__handle";
	handle.style.cursor = "grabbing";

	let removeButton = document.createElement("button");
	removeButton.textContent = "-";
	removeButton.className = "todoList__listItem__removeHandle";
	removeButton.onclick = function () {
		const index = Array.from(
			checkbox.parentNode.parentNode.children
		).indexOf(checkbox.parentNode);
		todos.splice(index, 1);
		localStorage.setItem("todos", JSON.stringify(todos));
		update(todos);
	};

	listItem.appendChild(checkbox);
	listItem.appendChild(todoText);
	listItem.appendChild(removeButton);
	listItem.appendChild(handle);

	todoList.appendChild(listItem);
}

function update(tasksList) {
	todoList.innerHTML = ""; // Remove all existing children from todoList
	if (tasksList.length > 0) {
		for (let i = 0; i < tasksList.length; i++) {
			createElement(tasksList[i].content, tasksList[i].done);
		}
	} else {
		let greeting = document.createElement("div");
		greeting.textContent = "What are you going to do today?";
		greeting.style.fontSize = "20px";
		greeting.style.color = "white";
		greeting.style.margin = "15px";
		todoList.appendChild(greeting);
	}
}

window.onload = () => {
	todos = JSON.parse(localStorage.getItem("todos"));
	if (todos) {
		update(todos);
	} else {
		todos = [];
	}
};

todoForm.onsubmit = (e) => {
	// When Enter Button Or Add Button Is Clicked
	e.preventDefault();
	const val = todoInput.value;
	todoInput.value = "";
	if (removeDuplicates(val, " ") != "") {
		todos.push({ content: val, done: false });
		localStorage.setItem("todos", JSON.stringify(todos));
		createElement(val, false);
	}
};
