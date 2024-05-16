import { Page } from '@playwright/test';
import { BaseStep } from './base';
const eventTestData = require("../../pages/content/event.name.event.description_en.json");

export class EvidenceReminder extends BaseStep {
    
  readonly page : Page;
  

   constructor(page: Page) {
       super(page);
       this.page = page;
   }

    async performEvidenceReminder() {

        await this.loginAsCaseworkerUser('PIP');
        await this.homePage.chooseEvent('Evidence reminder');
        await this.eventNameAndDescriptionPage.verifyPageContent("Evidence reminder");
        await this.eventNameAndDescriptionPage.inputData(eventTestData.eventSummaryInput,
            eventTestData.eventDescriptionInput);
        await this.eventNameAndDescriptionPage.confirmSubmission();

        await this.verifyHistoryTab('With FTA', 'Evidence reminder', 'Event Description for Automation Verification');
    }
}