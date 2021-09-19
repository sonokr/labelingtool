import React, { useEffect } from "react";
import { useKey } from "react-use";
import "./App.css";
const { useState, useRef } = React;

const getExt = (filename: string) => {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
};

function App() {
  const [imageList, setImageList] = useState<File[]>([]);
  const [numberOfImage, setNumberOfImage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageDetail, setImageDetail] = useState({
    filename: "",
    width: 0,
    height: 0,
  });

  const IMAGE_ID = "image";

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // TODO: Canvasに画像を描画する処理
    if (imageList.length === 0) return;
    const file = imageList[currentIndex];
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
  }, [currentIndex, imageList]);

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
    setNumberOfImage(tempImageList.length - 1);
  };

  const nextImage = () => {
    if (currentIndex === numberOfImage) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousImage = () => {
    if (currentIndex === 0) {
      setCurrentIndex(numberOfImage);
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  useKey("ArrowRight", nextImage);
  useKey("ArrowLeft", previousImage);

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
      <div>
        <input disabled value={imageDetail.filename} />
        <input disabled value={imageDetail.width} />
        <input disabled value={imageDetail.height} />
      </div>
      <p>
        {currentIndex}/{numberOfImage}
      </p>
      <button onClick={previousImage}>Previous</button>
      <button onClick={nextImage}>Next</button>
      <div>
        <canvas ref={imageCanvasRef} id={IMAGE_ID}></canvas>
      </div>
    </div>
  );
}

export default App;
