import { useState, useRef, useEffect } from 'react';

import { Stage, Layer, Image, Transformer, Circle } from 'react-konva';
import useImage from "use-image";

const BgImage = ({imageUrl, ...rest}) => {
  // hooks
  const [image] = useImage(imageUrl, 'Anonymous');

  // render out
  return (<Image 
    image={image} 
    draggable
    {...rest}
  />);
};

const URLImage = ({
  image,
  isSelected,
  stageScale,
  onSelect,
  onChange,  
  onDelete,
}) => {
  // refs
  const refImage = useRef();
  const refTransformer = useRef();

  // hooks
  const [img] = useImage(image.src, 'Anonymous');

  useEffect(() => {
    //console.log('-- isSelected', isSelected);
    if (isSelected) {
      // we need to attach transformer manually
      refTransformer && refTransformer.current && refTransformer.current.nodes([refImage.current]);
      refTransformer && refTransformer.current && refTransformer.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // functions
  const handleMouseEnter = (e) => {
    if (isSelected) {
      e.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
      e.target.getStage().container().style.cursor = "pointer";
    }
  };

  const handleMouseLeave = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };

  const handleBoundBox = (oldBox, newBox) => {
    // limit resize
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  };

  console.log(' -- URLImage:', image);
  // render out
  return (
    <>
      <Image
        ref={refImage}
        image={img}
        draggable
        // offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onSelect}
        onTap={onSelect}        
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {          
          const node = refImage.current;
          console.log('-- onTransformEnd: ', node);
          // const scaleX = node.scaleX();
          // const scaleY = node.scaleY();

          // we will reset it back
          // node.scaleX(1);
          // node.scaleY(1);
          // console.log(`scales: scaleX:${scaleX}, scaleY:${scaleY}`);
          // onChange({
          //   ...image,
          //   // x: node.x(),
          //   // y: node.y(),
          //   // set minimal value
          //   width: Math.max(5, node.width() * scaleX),
          //   height: Math.max(node.height() * scaleY)
          // });
        }}
        {...image}
      />
      {isSelected && (
        <Transformer
          ref={refTransformer}
          boundBoxFunc={handleBoundBox}
          centeredScaling={false}
        >
          <Circle
            x={refImage.current.width() * stageScale}
            radius={8}
            fill="red"
            onClick={() => onDelete(refImage.current)}
          ></Circle>
        </Transformer>
      )}
    </>
  );
}

const WIDTH          = 734;
const HEIGHT         = 512;
const BG_IMAGE_URL   = 'https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg';
const SUBJ_IMAGE_URL = 'https://bigfork.org/wp-content/uploads/2018/06/Coca-Cola-8-oz-Glass-Bottle-002.jpg';
const SUBJ_X         = 512;
const SUBJ_Y         = 512;
const SUBJ_WIDTH     = 120;
const SUBJ_HEIGHT    = 100;

const createImage = ({src, ...rest}) => {
  return {
    src,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    ...rest,
  };
}

function Index() {
  // refs
  const refStage = useRef();

  // state
  const [selectedImage, selectImage] = useState(null);
  const [images, setImages] = useState([]);  

  // hooks

  // functions
  const handleDeselect = (e) => {    
    // deselect when clicked on empty area
    // console.log('-- handleDeselect: index clicked:', e.target.index, e.target.index === 0);
    if (e.target.index === 0) {
      selectImage(null);
    }
  };

  const handleDeleteImage = (image) => {
    console.log("handleDeleteImage", image);
    selectImage(null);
    const newImages = [...images];
    newImages.splice(image.index-1, 1);
    setImages(newImages);
  };

  const handleNew = () => {
    // add image
    setImages([
      ...images,
      createImage({
        x: SUBJ_X,
        y: SUBJ_Y,
        width: SUBJ_WIDTH,
        height: SUBJ_HEIGHT,
        src: SUBJ_IMAGE_URL,
    })]);
  }

  const handleDownload = (e) => {
    e.preventDefault();
    if(refStage && refStage.current) {
      var dataURL = refStage.current.toDataURL();
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

              ref={refStage}

              style={{
                border: "1px solid grey"
              }} 

              onMouseDown={handleDeselect}
              onTouchStart={handleDeselect}              
            >
              <Layer>
                <BgImage
                  imageUrl={BG_IMAGE_URL}
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
                      stageScale={1}
                      isSelected={image === selectedImage}
                      onSelect={() => selectImage(image)}
                      onChange={(image) => {
                        console.log('-- onChange:', image);
                        const rects = images.slice();
                        rects[index] = image;
                        setImages(rects);
                        selectImage(image);
                      }}
                      onDelete={handleDeleteImage}
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
