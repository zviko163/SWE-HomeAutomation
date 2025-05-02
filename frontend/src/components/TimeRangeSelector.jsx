import React from 'react';

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  const timeRanges = ['24h', '7d', '30d', '1y'];

  return (
    <div className="insights-time-selector">
      <div className="time-range-selector">
        {timeRanges.map((range) => (
          <button
            key={range}
            className={`time-btn ${selectedRange === range ? 'active' : ''}`}
            onClick={() => onRangeChange(range)}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;