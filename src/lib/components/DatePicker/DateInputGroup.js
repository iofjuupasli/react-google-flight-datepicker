import React from 'react';
import PropTypes from 'prop-types';

import DateInput from './DateInput';
import CalendarIcon from '../../assets/svg/calendar.svg';

const DateInputGroup = ({
  showCalendarIcon,
  inputFocus,
  handleClickDateInput,
  fromDate,
  toDate,
  minDate,
  maxDate,
  handleChangeDate,
  startDatePlaceholder,
  endDatePlaceholder,
  dateFormat,
  isSingle,
  onFocus,
  nonFocusable,
  topBar,
  children,
}) => {
  function handleClickFromInput() {
    handleClickDateInput('from');
  }

  function handleClickToInput() {
    handleClickDateInput('to');
  }

  function handleChangeFromDate(date) {
    handleChangeDate(date, 'from');
  }

  function handleChangeToDate(date) {
    handleChangeDate(date, 'to');
  }

  const startDateInput = (
    <DateInput
      handleClickDateInput={handleClickFromInput}
      showIcon={showCalendarIcon}
      tabIndex={nonFocusable ? '-1' : '0'}
      isFocus={inputFocus === 'from'}
      value={fromDate}
      placeholder={startDatePlaceholder}
      handleChangeDate={handleChangeFromDate}
      dateFormat={dateFormat}
      isSingle={isSingle}
      name="START_DATE"
      onFocus={onFocus}
      nonFocusable={nonFocusable}
      minDate={minDate}
      maxDate={maxDate}
    />
  );

  const endDateInput = !isSingle && (
    <DateInput
      handleClickDateInput={handleClickToInput}
      tabIndex="0"
      isFocus={inputFocus === 'to'}
      value={toDate}
      placeholder={endDatePlaceholder}
      handleChangeDate={handleChangeToDate}
      dateFormat={dateFormat}
      name="END_DATE"
      nonFocusable={nonFocusable}
      minDate={minDate}
      maxDate={maxDate}
      fromDate={fromDate}
    />
  );

  if (children) {
    return children({ startDateInput, endDateInput, topBar });
  }

  return (
    <div className="date-picker-input-container">
      <div className="date-picker-input">
        {showCalendarIcon && (
          <CalendarIcon className="icon-calendar mobile" viewBox="0 0 24 24" />
        )}
        <div className="date-picker-date-group">
          {startDateInput}
          {endDateInput}
        </div>
      </div>
      {topBar}
    </div>
  );
};

DateInputGroup.propTypes = {
  handleClickDateInput: PropTypes.func,
  showCalendarIcon: PropTypes.bool,
  inputFocus: PropTypes.string,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  handleChangeDate: PropTypes.func,
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  dateFormat: PropTypes.string,
  isSingle: PropTypes.bool,
  onFocus: PropTypes.func,
  nonFocusable: PropTypes.bool,
  topBar: PropTypes.node,
  children: PropTypes.func,
};

DateInputGroup.defaultProps = {
  handleClickDateInput: () => {},
  showCalendarIcon: false,
  inputFocus: null,
  fromDate: null,
  toDate: null,
  minDate: null,
  maxDate: null,
  handleChangeDate: () => {},
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  dateFormat: '',
  isSingle: false,
  onFocus: () => {},
  nonFocusable: false,
  topBar: null,
  children: null,
};

export default DateInputGroup;
