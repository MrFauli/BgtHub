type ParagraphBlock = {
  type: "paragraph"; 
  text: string;
};

type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption: string;
};

type HeadingBlock = {
  type: "heading";
  level: number;
  text: string;
};
type LinkBlock = {
  type: "link";
  url: string;
  label: string;
  target: "_blank" | "_self";
};

type YouTubeBlock = {
  type: "youtube";
  videoUrl: string; 
  videoId: string; 
  caption?: string;
};

export type ContentBlock = ParagraphBlock | ImageBlock | HeadingBlock | LinkBlock | YouTubeBlock;
export type postObj ={
    
    "id": number;
    "title": string;
    "slug": string;
    "date": string;
    "grade":string | number;
        "status"?:string,
    "author": string;
    "tag": string[];
    "summary": string;
    "coverImage": string;
    "content": ContentBlock[];
    "visible":boolean;
}

export const defaultBlogPost: postObj = {
    "id": 0 ,
    "title": "",
    "slug": "",
    "date": "",
    "grade":"" ,
    "status":"",
    "author": "",
    "tag": [],
    "summary": "",
    "coverImage": "",
    "content": [],
    "visible":true}