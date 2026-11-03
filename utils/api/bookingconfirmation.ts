import { APIRequestContext } from "@playwright/test";
import {CreateEvent} from '../../utils/api/createevent'

export class BookingConfirmation{

    private readonly apiContext:APIRequestContext

    constructor(apiContext:APIRequestContext){
        this.apiContext=apiContext;
    }

    
}