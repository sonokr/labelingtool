import { FC, Dispatch, SetStateAction } from "react";

import { Input, Radio } from "antd";

type Props = {
  filename: string;
  width: number;
  height: number;
  label: Label;
  setLabel: Dispatch<SetStateAction<Label>>;
};

const Label: FC<Props> = ({ filename, width, height, label, setLabel }) => {
  const ballX = label.actualX;
  const ballY = label.actualY;
  const visibility = label.visibility;
  const status = label.status;

  return (
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <td>
            <Input disabled value={filename} id="filename" />
          </td>
        </tr>
        <tr>
          <th>Width</th>
          <td>
            <Input disabled value={width} id="width" />
          </td>
        </tr>
        <tr>
          <th>Height</th>
          <td>
            <Input disabled value={height} id="height" />
          </td>
        </tr>
        <tr>
          <th>X coordinate</th>
          <td>
            <Input disabled value={ballX} id="xCoordinate" />
          </td>
        </tr>
        <tr>
          <th>Y coordinate</th>
          <td>
            <Input disabled value={ballY} id="yCoordinate" />
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
                setLabel({
                  ...label,
                  visibility: Number(e.target.value),
                })
              }
              value={visibility}
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
                setLabel({
                  ...label,
                  status: Number(e.target.value),
                })
              }
              value={status}
              optionType="button"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Label;
