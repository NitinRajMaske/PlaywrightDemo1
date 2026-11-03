import {Page, Locator} from '@playwright/test'
import { EventDetailPage } from './eventdetailpage';
import {BookingConfirmationPage} from './bookingconfirmationpage'

export class EventPage{

    private readonly page:Page;    
    private readonly cardsProduct:Locator;
    private readonly btnAddNewEvent:Locator;

    get productCards():Locator{
        return this.cardsProduct;
    }

    get addeNewEventButton():Locator{
        return this.btnAddNewEvent;
    }

    constructor(page:Page){
        this.page=page;
        this.cardsProduct=page.getByTestId("event-card");
        this.btnAddNewEvent=page.getByText("Add New Event");

    }

    async clickAddNewEventBtn(){
        await this.btnAddNewEvent.click();
        return new EventDetailPage(this.page);
    }

    async completBooking(eventName:string){
        const cardName=await this.cardsProduct.filter({hasText:eventName});
        await cardName.getByRole('link',{name:"Book Now", exact:true}).click();

        return new BookingConfirmationPage(this.page);

    }
}