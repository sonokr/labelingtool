import React, { useEffect } from "react";
import { useKey } from "rooks";
import "./App.css";
import { Row, Col, Input, Button, List } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
const { useState, useRef } = React;

interface Annotation {
  x: number;
  y: number;
  visibility: number;
}

interface AnnotationList {
  [key: string]: Annotation;
}

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
};

const App = () => {
  const initValue = -1;

  const [fileList, setFileList] = useState<File[]>([]);
  const [numberOfImage, setNumberOfImage] = useState(0);
  const [index, setIndex] = useState(0);
  const [imageDetail, setImageDetail] = useState({
    filename: "",
    width: 0,
    height: 0,
  });
  const [annotation, setAnnotation] = useState<Annotation>({
    x: initValue,
    y: initValue,
    visibility: initValue,
  });
  const [annotationList, setAnnotationList] = useState<AnnotationList>({});

  let isDrawing = false;

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!annotationCanvasRef.current) return;
    annotationCanvasRef.current.width = imageDetail.width;
    annotationCanvasRef.current.height = imageDetail.height;
  }, [imageDetail.width, imageDetail.height]);

  useEffect(() => {
    const newAnnotationList: AnnotationList = {};
    for (const file of fileList) {
      newAnnotationList[file.name] = {
        x: initValue,
        y: initValue,
        visibility: initValue,
      };
    }
    setAnnotationList(newAnnotationList);
    // eslint-disable-next-line
  }, [fileList]);

  useEffect(() => {
    if (fileList.length === 0) return;
    const file = fileList[index];

    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (!imageCanvasRef.current) return;
      imageCanvasRef.current.width = img.width;
      imageCanvasRef.current.height = img.height;
      const context = imageCanvasRef.current.getContext("2d");
      if (!context) return;
      context.drawImage(img, 0, 0);

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
        x: currentAnnotation.x,
        y: currentAnnotation.y,
        visibility: currentAnnotation.visibility,
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
  };

  const nextImage = (e: any) => {
    if (index === numberOfImage) setIndex(0);
    else setIndex(index + 1);
  };

  const previousImage = (e: any) => {
    if (index === 0) setIndex(numberOfImage);
    else setIndex(index - 1);
  };

  useKey("ArrowRight", nextImage);
  useKey("ArrowLeft", previousImage);

  const drawCircle = (x: number, y: number) => {
    if (!annotationCanvasRef.current) return;
    const context = annotationCanvasRef.current?.getContext("2d");
    if (!context) return;
    context.clearRect(
      0,
      0,
      annotationCanvasRef.current.width,
      annotationCanvasRef.current.height
    );
    if (x === initValue && y === initValue) return;
    context.beginPath();
    context.arc(
      x, // Coordinates of the x-centre of the circle
      y, // Coordinates of the y-center of the circle
      5, // Radius
      (0 * Math.PI) / 180, // Starting angle
      (360 * Math.PI) / 180, // Ending angle
      false // Direction
    );
    context.fillStyle = "rgba(255,0,0,1.0)";
    context.fill();
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
    setAnnotation({ x: x, y: y, visibility: annotation.visibility });
    setAnnotationList({
      ...annotationList,
      [imageDetail.filename]: {
        x: x,
        y: y,
        visibility: 0,
      },
    });
  };

  const onVisibilityChange = (visibility: number) => {
    return;
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

  const handleInfiniteOnLoad = () => {
    return;
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
                <Input
                  onChange={(e) => onVisibilityChange(Number(e.target.value))}
                  value={annotation.visibility}
                  type="number"
                  id="visibility"
                />
              </td>
            </tr>
          </table>
          <p>
            {index}/{numberOfImage}
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
          {/* TODO:
              When each element in the list is clicked,
              the image should be displayed. */}
          <div style={{ height: "700px", overflow: "auto" }}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={handleInfiniteOnLoad}
              hasMore={false}
              useWindow={false}
            >
              <List
                dataSource={fileList}
                footer={
                  <div>
                    <b>Labeded images: 0/100</b>
                  </div>
                }
                renderItem={(item) => (
                  <List.Item key={item.name}>
                    <div>{item.name}</div>
                    <div>Not Labeled</div>
                  </List.Item>
                )}
              ></List>
            </InfiniteScroll>
          </div>
          <Button onClick={outputLabel}>Output Label.csv</Button>
        </Col>
        <Col>
          <div>
            <div className="canvas-wrapper">
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
