import { FC, Dispatch, SetStateAction } from "react";
import { List, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroller";

const { Text } = Typography;

type Props = {
  numberOfImage: number;
  filename: string;
  label: Label;
  labelList: LabelList;
  setIndex: Dispatch<SetStateAction<number>>;
  setLabelList: Dispatch<SetStateAction<LabelList>>;
};

const FileList: FC<Props> = ({
  numberOfImage,
  filename,
  label,
  labelList,
  setIndex,
  setLabelList,
}) => {
  const labelListToDisplay = [];
  for (const [key, value] of Object.entries(labelList)) {
    labelListToDisplay.push(
      key === filename
        ? { filename: filename, isLabeled: label.isLabeled }
        : { filename: key, isLabeled: value.isLabeled }
    );
  }

  const onRowClicked = (index: number) => {
    setLabelList({
      ...labelList,
      [filename]: { ...label },
    });
    setIndex(index);
  };

  return (
    <>
      <div style={{ height: "50vh", overflow: "auto" }}>
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
            dataSource={labelListToDisplay}
            renderItem={({ filename, isLabeled }, index) => (
              <List.Item key={index} onClick={() => onRowClicked(index)}>
                <div>{filename}</div>
                <div>
                  {isLabeled === true ? (
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
    </>
  );
};

export default FileList;
