import { useRef, useEffect } from 'react';

import useImage from "use-image";

import { Image, Transformer } from 'react-konva';

const MIN_SIZE = 5;

const ImageShape = ({shapeProps, isSelected, onSelect, onChange}) => {
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
  const handleMouseEnter = e => {
    if (isSelected) {
      e.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
      e.target.getStage().container().style.cursor = "pointer";
    }
  };

  const handleMouseLeave = e => {
    e.target.getStage().container().style.cursor = "default";
  };

  const handleSelect = () => {
    onSelect && typeof onSelect === 'function' && onSelect(shapeProps.id);
  }

  const handleBoundBox = (oldBox, newBox) => {
    console.log('-- handleBoundBox');
    // limit resize
    if (newBox.width < MIN_SIZE || newBox.height < MIN_SIZE) {
      return oldBox;
    }
    return newBox;
  };

  const handleDragEnd = e => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = e => {
    console.log('--- handleTransformEnd');
    const node = imageRef.current;
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
      width: Math.max(MIN_SIZE, node.width() * scaleX),
      height: Math.max(MIN_SIZE, node.height() * scaleY),
    });
  };

  //console.log('-- ImageShape:', isSelected, shapeProps);
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
    </Transformer>
  )}  
  </>
  );
};

export default ImageShape;