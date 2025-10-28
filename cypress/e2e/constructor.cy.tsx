describe('Конструктор бургеров - добавление ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('ingredientsApi');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('userApi');

    cy.visit('/');
    cy.wait(['@ingredientsApi', '@userApi']);
  });

  it('Должен добавлять булку в конструктор', () => {
    cy.get('[data-testid=ingredient-item]').should(
      'have.length.greaterThan',
      0
    );

    cy.contains('[data-testid=ingredient-item]', 'Краторная булка N-200i')
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-testid=constructor-bun-bottom]')
      .should('contain', 'Краторная булка N-200i')
      .and('contain', 'низ');

    cy.get('[data-testid=constructor-bun-top]')
      .should('contain', 'Краторная булка N-200i')
      .and('contain', 'верх');
  });

  it('Должен добавлять начинку в конструктор', () => {
    cy.contains(
      '[data-testid=ingredient-item]',
      'Биокотлета из марсианской Магнолии'
    )
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-testid=constructor-fillings]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});

describe('Конструктор бургеров - модальные окна', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('ingredientsApi');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('userApi');

    cy.visit('/');
    cy.wait(['@ingredientsApi', '@userApi']);
  });

  it('Открытие модального окна при клике', () => {
    cy.contains(
      '[data-testid=ingredient-item]',
      'Краторная булка N-200i'
    ).click();

    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal-title]').should('contain', 'Детали ингредиента');
  });

  it('Закрытие модального окна по кнопке', () => {
    cy.contains(
      '[data-testid=ingredient-item]',
      'Краторная булка N-200i'
    ).click();

    cy.get('[data-testid=modal]').should('be.visible');

    cy.get('[data-testid=modal-close]').click();

    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('Закрытие модального окна по оверлею', () => {
    cy.contains(
      '[data-testid=ingredient-item]',
      'Краторная булка N-200i'
    ).click();

    cy.get('[data-testid=modal]').should('be.visible');

    cy.get('[data-testid=modal-overlay]').click({ force: true });

    cy.get('[data-testid=modal]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('ingredientsApi');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('userApi');

    cy.fixture('order.json').then((orderResponse) => {
      cy.intercept('POST', '**/api/orders', (req) => {
        expect(req.headers.authorization).to.exist;

        req.reply({
          statusCode: 200,
          body: orderResponse
        });
      }).as('createOrderApi');
    });

    window.localStorage.setItem('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait(['@ingredientsApi', '@userApi']);
  });

  it('Оформление заказа и очищение конструктора', () => {
    cy.contains('[data-testid=ingredient-item]', 'Краторная булка N-200i')
      .contains('button', 'Добавить')
      .click();

    cy.contains(
      '[data-testid=ingredient-item]',
      'Биокотлета из марсианской Магнолии'
    )
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-testid=constructor-bun-top]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-testid=constructor-fillings]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrderApi');

    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=order-number]').should('contain', '92488');

    cy.get('[data-testid=modal-close]').click();

    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('[data-testid=constructor-bun-top]').should('not.exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('not.exist');
    cy.get('[data-testid=constructor-fillings] li').should('not.exist');
  });
});
