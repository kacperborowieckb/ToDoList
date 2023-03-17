const textarea = document.querySelector('.input');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const itemTemplate = document.querySelector('.list-item-temp');
const itemContainer = document.querySelector('.list');
const title = document.querySelector('.title');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// coolTextLoad(title);

textarea.addEventListener('keyup', (e) => {
  textarea.style.height = '32px';
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});

let tasks = JSON.parse(localStorage.getItem('task')) || [];

if (localStorage.getItem('task')) {
  tasks.map((task) => createTask(task));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value) return;

  const task = {
    value: input.value,
    isCompleted: false,
  };
  tasks.push(task);
  localStorage.setItem('task', JSON.stringify(tasks));

  createTask(task);

  form.reset();
  input.focus();
});

function createTask(task) {
  const template = itemTemplate.content.cloneNode(true);
  const element = template.querySelector('.list-item');
  const textarea = template.querySelector('.item-text');

  template.querySelector('.delete').addEventListener('click', () => deleteTask(task, element));
  template.querySelector('.edit').addEventListener('click', () => editTask(task, element));
  template.querySelector('.check').addEventListener('click', () => checkTask(task, element));
  textarea.setAttribute('data-value', task.value);
  textarea.textContent = task.value;
  if (task.isCompleted === true) {
    element.style.color = 'var(--clr-green)';
  }
  setTimeout(() => {
    element.classList.add('show');
  }, 10);

  itemContainer.appendChild(template);
  // coolTextLoad(textarea);
}

function deleteTask(task, element) {
  tasks = tasks.filter((item) => item !== task);
  localStorage.setItem('task', JSON.stringify(tasks));
  element.classList.remove('show');
  setTimeout(() => {
    element.remove();
  }, 400);
}

function editTask(task, element) {
  const textarea = element.querySelector('.item-text');
  if (textarea.hasAttribute('contenteditable', 'true')) {
    textarea.removeAttribute('contenteditable');
    tasks[tasks.indexOf(task)].value = textarea.textContent;
    localStorage.setItem('task', JSON.stringify(tasks));
    textarea.setAttribute('data-value', textarea.textContent);
    // coolTextLoad(textarea);
  } else {
    textarea.setAttribute('contenteditable', 'true');
  }
}

function checkTask(task, element) {
  const textarea = element.querySelector('.item-text');
  // coolTextLoad(textarea);
  tasks[tasks.indexOf(task)].isCompleted = true;
  localStorage.setItem('task', JSON.stringify(tasks));
  element.style.color = 'var(--clr-green)';
}

// function coolTextLoad(element) {
//   let iteration = Math.floor(element.textContent.length / 6);
//   let interval = setInterval(() => {
//     element.textContent = element.textContent
//       .split('')
//       .map((letter, index) => {
//         return index < iteration
//           ? element.dataset.value[index]
//           : letter !== ' ' && letter === letter.toLowerCase()
//           ? letters[Math.floor(Math.random() * 26)].toLowerCase()
//           : letter !== ' '
//           ? letters[Math.floor(Math.random() * 26)]
//           : ' ';
//       })
//       .join('');
//     if (iteration > element.textContent.length) {
//       clearInterval(interval);
//     }
//     iteration += 1;
//   }, 60);
// }
