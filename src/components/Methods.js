import StorageManager from './Storage.js';
import Todolist from './Todolist.js';
import UpdateUI from './UpdateUI.js';

export default class Methods {
  constructor(itemsToDelete = [], toogle = false) {
    this.itemsToDelete = itemsToDelete;
    this.toogle = toogle;
    this.listLength = StorageManager.getData().length;
  }

  markListForChanges = (li, id, listContainer) => {
    /* line 13 - 17 is for cases where a user selects items for delete */
    /* and goes ahead to add to the list */

    const storedDataLength = StorageManager.getData().length;
    if (this.listLength < storedDataLength) {
      this.itemsToDelete.length = 0;
    }

    const taskDescription = li.children[1];
    Methods.taskKeyDown(taskDescription, id, listContainer);
    const elipsis = li.lastChild.children[0];
    const deleteIcon = li.lastChild.children[1];
    const index = this.itemsToDelete.indexOf(id);

    if (index !== -1) {
      this.toogle = !this.toogle;
      this.itemsToDelete.splice(index, 1);
    } else {
      this.toogle = true;
      this.itemsToDelete.push(id);
      this.listLength = StorageManager.getData().length;
    }

    if (this.toogle) {
      li.classList.add('markActive');
      elipsis.classList.add('trash');
      deleteIcon.classList.remove('trash');
      taskDescription.contentEditable = true;
      taskDescription.classList.add('task-description-border');

      // the following code is used to set cursor to the end of the span tag on edit
      const range = document.createRange();
      range.selectNodeContents(taskDescription);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      li.classList.remove('markActive');
      elipsis.classList.remove('trash');
      deleteIcon.classList.add('trash');
      taskDescription.contentEditable = false;
      taskDescription.classList.remove('task-description-border');
      Methods.editTaskDescription(taskDescription, id);
    }
    this.addListenerForRemove(deleteIcon, listContainer);
    this.toogle = true;
  }

  addListenerForRemove = (deleteBtn, listContainer) => {
    deleteBtn.addEventListener('click', () => {
      Todolist.remove(this.itemsToDelete);
      this.itemsToDelete.length = 0;
      Methods.uIRefreshInstance(listContainer);
    });
  }

  static editTaskDescription = (taskDescriptionSpanTag, id) => {
    const taskDescription = taskDescriptionSpanTag.textContent;
    const toDoList = StorageManager.getData();
    if (taskDescription !== '') {
      toDoList[id - 1].description = taskDescriptionSpanTag.textContent;
      StorageManager.storeData(toDoList);
    } else {
      taskDescriptionSpanTag.textContent = toDoList[id - 1].description;
    }
  }

  static uIRefreshInstance = (listContainer) => {
    const ulManager = new UpdateUI(listContainer, StorageManager.getData());
    ulManager.refreshUI();
  }

  static taskKeyDown(taskDescriptionSpanTag, id, listContainer) {
    taskDescriptionSpanTag.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        Methods.editTaskDescription(taskDescriptionSpanTag, id);
        Methods.uIRefreshInstance(listContainer);
      }
    });
  }
}