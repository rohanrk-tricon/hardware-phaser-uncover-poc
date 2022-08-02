import App from './App';

// eslint-disable-next-line jest/expect-expect
it('stepper should default to 0', () => {
  // Arrange
  cy.mount(<App />);
  // Assert
  // cy.get(counterSelector).should('have.text', '0');
});
