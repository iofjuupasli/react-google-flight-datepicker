import React, { useState, useCallback } from 'react';
import RangeDatePicker from './RangeDatePicker';

export default function RangeDatePickerControlled() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const setDates = useCallback(
    (startDate, endDate) => {
      setStartDate(startDate);
      setEndDate(endDate);
    },
    [setStartDate, setEndDate],
  );

  return (
    <RangeDatePicker
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      startDate={startDate}
      endDate={endDate}
      onChange={setDates}
    />
  );
}
