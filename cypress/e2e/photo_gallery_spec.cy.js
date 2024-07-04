/* eslint-disable no-undef */
describe("Photo Gallery", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display photos in a responsive grid", () => {
    cy.viewport("macbook-15");
    cy.wait(1000);
    cy.get(".container").then(($container) => {
      const containerWidth = $container.width();
      cy.get(".container .display-flex:visible").then(($images) => {
        const imageWidth = $images.first().width();
        const imagesPerRow = Math.floor(containerWidth / imageWidth);
        expect(imagesPerRow).to.be.greaterThan(1);
      });
    });

    cy.viewport("iphone-6");
    cy.wait(1000);
    cy.get(".container").then(($container) => {
      const containerWidth = $container.width();
      cy.get(".container .display-flex:visible").then(($images) => {
        const imageWidth = $images.first().width();
        const imagesPerRow = Math.floor(containerWidth / imageWidth);
        expect(imagesPerRow).to.be.equal(1);
      });
    });
  });

  it("should lazy load photos", () => {
    cy.get("img.lazy-image").each(($img) => {
      cy.wrap($img).should("not.have.class", "loaded");
    });

    cy.scrollTo(0, 500);
    cy.wait(1000);
    cy.get("img.lazy-image").each(($img) => {
      if (Cypress.dom.isVisible($img)) {
        cy.wrap($img).should("have.class", "loaded");
      }
    });

    cy.scrollTo("bottom");
    cy.wait(1000);
    cy.get("img.lazy-image").each(($img) => {
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
    cy.get(".full-view img").should("be.visible");

    let currentImageUrl;
    cy.get(".full-view img").then(($img) => {
      currentImageUrl = $img.attr("src");
    });

    cy.get("body").trigger("keydown", { key: "ArrowRight", force: true });

    cy.get(".full-view img").should(($img) => {
      const newImageUrl = $img.attr("src");
      expect(newImageUrl).not.to.equal(currentImageUrl);
    });

    cy.get("body").trigger("keydown", { key: "ArrowLeft", force: true });

    cy.get(".full-view img").should(($img) => {
      const newImageUrl = $img.attr("src");
      expect(newImageUrl).to.equal(currentImageUrl);
    });
  });

  it("should go back to gallery on clicking back button", () => {
    cy.get(".btn").first().click();
    cy.get(".full-view").should("be.visible");
    cy.get(".back-button").click();
    cy.get(".full-view").should("not.exist");
    cy.get(".container").should("be.visible");
  });
});
