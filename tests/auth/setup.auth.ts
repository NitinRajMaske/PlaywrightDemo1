import {test as setup} from '@playwright/test'
import { LoginPage } from '../../pages/loginpage'

setup('Login And Create Storage State', async({page})=>{

    const url=process.env.BASEURL ?? "";
    const userName=process.env.USERNAME1 ?? "";
    const password=process.env.PASSWORD ?? "";

    const loginPage=new LoginPage(page);
    await loginPage.navigate(url);
    await loginPage.login(userName, password);
    await page.waitForTimeout(5000);
    await page.context().storageState({path:'login.json'});
})