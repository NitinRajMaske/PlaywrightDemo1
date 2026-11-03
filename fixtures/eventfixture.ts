import {test, expect} from '@playwright/test'
import {CreateEvent} from '../utils/api/createevent'
import {BookingConfirmation} from '../utils/api/bookingconfirmation'
import logindata from '../testdata/logindata.json'

type EventFixture=({
    eventTitle:object,
    eventPage:BookingConfirmation
})
let title:object;
export const Test=test.extend<EventFixture>({

    
    eventTitle:async({playwright},use)=>{
        const apiContext=await playwright.request.newContext();
        const createEvent=new CreateEvent(apiContext);
        title=await createEvent.createEvent(logindata.eventUrl, JSON.stringify(logindata.eventPayload), logindata.loginUrl, JSON.stringify(logindata.loginPayload))
        await use(title);
        await apiContext.dispose();
    },

    eventPage:async({playwright}, use)=>{

        const apiContext1=await playwright.request.newContext();
        const createEvent1=new CreateEvent(apiContext1);
        const title=await createEvent1.createEvent(logindata.eventUrl, JSON.stringify(logindata.eventPayload), logindata.loginUrl, JSON.stringify(logindata.loginPayload))

        const bookingurl="https://api.eventhub.rahulshettyacademy.com/api/bookings";
        const bookingPayload={
                                customerEmail:"abc@email.com",
                                customerName:"abc",
                                customerPhone:"1236547890",
                                eventId:title.id,
                                quantity:1
                            }
        
        const apiContext=await playwright.request.newContext();
        const createEvent=new CreateEvent(apiContext);
        const title2=await createEvent.confirmBooking(bookingurl, bookingPayload, logindata.loginUrl, JSON.stringify(logindata.loginPayload))
        await use(title2);
        await apiContext.dispose();
    }
})