type ParagraphBlock = {
  type: "paragraph"; // genau dieser Wert
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

type ContentBlock = ParagraphBlock | ImageBlock | HeadingBlock;
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