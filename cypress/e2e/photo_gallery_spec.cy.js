/* eslint-disable no-undef */
describe("Photo Gallery", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display photos in a responsive grid", () => {
    cy.get(".container").should("be.visible");

    cy.viewport("macbook-15");
    cy.get(".container").should(
      "not.have.css", // checks for the absence of a CSS property
      "grid-template-columns",
      "repeat(1, 1fr)"
    );

    cy.viewport("iphone-6");
    cy.checkMediaQuery("(max-width: 768px)");
    cy.get(".container").should(
      "not.have.css", // checks for the absence of a CSS property
      "grid-template-columns",
      "repeat(auto-fill, minmax(200px, 1fr))"
    );
  });

  it("should lazy load photos", () => {
    cy.scrollTo("bottom");
    cy.get("img.lazy-image").each(($img) => {
      // check that only visible images are loaded
      if (Cypress.dom.isVisible($img)) {
        cy.wrap($img).should("have.class", "loaded");
      }
    });
  });

  it("should open photo in full resolution on click", () => {
    cy.get(".btn").first().click();
    cy.get(".full-view").should("be.visible");
  });

  it("should navigate photos using left and right arrow keys", () => {
    cy.get(".btn").first().click();
    cy.get(".full-view").should("be.visible");

    cy.get("body").trigger("keydown", { key: "ArrowRight", force: true });

    cy.get("body").trigger("keydown", { key: "ArrowLeft", force: true });
  });

  it("should go back to gallery on clicking back button", () => {
    cy.get(".btn").first().click();
    cy.get(".full-view").should("be.visible");
    cy.get(".back-button").click();
    cy.get(".full-view").should("not.exist");
    cy.get(".container").should("be.visible");
  });
});
