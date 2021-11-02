import { useState, useEffect, useRef } from "react";

import { useKey } from "rooks";
import { Layout, Row, Col, Button, Typography } from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import Canvas from "./components/Canvas";
import Label from "./components/Label";
import FileList from "./components/FileList";

import "./App.css";

const { Sider } = Layout;
const { Title } = Typography;

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "10px";
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
  const inputLabelRef = useRef<HTMLInputElement>(null);

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

  let numberOfLabeledImage = 0;
  for (const key in labelList) {
    if (labelList[key].isLabeled) numberOfLabeledImage++;
  }

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

  const onLabelSelected = (files: FileList | null) => {
    if (files === null) return;
    console.log(files[0]);
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
    <Layout style={{ background: "#fff", margin: "30px 0px" }}>
      <Sider
        className="App"
        breakpoint="lg"
        style={{ background: "#fff", margin: "0px 30px" }}
      >
        <Row>
          <div className="title-wrapper">
            <Title level={3} className="title">
              LabelingTool
            </Title>{" "}
            <p className="description">for TrackNet</p>
          </div>
        </Row>
        <div style={{ marginBottom: "15px" }}>
          <a
            href="https://digit-sport.notion.site/Labelingtool-for-TrackNet-076774bea4634a968c250c779f5efb41"
            target="_blank"
            rel="noreferrer"
          >
            How to use
          </a>
        </div>
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
            {fileList.length === 0 ? (
              <p>No file selected.</p>
            ) : (
              <p>{fileList.length} files selected.</p>
            )}
          </div>
        </Row>
        <div style={{ marginBottom: "15px" }}>
          <div>
            Current Image: {index + 1}/{numberOfImage + 1}
          </div>
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
        </div>
        <div style={{ marginBottom: "15px" }}>
          <div>
            Labeled Images: {numberOfLabeledImage + 1}/{numberOfImage + 1}
          </div>
          <input
            type="file"
            accept=".csv"
            ref={inputLabelRef}
            style={{ display: "none" }}
            onChange={(e) =>
              onLabelSelected(e.target.files !== null ? e.target.files : null)
            }
          />
          <Button
            style={{ width: "11em" }}
            onClick={() => inputLabelRef.current!.click()}
          >
            Load Label.csv
          </Button>
          <Button style={{ width: "11em" }} onClick={() => outputLabel()}>
            Output Label.csv
          </Button>
        </div>
        <div ref={fileListRef}>
          <FileList
            numberOfImage={numberOfImage}
            filename={filename}
            label={label}
            labelList={labelList}
            setIndex={setIndex}
            setLabelList={setLabelList}
          />
        </div>
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Row>
          <Col>
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
      </Layout>
    </Layout>
  );
};

export default App;
