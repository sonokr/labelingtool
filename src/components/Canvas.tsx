import { memo, FC, SetStateAction, Dispatch } from "react";
import { Stage, Layer, Circle, Image as Kimage } from "react-konva";

type Props = {
  leftObjectWidth: number;
  image: HTMLImageElement;
  label: Label;
  setLabel: Dispatch<SetStateAction<Label>>;
};

const Canvas: FC<Props> = ({ leftObjectWidth, image, label, setLabel }) => {
  console.log(leftObjectWidth);
  const width = image.width;
  const height = image.height;

  const ballX = label.x;
  const ballY = label.y;

  const scale = (window.innerWidth - 3.6 * leftObjectWidth) / width;

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
      <Stage width={width * scale} height={height * scale}>
        <Layer>
          <Kimage
            image={image}
            width={width * scale}
            height={height * scale}
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
