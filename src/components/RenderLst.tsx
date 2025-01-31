import React from "react";

interface RenderListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  resourceName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataToRender: any;
}

const RenderLst = ({
  data,
  resourceName,
  dataToRender: ItemComponet,
}: RenderListProps) => {
  return (
    <div>
      {data.map((item, i) => (
        <ItemComponet key={i} {...{ [resourceName]: item }} />
      ))}
    </div>
  );
};

export default RenderLst;
