import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getMonth,
  differenceInMonths,
  parseISO,
} from 'date-fns';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import MonthCalendar from './MonthCalendar';
import { getMonthInfo, getWeekDay } from '../../helpers';

const DialogContentMobile = ({
  fromDate,
  toDate,
  hoverDate,
  onSelectDate,
  startWeekDay,
  minDate,
  maxDate,
  monthFormat,
  isOpen,
  isSingle,
  highlightToday,
}) => {
  const [rowCount, setRowCount] = useState(2400);
  const minYear = minDate ? getYear(minDate) : 1900;
  const minMonth = minDate ? getMonth(minDate) : 0;
  const listRef = useRef();

  useEffect(() => {
    if (maxDate) {
      const _minDate = minDate || parseISO('1900-01-01');
      setRowCount(differenceInMonths(maxDate, _minDate) + 1);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const date = fromDate || new Date();
      let monthDiff = differenceInMonths(date, parseISO('1900-01-01'));

      if (minDate) {
        monthDiff = differenceInMonths(date, minDate);
      }

      const timeoutId = setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToItem(monthDiff + 1, 'smart');
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  function getMonthYearFromIndex(index) {
    const _index = index + minMonth;
    const year = minYear + Math.floor(_index / 12);
    const month = _index % 12;

    return { year, month };
  }

  // eslint-disable-next-line react/prop-types
  const Row = ({ index, style }) => {
    const { year, month } = getMonthYearFromIndex(index);

    return (
      <div style={style}>
        <MonthCalendar
          month={month}
          year={year}
          onSelectDate={onSelectDate}
          fromDate={fromDate}
          toDate={toDate}
          hoverDate={hoverDate}
          startWeekDay={startWeekDay}
          minDate={minDate}
          maxDate={maxDate}
          monthFormat={monthFormat}
          isSingle={isSingle}
          highlightToday={highlightToday}
        />
      </div>
    );
  };

  function getItemSize(index) {
    const { year, month } = getMonthYearFromIndex(index);
    const { totalWeek } = getMonthInfo(year, month, 'monday');

    return totalWeek.length * 48 + 34;
  }

  function renderMonthCalendars() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height - 36}
            itemCount={rowCount}
            itemSize={getItemSize}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    );
  }

  function generateWeekDay() {
    const arrWeekDay = getWeekDay(startWeekDay);

    return arrWeekDay.map((day, index) => (
      <div className="weekday" key={index}>{day}</div>
    ));
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-content">
        <div className="weekdays mobile">
          {generateWeekDay()}
        </div>
        {renderMonthCalendars()}
      </div>
    </div>

  );
};

DialogContentMobile.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func,
  startWeekDay: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthFormat: PropTypes.string,
  isOpen: PropTypes.bool,
  isSingle: PropTypes.bool,
  highlightToday: PropTypes.bool,
};

DialogContentMobile.defaultProps = {
  fromDate: null,
  toDate: null,
  hoverDate: null,
  onSelectDate: () => {},
  startWeekDay: null,
  minDate: null,
  maxDate: null,
  monthFormat: '',
  isOpen: false,
  isSingle: false,
  highlightToday: false,
};

export default DialogContentMobile;
