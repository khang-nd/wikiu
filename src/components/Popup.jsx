import React from 'react';

class Popup extends React.Component {
  constructor() {
    super();
    document.body.style.overflowY = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflowY = '';
  }

  render() {
    const { isDismissable, children } = this.props;
    return (
      <div className="popup">
        <div className="popup__box">
          {isDismissable ? (
            <div className="popup__close">
              <i className="fi fi-close"></i>
            </div>
          ) : null}
          <div className="popup__content">{children}</div>
        </div>
      </div>
    );
  }
}

export default Popup;
