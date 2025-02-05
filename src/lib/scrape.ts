"use server";
import * as cheerio from "cheerio";
import axios from "axios";
// import puppeteer from "puppeteer-extra";
// import StealthPlugin  from "puppeteer-extra-plugin-stealth";
// puppeteer.use(StealthPlugin())

import puppeteer from "puppeteer";

export const giveLinkDetails = async(link : string)=>{
    const { data: html } = await axios.get(link);
    const $ = cheerio.load(html);
    $('script, style').remove();
    const metadata = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: $('img[alt="og image"]').attr('src') || $('meta[property="og:image"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        favicon: $('link[rel="icon"]').attr('href'),
        content: $('body').text().trim()
    };

    return {
        title: metadata.ogTitle || metadata.title,
        description: metadata.ogDescription || metadata.description,
        image: metadata.ogImage || metadata.favicon,
        keywords: metadata.keywords,
        content: metadata.content
    }
  }

  export const getYoutubeDetails = async (link : string)=>{
    const { data: html } = await axios.get(link);
    const $ = cheerio.load(html);
    $('script, style').remove();
    const metadata = {
        title: $('title').text(),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogImage: $('img[alt="og image"]').attr('src') || $('meta[property="og:image"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        favicon: $('link[rel="icon"]').attr('href'),
    };

    return {
        title: metadata.ogTitle || metadata.title,
        image: metadata.ogImage || metadata.favicon,
        keywords: metadata.keywords,
    }
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