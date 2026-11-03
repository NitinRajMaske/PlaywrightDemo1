import { APIRequestContext, Expect } from "@playwright/test";

export class CreateEvent{

    private readonly apiContext:APIRequestContext;
    
    constructor(apiContext:APIRequestContext){
        this.apiContext=apiContext;
    }

    async loginAndGetToken(url:string, payload:string){
        const response=await this.apiContext.post(url,{
            data:payload
        })

        const apiResponse=await response.json();
        console.log("API Response = ",apiResponse)
        const token=apiResponse.token;
        console.log("Token = ",token)
        return token;
    }

    async createEvent(eventUrl:string, eventPayload:string, loginUrl:string, loginPayload:string){
        const token=await this.loginAndGetToken(loginUrl, JSON.parse(loginPayload));
        console.log("Login URL = ",loginUrl);
        console.log("Login PAYLOAD = ",loginPayload);
        console.log("EVENT URL = ",eventUrl);
        console.log("EVENT PAYLOAD = ",eventPayload);

        const response = await this.apiContext.post(eventUrl,{
            data:JSON.parse(eventPayload),
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })

        const apiResponse=await response.json();
        const id=apiResponse.data.id;
        const title=apiResponse.data.title;
        let obj={id:"", title:"", tokenVal:""};
        obj.id=id;
        obj.title=title;
        obj.tokenVal=token;
        return obj;
    }

    async confirmBooking(url:string, bookingPayload:object, loginUrl:string, loginPayload:string){

        const response=await this.apiContext.post(url,{
            data:bookingPayload,
            headers:{
                'Authorization':`Bearer ${await this.loginAndGetToken(loginUrl, JSON.parse(loginPayload))}`
            }
        })

        const apiResponse=await response.json();
        
        return apiResponse;
    }
}