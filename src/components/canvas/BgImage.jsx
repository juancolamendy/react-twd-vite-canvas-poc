import useImage from "use-image";

import { Image } from 'react-konva';

const BgImage = ({src, ...rest}) => {
  // hooks
  const [image] = useImage(src, 'Anonymous');

  // render out
  return (<Image 
    image={image} 
    listening={false}
    {...rest}
  />);
};

export default BgImage;