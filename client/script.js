SIGNUP_URL = "http://localhost:3000/signup"
SIGNIN_URL = "http://localhost:3000/signin"
GET_TODOS_URL = "http://localhost:3000/todos"

function moveToSignup(){
    document.getElementById("signup-container").style.display = "block";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("todos-container").style.display = "none";
}

function moveToSignin() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
    document.getElementById("todos-container").style.display = "none";
}

async function getTodos(){
    const token = localStorage.getItem('token');
    try{
        const response = await axios.get(GET_TODOS_URL,{
            headers: {
                'token': token
            }
        })
        if(response.status === 200){
            const todos = response.data; // { todo: [...] }
            const todosList = document.querySelector("#todos-list");
            console.log(typeof todos.todo); // Should log "object" (arrays are objects in JS)
            console.log(todos.todo); // Should log your array

            todosList.innerHTML = ""; // Clear existing todos       

// Check if the todo array exists and has items
if (todos.todo && todos.todo.length) {
    todos.todo.forEach((item) => {
        const todoElement = createTodoElement(item);
        todosList.appendChild(todoElement);
    });
}
            
        }
    }catch(error){
        console.error("Error during fetching todos:", error);
    }
}

function moveToTodos() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("todos-container").style.display = "block";
    getTodos();
}

async function signup(){
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    try{
        const response = await axios.post(SIGNUP_URL,{
            username: username,
            password: password
        })
        if(response.status === 201){
            alert(response.data.message);
            moveToSignin();
        }
    }catch(error){
        console.error("Error during signup:", error);
    }
}

async function signin(){
    const username = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;
    try{
        const response = await axios.post(SIGNIN_URL,{
            username: username,
            password: password
        })
        if(response.status === 200){
            alert(response.data.message);

            localStorage.setItem('token', response.data.token);
            moveToTodos();
        }
    }catch(error){
        console.error("Error during signin:", error);
    }
}

async function logout(){
    localStorage.removeItem('token');
    alert("You are logged out successfully!");
    moveToSignin();
}

function createTodoElement(todo) {
    // Create a container div for the To-Do
    const todoDiv = document.createElement("div");
    todoDiv.className = "todo-item";

    // Create an input element for the To-Do title
    const inputElement = createInputElement(todo.title);
    inputElement.readOnly = true;

    // Create update, delete, and done checkbox elements
    const updateBtn = createUpdateButton(inputElement, todo.id);
    const deleteBtn = createDeleteButton(todo.id);
    const doneCheckbox = createDoneCheckbox(todo.done, todo.id, inputElement);

    // Append the created elements to the To-Do container
    todoDiv.appendChild(inputElement);
    todoDiv.appendChild(doneCheckbox);
    todoDiv.appendChild(updateBtn);
    todoDiv.appendChild(deleteBtn);

    return todoDiv;
}

function createInputElement(value) {
    // Create an input element
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = value;
    inputElement.readOnly = true;

    return inputElement;
}

function createUpdateButton(inputElement, id) {
    // Create an update button
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Edit";

    // Handle button click
    updateBtn.onclick = function () {
        if (inputElement.readOnly) {
            // Make input editable and change button text to "Save"
            inputElement.readOnly = false;
            updateBtn.textContent = "Save";
            inputElement.focus(); // Focus on the input field
            inputElement.style.outline = "1px solid #007BFF"; // Add blue focus color
        } else {
            // Make input read-only and change button text to "Edit"
            inputElement.readOnly = true;
            updateBtn.textContent = "Edit";
            inputElement.style.outline = "none"; // Remove focus outline
            // Update the To-Do with new title
            updateTodo(id, inputElement.value);
        }
    };

    return updateBtn;
}

function createDeleteButton(id) {
    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // Handle button click
    deleteBtn.onclick = function () {
        // Delete the To-Do
        deleteTodo(id);
    };

    return deleteBtn;
}

async function toggleTodoDone(id, done) {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    try {
        // Send the updated status of the To-Do (done/undone) to the server
        await axios.put(
            `http://localhost:3000/todos/${id}/done`,
            { done: !done }, // Toggle the done state
            {
                headers: { Authorization: token },
            }
        );

        // Refresh the To-Do list to reflect the changes
        getTodos();
    } catch (error) {
        // Log error if toggling To-Do status fails
        console.error("Error while toggling To-Do status:", error);
    }
}

function createDoneCheckbox(done, id, inputElement) {
    // Create a checkbox element
    const doneCheckbox = document.createElement("input");
    doneCheckbox.type = "checkbox";
    doneCheckbox.checked = done;

    // Set the text decoration based on the current done state
    inputElement.style.textDecoration = done ? "line-through" : "none";

    // Handle checkbox change
    doneCheckbox.onchange = function () {
        // Toggle the To-Do status and update text decoration
        toggleTodoDone(id, done); // Pass the current done state
        inputElement.style.textDecoration = doneCheckbox.checked ? "line-through" : "none"; // Update text decoration based on checkbox state
    };

    return doneCheckbox;
}
