import Card from './Card';
import { saveToLocalStorage } from './utils';

export default class CardList {
  constructor() {
    this.cardsArray = [];
    this.cardsList = null;
    this.clonedCardObject = null;
    this.clonedEl = null;
    this.ghostEl = null;
    this.openButtons = document.querySelectorAll('.open-card-input');
    this.addButtons = document.querySelectorAll('.add-button');
    this.cancelButtons = document.querySelectorAll('.cancel-button');
    this.plug = null;
  }

  init() {
    this.loadList();
    this.getCardList();
    this.addListners();
  }

  loadList() {
    const loadedList = JSON.parse(localStorage.getItem('cardsList'));
    if (!loadedList) {
      return;
    }
    loadedList.forEach((item) => {
      const newCard = new Card(item);
      this.cardsArray.push(newCard);
    });
  }

  getCardList() {
    this.cardsList = document.querySelectorAll('.card');
  }

  addListners() {
    document.addEventListener('mousemove', (evt) => {
      evt.preventDefault();

      if (!this.ghostEl) {
        this.getGhostEl();
        return;
      }

      if (this.ghostEl !== null && !this.clonedEl) {
        this.getClonedEl();
        return;
      }

      this.clonedCardObject.positionGhostEl(evt);

      this.insertPlug(evt);
    });

    document.addEventListener('mouseup', (evt) => {
      evt.preventDefault();

      if (!this.clonedEl) {
        return;
      }

      this.removeGhostEl();
      this.clearClonedEl();
      this.appendNewCard(evt);
      this.stopDragging();
      saveToLocalStorage();
    });

    this.openButtons.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        const inputBox = item.parentElement.querySelector('.card-input-box');
        inputBox.classList.remove('hidden');
        item.classList.add('hidden');
      });
    });

    this.addButtons.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        const columnCardList = document.querySelector(`#${item.dataset.columnId}`);
        const input = item.closest('.card-input-box').querySelector('.card-input');
        if (input.value === '') {
          return;
        }
        this.addNewCard(columnCardList, input.value);
        input.value = '';
        saveToLocalStorage();
      });
    });

    this.cancelButtons.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        const inputBox = item.closest('.card-input-box');
        inputBox.classList.add('hidden');
        inputBox.nextElementSibling.classList.remove('hidden');
      });
    });
  }

  getGhostEl() {
    this.ghostEl = document.querySelector('.dragged');
  }

  removeGhostEl() {
    this.ghostEl.parentElement.removeChild(this.ghostEl);
    this.ghostEl = null;
  }

  getClonedEl() {
    this.clonedEl = document.querySelector('.cloned');
    const clonedDataId = this.clonedEl.dataset.cardId;
    this.clonedCardObject = this.cardsArray.find((item) => item.cardId === clonedDataId);
  }

  clearClonedEl() {
    this.clonedEl.classList.remove('cloned');
  }

  removeClonedEl() {
    this.clonedEl.parentElement.removeChild(this.clonedEl);
  }

  insertPlug(event) {
    this.ghostEl.style.display = 'none';
    const closestCard = document.elementFromPoint(event.clientX, event.clientY).closest('.card');
    if (!closestCard) {
      this.ghostEl.style.display = 'block';
      return;
    }

    this.removePlug();

    if (closestCard.classList.contains('cloned')) {
      this.ghostEl.style.display = 'block';
      return;
    }

    this.plug = document.createElement('div');
    this.plug.classList.add('plug');
    this.plug.style.height = `${this.clonedEl.getBoundingClientRect().height}px`;

    closestCard.parentElement.insertBefore(this.plug, closestCard);

    this.ghostEl.style.display = 'block';
  }

  removePlug() {
    if (!this.plug) {
      return;
    }
    this.plug.parentElement.removeChild(this.plug);
    this.plug = null;
  }

  replacePlug(card) {
    this.plug.parentElement.replaceChild(card, this.plug);
    this.plug = null;
  }

  appendNewCard(event) {
    const newCard = new Card(this.clonedCardObject);
    this.cardsArray.push(newCard);

    if (this.plug !== null) {
      this.replacePlug(newCard.cardDiv);
      this.removeClonedEl();
      this.refreshCardsArray();
      return;
    }

    const closestColumn = document.elementFromPoint(event.clientX, event.clientY).closest('.column');
    if (!closestColumn) {
      return;
    }
    closestColumn.querySelector('.column-cards-list').insertAdjacentElement('beforeend', newCard.cardDiv);
    this.removeClonedEl();
    this.refreshCardsArray();
  }

  stopDragging() {
    this.clonedCardObject = null;
    this.clonedEl = null;
    this.ghostEl = null;
    this.getCardList();
  }

  refreshCardsArray() {
    const clonedCardId = this.clonedCardObject.cardId;
    this.cardsArray = this.cardsArray.filter((item) => item.cardId !== clonedCardId);
  }

  addNewCard(columnList, text) {
    const newCard = new Card({ cardParentId: columnList.id, cardText: text });
    this.cardsArray.push(newCard);
  }
}
