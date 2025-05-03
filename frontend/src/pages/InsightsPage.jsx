import React, { useState } from 'react';
import TimeRangeSelector from '../components/TimeRangeSelector';

const InsightsPage = () => {
  const [selectedRange, setSelectedRange] = useState('24h');

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  return (
    <div className="insights-content">
      <TimeRangeSelector
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
      />
      {/* ... rest of your insights content ... */}
    </div>
  );
};

export default InsightsPage;