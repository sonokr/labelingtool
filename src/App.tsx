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

import { compare, makeBlob, getExt, isLabelCorrect } from "./lib/helpers";
import { makeLabelList, readLabelFile } from "./lib/label";
import { sleep } from "./lib/sleep";

import "./App.css";

const { Sider } = Layout;
const { Title } = Typography;

const initValue = -1;
const initLabel = {
  id: 0,
  filename: "",
  x: initValue,
  y: initValue,
  visibility: initValue,
  status: initValue,
  isLabeled: false,
};

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<HTMLImageElement>(new Image()); // The image to display now.
  const [fileList, setFileList] = useState<File[]>([]); // List of selected files.
  const [numberOfImage, setNumberOfImage] = useState(0); // The number of images.
  const [index, setIndex] = useState(0); // The index of current file.
  const [filename, setFilename] = useState(""); // The filename of current file.
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // The size of current file.
  const [label, setLabel] = useState<Label>(initLabel); // The label of current file
  const [labelList, setLabelList] = useState<LabelList>({}); // The list of labels.
  const [labelFile, setLabelFile] = useState<File>();
  const [numberOfLabeledImage, setNumberOfLabeledImage] = useState(0);

  // ラベルリストを初期化する
  // 画像の枚数と同じサイズのラベルリストを初期化する
  // ラベルファイルが存在する場合は，それを読み込む
  useEffect(() => {
    let newLabelList: LabelList = {};
    if (labelFile) {
      console.log('"Label.csv" was found.');
      newLabelList = readLabelFile(labelFile);
    } else {
      console.log("Label.csv was not found.");
      newLabelList = makeLabelList(fileList);
    }
    setLabelList(newLabelList);

    (async () => {
      await sleep(100);
      if (fileList.length === 0) return;
      const filename = fileList[index].name;
      if (newLabelList[filename] === undefined) return;
      setLabel(newLabelList[filename]);
    })();

    console.log(label);

    // eslint-disable-next-line
  }, [fileList, labelFile]);

  // labelListが初期化されたとき，labelを更新する
  useEffect(() => {
    if (fileList.length === 0) return;
    if (labelList[fileList[index].name] === undefined) return;
    setLabel(labelList[fileList[index].name]);
    console.log("Label was updated.");
  }, [index, fileList, labelList]);

  // 画像のインデックスが変更されたとき
  // 画像を再描画し，ラベルを更新する
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

    console.log("Canvas was redrawn.");
  }, [index, fileList, labelList]);

  // ラベル付けが完了した画像のインデックスを記録する
  useEffect(() => {
    if (!isLabelCorrect([label.x, label.y, label.visibility, label.status]))
      return;
    setLabel({ ...label, isLabeled: true });
    console.log("This image was labeled correctly.");
    // eslint-disable-next-line
  }, [label.x, label.y, label.visibility, label.status]);

  // ラベル付けが完了した画像の枚数を記録する
  useEffect(() => {
    let tempNumberOfLabeledImage = 0;
    for (const key in labelList) {
      if (labelList[key].isLabeled) tempNumberOfLabeledImage++;
    }
    setNumberOfLabeledImage(tempNumberOfLabeledImage);
  }, [label.isLabeled, labelList]);

  const onDirectorySelected = (files: FileList | null) => {
    if (files === null) return;

    const acceptExt = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
    const newFileList = Array.from(files)
      .filter((_) => acceptExt.includes(getExt(_.name)))
      .sort(compare);

    setFileList(newFileList);
    setNumberOfImage(newFileList.length);

    const labelFile = Array.from(files)
      .filter((_) => "Label.csv".includes(_.name))
      .sort()[0];
    if (!labelFile) return;
    setLabelFile(labelFile);
  };

  const setPartOfLabelList = () => {
    setLabelList({
      ...labelList,
      [filename]: { ...label },
    });
  };

  const nextImage = () => {
    setPartOfLabelList();
    if (index === numberOfImage - 1) setIndex(0);
    else setIndex(index + 1);
  };

  const previousImage = () => {
    setPartOfLabelList();
    if (index === 0) setIndex(numberOfImage - 1);
    else setIndex(index - 1);
  };

  const outputLabel = () => {
    const blob = makeBlob(labelList);
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
            Current Image: {numberOfImage === 0 ? 0 : index + 1}/{numberOfImage}
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
            Labeled Images: {numberOfLabeledImage}/{numberOfImage}
          </div>
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
