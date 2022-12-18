/// <reference types="cypress" />

import {WoosmapPublicKey} from "../../src/configuration/map.config";
import Urls from "../../src/configuration/urls.config";

const mapJSUrl = `${Urls.mapJS}?key=${WoosmapPublicKey}`;
const localitiesJSUrl = `${Urls.localitiesWidgetJS}?key=${WoosmapPublicKey}`;

describe('Opening Store Locator', () => {
    before(() => {
        cy.intercept('GET', 'https://api.woosmap.com/**/*')
            .as('woosmapAPI');
        cy.intercept('GET', 'https://sdk.woosmap.com/**/*')
            .as('woosmapSDK');

        cy.intercept({
            method: 'GET',
            url: 'https://sdk.woosmap.com/map/assets/sprite@2x.png',
        }, {fixture: "../../cypress/fixtures/sprite@2x.png"}).as('imageRequest')


        cy.visit('http://localhost:1234/')
    })
    it('Check the scripts loading', () => {
        // Verify initial map load successful.
        cy.wait('@woosmapAPI')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait('@woosmapSDK')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait(5000);

        it('Check Map JS Library', () => {
            cy.get(`head script[src="${mapJSUrl}"]`).should('exist');
        })
        it('Check Localities JS Library', () => {
            cy.get(`head script[src="${localitiesJSUrl}"]`).should('exist');
        })

    })
})
