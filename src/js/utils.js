function saveToLocalStorage() {
  const arr = [];
  const cardsList = document.querySelectorAll('.card');
  cardsList.forEach((item) => {
    arr.push({
      cardParentId: item.parentElement.id,
      cardText: item.firstChild.textContent,
    });
  });

  localStorage.setItem('cardsList', JSON.stringify(arr));
}

function getRandomId() {
  return `${Math.random().toString(36).substr(2, 9)}`;
}

export { saveToLocalStorage, getRandomId };
