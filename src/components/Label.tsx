import { FC, Dispatch, SetStateAction } from "react";

<<<<<<< HEAD
import { Input, Radio, Row, Col } from "antd";
=======
import { Typography, Radio } from "antd";

const { Text } = Typography;
>>>>>>> master

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
    <>
<<<<<<< HEAD
      <Row>
        <Col>
          Name
          <Input disabled value={filename} id="filename" />
        </Col>
        <Col>
          Width
          <Input disabled value={width} id="width" />
        </Col>
        <Col>
          Height
          <Input disabled value={height} id="height" />
        </Col>
      </Row>
      <Row>
        <Col>
          X coordinate
          <Input disabled value={ballX} id="xCoordinate" />
        </Col>
        <Col>
          Y coordinate
          <Input disabled value={ballY} id="yCoordinate" />
        </Col>
      </Row>
      <Row>
        <Col>
          Visibility
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
        </Col>
        <Col>
          Status
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
        </Col>
      </Row>
=======
      <table>
        <tr>
          <td>
            <Text strong>Image detail</Text>
          </td>
          <td>⊳</td>
          <td>
            <Text code>
              {filename ? filename : "null"}, ({width}, {height})px
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text strong>Ball coordinates</Text>
          </td>
          <td>⊳</td>
          <td>
            <Text code>
              (x, y) = ({ballX}, {ballY})px
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text strong>Visibility</Text>
          </td>
          <td>⊳</td>
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
          <td>
            <Text strong>Status</Text>
          </td>
          <td>⊳</td>
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
      </table>
>>>>>>> master
    </>
  );
};

export default Label;
