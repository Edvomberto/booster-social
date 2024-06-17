import React from 'react';
import { Fade } from 'reactstrap';

function FadeWrapper({ in: inProp = true, children, ...otherProps }) {
  return <Fade in={inProp} {...otherProps}>
    {children}
  </Fade>;
}

export default FadeWrapper;