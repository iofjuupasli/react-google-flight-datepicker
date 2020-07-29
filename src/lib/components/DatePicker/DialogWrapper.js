import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Popover from './Popover';

const DialogWrapper = ({
  children,
  isMobile,
  targetElement,
  onClose,
  targetOffset,
}) => (isMobile ? (
  createPortal(
    <div className="react-google-flight-datepicker">{children}</div>,
    document.querySelector('body'),
  )
) : (
  <Popover
    targetElement={targetElement}
    onClickOutside={onClose}
    onEsc={onClose}
    targetOffset={targetOffset}
  >
    <div className="react-google-flight-datepicker">{children}</div>
  </Popover>
));

DialogWrapper.propTypes = {
  isMobile: PropTypes.string,
  children: PropTypes.node,
  targetElement: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  targetOffset: PropTypes.string,
};

DialogWrapper.defaultProps = {
  children: null,
  isMobile: false,
};

export default DialogWrapper;
