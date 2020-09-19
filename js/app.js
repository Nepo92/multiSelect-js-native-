/* eslint-disable no-plusplus */
const template = (data = [], placeholder) => {
  const text = placeholder ?? '';
  const items = data.map((item) => {
    return `<li tabindex="0" class="multiselect__item" data-type="item" data-id="${item.id}">${item.value}</li>`;
  });
  return `
  <div tabindex="0" class="multiselect__input" data-type="input">
    <span data-type="value" class="multiselect__placeholder">${text}</span>
    <i class="fas fa-angle-up select__icon"></i>
  </div>
  <div class="multiselect__body">
    <ul class="multiselect__list">
      ${items.join('')}
    </ul>
  </div>
  `;
};

export default class multiSelect {
  constructor(selector, options) {
    this.multiSelect = document.querySelector(selector);
    this.options = options;
    this.placeholder = options.placeholder;
    this.chooseitems = [];
    this.render();
    this.settings();
  }

  render() {
    const { placeholder, data } = this.options;
    this.multiSelect.classList.add('multiselect');
    this.multiSelect.innerHTML = template(data, placeholder, this.selectedId);
    this.angle = this.multiSelect.querySelector('.fas');
  }

  settings() {
    this.clickHandler = this.clickHandler.bind(this);
    this.multiSelect.addEventListener('click', this.clickHandler);
    this.tabHandler = this.tabHandler.bind(this);
    this.multiSelect.addEventListener('keyup', this.tabHandler);
    this.items = document.querySelectorAll('.multiselect__item');
    document.body.addEventListener('click', (event) => {
      if (!event.target.classList.contains('multiselect__input') && !event.target.classList.contains('multiselect__item')) {
        this.close();
      }
    });
    this.value = this.multiSelect.querySelector('[data-type="value"]');
    this.multiSelectInput = this.multiSelect.querySelector('.multiselect__input');
    this.multiSelectPlaceholder = this.multiSelect.querySelector('.multiselect__placeholder');
  }

  clickHandler(event) {
    const { type } = event.target.dataset;
    if (type === 'input') {
      this.toggle();
    } else if (type === 'item') {
      this.addChoose(event);
    } else if (type === 'choose') {
      this.delChoose(event);
    }
  }

  addChoose(event) {
    this.element = event.target.textContent;

    if (this.element === '') return;

    for (let i = 0; i < this.items.length; i++) {
      if (this.element === this.chooseitems[i]) {
        return;
      }
    }

    this.chooseitems.push(this.element);

    /* Создаем элемент */
    this.elem = document.createElement('span');
    this.elem.setAttribute('data-type', 'choose');
    this.elem.setAttribute('tabindex', '0');
    this.elem.classList.add('multiselect__choose');

    /* Изменяем поток */
    this.multiSelectInput.style.justifyContent = 'flex-start';

    /* Убираем placeholder */
    this.multiSelectPlaceholder.innerHTML = '';

    /* Добавляем элемент */
    this.multiSelectInput.appendChild(this.elem);

    /* Вносим в эемент текст выбранного айтема */
    this.elem.innerHTML = event.target.textContent;

    console.log(this.chooseitems); // Выбор до редактирования
  }

  delChoose(event) {
    this.element = event.target;
    this.elementText = event.target.textContent;

    for (let i = 0; i < this.items.length; i++) {
      if (this.elementText === this.chooseitems[i]) {
        this.index = this.chooseitems.indexOf(this.elementText);
        this.chooseitems.splice(this.index, 1);
        console.log(this.chooseitems); // Выбор после редактирования
      }
    }
    this.element.style.display = 'none';
    if (this.chooseitems.length === 0) this.multiSelectPlaceholder.innerHTML = `${this.placeholder}`;
  }

  tabHandler(event) {
    const { type } = event.target.dataset;
    const buttons = event.which;

    if (buttons === 13) {
      if (type === 'input') {
        this.toggle();
      } else if (type === 'item') {
        this.addChoose(event);
      } else if (type === 'choose') {
        this.delChoose(event);
      }
    }
  }

  open() {
    this.multiSelect.classList.add('opened');
    this.angle.classList.remove('fa-angle-up');
    this.angle.classList.add('fa-angle-down');
  }

  close() {
    this.multiSelect.classList.remove('opened');
    this.angle.classList.remove('fa-angle-down');
    this.angle.classList.add('fa-angle-up');
  }

  toggle() {
    !this.multiSelect.classList.contains('opened') ? this.open() : this.close();
  }
}
