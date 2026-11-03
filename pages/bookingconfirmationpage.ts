import {Page, Locator} from '@playwright/test'

export class BookingConfirmationPage{

    private readonly page:Page;
    private readonly hdrTicketDetails:Locator;
    private readonly ticketCount:Locator;
    private readonly txtFullName:Locator;
    private readonly txtEmail:Locator;
    private readonly txtMobileNo:Locator;
    private readonly lblTotalAmount:Locator;
    private readonly btnConfirmBooking:Locator;
    private readonly bookingConfirmMsg:Locator;

    get bookingMsg():Locator{
        return this.bookingConfirmMsg;
    }

    constructor(page:Page){
        this.page=page;
        this.hdrTicketDetails=page.locator("//div[contains(@class,'lg:sticky')]");
        this.txtFullName=this.hdrTicketDetails.getByPlaceholder("Your full name");
        this.txtEmail=this.hdrTicketDetails.getByPlaceholder("you@email.com");
        this.txtMobileNo=this.hdrTicketDetails.getByLabel("Phone Number");
        this.ticketCount=this.hdrTicketDetails.locator("//label[text()='Tickets']//parent::div//div");
        this.lblTotalAmount=this.hdrTicketDetails.locator('//form[@novalidate]//div[contains(@class,"bg-indigo-50")]');
        this.btnConfirmBooking=this.hdrTicketDetails.getByRole('button',{name:'Confirm Booking', exact:true});
        this.bookingConfirmMsg=page.locator("//div[contains(@class,'bg-emerald-100')]");
    }

    async selectTicketCount(ticketCount:number, amount:number){
        await this.hdrTicketDetails.waitFor();
        const currentCount=await this.ticketCount.locator("//span").first().textContent();

        if(Number(currentCount)<ticketCount){
            const countRequired=ticketCount-Number(currentCount);

            for(let i=0;i<countRequired;i++){
                await this.ticketCount.locator("//button").last().click();
            }
        }
    }

    async enterDetails(fullName:string, email:string, mobNo:string){
        await this.txtFullName.scrollIntoViewIfNeeded();
        await this.txtFullName.fill(fullName);
        await this.txtEmail.fill(email);
        await this.txtMobileNo.fill(mobNo);
    }

    async verifyTheSeatsAndAmount(){
        await this.lblTotalAmount.scrollIntoViewIfNeeded();
        const amountDetails=await this.lblTotalAmount.locator("\\span").allTextContents();        

        return amountDetails;
    }

    async clickOnConfirmBooking(){
        await this.btnConfirmBooking.click();
    }

    async verifyConfirmationMsg(){
        const details= this.bookingConfirmMsg.locator("//following-sibling::h3");
        console.log("Confirmation Message Count = ",await details.count());
        return details;
    }

    async verifyConfirmationDetails(){
        const msg=this.bookingConfirmMsg.locator("//following-sibling::div//div");
        console.log("Confirmation Message Details = ",await msg.count());
        return msg;
    }
}