import React, { useState } from 'react';
import dayjs from 'dayjs';
import RangeDatePicker from './RangeDatePicker';

const TestDatePicker = () => {
  const [startDate, setStartDate] = useState(null);
  setTimeout(() => {
    setStartDate(dayjs().add(3, 'day'));
  }, 5000);

  return (
    <RangeDatePicker
      startDate={startDate}
      onChange={() => {
        console.log('change');
      }}
    />
  );
};

export default TestDatePicker;
