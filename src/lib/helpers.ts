const initValue = -1

export const compare = (a: File, b: File) => {
    if (a.name > b.name) return 1;
    else if (b.name > a.name) return -1;
    return 0;
};

export const makeBlob = (labelList: LabelList) => {
    const separator = ",";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const as = [];
    for (const [f, a] of Object.entries(labelList)) {
      as.push([f, a.visibility, a.x, a.y, a.status]);
    }
    const data = as.map((a) => a.join(separator)).join("\r\n");
    return new Blob([bom, data], { type: "text/csv" });
}

export const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "10px";
  return filename.slice(pos + 1);
};

export const isLabelCorrect = (label: number[]) => {
    let is = true
    for (let i=0; i<label.length; i++) {
        if (label[i] === initValue) is = false
    }
    return is
}

export const isNumber = (value: any) => {
  return ((typeof value === 'number') && (isFinite(value)));
};

export const toNumber = (value: any) => {
    return isNumber
}