/// <reference types="cypress" />

import {WoosmapPublicKey} from "../../src/configuration/map.config";
import Urls from "../../src/configuration/urls.config";

const mapJSUrl = `${Urls.mapJS}?key=${WoosmapPublicKey}`;
const localitiesJSUrl = `${Urls.localitiesWidgetJS}?key=${WoosmapPublicKey}`;

describe('Opening Store Locator', () => {
    before(() => {
        cy.intercept('GET', 'https://api.woosmap.com/**/*')
            .as('woosmapAPI');

        cy.visit('http://localhost:1234/')
    })
    it('Check the scripts loading', () => {
        // Verify initial map load successful.
        cy.wait('@woosmapAPI')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait(2000);

        it('Check Map JS Library', () => {
            cy.get(`head script[src="${mapJSUrl}"]`).should('exist');
        })
        it('Check Localities JS Library', () => {
            cy.get(`head script[src="${localitiesJSUrl}"]`).should('exist');
        })

    })
})
