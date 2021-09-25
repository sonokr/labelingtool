interface Label {
  id: number;
  filename: string;
  x: number;
  y: number;
  actualX: number;
  actualY: number;
  visibility: number;
  status: number;
  isLabeled: Boolean;
}

interface LabelList {
  [key: string]: Label;
}

interface Dict {
  [key: number | string | symbol]: any;
}