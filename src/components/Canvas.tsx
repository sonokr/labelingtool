import { memo, FC, SetStateAction, Dispatch } from "react";
import { Stage, Layer, Circle, Image as Kimage } from "react-konva";

type Props = {
  image: HTMLImageElement;
  label: Label;
  setLabel: Dispatch<SetStateAction<Label>>;
};

const Canvas: FC<Props> = ({ image, label, setLabel }) => {
  const width = image.width;
  const height = image.height;

  const ballX = label.x;
  const ballY = label.y;

  const setLabelCoords = (x: number, y: number) => setLabel({ ...label, x, y });

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
      <Stage width={width} height={height}>
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
