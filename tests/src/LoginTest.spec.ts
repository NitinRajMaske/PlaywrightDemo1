import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardpage';
import bookingdata from '../../testdata/bookingdata.json';
import { EventDetailPage } from '../../pages/eventdetailpage';
import { BookingConfirmationPage } from '../../pages/bookingconfirmationpage';
import {Test} from '../../fixtures/eventfixture'
import { MockEventResponse } from '../../utils/ui/mockeventresponse';
import { url } from 'node:inspector';

test("@E2E Order Creation End To End Flow", async ({ page }) => {

    let dp: DashboardPage;
    let eventDetailsPage: EventDetailPage;
    let bookingDetails: string[];
    let bookingConfirmation: BookingConfirmationPage;
    
    // FIXED: Added missing 'await' to all test.step blocks
    await test.step("Navigate To Home Page", async () => {
        dp = new DashboardPage(page);
        await dp.navigate(); 
    });   
    
    await test.step("Enter Details", async () => {
        eventDetailsPage = await dp.gotoManageEvent();
        
        // Assert & Action chains
        const title = await eventDetailsPage.eventTitle;
        await expect(title).toBeEnabled();
        await eventDetailsPage.enterTitle(bookingdata.bookingTitle);

        const desc = await eventDetailsPage.eventDescription;
        await expect(desc).toBeVisible();
        await eventDetailsPage.enterDescription(bookingdata.bookingDesc);

        const category = await eventDetailsPage.categoryOptions;
        await expect(category).toBeEnabled();
        await eventDetailsPage.selectCategory(bookingdata.bookingCategory);

        const city = await eventDetailsPage.city;
        await expect(city).toBeEnabled();
        await eventDetailsPage.enterCity(bookingdata.city);

        const venue = await eventDetailsPage.venue;
        await expect(venue).toBeEnabled();
        await eventDetailsPage.enterVenue(bookingdata.venue);

        const dateAndTime = await eventDetailsPage.dateAndTime;
        await expect(dateAndTime).toBeEnabled();
        await eventDetailsPage.selectDateAndTime(bookingdata.bookingDate);

        const totalSeats = await eventDetailsPage.totalSeats;
        await expect(totalSeats).toBeEnabled();
        await eventDetailsPage.enterTotalSeats(bookingdata.totalSeats);

        const price = await eventDetailsPage.price;
        await expect(price).toBeEnabled();
        await eventDetailsPage.enterPrice(bookingdata.bookingPrice);

        const eventBtn = await eventDetailsPage.addEventButton;
        await expect(eventBtn).toBeEnabled();
        await eventDetailsPage.clickAddEventBtn();    

        const toolTipMsg = await eventDetailsPage.toolTipMsg;
        await expect(toolTipMsg).toBeVisible();
    });
        
    await test.step("Complete Booking", async () => {
        const eventPage = await eventDetailsPage.clickEventLink();
        bookingConfirmation = await eventPage.completBooking(bookingdata.bookingTitle);
        await bookingConfirmation.selectTicketCount(2, 5000);
        await bookingConfirmation.enterDetails(bookingdata.bookinName, bookingdata.bookingEmail, bookingdata.bookingMobile);
        bookingDetails = await bookingConfirmation.verifyTheSeatsAndAmount();
    });
    
    await test.step("Get Booking Details", async () => {
        const details = bookingDetails.slice(0, 2);
        
        // FIXED: Safe global comma stripping with regex mapping
        let cleanTicketPrice = details[0].split("×")[0].replace(/,/g, "").trim();
        let cleanTotalPrice = details[1].replace(/,/g, "");

        await expect(cleanTicketPrice).toContain(bookingdata.bookingPrice);
        await expect(details[0].split("×")[1]).toContain(bookingdata.bookingCount);
        await expect(cleanTotalPrice).toContain((Number(bookingdata.bookingPrice) * 2).toString());

        await bookingConfirmation.clickOnConfirmBooking();

        await expect(bookingConfirmation.bookingMsg).toBeVisible();
        await bookingConfirmation.verifyConfirmationMsg();
        
        const confirmationDetails = await bookingConfirmation.verifyConfirmationDetails();
        await expect(confirmationDetails.nth(1)).toContainText(bookingdata.bookinName);
        
        // FIXED: Cleaned up messy conditional mutations into clear extractions
        const rawTotalPrice = await confirmationDetails.nth(3).textContent() || "";
        const finalPriceSanitized = rawTotalPrice.replace(/,/g, "");
        
        await expect(finalPriceSanitized).toContain((Number(bookingdata.bookingPrice) * 2).toString());    
    });   
});

Test('@Regression Create Event Using API', async({page, eventPage})=>{

    const dashboardUrl=process.env.DASHBOARDURL ?? "";
    console.log("Event Title = ",eventTitle.id);
    await page.goto(dashboardUrl);
})

Test.only('@Regression Create Booking Using API', async({page, eventPage})=>{

    const dashboardUrl=process.env.DASHBOARDURL ?? "";
    console.log("Event Response = ",eventPage);
    await page.goto(dashboardUrl);
    const dp=new DashboardPage(page);
    const myBooking=await dp.gotoMyBookings();
    await myBooking.verifyBooking(eventPage.data.bookingRef);
})

test('Mock Booking Response', {tag:'@Mock'},async({page})=>{

    const mer=new MockEventResponse(page);
    await mer.mockEvent();
    //await mer.blockResponse();

    const dashboardUrl=process.env.DASHBOARDURL ?? "";
    await page.goto(dashboardUrl);
    const dp=new DashboardPage(page);
    const myBooking=await dp.gotoMyBookings();
    await page.pause();
})

test('@MockRequest Request Mocking', async({page})=>{

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
        async route=>{
            await route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=123654'});
    
            })
        
    await page.route("**/*.{jpg,jpeg,png,PNG,JPEG,webp}", async route=>{await route.abort()})
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill("maske.nitinraj@gmail.com");
    await page.getByPlaceholder("enter your passsword").fill("Password123");
    await page.getByRole('button',{name:'Login', exact:true}).click();
    await page.locator('[routerlink="/dashboard/myorders"]').click();
    await page.locator("//table[contains(@class,'table-bordered')]//tr[@class]").first().getByRole('button',{name:'View'}).click();
})


