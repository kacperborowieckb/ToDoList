const form = document.querySelector('.form');
const input = document.querySelector('.input');
const submitBtn = document.querySelector('.add-button');
const timeInput = document.querySelector('.time-input');
const itemTemplate = document.querySelector('.list-item-temp');
const itemContainer = document.querySelector('.list');
const seconds = 1000;
const minutes = seconds * 60;
const hours = minutes * 60;

input.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    submitBtn.click();
    e.preventDefault();
  }
  input.style.height = '32px';
  let scHeight = e.target.scrollHeight;
  input.style.height = `${scHeight}px`;
});

let tasks = JSON.parse(localStorage.getItem('task')) || [];

if (localStorage.getItem('task')) {
  tasks.map((task) => createTask(task));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value.trim() === '') {
    form.reset();
    return;
  }

  const task = {
    value: input.value,
    isCompleted: false,
    deadLine: timeInput.value || 'No dead line',
  };
  tasks.push(task);
  localStorage.setItem('task', JSON.stringify(tasks));

  createTask(task);

  form.reset();
  input.focus();
  input.style.height = '32px';
});

function createTask(task) {
  const template = itemTemplate.content.cloneNode(true);
  const element = template.querySelector('.list-item');
  const textarea = template.querySelector('.item-text');
  const time = template.querySelector('.time');

  createTimer(task, time);

  template.querySelector('.delete').addEventListener('click', () => deleteTask(task, element));
  template.querySelector('.edit').addEventListener('click', () => editTask(task, element));
  template.querySelector('.check').addEventListener('click', () => checkTask(task, element));

  textarea.textContent = task.value;
  if (task.isCompleted === true) {
    element.style.color = 'var(--clr-green)';
    element.querySelector('.edit').setAttribute('disabled', 'disabled');
  }
  setTimeout(() => {
    element.classList.add('show');
  }, 10);

  itemContainer.appendChild(template);
}

function createTimer(task, element) {
  if (task.isCompleted === true) {
    element.textContent = 'FINISHED!';
    return;
  }

  if (task.deadLine === 'No dead line') {
    return;
  } else if (task.deadLine === 'End of time') {
    element.textContent = 'END OF TIME';
    element.parentElement.style.opacity = 0.6;
    return;
  }

  let timeout = setTimeout(createTimer, 1000, task, element);

  let today = new Date();
  let currentTime =
    today.getHours() * hours + today.getMinutes() * minutes + today.getSeconds() * seconds;
  let deadLineArr = task.deadLine.split(':');

  let deadLine = deadLineArr[0] * hours + deadLineArr[1] * minutes;

  let gap = deadLine > currentTime ? deadLine - currentTime : deadLine - (currentTime - hours * 24);

  let hoursLeft = Math.floor(gap / hours);
  let minutesLeft = Math.floor((gap % hours) / minutes);

  if (hoursLeft === 0 && minutesLeft === 0 && today.getSeconds() === 59) {
    element.textContent = 'END OF TIME';
    task.deadLine = 'End of time';
    localStorage.setItem('task', JSON.stringify(tasks));
    element.parentElement.style.opacity = 0.6;
    clearTimeout(timeout);
  } else {
    element.textContent = `${hoursLeft} HOURS ${minutesLeft} MINUTES LEFT`;
  }
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
    task.value = textarea.textContent;
    localStorage.setItem('task', JSON.stringify(tasks));
    textarea.setAttribute('data-value', textarea.textContent);
    textarea.style['box-shadow'] = '';
  } else {
    textarea.setAttribute('contenteditable', 'true');
    textarea.style['box-shadow'] = '0px 0px 5px hsla(0, 0%, 100%, 0.2)';
  }
}

function checkTask(task, element) {
  task.isCompleted = true;
  localStorage.setItem('task', JSON.stringify(tasks));
  element.style.color = 'var(--clr-green)';
  element.querySelector('p').textContent = 'FINISHED!';
  element.style.opacity = 1;
  element.querySelector('.edit').setAttribute('disabled', 'disabled');
}
