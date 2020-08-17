import React from 'react';

function Header({ history, title, desc = null, label = null }) {
  return (
    <div className="header">
      <div className="header__title">
        {title}
        {desc ? <div className="header__desc">{desc}</div> : null}
      </div>
      {label ? <div className="label">{label}</div> : null}
    </div>
  );
}

export default Header;
