import { Page } from '@playwright/test';
import { WebAction } from '../common/web.action';
import sendToJudgeData from "./content/send.to.judge_en.json";

let webAction: WebAction;

export class SendToJudgePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        webAction = new WebAction(this.page);
    }

    async verifyPageContent() {
        await webAction.verifyPageLabel('h1.govuk-heading-l', sendToJudgeData.sendToJudgeHeading); //Heading Text
        await webAction.verifyPageLabel('label[for=\'prePostHearing\']', sendToJudgeData.sendToJudgePrePostHearingFieldLabel); //Field Label
        await webAction.verifyPageLabel('label[for=\'tempNoteDetail\']', sendToJudgeData.sendToJudgeTextFieldLabel);
        await webAction.verifyPageLabel('label[for=\'interlocReviewState\']', sendToJudgeData.sendToJudgeReviewStateFieldLabel);
    }

    async selectHearingType(): Promise<void> {
        await webAction.chooseOptionByLabel('#prePostHearing', sendToJudgeData.sendToJudgePrePostHearingSelectValue);
    }

    async inputData(): Promise<void> {
        await webAction.inputField('#tempNoteDetail', sendToJudgeData.sendToJudgeInput);
    }

    async selectInterlocutoryReviewState(): Promise<void> {
        await webAction.chooseOptionByLabel('#interlocReviewState', sendToJudgeData.sendToJudgeReviewStateSelectValue);
    }

    async confirmSubmission(): Promise<void> {
        await webAction.clickButton('Submit');
    } 
}