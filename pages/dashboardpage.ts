import {Page, Locator} from '@playwright/test'
import { EventPage } from './eventpage';
import { EventDetailPage } from './eventdetailpage';
import { MyBookings } from './mybookingspage';

export class DashboardPage{

    private readonly page:Page;
    private readonly btnBrowseEvent:Locator;
    private readonly btnMyBookings:Locator;
    private readonly btnAdmin:Locator;
    private readonly lnkManageEvents:Locator;
    private readonly lnkManageBookins:Locator;
    private readonly optionsAdmin:Locator;
    private readonly lnkEnevts:Locator;
    private readonly lnkMyBookings:Locator;

    get browseEventButton():Locator{
        return this.btnBrowseEvent;
    }

    get myBookingButton():Locator{
        return this.btnMyBookings;
    }

    constructor(page:Page){
        this.page=page;
        this.btnBrowseEvent=page.getByRole('link',{name:'Browse Events →'});
        this.btnMyBookings=page.getByRole('button',{name:'My Bookings'});        
        this.btnAdmin=page.getByRole("button",{name:'Admin'});
        this.optionsAdmin=this.btnAdmin.locator('//following-sibling::div');
        this.lnkManageEvents=this.optionsAdmin.getByRole('link',{name:'Manage Events'});
        this.lnkManageBookins=this.optionsAdmin.getByRole('link',{name:'Manage Bookings'});
        this.lnkEnevts=page.getByRole('link',{name:'Events', exact:true});
        this.lnkMyBookings=page.getByTestId("nav-bookings");
        
    }

    async navigate(){
        await this.page.goto("https://eventhub.rahulshettyacademy.com/");
    }

    async clickBrowseEventBtn(){
        await this.btnBrowseEvent.click();
        return new EventPage(this.page);
    }

    async gotoManageEvent(){
        await this.btnAdmin.click();
        await this.optionsAdmin.waitFor({state:'visible'});
        await this.lnkManageEvents.click();
        return new EventDetailPage(this.page);
    }

    async clickOnEventsOptions(){
        await this.lnkEnevts.click();
    }

    async gotoMyBookings(){
        await this.lnkMyBookings.click();
        return new MyBookings(this.page);
    }
}