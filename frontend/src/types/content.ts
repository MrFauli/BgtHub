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
type LinkBlock = {
  type: "link";
  url: string;
  label: string;
  target: "_blank" | "_self";
};

type YouTubeBlock = {
  type: "youtube";
  videoUrl: string; // z.B. https://www.youtube.com/watch?v=...
  videoId: string;  // Extrahiert: dQw4w9WgXcQ
  caption?: string;
};
export type ContentBlock = ParagraphBlock | ImageBlock | HeadingBlock | LinkBlock | YouTubeBlock;