import _ from 'lodash';
import './style.css';
import UpdateUI from './components/UpdateUI.js';
import Todolist from './components/Todolist.js';
import storageManager from './components/Storage.js';
import Methods from './components/Methods.js';
import { markCompleted, clearCompleted } from './components/Completed.js';

const listText = document.querySelector('.input-task');
const addListBtn = document.querySelector('#add');
const todosHolder = document.querySelector('.list');
const clearList = document.querySelector('.clear');
const localStorage = storageManager.getData();

const ulManager = new UpdateUI(todosHolder, localStorage);
const Method = new Methods();

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = _;
  return element;
};

const addToList = () => {
  if (listText.value !== '') {
    Todolist.add(listText.value);
    ulManager.refreshUI();
    listText.value = '';
  }
};

const submitEnter = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addToList();
  }
};

addListBtn.addEventListener('click', addToList);
listText.addEventListener('keyup', submitEnter);

todosHolder.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const listId = e.target.id.replace('list-', '');
    Method.markListForChanges(e.target, listId, todosHolder);
  } else if (e.target.tagName === 'INPUT') {
    const checkbox = e.target;
    const { id } = e.target;
    markCompleted(checkbox, id, todosHolder);
  }
});

clearList.addEventListener('click', () => {
  clearCompleted(todosHolder);
});

document.body.appendChild(component());
window.onresize = ulManager.refreshUI();