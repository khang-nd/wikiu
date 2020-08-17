import React from 'react';

function ButtonLink({ className, click, children }) {
  return (
    <div
      className={'button ripple ' + className}
      onClick={() => setTimeout(click, 500)}
    >
      {children}
    </div>
  );
}

export default ButtonLink;
