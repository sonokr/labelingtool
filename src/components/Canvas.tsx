import { memo, FC, SetStateAction, Dispatch } from "react";
import { Stage, Layer, Circle, Rect, Image as Kimage } from "react-konva";

type Props = {
  image: HTMLImageElement;
  label: Label;
  setLabel: Dispatch<SetStateAction<Label>>;
};

const Canvas: FC<Props> = ({ image, label, setLabel }) => {
  const width = image.width;
  const height = image.height;

  const scale = ((window.innerWidth - 60) * 0.8) / width; // marginを考慮

  const ballX = label.x * scale;
  const ballY = label.y * scale;

  const setLabelCoords = (x: number, y: number) =>
    setLabel({
      ...label,
      x: (x * (1 / scale)) | 0,
      y: (y * (1 / scale)) | 0,
    });

  const handleMouseDown = (x: number, y: number) => {
    setLabelCoords(x, y);
  };

  const handleMouseUp = (x: number, y: number) => {
    setLabelCoords(x, y);
  };

  const imageCanvas = (
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

  const skeltonWidth = (window.innerWidth - 60) * 0.8;

  const skelton = (
    <div>
      <Stage width={skeltonWidth} height={skeltonWidth * (9 / 16)}>
        <Layer>
          <Rect
            stroke="black"
            strokeWidth={1}
            width={skeltonWidth}
            height={skeltonWidth * (9 / 16)}
          />
        </Layer>
      </Stage>
    </div>
  );

  return width !== 0 ? imageCanvas : skelton;
};

export default memo(Canvas);
