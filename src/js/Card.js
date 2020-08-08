import { saveToLocalStorage, getRandomId } from './utils';

export default class Card {
  constructor(obj) {
    this.cardParentId = obj.cardParentId;
    this.cardText = obj.cardText;
    this.cardId = getRandomId();
    this.cardDiv = null;
    this.cardParentElement = null;
    this.ghostEl = null;
    this.shiftX = null;
    this.shiftY = null;
    this.deleteButton = null;
    this.init();
  }

  init() {
    this.createCardDiv();
    this.insertCard(this.cardParentElement);
    this.deleteButton = this.cardDiv.querySelector('.remove-button');
    this.addListners();
  }

  addListners() {
    this.cardDiv.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains('remove-button')) {
        this.cardDiv.parentElement.removeChild(this.cardDiv);
        saveToLocalStorage();
        return;
      }
      this.createGhostEl(evt);
    });

    this.cardDiv.addEventListener('mousemove', (evt) => {
      evt.preventDefault();

      if (!this.ghostEl) {
        return;
      }
      this.positionGhostEl(evt);
    });

    this.cardDiv.addEventListener('mouseover', () => {
      this.deleteButton.classList.remove('hidden');
    });

    this.cardDiv.addEventListener('mouseout', () => {
      this.deleteButton.classList.add('hidden');
    });
  }

  createCardDiv() {
    this.cardDiv = document.createElement('div');
    this.cardDiv.classList.add('card');
    this.cardDiv.innerHTML = `<span>${this.cardText}</span><div class="remove-button hidden">&#10005;</div>`;
    this.cardDiv.dataset.cardId = this.cardId;
    this.cardParentElement = document.querySelector(`#${this.cardParentId}`);
  }

  insertCard(parent) {
    parent.insertAdjacentElement('beforeend', this.cardDiv);
  }

  createGhostEl(event) {
    this.ghostEl = this.cardDiv.cloneNode(true);
    this.ghostEl.classList.add('dragged');
    document.body.appendChild(this.ghostEl);
    this.cardDiv.classList.add('cloned');
    this.positionGhostEl(event);
  }

  getElementShift(event) {
    this.shiftX = event.clientX - this.cardDiv.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.cardDiv.getBoundingClientRect().top;
  }

  positionGhostEl(event) {
    if (!this.shiftX || !this.shiftY) {
      this.getElementShift(event);
    }

    this.ghostEl.style.left = `${event.pageX - this.shiftX}px`;
    this.ghostEl.style.top = `${event.pageY - this.shiftY}px`;
  }
}
