import React from 'react';
import './Widget.css'; // Import the corresponding CSS file

const Widget = ({ title, leftContent=null, rightContent=null }) => {
  return (
    <div className="widget">
      <div className="widget-header">{title}</div>
      <div className="widget-content">
        <div className="widget-left">
          {leftContent}
          <div></div>
        </div>
        <div className="widget-right">{rightContent}</div>
      </div>
    </div>
  );
};

export default Widget;
