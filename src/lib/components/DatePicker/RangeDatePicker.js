import React, {
  useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isBefore, isAfter, startOfDay } from 'date-fns';

import { usePrevious } from '../../helpers/usePrevious';
import './styles.scss';
import DateInputGroup from './DateInputGroup';
import DialogWrapper from './DialogWrapper';
import Dialog from './Dialog';

const RangeDatePicker = ({
  showCalendarIcon,
  isOpen,
  onIsOpenChange,
  startDate,
  endDate,
  startDatePlaceholder,
  endDatePlaceholder,
  className,
  disabled,
  onChange,
  onFocus,
  startWeekDay,
  minDate,
  maxDate,
  dateFormat,
  monthFormat,
  highlightToday,
  topBar,
  DoneButton,
}) => {
  const containerRef = useRef(null);
  const [inputFocus, setInputFocus] = useState('to');
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [hoverDate, setHoverDate] = useState();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useLayoutEffect(() => {
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    setIsFirstTime(true);
  }, []);

  useEffect(() => {
    if (startDate) {
      setFromDate(startDate);
    }
    if (endDate) {
      setToDate(endDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isFirstTime) {
      const startDate = fromDate || null;
      const endDate = toDate || null;
      onChange(startDate, endDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (isFirstTime) {
      const input = inputFocus === 'from'
        ? 'Start Date'
        : inputFocus === 'to'
          ? 'End Date'
          : '';
      onFocus(input);
    }
  }, [inputFocus]);

  function toggleDialog() {
    onIsOpenChange(!isOpen);
  }

  function handleClickDateInput(inputFocus) {
    if ((inputFocus === 'to' && !fromDate) || disabled) {
      return;
    }

    if (!isOpen) {
      onIsOpenChange(true);
    }

    setInputFocus(inputFocus);
  }

  function onSelectDate(date) {
    if (inputFocus) {
      if (
        inputFocus === 'from'
        || (fromDate && isBefore(startOfDay(date), startOfDay(fromDate)))
      ) {
        setFromDate(date);
        if (toDate && isAfter(startOfDay(date), startOfDay(toDate))) {
          setToDate(null);
        }
        setInputFocus('to');
      } else {
        setToDate(date);
        setInputFocus(null);
      }
    } else {
      setFromDate(date);
      setInputFocus('to');
      if (toDate && isAfter(startOfDay(date), startOfDay(toDate))) {
        setToDate(null);
      }
    }
  }

  function onHoverDate(date) {
    setHoverDate(date);
  }

  function handleReset() {
    setInputFocus('from');
    setFromDate(null);
    setToDate(null);
    setHoverDate(null);
  }

  function handleChangeDate(value, input) {
    if (
      (minDate && isAfter(startOfDay(minDate), startOfDay(value)))
      || (maxDate && isBefore(startOfDay(maxDate), startOfDay(value)))
    ) {
      return;
    }

    if (input === 'from') {
      setInputFocus('from');
      setFromDate(value);
      if (value > toDate) {
        setToDate(null);
      }
    } else {
      setInputFocus('to');
      setToDate(value);
    }
  }

  function onDateInputFocus() {
    handleClickDateInput('from');
  }

  const isOpenPrevous = usePrevious(isOpen);

  return (
    <div className="react-google-flight-datepicker">
      <div
        className={cx('date-picker', className, {
          disabled,
        })}
        ref={containerRef}
      >
        <DateInputGroup
          handleClickDateInput={handleClickDateInput}
          showCalendarIcon={showCalendarIcon}
          fromDate={fromDate}
          toDate={toDate}
          minDate={minDate}
          maxDate={maxDate}
          handleChangeDate={handleChangeDate}
          startDatePlaceholder={startDatePlaceholder}
          endDatePlaceholder={endDatePlaceholder}
          dateFormat={dateFormat}
          onFocus={onDateInputFocus}
          nonFocusable={isOpen}
          topBar={topBar}
        />
        {isOpen && containerRef.current ? (
          <DialogWrapper
            isMobile={isMobile}
            targetElement={containerRef.current}
            onClose={toggleDialog}
          >
            <Dialog
              animateOpen={isOpenPrevous === false}
              isOpen={isOpen}
              toggleDialog={toggleDialog}
              handleClickDateInput={handleClickDateInput}
              inputFocus={inputFocus}
              setInputFocus={setInputFocus}
              onSelectDate={onSelectDate}
              onHoverDate={onHoverDate}
              fromDate={fromDate}
              toDate={toDate}
              hoverDate={hoverDate}
              handleReset={handleReset}
              handleChangeDate={handleChangeDate}
              startDatePlaceholder={startDatePlaceholder}
              endDatePlaceholder={endDatePlaceholder}
              startWeekDay={startWeekDay}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat={dateFormat}
              monthFormat={monthFormat}
              isMobile={isMobile}
              highlightToday={highlightToday}
              topBar={topBar}
              DoneButton={DoneButton}
            />
          </DialogWrapper>
        ) : null}
      </div>
    </div>
  );
};

RangeDatePicker.propTypes = {
  showCalendarIcon: PropTypes.bool,
  isOpen: PropTypes.bool,
  onIsOpenChange: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  startWeekDay: PropTypes.oneOf(['monday', 'sunday']),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  dateFormat: PropTypes.string,
  monthFormat: PropTypes.string,
  highlightToday: PropTypes.bool,
  topBar: PropTypes.node,
  DoneButton: PropTypes.elementType,
};

RangeDatePicker.defaultProps = {
  showCalendarIcon: false,
  isOpen: false,
  onIsOpenChange: () => {},
  startDate: null,
  endDate: null,
  className: '',
  disabled: false,
  startDatePlaceholder: 'Start date',
  endDatePlaceholder: 'End date',
  onChange: () => {},
  onFocus: () => {},
  startWeekDay: 'monday',
  minDate: null,
  maxDate: null,
  dateFormat: 'dd / MM / yyyy',
  monthFormat: 'MMMM - yyyy',
  highlightToday: false,
  topBar: null,
  DoneButton: null,
};

export default RangeDatePicker;
