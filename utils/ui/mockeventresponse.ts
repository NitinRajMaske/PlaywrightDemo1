import {Page} from '@playwright/test'

export class MockEventResponse{

    private readonly page:Page;

    constructor(page:Page){
        this.page=page;
    }

    async mockEvent(){
        await this.page.route("**/*bookings?page=1&limit=10",
            async route=>{
                const response=await route.fetch();
                const jsonRes=await response.json();
                const data= jsonRes.data;
                const body=data.slice(0,0);

                await route.fulfill({
                    response,
                    body
                })
            }
        )
    }

    async blockResponse(){
        await this.page.route("**/*.{jpeg,png,gif,JPEG,PNG,webp}", async route=>{
            await route.abort();
        })
    }

}