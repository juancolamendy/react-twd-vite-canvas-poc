import { useState, useRef, useEffect } from 'react';

import { Stage, Layer, Image, Transformer, Circle } from 'react-konva';
import useImage from "use-image";

const BgImage = (props) => {
  // hooks
  const [image] = useImage(
    "https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg"
  );

  // render out
  return (<Image 
    image={image} 
    {...props}
  />);
};

const URLImage = ({
  image,
  shapeProps,
  unSelectShape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  onDelete
}) => {
  // refs
  const shapeRef = useRef();
  const trRef = useRef();
  const deleteButton = useRef();

  // hooks
  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current && trRef.current.nodes([shapeRef.current]);
      trRef.current && trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // functions
  const onMouseEnter = (e) => {
    if (isSelected) {
      e.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
      e.target.getStage().container().style.cursor = "pointer";
    }
  };

  const onMouseLeave = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };  

  const handleDelete = () => {
    unSelectShape(null);
    onDelete(shapeRef.current);
  };

  // render out
  return (
    <>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButton}
            onClick={handleDelete}
            x={shapeRef.current.width() * stageScale}
          ></Circle>
        </Transformer>
      )}
    </>
  );
}

const WIDTH = 734;
const HEIGHT = 512;

const createImage = ({src, ...rest}) => {
  return {src, ...rest};
}

function Index() {
  // refs
  const stageRef = useRef();

  // state
  const [selectedId, selectShape] = useState(null);
  const [images, setImages] = useState([]);  

  // hooks

  // functions
  const handleDeselect = (e) => {
    console.log('-- handleDeselect');
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleNew = (e) => {
    e.preventDefault();

    if(stageRef && stageRef.current) {
      // add image
      setImages([
        ...images,
        createImage({
          src: 'https://images.pexels.com/photos/9575875/pexels-photo-9575875.jpeg',
      })]);
    } 
  }

  // render out
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex flex-row h-full w-full overflow-hidden">

        <div className="flex flex-col space-y-4 w-40 shrink-0 bg-gray-100 p-4">
          <button type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleNew}
          >
            New
          </button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Download
          </button>
        </div>

        <div className="w-full flex flex-grow p-6 items-center justify-center">

            <Stage
              width={WIDTH}
              height={HEIGHT}

              ref={stageRef}

              draggable={true}
              style={{
                border: "1px solid grey"
              }} 

              onMouseDown={handleDeselect}
              onTouchStart={handleDeselect}              
            >
              <Layer>
                <BgImage
                  x={0}
                  y={0}
                  width={WIDTH}
                  height={HEIGHT}
                />
              </Layer>
            </Stage>

        </div>

      </div>
    </div>
  )
}

export default Index;
