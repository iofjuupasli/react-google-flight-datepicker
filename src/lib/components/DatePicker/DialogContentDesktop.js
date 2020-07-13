import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  isBefore,
  isAfter,
  subMonths,
  addMonths,
  startOfMonth,
  setDate,
  getDate,
  addDays,
  differenceInMonths,
  getMonth,
  getYear,
} from 'date-fns';

import PrevIcon from '../../assets/svg/prev.svg';
import NextIcon from '../../assets/svg/next.svg';
import MonthCalendar from './MonthCalendar';

const DialogContentDesktop = ({
  fromDate,
  toDate,
  hoverDate,
  onSelectDate,
  onHoverDate,
  startWeekDay,
  minDate,
  maxDate,
  monthFormat,
  isSingle,
  isOpen,
  dateChanged,
  highlightToday,
}) => {
  const containerRef = useRef();
  const [translateAmount, setTranslateAmount] = useState(0);
  const [monthArray, setMonthArray] = useState([]);
  const [focusDate, setFocusDate] = useState(new Date());
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  function getArrayMonth(date) {
    const prevMonth = subMonths(date, 1);
    const nextMonth = addMonths(date, 1);
    const futureMonth = addMonths(date, 2);

    return [prevMonth, focusDate, nextMonth, futureMonth];
  }

  useEffect(() => {
    setFocusDate(fromDate || new Date());
  }, [isOpen]);

  useEffect(() => {
    if (minDate && isBefore(startOfMonth(focusDate), startOfMonth(addMonths(minDate, 1)))) {
      setDisablePrev(true);
    } else {
      setDisablePrev(false);
    }

    if (maxDate && isAfter(startOfMonth(focusDate), startOfMonth(subMonths(maxDate, 2)))) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }

    const arrayMonth = getArrayMonth(focusDate);
    setMonthArray(arrayMonth);
  }, [focusDate]);

  function increaseFocusDate(date) {
    if (date instanceof Date) {
      setFocusDate(date);
    } else {
      const nextDate = addMonths(focusDate, 1);
      setFocusDate(nextDate);
    }
  }

  function decreaseFocusDate(date) {
    if (date instanceof Date) {
      setFocusDate(date);
    } else {
      const prevDate = subMonths(focusDate, 1);
      setFocusDate(prevDate);
    }
  }

  function increaseCurrentMonth(date) {
    if (disableNext) return;

    setTranslateAmount(-378);
    setTimeout(() => {
      increaseFocusDate(date);
      setTranslateAmount(0);
    }, 200);
  }

  function decreaseCurrentMonth(date) {
    if (disablePrev) return;

    setTranslateAmount(378);
    setTimeout(() => {
      decreaseFocusDate(date);
      setTranslateAmount(0);
    }, 200);
  }

  useEffect(() => {
    if (dateChanged) {
      if (isBefore(startOfMonth(dateChanged), startOfMonth(focusDate))) {
        decreaseCurrentMonth(dateChanged);
      }
      if (isAfter(startOfMonth(dateChanged), startOfMonth(addMonths(focusDate, 1)))) {
        increaseCurrentMonth(subMonths(dateChanged, 1));
      }
    }
  }, [dateChanged]);

  function onBackButtonKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      decreaseCurrentMonth();

      return false;
    }
  }

  function onNextButtonKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      increaseCurrentMonth();

      return false;
    }
  }

  function focusOnCalendar() {
    if (containerRef && containerRef.current) {
      let selectedButton = containerRef.current.querySelector('.day.selected');
      if (!selectedButton) {
        selectedButton = containerRef.current.querySelector(
          '.month-calendar:not(.hidden) .day:not(.disabled)',
        );
      }
      if (selectedButton) {
        selectedButton.focus();
      }
    }
  }

  function onKeyDown(e) {
    const allowKeyCodes = [9, 32, 37, 38, 39, 40];
    if (
      allowKeyCodes.indexOf(e.keyCode) === -1
      || !e.target.getAttribute('data-day-index')
    ) {
      return true;
    }

    e.preventDefault();

    const calendarContainer = e.target.parentElement.parentElement.parentElement.parentElement;
    const dayIndex = parseInt(e.target.getAttribute('data-day-index'));
    const dateValue = parseInt(e.target.getAttribute('data-date-value'));
    const date = new Date(dateValue);
    const lastDateOfMonth = getDate(setDate(addMonths(date, 1), 0));
    let nextDayIndex = -1;
    let increaseAmount = 0;

    switch (e.keyCode) {
      case 9: {
        const doneButton = calendarContainer.parentElement.parentElement.parentElement.querySelector(
          '.submit-button',
        );
        if (doneButton) {
          doneButton.focus();

          return true;
        }
        break;
      }
      case 32:
        e.target.click();
        break;
      case 37:
        increaseAmount = -1;
        break;
      case 38:
        increaseAmount = -7;
        break;
      case 39:
        increaseAmount = 1;
        break;
      case 40:
        increaseAmount = 7;
        break;
      default:
        break;
    }

    nextDayIndex = dayIndex + increaseAmount;
    if (nextDayIndex > 0 && nextDayIndex <= lastDateOfMonth) {
      const selector = `.day[data-day-index="${nextDayIndex}"]`;
      const dayElement = e.target.parentElement.parentElement.querySelector(
        selector,
      );
      if (dayElement) {
        dayElement.focus();
      }
    } else {
      const nextDate = addDays(date, increaseAmount);

      if (
        increaseAmount > 0
        && isAfter(startOfMonth(nextDate), startOfMonth(focusDate))
      ) {
        if (maxDate && isAfter(startOfMonth(nextDate), startOfMonth(maxDate))) return false;
        increaseCurrentMonth();
      } else if (
        increaseAmount < 0
        && isAfter(startOfMonth(focusDate), startOfMonth(nextDate))
      ) {
        if (minDate && isBefore(startOfMonth(nextDate), startOfMonth(minDate))) return false;
        decreaseCurrentMonth();
      }
      setTimeout(() => {
        const query = `.month-calendar[data-month-index="${getMonth(nextDate)
          + 1}"] .day[data-day-index="${getDate(nextDate)}"]`;
        const dayElement = calendarContainer.querySelector(query);
        if (dayElement) {
          dayElement.focus();
        }
      }, 200);
    }

    return false;
  }

  function renderMonthCalendars() {
    return monthArray.map((date, dateIndex) => (
      <MonthCalendar
        // eslint-disable-next-line react/no-array-index-key
        key={dateIndex}
        hidden={dateIndex === 0 && translateAmount <= 0}
        isAnimating={dateIndex === 0 && translateAmount > 0}
        month={getMonth(date)}
        year={getYear(date)}
        onSelectDate={onSelectDate}
        onHoverDate={onHoverDate}
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
    ));
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="calendar-wrapper" ref={containerRef} onKeyDown={onKeyDown}>
      <div
        className={cx('calendar-content', {
          isAnimating: translateAmount !== 0,
        })}
        style={{
          transform: `translateX(${translateAmount}px)`,
        }}
      >
        {renderMonthCalendars()}
      </div>
      <div className="calendar-flippers">
        <div
          className={cx('flipper-button', { disabled: disablePrev })}
          onClick={decreaseCurrentMonth}
          onKeyDown={onBackButtonKeyDown}
          role="button"
          tabIndex="0"
        >
          <PrevIcon viewBox="0 0 24 24" />
        </div>
        <div
          className={cx('flipper-button', { disabled: disableNext })}
          onClick={increaseCurrentMonth}
          onKeyDown={onNextButtonKeyDown}
          role="button"
          tabIndex="0"
          onBlur={focusOnCalendar}
        >
          <NextIcon viewBox="0 0 24 24" />
        </div>
      </div>
    </div>
  );
};

DialogContentDesktop.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  startWeekDay: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthFormat: PropTypes.string,
  isSingle: PropTypes.bool,
  isOpen: PropTypes.bool,
  dateChanged: PropTypes.instanceOf(Date),
  highlightToday: PropTypes.bool,
};

DialogContentDesktop.defaultProps = {
  fromDate: null,
  toDate: null,
  hoverDate: null,
  onSelectDate: () => {},
  onHoverDate: () => {},
  startWeekDay: null,
  minDate: null,
  maxDate: null,
  monthFormat: '',
  isSingle: false,
  isOpen: false,
  dateChanged: null,
  highlightToday: false,
};

export default DialogContentDesktop;
