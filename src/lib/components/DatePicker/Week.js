import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  isSameDay,
} from 'date-fns';

import Day from './Day';

const Week = ({
  isFirst,
  week,
  month,
  year,
  fromDate,
  toDate,
  hoverDate,
  onSelectDate,
  onHoverDate,
  totalDay,
  minDate,
  maxDate,
  isSingle,
  weekIndex,
  highlightToday,
}) => {
  function generateDay() {
    return [...Array(week.days).keys()].map(index => {
      const dateIndex = index + week.start;
      const dateValue = parseISO(`${year}-${(month + 1).toString().padStart(2, '0')}-${dateIndex.toString().padStart(2, '0')}`);
      const disabled = (minDate && isBefore(startOfDay(dateValue), startOfDay(minDate)))
        || (maxDate && isAfter(startOfDay(dateValue), startOfDay(maxDate)));
      const selected = isSameDay(dateValue, fromDate) || isSameDay(dateValue, toDate);
      let hovered = false;
      const highlight = highlightToday && isSameDay(dateValue, new Date());

      if (fromDate && !isSameDay(fromDate, toDate) && !isSingle) {
        if (toDate && !isAfter(startOfDay(fromDate), startOfDay(dateValue)) && !isBefore(startOfDay(toDate), startOfDay(dateValue))) {
          hovered = true;
        }
        if (
          !toDate
          && !isBefore(startOfDay(dateValue), startOfDay(fromDate)) && !(hoverDate && isBefore(startOfDay(hoverDate), startOfDay(dateValue)))
          && isBefore(startOfDay(fromDate), startOfDay(hoverDate))
        ) {
          hovered = true;
        }
      }

      let isEndDate = false;
      if (isSameDay(dateValue, toDate) || (!toDate && isSameDay(dateValue, hoverDate))) {
        isEndDate = true;
      }

      return (
        <Day
          key={index}
          dateIndex={dateIndex}
          dateValue={dateValue}
          hoverDate={hoverDate}
          onSelectDate={onSelectDate}
          onHoverDate={onHoverDate}
          selected={selected}
          hovered={hovered}
          highlight={highlight}
          disabled={disabled}
          isEndDay={isEndDate}
          totalDay={totalDay}
          weekDayIndex={index}
          weekIndex={weekIndex}
        />
      );
    });
  }

  return <div className={cx('week', { first: isFirst })}>{generateDay()}</div>;
};

Week.propTypes = {
  isFirst: PropTypes.bool,
  week: PropTypes.object,
  month: PropTypes.number,
  year: PropTypes.number,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  totalDay: PropTypes.number,
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  isSingle: PropTypes.bool,
  weekIndex: PropTypes.number,
  highlightToday: PropTypes.bool,
};

Week.defaultProps = {
  isFirst: false,
  week: {},
  month: null,
  year: null,
  fromDate: null,
  toDate: null,
  totalDay: null,
  hoverDate: null,
  onSelectDate: () => {},
  onHoverDate: () => {},
  minDate: null,
  maxDate: null,
  isSingle: false,
  weekIndex: 0,
  highlightToday: false,
};

export default Week;
