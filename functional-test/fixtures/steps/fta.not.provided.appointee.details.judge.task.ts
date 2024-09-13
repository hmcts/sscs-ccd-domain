import { BaseStep } from './base';
import { Page, expect } from '@playwright/test';
import { credentials } from "../../config/config";
import task from '../../pages/content/review.fta.not.provided.appointee.details.judge.task_en.json';
import dateUtilsComponent from '../../utils/DateUtilsComponent';
import { SendToAdmin } from './send.to.admin';
import issueDirectionTestdata from '../../pages/content/issue.direction_en.json';
import { VoidCase } from './void.case';


export class FtaNotProvidedAppointeeDetailsJudgeTask extends BaseStep {

    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async allocateCaseToInterlocutoryJudge(caseId: string) {
        
        // CTSC Admin with case allocator role allocates case to Interlocutory Judge
        await this.loginUserWithCaseId(credentials.amSuperUser, false, caseId);
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);
        await this.homePage.navigateToTab('Roles and access');
        await this.rolesAndAccessTab.allocateInterlocutoryJudge(credentials.salariedJudge.email);
    }

    async verifyInterlocutoryJudgeCanViewAndCompleteTheAutoAssignedFtaNotProvidedAppointeeDetailsJudgeTask(caseId: string): Promise<void> {

        // Interlocutory Judge verfies the auto assigned task details
        await this.loginUserWithCaseId(credentials.judge, false, caseId);
        await this.homePage.navigateToTab('Tasks');
        await this.tasksTab.verifyTaskIsDisplayed(task.name);
         await this.tasksTab.verifyPageContentByKeyValue(task.name, 
            'Task created', dateUtilsComponent.formatDateToSpecifiedDateFormat(new Date()));
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToInterlocutaryJudge);
        await this.tasksTab.verifyManageOptions(task.name, task.assignedManageOptionsForInterlocutaryJudge);
        await this.tasksTab.verifyNextStepsOptions(task.name, task.nextStepsOptions);

        // Select send to admin next step and complete the event
        await this.tasksTab.clickNextStepLink(task.sendToAdmin.link);

        let sendToAdmin = new SendToAdmin(this.page)
        await sendToAdmin.comepleteSendToAdmin();

        // Interlocutory Judge verifies task is removed from the tasks list within Tasks tab
        await this.tasksTab.verifyTaskIsHidden(task.name);
    }

    async verifySalariedJudgeCanViewAndCompleteTheUnassignedFtaNotProvidedAppointeeDetailsJudgeTask(caseId: string): Promise<void> {

        // Verify Salaried Judge can view the unassigned task
        await this.loginUserWithCaseId(credentials.salariedJudge, true, caseId);
        await this.homePage.navigateToTab('Tasks');
        await this.tasksTab.verifyTaskIsDisplayed(task.name);
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 
            'Task created', dateUtilsComponent.formatDateToSpecifiedDateFormat(new Date()));
         await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToWhenNotAssigned);
         await this.tasksTab.verifyManageOptions(task.name, task.unassignedManageOptionsForSalariedJudge);

        // Salaried Judge self assigns the task
        await this.tasksTab.selfAssignTask(task.name);
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToSalariedJudge);
        await this.tasksTab.verifyManageOptions(task.name, task.assignedManageOptionsForSalariedJudge);
        await this.tasksTab.verifyNextStepsOptions(task.name, task.nextStepsOptions);

        // Select issue direction next step and complete the event
        await this.tasksTab.clickNextStepLink(task.issueDirectionsNotice.link);
        await this.issueDirectionPage.submitIssueDirection(
            issueDirectionTestdata.preHearingType,
            issueDirectionTestdata.appealToProceedDirectionType, 
            issueDirectionTestdata.docTitle
        );
        await this.eventNameAndDescriptionPage.verifyPageContent(issueDirectionTestdata.eventNameCaptor);
        await this.eventNameAndDescriptionPage.confirmSubmission();
        await expect(this.homePage.summaryTab).toBeVisible();
        await this.homePage.delay(3000);

        await this.verifyHistoryTabDetails('With FTA', 'Issue directions notice');

        // Verify task is removed from the tasks list within Tasks tab
        await this.homePage.navigateToTab('Tasks');
        await this.tasksTab.verifyTaskIsHidden(task.name);
    }

    async verifyFeePaidJudgeCanViewAndCompleteTheUnassignedFtaNotProvidedAppointeeDetailsJudgeTask(caseId: string): Promise<void> {

        // Fee Paid Judge self assigns the task
        await this.loginUserWithCaseId(credentials.feePaidJudge, true, caseId);
        await this.homePage.navigateToTab('Tasks');
        await this.tasksTab.verifyTaskIsDisplayed(task.name);
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 
            'Task created', dateUtilsComponent.formatDateToSpecifiedDateFormat(new Date()));
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToWhenNotAssigned);
        await this.tasksTab.verifyManageOptions(task.name, task.unassignedManageOptions);

         // Fee-Paid Judge self assigns the task
        await this.tasksTab.selfAssignTask(task.name);        
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToFeePaidJudge);
        await this.tasksTab.verifyManageOptions(task.name, task.assignedManageOptionsForFeePaidJudge);
        await this.tasksTab.verifyNextStepsOptions(task.name, task.nextStepsOptions);

         // Select send to admin next step and complete the event
         await this.tasksTab.clickNextStepLink(task.sendToAdmin.link);

         let sendToAdmin = new SendToAdmin(this.page)
         await sendToAdmin.comepleteSendToAdmin();

        // Verify task is removed from the tasks list within Tasks tab
        await this.tasksTab.verifyTaskIsHidden(task.name);
    }

    async verifySalariedJudgeCanViewAndSelfAssignTheFtaNotProvidedAppointeeDetailsJudgeTask(caseId: string): Promise<void> {

        // Verify FTA not Provided Appointee Details - Judge task is displayed to the Salaried Judge
        await this.loginUserWithCaseId(credentials.salariedJudge, true, caseId);
        await this.homePage.navigateToTab('Tasks');
        await this.tasksTab.verifyTaskIsDisplayed(task.name);

        // Salaried Judge self assigns the task
        await this.tasksTab.selfAssignTask(task.name);
        await this.tasksTab.verifyPageContentByKeyValue(task.name, 'Assigned to', task.assignedToSalariedJudge);
        await this.tasksTab.verifyManageOptions(task.name, task.assignedManageOptionsForSalariedJudge);
        await this.tasksTab.verifyNextStepsOptions(task.name, task.nextStepsOptions);
    }

    async verifyFtaNotProvidedAppointeeDetailsJudgeTaskIsCancelledAutomaticallyWhenTheCaseIsVoid(caseId: string): Promise<void> {

        // CTSC Admin voids the case
        let voidCase = new VoidCase(this.page);
        await voidCase.performVoidCase(caseId);

        // Verify task is removed from the tasks list within Tasks tab
        await this.tasksTab.verifyTaskIsHidden(task.name);
    }

}
