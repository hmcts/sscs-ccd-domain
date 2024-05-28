import {expect, Page} from '@playwright/test';
import {WebAction} from '../../common/web.action'
import { HomePage } from '../common/homePage';
import { threadId } from 'worker_threads';


let webActions: WebAction;

export class History {

    readonly page: Page;
    protected homePage: HomePage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(this.page);
        webActions = new WebAction(this.page);
    }

    async verifyPageContentByKeyValue(fieldLabel: string, fieldValue: string) {
        await expect(this.page
            .locator(`//*[normalize-space()="${fieldLabel}"]/../..//td[normalize-space()="${fieldValue}"]`)).toBeVisible();
    }

    // async verifyHistoryPageContentByKeyValue(fieldLabel: string, fieldValue: string) {
    //     await expect(this.page
    //         .locator(`//*[normalize-space()="${fieldLabel}"]/../td[normalize-space()="${fieldValue}"]`)).toBeVisible();
    // }


    async verifyHistoryPageContentByKeyValue(fieldLink: string, fieldLabel: string, fieldValue: string) {
        // await expect(this.page
        //     .locator(`//*[normalize-space()="${fieldLabel}"]/../td[normalize-space()="${fieldValue}"]`)).toBeVisible();
        let eleLink = this.page.locator(`//a[normalize-space()="${fieldLink}"]`);
        let ele = this.page.locator(`//*[normalize-space()="${fieldLabel}"]/../td[normalize-space()="${fieldValue}"]`);

        for(let i=0; i >=30; i++) {
            
            if(!eleLink.isVisible()) {
                await this.homePage.navigateToTab("History");
                await this.homePage.delay(1000);
                console.log(`I am inside a loop ${i}`);
                return i++;       
            } else {
                await eleLink.click();
                await expect(ele).toBeVisible();
                break;
            }
        }

    }

    async verifyHistoryPageEventLink(fieldLabel: string) {
        await expect(this.page
            .locator(`//a[normalize-space()="${fieldLabel}"]`)).toBeVisible();
    }

    async verifyEventCompleted(linkText: string) {
        await webActions.clickLink(linkText);
    }
}
