import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { URL } from "url";
import { CATEGORY } from "@prisma/client";
import puppeteer from "puppeteer-extra";
import StealthPlugin  from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin())

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function checkLinkType(link : string) {

  // TODO
  // validate the link
  
        const url = new URL(link);
        const hostname = url.hostname.toLowerCase();

        if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
            return CATEGORY.YTLINK;
        }

        if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return CATEGORY.TWTLINK;
        }

        return  CATEGORY.LINK;
        
   
}

export const giveTweetInfo =async (link : string)=>{
  
    const browser = await puppeteer.launch({
        headless: true,  // Faster headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Speeds up execution
    });

    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto(link, { waitUntil: "domcontentloaded" });

    await page.waitForSelector('div[data-testid="tweetText"]', {visible: true})
    await page.waitForSelector('div[data-testid="User-Name"]', {visible: true})
    const tweet=await page.$eval('div[data-testid="tweetText"]',el=>el.innerText).catch(()=>"N/A")
    const username=await page.$eval('div[data-testid="User-Name"]',el=>el.innerText).catch(()=>"N/A")
    
    await browser.close();
    return {description:tweet,creatorName:username}
    
}
