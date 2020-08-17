import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CircProgressBar({
  value,
  max,
  progressText = 'Downloading',
  completeText = 'Done',
}) {
  return (
    <div className="CircularProgressbar__wrapper">
      <CircularProgressbarWithChildren
        maxValue={max}
        value={value}
        styles={{
          path: { stroke: '#5d807e' },
          trail: { stroke: 'transparent' },
        }}
      >
        {value === max ? completeText : progressText}
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '200%',
            color: '#5d807e',
          }}
        >
          {value === max ? (
            <i className="fi fi-check-mark"></i>
          ) : (
            `${value}/${max}`
          )}
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default CircProgressBar;
