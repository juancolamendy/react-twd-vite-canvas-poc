import { useState, useRef } from 'react';

import { Stage, Layer } from 'react-konva';

import BgImage from '../components/canvas/BgImage';
import ImageShape from '../components/canvas/ImageShape';

const WIDTH           = 512;
const HEIGHT          = 512;
const BG_IMAGE_URL    = 'https://images.pexels.com/photos/1731660/pexels-photo-1731660.jpeg';
const SUBJ_IMAGE_URL  = 'https://bigfork.org/wp-content/uploads/2018/06/Coca-Cola-8-oz-Glass-Bottle-002.jpg';
const SUBJ_X          = 0;
const SUBJ_Y          = 0;
const SUBJ_WIDTH      = 100;
const SUBJ_HEIGHT     = 100;
const DELETE_KEY_CODE = 8;     

const createImage = ({src, id, ...rest}) => {
  return {
    src,
    id: id,
    x: SUBJ_X,
    y: SUBJ_Y,
    width: SUBJ_WIDTH,
    height: SUBJ_HEIGHT,
    ...rest,
  };
}

function Index() {
  // refs
  const stageRef = useRef();

  // state
  const [selectedId, setSelectedId] = useState(null);
  const [images, setImages] = useState([]);

  // hooks

  // functions
  const handleDeselect = e => {
    const clickedOnEmpty = e.target === e.target.getStage();
    //console.log('-- clickedOnEmpty', clickedOnEmpty);
    if(clickedOnEmpty) {
      setSelectedId(null);
    }    
  };

  const handleSelect = id => {
    setSelectedId(id);
  }

  const handleKeyDown = e => {
    console.log('-- onKeyDown:', selectedId);
    if (e.keyCode === DELETE_KEY_CODE && selectedId !== undefined && selectedId !== null) {
      console.log('-- delete:', selectedId);
      const tmpImgs = images.filter(img => img.id !== selectedId);
      setImages(tmpImgs);
      setSelectedId(null);
    }    
  };

  const handleChange = data => {
    console.log('-- onChange:', data);
    const tmpImgs = images.map(img => {
      if(data.id === img.id) {
        return {
          ...img, ...data,
        }
      }
      return img;
    });
    setImages(tmpImgs);
    setSelectedId(data.id);
  };

  const handleNew = () => {
    // add image
    setImages([
      ...images,
      createImage({
        src: SUBJ_IMAGE_URL,
        id: images.length+1,
    })]);
  }

  const handleDownload = () => {
    // download the image
    if(stageRef && stageRef.current) {
      var dataURL = stageRef.current.toDataURL();
      console.log(dataURL);
    }
  }

  console.log('-- images:', images);
  // render out
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full flex-col md:flex-row">

        <div className="flex flex-col space-y-4 w-full md:w-40 shrink-0 bg-gray-100 p-4">
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
            <div              
              className="max-w-[600px] mx-auto border border-4 border-red-900 bg-blue-600 p-2"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >

              <Stage
                ref={stageRef}

                style={{
                  border: "1px solid grey",
                  background: 'green',
                }}

                width={WIDTH}
                height={HEIGHT}

                onMouseDown={handleDeselect}
                onTouchStart={handleDeselect}
              >
                <Layer>
                  <BgImage
                    src={BG_IMAGE_URL}
                    x={0}
                    y={0}
                    width={WIDTH}
                    height={HEIGHT}
                  />

                  { images.map((img, i) => (
                    <ImageShape
                      key={i}
                      shapeProps={img}
                      isSelected={img.id === selectedId}
                      onSelect={handleSelect}
                      onChange={handleChange}
                    />
                  ))}

                </Layer>
              </Stage>
              
            </div>

        </div>

      </div>
    </div>
  )
}

export default Index;