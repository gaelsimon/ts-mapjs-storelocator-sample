/// <reference types="cypress" />

import userLatLng from "../../cypress/fixtures/userLatLng";
import Selectors from "../../src/configuration/selectors.config";

describe('Geolocation Use Cases', () => {
    before(() => {
        cy.intercept('GET', 'https://api.woosmap.com/**/*')
            .as('woosmapAPI');
        cy.intercept('GET', 'https://sdk.woosmap.com/**/*')
            .as('woosmapSDK');

        cy.intercept({
            method: 'GET',
            url: 'https://sdk.woosmap.com/map/assets/sprite@2x.png',
        }, {fixture: "../../cypress/fixtures/sprite@2x.png"}).as('imageRequest')


        cy.visitWithGeolocation("http://localhost:1234", userLatLng);
    })
    it(`Geolocate the user on click search__geolocateBtn and display Nearby Stores`, () => {
        // Verify initial map load successful.
        cy.wait('@woosmapAPI')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait('@woosmapSDK')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.get(`#${Selectors.searchWrapperID}`)
            .find('.search__geolocateBtn')
            .click()
        cy.get(`#${Selectors.listStoresContainerID}`).should('be.visible')
    })
})

