import React, { useEffect } from "react";
import { useKey } from "rooks";
import "./App.css";
import { Row, Col, Input, Button, List, Radio, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { useState, useRef } = React;

interface Annotation {
  id: number;
  filename: string;
  x: number;
  y: number;
  visibility: number;
  status: number;
}

interface AnnotationList {
  [key: string]: Annotation;
}

interface Dict {
  [key: number | string | symbol]: any;
}

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
};

const App = () => {
  const initValue = -1;

  // const [isDirectorySelected, setIsDirectorySelected] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [numberOfImage, setNumberOfImage] = useState(-1);
  const [index, setIndex] = useState(0);
  const [imageDetail, setImageDetail] = useState({
    filename: "",
    width: 0,
    height: 0,
  });
  const [annotation, setAnnotation] = useState<Annotation>({
    id: 0,
    filename: "",
    x: initValue,
    y: initValue,
    visibility: initValue,
    status: initValue,
  });
  const [annotationList, setAnnotationList] = useState<AnnotationList>({});
  const [isLabeledImageList, setIsLabeledImageList] = useState<Boolean[]>([]);

  let isDrawing = false;

  // Canvas
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageCanvas = imageCanvasRef.current;
  const imageContext = imageCanvas?.getContext("2d");
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvas = annotationCanvasRef.current;
  const annotationContext = annotationCanvas?.getContext("2d");

  // Resize the annotation canvas as the image is resize.
  useEffect(() => {
    if (!annotationCanvas) return;
    annotationCanvas.width = imageDetail.width;
    annotationCanvas.height = imageDetail.height;
    // eslint-disable-next-line
  }, [imageDetail.width, imageDetail.height]);

  // Once a directory has been selected,
  // craete a list of the same size for annotation.
  useEffect(() => {
    const newAnnotationList: AnnotationList = {};
    const newIsLabeledList: Dict = {};
    for (const [index, file] of fileList.entries()) {
      newAnnotationList[file.name] = {
        id: index,
        filename: file.name,
        x: initValue,
        y: initValue,
        visibility: initValue,
        status: initValue,
      };
      newIsLabeledList[file.name] = false;
    }
    setAnnotationList(newAnnotationList);
    setIsLabeledImageList(Array(fileList.length).fill(false));
    // eslint-disable-next-line
  }, [fileList]);

  // Records an index of the images that have been labeled.
  useEffect(() => {
    if (
      annotation.x === initValue ||
      annotation.y === initValue ||
      annotation.visibility === initValue ||
      annotation.status === initValue
    )
      return;

    const temp = [];
    for (const [index, value] of isLabeledImageList.entries()) {
      if (annotation.id === index) temp.push(true);
      else temp.push(value);
    }
    setIsLabeledImageList(temp);
    // eslint-disable-next-line
  }, [
    index,
    annotation.x,
    annotation.y,
    annotation.visibility,
    annotation.status,
  ]);

  // When the index is changed, the image is redrawn and,
  // annotation information is update.
  useEffect(() => {
    if (fileList.length === 0) return;
    const file = fileList[index];

    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (!imageCanvas || !imageContext) return;
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      imageContext.drawImage(img, 0, 0);

      setImageDetail({
        filename: file.name,
        width: img.width,
        height: img.height,
      });
    };

    // If already annotated. Display it.
    if (annotationList[file.name] !== undefined) {
      const currentAnnotation = annotationList[file.name];
      setAnnotation({
        id: currentAnnotation.id,
        filename: currentAnnotation.filename,
        x: currentAnnotation.x,
        y: currentAnnotation.y,
        visibility: currentAnnotation.visibility,
        status: currentAnnotation.status,
      });
      drawCircle(currentAnnotation.x, currentAnnotation.y);
    }
    // eslint-disable-next-line
  }, [index, fileList]);

  const onDirectorySelected = (files: FileList | null) => {
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
    console.log(newFileList);
  };

  const nextImage = (e: any) => {
    setAnnotationList({
      ...annotationList,
      [imageDetail.filename]: {
        id: annotation.id,
        filename: annotation.filename,
        x: annotation.x,
        y: annotation.y,
        visibility: annotation.visibility,
        status: annotation.status,
      },
    });
    if (index === numberOfImage) setIndex(0);
    else setIndex(index + 1);
  };

  const previousImage = (e: any) => {
    setAnnotationList({
      ...annotationList,
      [imageDetail.filename]: {
        id: annotation.id,
        filename: annotation.filename,
        x: annotation.x,
        y: annotation.y,
        visibility: annotation.visibility,
        status: annotation.status,
      },
    });
    if (index === 0) setIndex(numberOfImage);
    else setIndex(index - 1);
  };

  useKey("ArrowRight", nextImage);
  useKey("ArrowLeft", previousImage);

  const drawCircle = (x: number, y: number) => {
    if (!annotationCanvas || !annotationContext) return;
    annotationContext.clearRect(
      0,
      0,
      annotationCanvas.width,
      annotationCanvas.height
    );
    if (x === initValue && y === initValue) return;
    annotationContext.beginPath();
    annotationContext.arc(
      x, // Coordinates of the x-centre of the circle
      y, // Coordinates of the y-center of the circle
      5, // Radius
      (0 * Math.PI) / 180, // Starting angle
      (360 * Math.PI) / 180, // Ending angle
      false // Direction
    );
    annotationContext.fillStyle = "rgba(255,0,0,1.0)";
    annotationContext.fill();
  };

  const handleMouseDown = (x: number, y: number) => {
    isDrawing = true;
    drawCircle(x, y);
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing) return;
    drawCircle(x, y);
  };

  const handleMouseUp = (x: number, y: number) => {
    isDrawing = false;
    drawCircle(x, y);
    setAnnotation({
      ...annotation,
      x: x,
      y: y,
      visibility: annotation.visibility,
      status: annotation.status,
    });
  };

  const outputLabel = () => {
    const separator = ",";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const as = [];
    for (const [f, a] of Object.entries(annotationList)) {
      as.push([f, a.visibility, a.x, a.y, 0]);
    }
    const data = as.map((a) => a.join(separator)).join("\r\n");
    const blob = new Blob([bom, data], { type: "text/csv" });
    const link = document.createElement("a");
    link.download = "Label.csv";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="App">
      <Row gutter={16}>
        <Col>
          <h2>Labelingtool</h2>
          <input
            type="file"
            onChange={(e) => {
              onDirectorySelected(
                e.target.files !== null ? e.target.files : null
              );
            }}
            /* @ts-expect-error */
            directory=""
            webkitdirectory=""
          />
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  <Input disabled value={imageDetail.filename} id="filename" />
                </td>
              </tr>
              <tr>
                <th>Width</th>
                <td>
                  <Input disabled value={imageDetail.width} id="width" />
                </td>
              </tr>
              <tr>
                <th>Height</th>
                <td>
                  <Input disabled value={imageDetail.height} id="height" />
                </td>
              </tr>
              <tr>
                <th>X coordinate</th>
                <td>
                  <Input disabled value={annotation.x} id="xCoordinate" />
                </td>
              </tr>
              <tr>
                <th>Y coordinate</th>
                <td>
                  <Input disabled value={annotation.y} id="yCoordinate" />
                </td>
              </tr>
              <tr>
                <th>Visibility</th>
                <td>
                  <Radio.Group
                    options={[
                      { label: "0", value: 0 },
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3", value: 3 },
                    ]}
                    onChange={(e) =>
                      setAnnotation({
                        ...annotation,
                        visibility: Number(e.target.value),
                      })
                    }
                    value={annotation.visibility}
                    optionType="button"
                  />
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <Radio.Group
                    options={[
                      { label: "0", value: 0 },
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                    ]}
                    onChange={(e) =>
                      setAnnotation({
                        ...annotation,
                        status: Number(e.target.value),
                      })
                    }
                    value={annotation.status}
                    optionType="button"
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
          <div style={{ height: "300px", overflow: "auto" }}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={() => {
                return;
              }}
              hasMore={false}
              useWindow={false}
            >
              <List
                dataSource={fileList}
                renderItem={(item, index) => (
                  <List.Item key={index} onClick={() => setIndex(index)}>
                    <div>{item.name}</div>
                    <div>
                      {isLabeledImageList[index] === true ? (
                        <Text type="success">Labeled</Text>
                      ) : (
                        <Text type="danger">Not Labeled</Text>
                      )}
                    </div>
                  </List.Item>
                )}
              ></List>
            </InfiniteScroll>
          </div>
          <div>
            <div>
              <b>
                All images are{" "}
                {isLabeledImageList.filter((a) => a === true).length - 1 !==
                numberOfImage ? (
                  <Text type="danger">NOT </Text>
                ) : (
                  ""
                )}
                labeled.
              </b>
            </div>
            <Text>
              Labeded images:{" "}
              {isLabeledImageList.filter((a) => a === true).length}/
              {numberOfImage + 1}
            </Text>
          </div>
          <Button onClick={outputLabel}>Output Label.csv</Button>
        </Col>
        <Col>
          <div>
            <div className="canvas-wrapper">
              {/* TODO: Use <img> instead of <canvas> */}
              <canvas ref={imageCanvasRef} id="image"></canvas>
              <canvas
                ref={annotationCanvasRef}
                id="annotation"
                onMouseDown={(e) =>
                  handleMouseDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                }
                onMouseUp={(e) =>
                  handleMouseUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                }
                onMouseMove={(e) =>
                  handleMouseMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                }
              ></canvas>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default App;
