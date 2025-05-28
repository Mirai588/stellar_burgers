/// <reference types="cypress" />

const SELECTORS = {
  MODAL: '[data-cy=modal]',
  MODAL_CLOSE: '[data-cy=modal_close]',
  MODAL_OVERLAY: '[data-cy=modal_overlay]',
  INGREDIENT: id => `[data-cy=ingredient_${id}]`,
};

describe('Окна с информацией об ингредиентах', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then(win => win.localStorage.clear());
  });

  it('Открытие модального окна с данными об ингредиенте', () => {
    const ingredientId = '643d69a5c3f7b9001cfa093c';
    const expectedTitle = 'Краторная булка N-200i';

    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.INGREDIENT(ingredientId))
      .scrollIntoView()
      .click();

    cy.get(SELECTORS.MODAL).should('exist');

    cy.get(SELECTORS.MODAL).should('contain.text', expectedTitle);
    cy.get(SELECTORS.MODAL).should('contain.text', 'Калории');
  });

  it('Закрытие модального окна через кнопку', () => {
    const id = '643d69a5c3f7b9001cfa093c';

    cy.get(SELECTORS.INGREDIENT(id)).scrollIntoView().click();
    cy.get(SELECTORS.MODAL).should('exist');

    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Закрытие окна кликом по затемнённой области', () => {
    const id = '643d69a5c3f7b9001cfa093c';

    cy.get(SELECTORS.INGREDIENT(id)).scrollIntoView().click();
    cy.get(SELECTORS.MODAL).should('exist');

    cy.get(SELECTORS.MODAL_OVERLAY)
      .click({ force: true });

    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Модалка отображает полные характеристики ингредиента', () => {
    const id = '643d69a5c3f7b9001cfa093c'; // Краторная булка N-200i
  
    cy.get(SELECTORS.INGREDIENT(id)).scrollIntoView().click();
    cy.get(SELECTORS.MODAL).should('exist');
  
    cy.get(SELECTORS.MODAL).within(() => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Калории, ккал').should('exist');
      cy.contains('Белки, г').should('exist');
      cy.contains('Жиры, г').should('exist');
      cy.contains('Углеводы, г').should('exist');
    });
  });  
});
