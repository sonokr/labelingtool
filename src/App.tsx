import { useState, useEffect, useRef } from "react";

import { useKey } from "rooks";
import { Row, Col, Button, Typography, Divider, Collapse } from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import Canvas from "./components/Canvas";
import Label from "./components/Label";
import FileList from "./components/FileList";

import "./App.css";

const { Title } = Typography;
const { Panel } = Collapse;

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
};

const App = () => {
  const initValue = -1;
  const initLabel = {
    id: 0,
    filename: "",
    x: initValue,
    y: initValue,
    actualX: initValue,
    actualY: initValue,
    visibility: initValue,
    status: initValue,
    isLabeled: false,
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<HTMLImageElement>(new Image()); // The image to display now.
  const [fileList, setFileList] = useState<File[]>([]); // List of selected files.
  const [numberOfImage, setNumberOfImage] = useState(-1); // The number of images.
  const [index, setIndex] = useState(0); // The index of current file.
  const [filename, setFilename] = useState(""); // The filename of current file.
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // The size of current file.
  const [label, setLabel] = useState<Label>(initLabel); // The label of current file
  const [labelList, setLabelList] = useState<LabelList>({}); // The list of labels.

  // Once a directory has been selected,
  // craete a list of the same size for label.
  useEffect(() => {
    const newLabelList: LabelList = {};
    for (const [index, file] of fileList.entries()) {
      newLabelList[file.name] = {
        id: index,
        filename: file.name,
        x: initValue,
        y: initValue,
        actualX: initValue,
        actualY: initValue,
        visibility: initValue,
        status: initValue,
        isLabeled: false,
      };
    }
    setLabelList(newLabelList);
    // eslint-disable-next-line
  }, [fileList]);

  // When the index is changed,
  // the image is redrawn and, label is update.
  useEffect(() => {
    if (fileList.length === 0) return;
    const file = fileList[index];

    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
      setFilename(file.name);
      setImageSize({ width: img.width, height: img.height });
    };

    // If already annotated. Display it.
    if (labelList[file.name] !== undefined) {
      setLabel(labelList[file.name]);
    }
    // eslint-disable-next-line
  }, [index, fileList]);

  // Records an index of the images that have been labeled.
  useEffect(() => {
    if (
      label.x === initValue ||
      label.y === initValue ||
      label.visibility === initValue ||
      label.status === initValue
    )
      return;
    setLabel({ ...label, isLabeled: true });
    // eslint-disable-next-line
  }, [label.x, label.y, label.visibility, label.status]);

  const onDirectorySelected = (files: FileList | null) => {
    console.log(inputRef.current);
    if (files === null) return;
    const acceptExt = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
    const compare = (a: File, b: File) => {
      if (a.name > b.name) return 1;
      else if (b.name > a.name) return -1;
      return 0;
    };
    const newFileList = Array.from(files)
      .filter((file) => acceptExt.includes(getExt(file.name)))
      .sort(compare);
    setFileList(newFileList);
    setNumberOfImage(newFileList.length - 1);
  };

  const clearSelectedDirectory = () => {
    inputRef.current!.files = null;
  };

  const setPartOfLabelList = () => {
    setLabelList({
      ...labelList,
      [filename]: { ...label },
    });
  };

  const nextImage = () => {
    setPartOfLabelList();
    if (index === numberOfImage) setIndex(0);
    else setIndex(index + 1);
  };

  const previousImage = () => {
    setPartOfLabelList();
    if (index === 0) setIndex(numberOfImage);
    else setIndex(index - 1);
  };

  const outputLabel = () => {
    const separator = ",";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const as = [];
    for (const [f, a] of Object.entries(labelList)) {
      as.push([f, a.visibility, a.actualX, a.actualY, a.status]);
    }
    const data = as.map((a) => a.join(separator)).join("\r\n");
    const blob = new Blob([bom, data], { type: "text/csv" });
    const link = document.createElement("a");
    link.download = "Label.csv";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  useKey("ArrowRight", nextImage);
  useKey("ArrowLeft", previousImage);

  return (
    <div className="App">
      <Row>
        <div className="title-wrapper">
          <Title level={2} className="title">
            LabelingTool
          </Title>{" "}
          <p className="description">for TrackNet</p>
        </div>
      </Row>
      <Row>
        <div className="directory-select-button">
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => {
              onDirectorySelected(
                e.target.files !== null ? e.target.files : null
              );
            }}
            style={{ display: "none" }}
            /* @ts-expect-error */
            directory=""
            webkitdirectory=""
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              inputRef.current!.click();
            }}
          >
            Select Directory
          </Button>
          <Button icon={<UploadOutlined />} onClick={clearSelectedDirectory}>
            Clear(Not implemented)
          </Button>
          {fileList.length === 0 ? (
            <p>ディレクトリを選択してください．</p>
          ) : (
            <p>{fileList.length}個のファイルが選択されました．</p>
          )}
        </div>
      </Row>
      <Collapse accordion>
        <Panel header="使い方" key="1">
          <p>テキストはここ</p>
        </Panel>
      </Collapse>
      <Divider />
      <Row>
        <Col>
          <div>Current Image</div>
          <p>
            {index + 1}/{numberOfImage + 1}
          </p>
          <div>
            <Button
              onClick={previousImage}
              shape="circle"
              icon={<CaretLeftOutlined />}
            ></Button>
            <Button
              onClick={nextImage}
              shape="circle"
              icon={<CaretRightOutlined />}
            ></Button>
          </div>
          <Label
            filename={filename}
            width={imageSize.width}
            height={imageSize.height}
            label={label}
            setLabel={setLabel}
          />
          <div>
            <Canvas image={image} label={label} setLabel={setLabel}></Canvas>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col>
          <div ref={fileListRef}>
            <FileList
              numberOfImage={numberOfImage}
              filename={filename}
              label={label}
              labelList={labelList}
              setIndex={setIndex}
              setLabelList={setLabelList}
            />
            <Button onClick={outputLabel}>Output Label.csv</Button>
          </div>
        </Col>
      </Row>
      <Divider />
      <p>DigIT</p>
    </div>
  );
};

export default App;
