/// <reference types="cypress" />

import Selectors from "../../src/configuration/selectors.config";
import searchInput from "../fixtures/searchInput";
import streets from "../fixtures/streets";
import tiles from "../fixtures/tiles";
import Urls from "../../src/configuration/urls.config";
import {WoosmapPublicKey} from "../../src/configuration/map.config";

const localitiesJSUrl = `${Urls.localitiesWidgetJS}?key=${WoosmapPublicKey}`;

describe('Searching for locality Use Case', () => {
    before(() => {
        cy.intercept('GET', 'https://api.woosmap.com/maps/tiles.json?*', (req) => {
            req.reply(res => {
                res.body = tiles;
            })
        }).as('woosmapTilesJSON');
        cy.intercept('GET', 'https://api.woosmap.com/maps/style/streets.json?*', (req) => {
            req.reply(res => {
                res.body = streets;
            })
        }).as('woosmapStreetsJSON');

        cy.intercept({
            method: 'GET',
            url: '**.pbf'
        }).as('woosmapTiles');
        cy.intercept('GET', 'https://api.woosmap.com/localities/autocomplete/**/*')
            .as('localitiesAutocomplete');
        cy.intercept('GET', 'https://api.woosmap.com/stores/search/**/*')
            .as('storesSearch');
        cy.intercept({
            method: 'GET',
            url: 'https://sdk.woosmap.com/map/assets/sprite@2x.png',
        }, {fixture: "../../cypress/fixtures/sprite@2x.png"}).as('imageRequest')
        cy.visit('http://localhost:1234/')
    })
    it(`search for ${searchInput.london} in Localities Widget and display nearby stores`, () => {
        cy.wait('@woosmapTilesJSON')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait('@woosmapStreetsJSON')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait('@woosmapTiles')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.get(`head script[src="${localitiesJSUrl}"]`).should('exist');
        cy.searchLocality(searchInput.montpellier);
        cy.wait('@localitiesAutocomplete')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.wait('@storesSearch')
            .then((interception) => {
                expect(interception.response?.statusCode).to.equal(200);
            });
        cy.get(`#${Selectors.listStoresContainerID}`).should('be.visible');
    })

})
