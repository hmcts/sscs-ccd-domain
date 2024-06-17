import { Page } from '@playwright/test';
import { BaseStep } from './base';
import { credentials } from "../../config/config";
const eventTestData = require("../../pages/content/event.name.event.description_en.json");


export class ListingError extends BaseStep {

    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async performListingErrorEvent(caseId: string) {

        await this.loginUserWithCaseId(credentials.amCaseWorker, true, caseId);
        await this.homePage.reloadPage();
        await this.homePage.chooseEvent('Listing Error');

        //Enter details in event and submit
        await this.eventNameAndDescriptionPage.verifyPageContent('Listing Error');
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();

        // Navigate to History Tab and Verify event is listed
        await this.verifyHistoryTabDetails('Listing error', 'Listing error', eventTestData.eventDescriptionInput);
    }
}
