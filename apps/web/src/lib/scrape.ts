"use server";
import * as cheerio from "cheerio";
import axios from "axios";
import puppeteer from "puppeteer";

export const giveLinkDetails = async (link: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (
      ["image", "stylesheet", "font", "script"].includes(request.resourceType())
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.goto(link, { waitUntil: "domcontentloaded" });

  const metadata = await page.evaluate(() => {
    const getMetaContent = (nameOrProperty: string) => {
      const meta = document.querySelector(
        `meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`
      );
      return meta ? meta.getAttribute("content") : null;
    };

    const title = document.querySelector("title")?.textContent || "";
    const description = getMetaContent("description") || "";
    const ogTitle = getMetaContent("og:title") || "";
    const ogDescription = getMetaContent("og:description") || "";
    const ogImage = getMetaContent("og:image") || "";
    const keywords = getMetaContent("keywords") || "";
    const favicon =
      document.querySelector('link[rel="icon"]')?.getAttribute("href") || "";

    const contentElements = document.querySelectorAll(
      "body h1, body h2, body h3, body h4, body h5, body h6, body p"
    );
    const content = Array.from(contentElements)
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .join(". ")
      .split(" ")
      .slice(0, 100)
      .join(" ");

    return {
      title,
      description,
      ogTitle,
      ogDescription,
      ogImage,
      keywords,
      favicon,
      content,
    };
  });

  await browser.close();

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
    details: `${metadata.ogTitle || metadata.title} ${
      metadata.ogDescription || metadata.description
    }`,
  };
};

function extractTwitterId(url: string) {
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
  const tweetId = extractTwitterId(link);
  const response = await axios.get(
    "https://twitter-api45.p.rapidapi.com/tweet.php",
    {
      params: { id: tweetId },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
      },
    }
  );
  return { description: response.data.text, creatorName: response.data.name };
};
