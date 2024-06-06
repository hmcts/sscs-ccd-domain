import {expect, Page} from '@playwright/test';
import {BaseStep} from './base';
import {credentials} from "../../config/config";
import performAppealDormantOnCase from "../../api/client/sscs/appeal.event";
import createCaseBasedOnCaseType from "../../api/client/sscs/factory/appeal.type.factory";

const responseReviewedTestData = require('../../pages/content/response.reviewed_en.json');
const uploadResponseTestdata = require('../../pages/content/upload.response_en.json');

export class UploadResponse extends BaseStep {

    private static caseId: string;
    readonly page: Page;

    private presetLinks: string[] = ['Upload response', 'Ready to list', 'Update to case data', 'Add a hearing'];

    constructor(page: Page) {
        super(page);
        this.page = page;
    }


    async performUploadResponseWithFurtherInfoOnAPIP() {

        let pipCaseId = await createCaseBasedOnCaseType("PIP");
        await this.loginUserWithCaseId(credentials.dwpResponseWriter, false, pipCaseId);

        //await this.homePage.waitForLoadState();
        await this.homePage.chooseEvent('Upload response');
        await this.homePage.delay(4000);
        //await this.homePage.waitForLoadState();
        await this.uploadResponsePage.verifyPageContent();
        await this.uploadResponsePage.uploadDocs();
        await this.uploadResponsePage.selectIssueCode(uploadResponseTestdata.pipIssueCode);
        await this.uploadResponsePage.chooseAssistOption('Yes');
        await this.uploadResponsePage.continueSubmission();

        await this.checkYourAnswersPage.verifyCYAPageContent("Upload response",
            uploadResponseTestdata.pipBenefitCode, uploadResponseTestdata.pipIssueCode);
        await this.checkYourAnswersPage.confirmSubmission();

        await this.loginUserWithCaseId(credentials.amCaseWorker,true, pipCaseId);
        //await this.homePage.navigateToTab("History");
        await this.homePage.navigateToTab("Summary");
        await this.summaryTab.verifyPresenceOfText("Response received"); //The State moves on so cannot verifyr this code correctly.
        //await this.historyTab.verifyHistoryPageContentByKeyValue('Upload response', 'End state', 'Response received');

        await this.homePage.chooseEvent('Response reviewed');
        await this.responseReviewedPage.verifyPageContent(responseReviewedTestData.captionValue, responseReviewedTestData.headingValue);
        await this.responseReviewedPage.chooseInterlocOption('No');
        await this.responseReviewedPage.confirmSubmission();

        await this.homePage.delay(1000);
        await this.homePage.navigateToTab("History");

        for (const linkName of this.presetLinks) {
            await this.verifyHistoryTabLink(linkName);
        }
        await this.homePage.navigateToTab("Summary");
        await this.summaryTab.verifyPresenceOfText("Ready to list");
   }

    async performUploadResponseWithoutFurtherInfoOnATaxCredit() {

        let taxCaseId = await createCaseBasedOnCaseType("TAX CREDIT");
        await this.loginUserWithCaseId(credentials.dwpResponseWriter, false, taxCaseId);
        await this.homePage.chooseEvent('Upload response');
        await this.homePage.delay(4000);
        await this.uploadResponsePage.verifyPageContent();
        await this.uploadResponsePage.uploadDocs();
        await this.uploadResponsePage.selectIssueCode(uploadResponseTestdata.taxIssueCode);
        await this.uploadResponsePage.chooseAssistOption('No');
        await this.uploadResponsePage.continueSubmission();

        await this.checkYourAnswersPage.verifyCYAPageContent("Upload response", uploadResponseTestdata.taxBenefitCode, uploadResponseTestdata.taxIssueCode);
        await this.checkYourAnswersPage.confirmSubmission();

        await this.homePage.delay(3000);
        await this.loginUserWithCaseId(credentials.amCaseWorker,true, taxCaseId);
        await this.homePage.navigateToTab("History");

        for (const linkName of this.presetLinks) {
            await this.verifyHistoryTabLink(linkName);
        }
        await this.homePage.navigateToTab("Summary");
        await this.summaryTab.verifyPresenceOfText("Ready to list");
    }

    async performUploadResponseOnAUniversalCredit() {

        let ucCaseId = await createCaseBasedOnCaseType("UC");
        await this.loginUserWithCaseId(credentials.dwpResponseWriter, false, ucCaseId);

        await this.homePage.chooseEvent('Upload response');
        await this.homePage.delay(4000);
        await this.uploadResponsePage.verifyPageContent();
        await this.uploadResponsePage.uploadDocs();
        await this.uploadResponsePage.chooseAssistOption('No');
        await this.uploadResponsePage.continueSubmission();

        await this.uploadResponsePage.selectElementDisputed('childElement');
        await this.uploadResponsePage.continueSubmission();

        await this.uploadResponsePage.clickAddNewButton();
        await this.uploadResponsePage.selectUcIssueCode(uploadResponseTestdata.ucIssueCode);
        await this.homePage.delay(2000);
        await this.uploadResponsePage.continueSubmission();

        await this.uploadResponsePage.chooseDisputeOption(uploadResponseTestdata.ucDisputeOption);
        await this.homePage.delay(2000);
        await this.uploadResponsePage.continueSubmission();

        await this.uploadResponsePage.isJPOnTheCase(uploadResponseTestdata.ucJointPartyOnCase);
        await this.uploadResponsePage.continueSubmission();

        await this.checkYourAnswersPage.verifyCYAPageContent("Upload response", null, null, "UC");
        await this.checkYourAnswersPage.confirmSubmission();

        await this.loginUserWithCaseId(credentials.amCaseWorker,true, ucCaseId);
        await this.homePage.delay(1000);
        await this.homePage.navigateToTab("History");

        for (const linkName of this.presetLinks) {
            await this.verifyHistoryTabLink(linkName);
        }
        await this.homePage.navigateToTab("Summary");
        await this.summaryTab.verifyPresenceOfText("Ready to list");
    }

    async verifyErrorsScenariosInUploadResponse() {

        let pipErrorCaseId = await createCaseBasedOnCaseType("PIP");
        await this.loginUserWithCaseId(credentials.dwpResponseWriter, false, pipErrorCaseId);
        UploadResponse.caseId = pipErrorCaseId;

        await this.homePage.chooseEvent('Upload response');
        await this.homePage.delay(2000);
        await this.uploadResponsePage.verifyPageContent();
        await this.uploadResponsePage.uploadPartialDocs();
        await this.uploadResponsePage.selectIssueCode(uploadResponseTestdata.pipIssueCode);
        await this.uploadResponsePage.chooseAssistOption('Yes');
        await this.uploadResponsePage.continueSubmission();
        await this.uploadResponsePage.delay(1000);
        await this.uploadResponsePage.verifyDocMissingErrorMsg();
    }

    async verifyPHMEErrorsScenariosInUploadResponse() {

        await this.loginPage.goToLoginPage();
        await this.loginPage.verifySuccessfulLoginForDWPResponseWriter(false);
        await this.homePage.goToHomePage(UploadResponse.caseId);

        await this.homePage.chooseEvent('Upload response');
        await this.uploadResponsePage.uploadDocs();
        await this.uploadResponsePage.selectEvidenceReason('Potentially harmful evidence');
        await this.uploadResponsePage.selectIssueCode(uploadResponseTestdata.pipIssueCode);
        await this.uploadResponsePage.chooseAssistOption('Yes');
        await this.uploadResponsePage.continueSubmission();

        await this.checkYourAnswersPage.confirmSubmission();
        await this.checkYourAnswersPage.verifyPHMEErrorMsg();
    }

    async verifyIssueCodeErrorsScenariosInUploadResponse() {

        await this.loginPage.goToLoginPage();
        await this.loginPage.verifySuccessfulLoginForDWPResponseWriter(false);
        await this.homePage.goToHomePage(UploadResponse.caseId);

        await this.homePage.chooseEvent('Upload response');
        await this.uploadResponsePage.uploadDocs();
        await this.uploadResponsePage.selectIssueCode('DD');
        await this.uploadResponsePage.chooseAssistOption('Yes');
        await this.uploadResponsePage.continueSubmission();

        await this.checkYourAnswersPage.confirmSubmission();
        await this.checkYourAnswersPage.verifyIssueCodeErrorMsg();
    }
}
