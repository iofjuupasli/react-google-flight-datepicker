import React from 'react';
import PropTypes from 'prop-types';
import Popover from './Popover';

const DialogWrapper = ({ children, targetElement, onClose }) => (
  <Popover targetElement={targetElement} onClickOutside={onClose} onEsc={onClose}>
    <div className="react-google-flight-datepicker">
      {children}
    </div>
  </Popover>
);

DialogWrapper.propTypes = {
  children: PropTypes.node,
  targetElement: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

DialogWrapper.defaultProps = {
  children: null,
};

export default DialogWrapper;
