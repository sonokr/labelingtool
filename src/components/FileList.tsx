import { FC, Dispatch, SetStateAction } from "react";
import { List, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroller";

const { Text } = Typography;

type Props = {
  fileList: File[];
  labelList: LabelList;
  setIndex: Dispatch<SetStateAction<number>>;
};

const FileList: FC<Props> = ({ fileList, labelList, setIndex }) => {
  let numberOfLabeledImage = 0;
  for (const key in labelList) {
    if (labelList[key].isLabeled) numberOfLabeledImage++;
  }
  return (
    <>
      <div style={{ height: "300px", overflow: "auto" }}>
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
            dataSource={Object.entries(labelList)}
            renderItem={([filename, label], index) => (
              <List.Item key={index} onClick={() => setIndex(index)}>
                <div>{filename}</div>
                <div>
                  {label.isLabeled === true ? (
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
      <div>
        <div>
          <b>
            All images are{" "}
            {numberOfLabeledImage !== fileList.length ? (
              <Text type="danger">NOT </Text>
            ) : (
              ""
            )}
            labeled.
          </b>
        </div>
        <Text>
          Labeded images: {numberOfLabeledImage}/{fileList.length}
        </Text>
      </div>
    </>
  );
};

export default FileList;
