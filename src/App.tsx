import React, { useEffect } from "react";
import "./App.css";
const { useState, useRef } = React;

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
};

function App() {
  const [imageList, setImageList] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const IMAGE_ID = "image";
  const ANNOTATION_ID = "annotation";

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageContext = imageCanvasRef.current?.getContext("2d");
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawContext = drawCanvasRef.current?.getContext("2d");

  useEffect(() => {
    // TODO: Canvasに画像を描画する処理
    console.log("The index has changed.", currentIndex);
  }, [currentIndex]);

  const onDirectorySelected = (files: FileList | null) => {
    if (files === null) return;
    const acceptExt = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
    let tempImageList = [];
    for (const file of files) {
      if (acceptExt.includes(getExt(file.name))) {
        tempImageList.push(file);
      }
    }
    setImageList(tempImageList);
  };

  const handleMouseDown = (e: any) => {
    console.log(e);
    // TODO: クリックした位置に円を描画する．
    // TODO: 座標を記録する．
    return;
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(e) => {
          onDirectorySelected(e.target.files !== null ? e.target.files : null);
        }}
        /* @ts-expect-error */
        directory=""
        webkitdirectory=""
      />
      {imageList?.map((image: File) => (
        <div key={image.name}>
          <p>{image.name}</p>
        </div>
      ))}
      <div>
        <canvas ref={imageCanvasRef} id={IMAGE_ID}></canvas>
        <canvas
          ref={drawCanvasRef}
          id={ANNOTATION_ID}
          onMouseDown={handleMouseDown}
        ></canvas>
      </div>
    </div>
  );
}

export default App;
