import { useRef, useEffect } from 'react';

import useImage from "use-image";

import { Image, Transformer, Circle } from 'react-konva';

const ImageShape = ({shapeProps, id, isSelected, onSelect, onChange}) => {
  // refs
  const imageRef = useRef();
  const transformerRef = useRef();

  // hooks
  const [image] = useImage(shapeProps.src, 'Anonymous');

  useEffect(() => {
    //console.log('-- isSelected', isSelected);
    if (isSelected && transformerRef && transformerRef.current && imageRef && imageRef.current) {
      // we need to attach transformer manually
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
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

  const handleSelect = () => {
    onSelect && typeof onSelect === 'function' && onSelect(id);
  }

  const handleBoundBox = (oldBox, newBox) => {
    console.log('-- handleBoundBox');
    // limit resize
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  };

  const handleDragEnd = (e) => {
    onChange({
      id,
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e) => {
    console.log('--- handleTransformEnd');
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      id,
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      // set minimal value
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  //console.log('-- ImageShape:', id, isSelected, shapeProps);
  // render out
  return (
  <>
  <Image
    ref={imageRef}
    image={image}
    {...shapeProps}
    draggable
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={handleSelect}
    onTap={handleSelect}
    onDragEnd={handleDragEnd}
    onTransformEnd={handleTransformEnd}    
  />
  {isSelected && (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={handleBoundBox}
    >
      <Circle
        x={imageRef && imageRef.current ? imageRef.current.width() : 0}
        radius={8}
        fill="red"
        onClick={() => console.log('delete onClick')}
      ></Circle>
    </Transformer>
  )}  
  </>
  );
};

export default ImageShape;