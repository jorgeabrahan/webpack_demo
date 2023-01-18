import ToDo from './ToDo.js';

export default class ToDos {
  constructor(container) {
    this.container = container;
    this.todos = [];
    this.isEditEnabled = false;
  }

  removeSelected() {
    this.todos.forEach((todo) => {
      if (todo.completed) {
        this.delete(this.container.querySelector(`#${todo.id}`));
      }
    });
  }

  fixIndex() {
    this.todos.forEach((todo, index) => {
      todo.index = index;
    });
  }

  check(todo, input) {
    this.todos.forEach((element) => {
      if (element.id === todo.id) {
        element.completed = input.checked;
      }
    });
    if (input.checked) {
      input.setAttribute('checked', '');
      todo.querySelector('input[type="text"]').classList.add('completed');
      return;
    }
    todo.querySelector('input[type="text"]').classList.remove('completed');
    input.removeAttribute('checked', '');
  }

  focusIn(todo, input) {
    todo.classList.add('todo--focus');
    input.classList.remove('completed');
    this.isEditEnabled = true;
  }

  focusOut(todo, input) {
    todo.classList.remove('todo--focus');
    this.todos.forEach((element) => {
      if (element.id === todo.id) {
        element.description = input.value;
        if (element.completed) {
          input.classList.add('completed');
        }
      }
    });
    if (input.value.trim() === '') {
      this.delete(todo);
    }
    this.isEditEnabled = false;
  }

  move() {
    console.log(this.todos);
    console.log('move');
  }

  delete(todo) {
    const filtered = this.todos.filter(({ id }) => id !== todo.id);
    this.todos = filtered;
    this.fixIndex();
    todo.remove();
  }

  addEvents(todo) {
    todo.querySelector('input[type="checkbox"]').addEventListener('change', ({ target }) => {
      this.check(todo, target);
    });
    todo.querySelector('input[type="text"]').addEventListener('focusin', ({ target }) => {
      this.focusIn(todo, target);
    });
    todo.querySelector('input[type="text"]').addEventListener('focusout', ({ relatedTarget, target }) => {
      if (relatedTarget !== null && relatedTarget.tagName === 'BUTTON') return;
      this.focusOut(todo, target);
    });
    todo.querySelector('.btnMove').addEventListener('click', () => {
      this.move(todo);
    });
    todo.querySelector('.btnDelete').addEventListener('click', () => {
      this.delete(todo);
    });
  }

  add(description, completed = false) {
    const todo = new ToDo(description, completed, this.todos.length, ToDos.genId());
    this.todos.push(todo);
    const todoHtml = todo.createHtml();
    this.addEvents(todoHtml);
    this.container.appendChild(todoHtml);
  }

  static genId(tokenLen = 16) {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tokenLen; i += 1) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
