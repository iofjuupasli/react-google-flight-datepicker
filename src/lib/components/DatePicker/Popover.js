import PropTypes from 'prop-types';
import React from 'react';
import Tether from 'tether';
import { createPortal } from 'react-dom';
import { ResizeSensor } from 'css-element-queries';

const getModalRoot = () => document.body;

export default class Popover extends React.Component {
  constructor(props) {
    super(props);
    const popoverContainer = document.createElement('div');
    popoverContainer.className = `popover ${props.popoverClass}`;
    if (props.fixed) {
      popoverContainer.className += ' popover--fixed';
    }

    this.popoverElement = popoverContainer;
  }

  componentDidMount() {
    getModalRoot().appendChild(this.popoverElement);
    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
      getModalRoot().addEventListener('keydown', this.onDocumentKeyDown);
    }, 0);
    if (this.props.pin && this.tether) {
      return;
    }
    if (this.tether != null) {
      this.tether.destroy();
    }
    this.tether = new Tether(this.tetherOptions());
    this.tether.position();

    this.resizeSensor = new ResizeSensor(this.popoverElement, this.reposition);
  }

  componentDidUpdate() {
    this.reposition();
  }

  componentWillUnmount() {
    if (this.tether != null) {
      this.tether.destroy();
    }
    this.tether = null;
    document.removeEventListener('click', this.onDocumentClick);
    getModalRoot().removeEventListener('keydown', this.onDocumentKeyDown);

    getModalRoot().removeChild(this.popoverElement);

    if (this.resizeSensor) {
      this.resizeSensor.detach(this.reposition);
    }
  }

  onDocumentClick = evt => {
    const container = this.popoverElement;
    const element = evt.target;

    if (container !== element && !container.contains(element) && document.activeElement && document.activeElement.className.indexOf('ace_text-input') === -1) {
      if (document.body.contains(element)) {
        this.props.onClickOutside(evt);
      }
    }
  };

  onDocumentKeyDown = event => {
    if (event.keyCode === 27) {
      // escape
      this.props.onEsc(event);
    }
  };

  reposition = () => {
    if (this.tether && !this.props.pin) {
      this.tether.position();
    }
  };

  tetherOptions = () => ({
    element: this.popoverElement,
    target: this.props.targetElement,
    attachment: this.props.attachment,
    targetAttachment: this.props.targetAttachment,
    targetOffset: this.props.targetOffset,
    optimizations: {
      moveElement: true,
    },
    constraints: this.props.constraints || [
      { to: 'window', attachment: 'none', pin: this.props.pinOnScroll },
    ],
  });

  render() {
    return createPortal(this.props.children, this.popoverElement);
  }
}

Popover.propTypes = {
  popoverClass: PropTypes.string,
  onClickOutside: PropTypes.func,
  onEsc: PropTypes.func,
  children: PropTypes.node.isRequired,
  targetElement: PropTypes.any,
  attachment: PropTypes.string,
  targetAttachment: PropTypes.string,
  targetOffset: PropTypes.string,
  pin: PropTypes.bool,
  fixed: PropTypes.bool,
  pinOnScroll: PropTypes.bool,
  constraints: PropTypes.array,
};

Popover.defaultProps = {
  targetElement: null,
  pinOnScroll: true,
  popoverClass: '',
  onClickOutside: () => {},
  onEsc: () => {},
  attachment: 'top left',
  targetAttachment: 'top left',
  targetOffset: '0px -24px',
  constraints: null,
  pin: false,
  fixed: false,
};
