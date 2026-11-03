import {Page, Locator} from '@playwright/test'
import { EventPage } from './eventpage';

export class EventDetailPage{
    private readonly page:Page;
    private readonly txtEventTitle:Locator;
    private readonly txtDescription:Locator;
    private readonly listCategoryOptions:Locator;
    private readonly txtCity:Locator;
    private readonly txtVenue:Locator;
    private readonly dtEventDateTime:Locator;
    private readonly txtPrice:Locator;
    private readonly txtTotalSeats:Locator
    private readonly txtImageUrl:Locator;
    private readonly btnAddEvent:Locator;
    private readonly msgTooltip:Locator;
    private readonly lnkEventLink:Locator;

    get eventTitle():Locator{
        return this.txtEventTitle;
    }

    get eventDescription():Locator{
        return this.txtDescription;
    }

    get categoryOptions():Locator{
        return this.listCategoryOptions;
    }

    get city():Locator{
        return this.txtCity;
    }

    get venue():Locator{
        return this.txtVenue;
    }

    get dateAndTime():Locator{
        return this.dtEventDateTime;
    }

    get price():Locator{
        return this.txtPrice;
    }

    
    get totalSeats():Locator{
        return this.txtTotalSeats;
    }

    
    get addEventButton():Locator{
        return this.btnAddEvent;
    }

    get toolTipMsg():Locator{
        return this.msgTooltip;
    }

    constructor(page:Page){
        this.page=page;
        this.txtEventTitle=page.getByPlaceholder("Event title");
        this.txtDescription=page.getByPlaceholder("Describe the event…");
        this.listCategoryOptions=page.locator("//select[@id='category']");
        this.txtCity=page.getByLabel("City");
        this.txtVenue=page.getByPlaceholder("Venue name & address");
        this.dtEventDateTime=page.locator("[id='event-date-&-time']");
        this.txtPrice=page.getByLabel("Price ($)");
        this.txtTotalSeats=page.getByPlaceholder("e.g. 500");
        this.txtImageUrl=page.getByLabel("image-url-(optional)");
        this.btnAddEvent=page.getByRole('button',{name:'+ Add Event'});
        this.msgTooltip=page.locator('[aria-live="polite"]');
        this.lnkEventLink=page.getByRole('link',{name:'Events', exact:true});
    }


    async addNewEvent(title:string, desc:string, category:string, city:string, venue:string, eventDate:string, price:string
        ,totalSeat:string, imgUrl:string){

        this.enterTitle(title);
        this.enterDescription(desc);
        this.selectCategory(category);
        this.enterCity(city);
        this.enterVenue(venue);
        this.selectDateAndTime(eventDate);
        this.enterPrice(price);
        this.enterTotalSeats(totalSeat);       

    }

    async enterTitle(title:string){
        await this.txtEventTitle.fill(title);
    }

    async enterDescription(desc:string){
       await this.txtDescription.fill(desc);
    }

    async selectCategory(category:string){
        await this.listCategoryOptions.selectOption({label:category});
    }

    async enterCity(city:string){
        await this.txtCity.fill(city);
    }

    async enterVenue(venue:string){
       await this.txtVenue.fill(venue);
    }

    async selectDateAndTime(dateAndTime:string){
        await this.dtEventDateTime.pressSequentially(dateAndTime,{delay:1000});
    }

    async enterPrice(price:string){
        await this.txtPrice.fill(price);
    }

    async enterTotalSeats(seats:string){
        await this.txtTotalSeats.fill(seats);
    }

    async clickAddEventBtn(){
        await this.btnAddEvent.click();                
    }

    async getSuccessMsg(){
        return await this.msgTooltip;
    }

    async clickEventLink(){
        await this.lnkEventLink.click();
        return new EventPage(this.page);
    }
}