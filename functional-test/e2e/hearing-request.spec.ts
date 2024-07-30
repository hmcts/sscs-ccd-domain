import { test } from "../lib/steps.factory";
import createCaseBasedOnCaseType from "../api/client/sscs/factory/appeal.type.factory";
import performAppealDormantOnCase from "../api/client/sscs/appeal.event";

let caseId : string;


test.describe("Create a new hearing for an List assist case", {tag: '@pipeline'}, async() => {
    
    test("Trigger a new hearing for DLA case", async ({ uploadResponseSteps, hearingSteps }) => {
        caseId = await createCaseBasedOnCaseType('DLASANDL');
        await uploadResponseSteps.performUploadResponse(caseId, 'dla');
        await hearingSteps.verifyHearingIsTriggered(caseId, 'dla');
    });

    test("Trigger a new hearing for UC case", async ({ uploadResponseSteps, hearingSteps }) => {
        caseId = await createCaseBasedOnCaseType('UCSANDL');
        await uploadResponseSteps.performUploadResponseOnAUniversalCredit(caseId);
        await hearingSteps.verifyHearingIsTriggeredForUCCase();
    });
    

    test("Trigger a new hearing for PIP case", async ({ uploadResponseSteps, hearingSteps }) => {
        caseId = await createCaseBasedOnCaseType('PIPREPSANDL');
        await uploadResponseSteps.performUploadResponse(caseId, 'pip');
        await hearingSteps.verifyHearingIsTriggered(caseId, 'pip');
    });
    
});