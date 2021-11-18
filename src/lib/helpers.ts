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

export const readLabelFile = (labelFile: File) => {
    const newList: LabelList = {}
    const reader = new FileReader()
    reader.readAsText(labelFile)
    reader.onload = (e) => {
        if (!reader.result) return
        const cols = String(reader.result).split('\n')
        let row
        for (let i=0; i<cols.length; i++) {
            row = cols[i].split(",")
            const visibility = !isNaN(parseInt(row[1])) ? parseInt(row[1]) : initValue
            const x = !isNaN(parseInt(row[2])) ? parseInt(row[2]) : initValue
            const y = !isNaN(parseInt(row[3])) ? parseInt(row[3]) : initValue
            const status = !isNaN(parseInt(row[4])) ? parseInt(row[4]) : initValue

            newList[row[0]] = {
                id: i,
                filename: row[0],
                visibility: visibility,
                x: x,
                y: y,
                status: status,
                isLabeled: isLabelCorrect([visibility, x, y, status]),
            }
        }
    }
    return newList
}

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