import {defineConfig, devices} from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

const environemnt=process.env.TARGET_ENV||'qa'

dotenv.config({
  path:path.resolve(__dirname, `./env/.env.${environemnt}`)
})

export default defineConfig({

  timeout:80000,
  workers:2,
  //retries:1,
  expect:{
    timeout:6000
  },
  reporter:'html',

  
  projects:[
    {
      name:'setup',
      testMatch:/setup\.auth\.ts/
    },

    {
      name:'chrome',
      use:{
        browserName:'chromium',
        headless:false,
        screenshot:'only-on-failure',
        video:'retain-on-failure',
        trace:'retain-on-first-failure',
        storageState:'login.json',
        launchOptions:{
          slowMo:1000
        },
        ignoreHTTPSErrors:true
      },
      dependencies:['setup'],
      testIgnore:["**/auth.ts"],
    }
  ]

})