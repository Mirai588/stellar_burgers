/// <reference types="cypress" />

const SELECTORS = {
  BUN_INGREDIENTS: '[data-cy=bun_ingredients]',
  MAIN_INGREDIENTS: '[data-cy=main_ingredients]',
  BUN_TOP: '[data-cy=bun_top_constructor]',
  BUN_BOTTOM: '[data-cy=bun_bottom_constructor]',
  MAIN_CONSTRUCTOR: '[data-cy=main_constructor]',
  INGREDIENT: id => `[data-cy=ingredient_${id}]`,
};

describe('Проверка конструктора: ингредиенты', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Конструктор пуст после загрузки страницы', () => {
    cy.get(SELECTORS.BUN_TOP).should('not.exist');
    cy.get(SELECTORS.BUN_BOTTOM).should('not.exist');

    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .find('li')
      .should('have.length', 0);
    
  });

  it('Булка устанавливается в конструктор как верх и низ', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const bunLabel = 'Краторная булка N-200i';

    cy.get(SELECTORS.BUN_INGREDIENTS)
      .should('be.visible')
      .and('include.text', bunLabel);

    cy.get(SELECTORS.BUN_TOP).should('not.exist');
    cy.get(SELECTORS.BUN_BOTTOM).should('not.exist');

    cy.get(SELECTORS.INGREDIENT(bunId))
      .should('be.visible')
      .within(() => cy.contains('Добавить').click());

    cy.get(SELECTORS.BUN_TOP)
      .should('contain.text', bunLabel);

    cy.get(SELECTORS.BUN_BOTTOM)
      .should('contain.text', bunLabel);
  });

  it('Добавление одного ингредиента из блока начинок', () => {
    const id = '643d69a5c3f7b9001cfa0941';
    const label = 'Биокотлета из марсианской Магнолии';

    cy.get(SELECTORS.MAIN_INGREDIENTS)
      .scrollIntoView()
      .should('exist')
      .and('contain.text', label);

    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('not.include.text', label);

    cy.get(SELECTORS.INGREDIENT(id))
      .scrollIntoView()
      .contains('Добавить')
      .click();

    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('contain.text', label);
  });

  it('Добавление одинаковых начинок дважды', () => {
    const targetId = '643d69a5c3f7b9001cfa0941';
    const text = 'Биокотлета из марсианской Магнолии';

    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .should('not.contain.text', text);

    Array.from({ length: 2 }).forEach(() => {
      cy.get(SELECTORS.INGREDIENT(targetId))
        .scrollIntoView()
        .contains('Добавить')
        .click();
    });

    cy.get(SELECTORS.MAIN_CONSTRUCTOR)
      .find('li')
      .filter(`:contains("${text}")`)
      .should('have.length', 2);
  });
});
