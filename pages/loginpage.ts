import {Page, Locator} from '@playwright/test'

export class LoginPage{

    private readonly page:Page;
    private readonly txtUserName:Locator;
    private readonly txtPassword:Locator;
    private readonly btnSignIn:Locator;

    constructor(page:Page){
        this.page=page;
        this.txtUserName=page.getByPlaceholder("you@email.com");
        this.txtPassword=page.getByText("Password");
        this.btnSignIn=page.getByRole('button',{name:'Sign In', exact:true})
    }

    async navigate(url:string){
        await this.page.goto(url);
    }

    async login(username:string, password:string){
        await this.txtUserName.fill(username);
        await this.txtPassword.fill(password);
        await this.btnSignIn.click();
    }
} 