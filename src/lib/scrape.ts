"use server";
import * as cheerio from "cheerio";
import axios from "axios";
import { CATEGORY } from "@prisma/client";

export const giveLinkDetails = async (link: string) => {
  const { data: html } = await axios.get(link);
  const $ = cheerio.load(html);
  $("script, style").remove();
  const metadata = {
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content"),
    ogTitle: $('meta[property="og:title"]').attr("content"),
    ogDescription: $('meta[property="og:description"]').attr("content"),
    ogImage:
      $('img[alt="og image"]').attr("src") ||
      $('meta[property="og:image"]').attr("content"),
    keywords: $('meta[name="keywords"]').attr("content"),
    favicon: $('link[rel="icon"]').attr("href"),
    content: $("body h1, body h2, body h3, body h4, body h5, body h6, body p")
      .text()
      .trim()
      .split(".")
      .slice(0, 20)
      .join(". "),
  };

  return {
    title: metadata.ogTitle || metadata.title,
    description: metadata.ogDescription || metadata.description,
    image: metadata.ogImage || metadata.favicon,
    keywords: metadata.keywords,
    content: metadata.content,
  };
};

export const getYoutubeDetails = async (link: string) => {
  const { data: html } = await axios.get(link);
  const $ = cheerio.load(html);
  $("script, style").remove();
  const metadata = {
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content"),
    ogDescription: $('meta[property="og:description"]').attr("content"),
    ogTitle: $('meta[property="og:title"]').attr("content"),
    ogImage:
      $('img[alt="og image"]').attr("src") ||
      $('meta[property="og:image"]').attr("content"),
    keywords: $('meta[name="keywords"]').attr("content"),
    favicon: $('link[rel="icon"]').attr("href"),
  };

  return {
    title: metadata.ogTitle || metadata.title,
    description: metadata.ogDescription || metadata.description,
    image: metadata.ogImage || metadata.favicon,
    keywords: metadata.keywords,
    details: `${metadata.ogTitle || metadata.title} ${metadata.ogDescription || metadata.description}`
  };
};

function extractTwitterId(url : string) {
    
    const regex = /\/status\/(\d+)/;
    const match = url.match(regex);
  
    if (match && match[1]) {
      return match[1];
    }
  
    return null;
  }
  

export const giveTweetInfo = async (link: string) => {
// TODO
    // Twitter link check ZOD
  const tweetId = extractTwitterId(link)
    const response = await axios.get('https://twitter-api45.p.rapidapi.com/tweet.php', {
        params: { id: tweetId },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
        }
      });    
  return { description: response.data.text, creatorName: response.data.name };
};

interface ContentMakerProps {
  category: CATEGORY;
  link?: string;
  details: string;
  keywords?: string;
  createrName?: string;
  title?: string;
  description?: string;
}

export const contentMaker = (data: ContentMakerProps) => {
    if (data.category === "LINK") {
      return `CATEGORY : Website Link \n Title: ${
        data.title ? data.title : "NA"
      } \n Description: ${
        data.description ? data.description : "NA"
      } \n Keywords : ${
        data.keywords ? data.keywords : "NA"
      } \n Website URL : ${data.link ? data.link : "NA"} \n Details : ${
        data.details ? data.details : "NA"
      }`;
    } else if (data.category === "YTLINK") {
      return `CATEGORY : YouTube Video \n Title: ${
        data.title ? data.title : "NA"
      } \n Description: ${
        data.description ? data.description : "NA"
      } \n Keywords : ${
        data.keywords ? data.keywords : "NA"
      } \n YouTube Video URL : ${data.link ? data.link : "NA"} \n Details : ${
        data.details ? data.details : "NA"
      }`;
    } else if (data.category === "NOTE") {
      return `CATEGORY : User Personal Note \n Title: ${
        data.title ? data.title : "NA"
      } \n Description: ${
        data.description ? data.description : "NA"
      } \n Keywords : ${
        data.keywords ? data.keywords : "NA"
      } \n Note : ${data.details ? data.details : "NA"}`;
    } else if (data.category === "TWTLINK") {
      return `CATEGORY : Twitter Saves \n Title: ${
        data.title ? data.title : "NA"
      } \n Description: ${
        data.description ? data.description : "NA"
      } \n Keywords : ${
        data.keywords ? data.keywords : "NA"
      } \n Tweet URL : ${data.link ? data.link : "NA"} \n Tweet : ${
        data.details ? data.details : "NA"
      } \n Creator Name : ${data.createrName ? data.createrName : "NA"}`;
    } else {
      return "";
    }
  };
