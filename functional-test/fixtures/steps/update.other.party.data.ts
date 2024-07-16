import { expect, Page } from '@playwright/test';
import { BaseStep } from './base';
import { credentials } from "../../config/config";
import addUpdateOtherPartyData from "../../pages/content/update.other.party.data_en.json"
import createCaseBasedOnCaseType from "../../api/client/sscs/factory/appeal.type.factory";
import { StringUtilsComponent } from "../../utils/StringUtilsComponent";
import { time } from 'console';
const eventTestData = require("../../pages/content/event.name.event.description_en.json");

export class UpdateOtherPartyData extends BaseStep {

    readonly page: Page;


    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async performUpdateOtherPartyData(caseId: string) {
        // Creating case - CHILDSUPPORT
        var ChildSupportCaseId = await createCaseBasedOnCaseType("CHILDSUPPORT");

        // Starting event
        await this.goToUpdateOtherPartyData(this.page, ChildSupportCaseId);
        await this.updateOtherPartyDataPage.verifyPageContent();

        // Filling fields and Submitting the event
        await this.updateOtherPartyDataPage.applyOtherPartyData();
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);

        // Adding other party subscription
        await this.goToUpdateSubscriptionPage(this.page, ChildSupportCaseId);
        await this.updateOtherPartyDataPage.applyOtherPartiesSubscription();
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);

        // Verifying History tab + end state
        await this.verifyHistoryTabDetails("Update other party data");
        await this.historyTab.verifyPageContentByKeyValue('End state', 'With FTA');
        await this.historyTab.verifyPageContentByKeyValue('Event', 'Update subscription');

        // Navigate to Other Party Details tab + validations
        await this.verifyOtherPartyDetails("Other parties");
        await this.otherPartyDetailsTab.verifyPageContentByKeyValue;
        await this.otherPartyDetailsTab.verifyTabDetails;
    }

    async performUpdateOtherPartyDataTaxCredit(caseId: string) {
        // Creating case - TAX CREDIT
        var TaxCreditCaseId = await createCaseBasedOnCaseType("TAX CREDIT");

        // Starting event
        await this.goToUpdateOtherPartyData(this.page, TaxCreditCaseId);
        await this.updateOtherPartyDataPage.verifyPageContent();

        // Filling fields and Submitting the event
        await this.updateOtherPartyDataPage.applyOtherPartyDataTaxCredit();
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);

        // Adding other party subscription
        await this.goToUpdateSubscriptionPage(this.page, TaxCreditCaseId);
        await this.updateOtherPartyDataPage.applyOtherPartiesSubscription();
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);

        // Verifying History tab + end state
        await this.verifyHistoryTabDetails("Update other party data");
        await this.historyTab.verifyPageContentByKeyValue('End state', 'With FTA');
        await this.historyTab.verifyPageContentByKeyValue('Event', 'Update subscription');

        // Navigate to Other Party Details tab + validations
        await this.verifyOtherPartyDetails("Other parties");
        await this.otherPartyDetailsTab.verifyPageContentByKeyValue;
        await this.otherPartyDetailsTab.verifyTabDetails;
    }
        
    // Event created to select Update other party data event from next steps dropdown menu:
    private async goToUpdateOtherPartyData(page: Page, caseId: string) {
        await this.loginUserWithCaseId(credentials.amCaseWorker, true, caseId);
        await this.homePage.chooseEvent("Update other party data");
    }
    // Event created to trigger Update subscription event from next steps dropdown menu:
    private async goToUpdateSubscriptionPage(page: Page, caseId: string) {
        await this.loginUserWithCaseId(credentials.amCaseWorker, true, caseId);
        await this.homePage.chooseEvent("Update subscription");
    }
}