/* eslint-disable no-undef */
Cypress.Commands.add("checkMediaQuery", (query) => {
  const match = window.matchMedia(query);
  expect(match.matches).to.be.true;
});
