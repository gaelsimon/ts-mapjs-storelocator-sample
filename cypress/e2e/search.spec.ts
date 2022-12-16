/// <reference types="cypress" />

import Selectors from "../../src/configuration/selectors.config";
import searchInput from "../fixtures/searchInput";
import Urls from "../../src/configuration/urls.config";
import {WoosmapPublicKey} from "../../src/configuration/map.config";

const localitiesJSUrl = `${Urls.localitiesWidgetJS}?key=${WoosmapPublicKey}`;

describe('Searching for locality Use Case', () => {
    before(() => {
        cy.visit('http://localhost:1234/')
    })
    it(`check localitiesJS`, () => {
        cy.get(`head script[src="${localitiesJSUrl}"]`).should('exist');
    })
    it(`search Locality`, () => {
        cy.searchLocality(searchInput.montpellier);
    })
    it(`get listied stores`, () => {
        cy.get(`#${Selectors.listStoresContainerID}`).should('be.visible');
    })
})
