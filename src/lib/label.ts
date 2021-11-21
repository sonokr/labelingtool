import { isLabelCorrect } from './helpers'

const initValue = -1

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

export const makeLabelList = (fileList: File[]) => {
    let newLabelList: LabelList = {}
    for (const [index, file] of fileList.entries()) {
        newLabelList[file.name] = {
            id: index,
            filename: file.name,
            x: initValue,
            y: initValue,
            visibility: initValue,
            status: initValue,
            isLabeled: false,
        };
    }
    return newLabelList
}
