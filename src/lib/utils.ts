import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { URL } from "url";
import { CATEGORY } from "@prisma/client";


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


