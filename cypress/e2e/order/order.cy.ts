/// <reference types="cypress" />

const SELECTORS = {
  USER_API: '/api/auth/user',
  ORDERS_API: '/api/orders',
  INGREDIENTS_API: '/api/ingredients',
  INGREDIENT: id => `[data-cy=ingredient_${id}]`,
  CONSTRUCTOR: '[data-cy=burger_constructor]',
  ORDER_SECTION: '[data-cy=order_container]',
  MODAL: '[data-cy=modal]',
  MODAL_CLOSE: '[data-cy=modal_close]',
  CONSTRUCTOR_ITEM: '[data-cy^=constructor_item_]',
};

describe('Создание и оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', SELECTORS.USER_API, { fixture: 'user-response.json' });
    cy.intercept('POST', SELECTORS.ORDERS_API, { fixture: 'order-response.json' });
    cy.intercept('GET', SELECTORS.INGREDIENTS_API, { fixture: 'ingredients.json' });

    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then(w => w.localStorage.clear());
  });

  it('Сборка и успешное оформление бургера', () => {
    const bun = '643d69a5c3f7b9001cfa093c';
    const bunLabel = 'Краторная булка N-200i';
    const filling = '643d69a5c3f7b9001cfa0941';
    const fillingLabel = 'Биокотлета из марсианской Магнолии';

    cy.get(SELECTORS.CONSTRUCTOR)
      .should('not.contain.text', bunLabel)
      .and('not.contain.text', fillingLabel);

    cy.get(SELECTORS.INGREDIENT(bun)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(filling)).contains('Добавить').click();

    cy.get(SELECTORS.CONSTRUCTOR)
      .should('contain.text', bunLabel)
      .and('contain.text', fillingLabel);

    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();

    cy.get(SELECTORS.MODAL)
      .should('exist')
      .and('contain.text', '912');

    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.CONSTRUCTOR)
      .invoke('text')
      .then(text => {
        expect(text).to.include('Выберите начинку');
        const buns = (text.match(/Выберите булки/g) || []).length;
        expect(buns).to.eq(2);
      });
  });

  it('Заказ невозможен без ингредиентов', () => {
    cy.get(SELECTORS.CONSTRUCTOR)
      .invoke('text')
      .then(text => {
        expect(text).to.include('Выберите начинку');
        const prompts = (text.match(/Выберите булки/g) || []).length;
        expect(prompts).to.eq(2);
      });

    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Попытка оформить заказ без булки не проходит', () => {
    const filling = '643d69a5c3f7b9001cfa0941';

    cy.get(SELECTORS.INGREDIENT(filling)).contains('Добавить').click();
    cy.get(SELECTORS.CONSTRUCTOR).should('contain.text', 'Биокотлета');

    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('После оформления конструктор сбрасывается полностью', () => {
    const bun = '643d69a5c3f7b9001cfa093c';
    const filling = '643d69a5c3f7b9001cfa0941';

    cy.get(SELECTORS.INGREDIENT(bun)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(filling)).contains('Добавить').click();

    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();

    cy.get(SELECTORS.CONSTRUCTOR)
      .find(SELECTORS.CONSTRUCTOR_ITEM)
      .should('have.length', 0);
  });

  it('Пользователь может оформить несколько заказов подряд', () => {
    const bun = '643d69a5c3f7b9001cfa093c';
    const filling = '643d69a5c3f7b9001cfa0941';

    // Первый заказ
    cy.get(SELECTORS.INGREDIENT(bun)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(filling)).contains('Добавить').click();
    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();

    cy.get(SELECTORS.CONSTRUCTOR_ITEM).should('have.length', 0);

    // Второй заказ
    cy.get(SELECTORS.INGREDIENT(bun)).contains('Добавить').click();
    cy.get(SELECTORS.INGREDIENT(filling)).contains('Добавить').click();
    cy.get(SELECTORS.ORDER_SECTION).contains('Оформить заказ').click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();
  }); 
});
