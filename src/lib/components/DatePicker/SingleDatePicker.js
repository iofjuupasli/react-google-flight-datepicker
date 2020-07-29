import React, {
  useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isBefore, isAfter, startOfDay } from 'date-fns';
import { usePrevious } from '../../helpers/usePrevious';

import './styles.scss';
import DateInputGroup from './DateInputGroup';
import Dialog from './Dialog';
import DialogWrapper from './DialogWrapper';

const SingleDatePicker = ({
  showCalendarIcon,
  isOpen,
  onIsOpenChange,
  startDate,
  startDatePlaceholder,
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
  dialogTargetOffset,
  children,
}) => {
  const containerRef = useRef(null);
  const [fromDate, setFromDate] = useState();
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
    if (startDate) {
      setFromDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    setIsFirstTime(true);
    if (startDate) {
      setFromDate(startDate);
    }
  }, []);

  useEffect(() => {
    if (isFirstTime) {
      const startDate = fromDate || null;
      onChange(startDate);
    }
  }, [fromDate]);

  function toggleDialog() {
    onIsOpenChange(!isOpen);
  }

  function handleClickDateInput() {
    if (disabled) return;

    if (!isOpen) {
      onIsOpenChange(true);
    }

    onFocus('Start Date');
  }

  function onSelectDate(date) {
    if (
      (minDate && isAfter(startOfDay(minDate), startOfDay(date)))
      || (maxDate && isBefore(startOfDay(maxDate), startOfDay(date)))
    ) {
      return;
    }
    setFromDate(date);
  }

  function onHoverDate(date) {
    setHoverDate(date);
  }

  function handleReset() {
    setFromDate(null);
    setHoverDate(null);
  }

  function onDateInputFocus() {
    handleClickDateInput();
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
          minDate={minDate}
          maxDate={maxDate}
          handleChangeDate={onSelectDate}
          startDatePlaceholder={startDatePlaceholder}
          dateFormat={dateFormat}
          onFocus={onDateInputFocus}
          isSingle
          topBar={topBar}
        >
          {children}
        </DateInputGroup>
        {isOpen && containerRef.current ? (
          <DialogWrapper
            isMobile={isMobile}
            targetElement={containerRef.current}
            onClose={toggleDialog}
            targetOffset={dialogTargetOffset}
          >
            <Dialog
              animateOpen={isOpenPrevous === false}
              isOpen={isOpen}
              toggleDialog={toggleDialog}
              handleClickDateInput={handleClickDateInput}
              inputFocus="from"
              onSelectDate={onSelectDate}
              onHoverDate={onHoverDate}
              fromDate={fromDate}
              hoverDate={hoverDate}
              handleReset={handleReset}
              handleChangeDate={onSelectDate}
              startDatePlaceholder={startDatePlaceholder}
              startWeekDay={startWeekDay}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat={dateFormat}
              monthFormat={monthFormat}
              isMobile={isMobile}
              highlightToday={highlightToday}
              isSingle
              topBar={topBar}
              DoneButton={DoneButton}
            />
          </DialogWrapper>
        ) : null}
      </div>
    </div>
  );
};

SingleDatePicker.propTypes = {
  showCalendarIcon: PropTypes.bool,
  isOpen: PropTypes.bool,
  onIsOpenChange: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  startDatePlaceholder: PropTypes.string,
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
  dialogTargetOffset: PropTypes.string,
  children: PropTypes.func,
};

SingleDatePicker.defaultProps = {
  showCalendarIcon: false,
  isOpen: false,
  onIsOpenChange: () => {},
  startDate: null,
  className: '',
  disabled: false,
  startDatePlaceholder: 'Date',
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
  children: null,
};

export default SingleDatePicker;
