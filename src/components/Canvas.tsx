import { memo, FC, SetStateAction, Dispatch } from "react";
import { Stage, Layer, Circle, Image as Kimage } from "react-konva";

type Props = {
  leftObjectWidth: number;
  image: HTMLImageElement;
  label: Label;
  setLabel: Dispatch<SetStateAction<Label>>;
};

const Canvas: FC<Props> = ({ leftObjectWidth, image, label, setLabel }) => {
  const width = image.width;
  const height = image.height;

  const ballX = label.x;
  const ballY = label.y;

  const scale = (window.innerWidth - leftObjectWidth) / width;
  console.log("screen width", window.screenX);
  console.log("screen height", window.screenY);
  console.log("scale = window.innerWidth - leftObjectWidth / width");
  console.log(
    `${scale} = ${window.innerWidth} - ${leftObjectWidth} / ${width}`
  );
  console.log("利用可能なwidth", window.innerWidth - leftObjectWidth);
  console.log("利用可能なheight", window.innerHeight);
  console.log("スケール後の画像のwidth", scale * width);
  console.log("スケール後の画像のheight", scale * height);

  const setLabelCoords = (x: number, y: number) =>
    setLabel({
      ...label,
      x: x,
      y: y,
      actualX: (x * (1 / scale)) | 0,
      actualY: (y * (1 / scale)) | 0,
    });

  const handleMouseDown = (x: number, y: number) => {
    setLabelCoords(x, y);
  };

  const handleMouseUp = (x: number, y: number) => {
    setLabelCoords(x, y);
  };

  return (
    <div
      onMouseDown={(e) =>
        handleMouseDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      }
      onMouseUp={(e) =>
        handleMouseUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      }
    >
      <Stage
        width={width * scale}
        height={height * scale}
        scale={{ x: scale, y: scale }}
      >
        <Layer>
          <Kimage
            image={image}
            width={width}
            height={height}
            x={0}
            y={0}
          ></Kimage>
        </Layer>
        <Layer>
          <Circle fill="red" x={ballX} y={ballY} radius={5} opacity={1.0} />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(Canvas);
