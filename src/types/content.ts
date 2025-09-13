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

export type ContentBlock = ParagraphBlock | ImageBlock | HeadingBlock;