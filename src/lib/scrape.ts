import * as cheerio from "cheerio";
import axios from "axios";

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