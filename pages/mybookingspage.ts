import {Page, Locator} from '@playwright/test'

export class MyBookings{

    private readonly page:Page;
    private readonly bookingCards:Locator;

    constructor(page:Page){
        this.page=page;
        this.bookingCards=page.getByTestId("booking-card");
    }

    async verifyBooking(bookingReference:string){
        const bookCard=await this.bookingCards.filter({hasText:bookingReference});

        if(await bookCard.isVisible()){
            console.log("Booking Found");
        }else{
            console.log("Booking Not Found")
        }
    }
}