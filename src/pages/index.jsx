import { useState, useRef, useEffect } from 'react';

import { Stage, Layer, Image, Transformer, Circle } from 'react-konva';
import useImage from "use-image";

const BgImage = ({imageUrl, ...rest}) => {
  // hooks
  const [image] = useImage(imageUrl, 'Anonymous');

  // render out
  return (<Image 
    image={image} 
    {...rest}
  />);
};

const URLImage = ({
  image,
  unSelectShape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  onDelete,
  shapeProps
}) => {
  // refs
  const shapeRef = useRef();
  const trRef = useRef();
  const deleteButton = useRef();

  // hooks
  const [img] = useImage(image.src, 'Anonymous');

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
        width={image.width}
        height={image.height}
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

const WIDTH        = 734;
const HEIGHT       = 512;
const bgImageUrl   = 'https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg';
const subjImageUrl = 'https://bigfork.org/wp-content/uploads/2018/06/Coca-Cola-8-oz-Glass-Bottle-002.jpg';

const createImage = ({src, ...rest}) => {
  return {
    src,
    ...rest,
  };
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

  const unSelectShape = (prop) => {
    selectShape(prop);
  };  

  const onDeleteImage = (node) => {
    console.log("onDeleteImage", node);
    const newImages = [...images];
    newImages.splice(node.index-1, 1);
    setImages(newImages);
  };

  const handleRemove = (index) => {
    const newList = images.filter((item) => item.index !== index);

    setImages(newList);
  }; 

  const handleNew = (e) => {
    e.preventDefault();

    if(stageRef && stageRef.current) {
      // add image
      setImages([
        ...images,
        createImage({
          x: 815,
          y: 571,
          width: 100,
          height: 50,
          src: subjImageUrl,
      })]);
    } 
  }

  const handleDownload = (e) => {
    e.preventDefault();
    if(stageRef && stageRef.current) {
      var dataURL = stageRef.current.toDataURL();
      console.log(dataURL);
    }
  }

  console.log('-- images:', images);
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
          <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        <div className="w-full flex flex-grow p-6 items-center justify-center">

            <Stage
              width={WIDTH}
              height={HEIGHT}

              ref={stageRef}

              style={{
                border: "1px solid grey"
              }} 

              onMouseDown={handleDeselect}
              onTouchStart={handleDeselect}              
            >
              <Layer>
                <BgImage
                  imageUrl={bgImageUrl}
                  x={0}
                  y={0}
                  width={WIDTH}
                  height={HEIGHT}
                />
                {images.map((image, index) => {
                  return (
                    <URLImage
                      image={image}
                      key={index}
                      shapeProps={image}
                      stageScale={1}
                      isSelected={image === selectedId}
                      unSelectShape={unSelectShape}
                      onClick={handleRemove}
                      onSelect={() => {
                        selectShape(image);
                      }}
                      onChange={(newAttrs) => {
                        const rects = images.slice();
                        rects[index] = newAttrs;
                        setImages(rects);
                      }}
                      onDelete={onDeleteImage}
                    />
                  );
                })}                
              </Layer>
            </Stage>

        </div>

      </div>
    </div>
  )
}

export default Index;
