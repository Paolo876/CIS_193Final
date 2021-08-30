const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const todoCollection = document.querySelector('#todoCollection');
const clearBtn = document.querySelector('#clearBtn');
const listItemText = document.querySelector('#listItemText');


window.addEventListener('DOMContentLoaded', loadTodoFromStorage);
todoForm.addEventListener('submit', addTodo);
todoCollection.addEventListener('click', editTodo);
todoCollection.addEventListener('click', deleteTodo);
todoCollection.addEventListener('click', finishTodo);
clearBtn.addEventListener('click', clearAllTodo);


/********************************
   -- Event Functions --
********************************/

// add todo
function addTodo(e){
    
    if(/\S/.test(todoInput.value)) {

        const li = document.createElement('li');
        li.className = 'listItem';

        const link = document.createElement('a');
        link.className = 'listItemText';
        link.appendChild(document.createTextNode(todoInput.value));

        const editTodo = document.createElement('a');
        editTodo.className = 'editBtn';
        editTodo.innerHTML = '<i class="material-icons">create</i>';

        const deleteTodo = document.createElement('a');
        deleteTodo.className = 'deleteBtn';
        deleteTodo.innerHTML = `<i class="material-icons">close</i>`;
        
        const btnDiv = document.createElement('div');
        btnDiv.className = 'secondary-content';
        btnDiv.appendChild(editTodo);
        btnDiv.appendChild(deleteTodo);

        li.appendChild(link);
        li.appendChild(btnDiv)
        todoCollection.appendChild(li);

        var todoItem = {todoName: todoInput.value, 
                        todoStatus: false
                    };

        var localTodo;
        if(localStorage.getItem('todoList') === null){
            localTodo = [];
        } else {
            localTodo = JSON.parse(localStorage.getItem('todoList'));
        }
        localTodo.push(todoItem);
        localStorage.setItem('todoList', JSON.stringify(localTodo));

    } else{
        notifModal('Invalid input.');
    }
    todoInput.value = '';
     e.preventDefault();
}

// edit todo
function editTodo(e){
    if(e.target.parentElement.classList.contains('editBtn')){
        var todoItem = e.target.parentElement.parentElement.parentElement.firstChild;
        todoItem.toggleAttribute('contentEditable')
        var originalTodo = todoItem.textContent;

        if(todoItem.hasAttribute('contentEditable')){
            todoCollection.removeEventListener('click', finishTodo);
            todoItem.focus()

            todoItem.addEventListener('blur', function(){
                todoItem.removeAttribute('contentEditable');
                todoCollection.addEventListener('click', finishTodo);
                setEditedTodo(originalTodo, todoItem.textContent);

            });
            todoItem.addEventListener('keydown', function(e){
                if(e.key == 'Enter'){
                    e.preventDefault()
                    todoItem.removeAttribute('contentEditable');
                    todoCollection.addEventListener('click', finishTodo);
                    setEditedTodo(originalTodo, todoItem.textContent);
                }
            })
        } else {
            todoCollection.addEventListener('click', finishTodo);
        }

    }

}

function setEditedTodo(originalTodo, editedTodo) {
    if(originalTodo != editedTodo){
        notifModal('Todo item updated.');
    }
    var localTodo = JSON.parse(localStorage.getItem('todoList'));
    localTodo.forEach(function(todo){
        if(todo.todoName == originalTodo){
            todo.todoName = editedTodo;
        }
    });
    localStorage.setItem('todoList', JSON.stringify(localTodo));

}


// delete todo
function deleteTodo(e){
    if(e.target.parentElement.classList.contains('deleteBtn')){
        e.target.parentElement.parentElement.parentElement.remove();
        localTodo = JSON.parse(localStorage.getItem('todoList'));
        localTodo.forEach(function(todo, index){
            if(todo.todoName == e.target.parentElement.parentElement.parentElement.firstChild.textContent){
                localTodo.splice(index, 1)
            }
        });
        localStorage.setItem('todoList', JSON.stringify(localTodo));
    }


}

//mark as finished
function finishTodo(e){
    if(e.target.classList.contains('listItemText')){
        e.target.classList.toggle('finishedTodo');
        // console.log(e.target.parentElement.children[1].firstChild.style.color = 'black')
        // e.target.parentElement.children[1].firstChild.firstChild.style.color = 'rgb(235, 235, 235)'
        // e.target.parentElement.children[1].firstChild.firstChild.removeEventListener('click', finishTodo)
        localTodo = JSON.parse(localStorage.getItem('todoList'));
        localTodo.forEach(function(todo){
            if(todo.todoName == e.target.parentElement.firstChild.textContent){
                if(todo.todoStatus == true){
                    todo.todoStatus = false;
                } else {
                    todo.todoStatus = true;
                }
            }
        });
        localStorage.setItem('todoList', JSON.stringify(localTodo));
    }
}

// clear all
function clearAllTodo(){
    while(todoCollection.firstChild){
        todoCollection.removeChild(todoCollection.firstChild)
   }
   localStorage.removeItem('todoList');
}

// load from storage
function loadTodoFromStorage() {
    var localTodo;
    if(localStorage.getItem('todoList') === null){
        localTodo = [];
    } else {
        localTodo = JSON.parse(localStorage.getItem('todoList'));
    }

    localTodo.forEach(function(todo){
        const li = document.createElement('li');
        li.className = 'listItem';

        const link = document.createElement('a');
        link.className = 'listItemText';
        if(todo.todoStatus == true){
            link.className += ' finishedTodo';
        }
        link.appendChild(document.createTextNode(todo.todoName));

        const editTodo = document.createElement('a');
        editTodo.className = 'editBtn';
        editTodo.innerHTML = '<i class="material-icons">create</i>';

        const deleteTodo = document.createElement('a');
        deleteTodo.className = 'deleteBtn';
        deleteTodo.innerHTML = `<i class="material-icons">close</i>`;
        
        const btnDiv = document.createElement('div');
        btnDiv.className = 'secondary-content';
        btnDiv.appendChild(editTodo);
        btnDiv.appendChild(deleteTodo);

        li.appendChild(link);
        li.appendChild(btnDiv)
        todoCollection.appendChild(li);
    });
}