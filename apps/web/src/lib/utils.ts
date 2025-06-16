import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CATEGORY } from "@repo/db/client";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const extractYoutubeId = (link: string) => {
  const match = link.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

export const extractTweetId = (link: string): string | null => {
  const match = link.match(/status\/(\d+)/);
  return match ? match[1] : null;
};


export function checkLinkType(link : string) {

  // TODO
  // validate the link
  
        const url = new URL(link);
        const hostname = url.hostname.toLowerCase();

        if ((hostname.includes('youtube.com') || hostname === 'youtu.be') && extractYoutubeId(link)) {
            return CATEGORY.YTLINK;
        }

        if ((hostname.includes('twitter.com') || hostname.includes('x.com')) && extractTweetId(link) ) {
            return CATEGORY.TWTLINK;
        }

        return  CATEGORY.LINK;
        
   
}

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



