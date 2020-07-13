import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  addDays,
  subDays,
  startOfDay,
  isAfter,
  isBefore,
  format,
  parse,
  isValid,
  getYear,
} from 'date-fns';
import CalendarIcon from '../../assets/svg/calendar.svg';
import PrevIcon from '../../assets/svg/prev.svg';
import NextIcon from '../../assets/svg/next.svg';

const DateInput = ({
  handleClickDateInput,
  showIcon,
  tabIndex,
  isFocus,
  value,
  placeholder,
  handleChangeDate,
  dateFormat,
  isSingle,
  onFocus,
  name,
  nonFocusable,
  fromDate,
  minDate,
  maxDate,
}) => {
  const [formattedDate, setFormattedDate] = useState(null);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  useEffect(() => {
    if (value) {
      const text = format(value, dateFormat);
      setFormattedDate(text);

      if ((minDate && isAfter(startOfDay(addDays(minDate, 1)), startOfDay(value)))
        || (name === 'END_DATE' && isBefore(startOfDay(value), startOfDay(addDays(fromDate, 1))))
      ) {
        setDisablePrev(true);
      } else {
        setDisablePrev(false);
      }

      if (maxDate && isBefore(startOfDay(subDays(maxDate, 1)), startOfDay(value))) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
    } else {
      setFormattedDate(null);
    }
  }, [value, fromDate]);

  function prevDate(e) {
    e.stopPropagation();
    handleChangeDate(subDays(value, 1));
  }

  function nextDate(e) {
    e.stopPropagation();
    handleChangeDate(addDays(value, 1));
  }

  function onDateInputFocus() {
    if (onFocus) onFocus(name);
  }

  return (
    <div
      className={cx('date', { 'is-focus': isFocus, 'is-single': isSingle })}
      role="button"
      tabIndex={nonFocusable ? '-1' : tabIndex}
      onClick={handleClickDateInput}
      onFocus={onDateInputFocus}
      id="start-date-input-button"
    >
      {showIcon && (
        <CalendarIcon className="icon-calendar" viewBox="0 0 24 24" />
      )}
      <input
        className="selected-date"
        placeholder={placeholder}
        value={formattedDate || ''}
        onChange={event => {
          const parsed = parse(event.currentTarget.value, dateFormat, new Date());
          if (getYear(parsed) >= 2000 && isValid(parsed)) {
            handleChangeDate(parsed);
          } else {
            setFormattedDate(event.currentTarget.value);
          }
        }}
      />
      {formattedDate && (
        <div className="change-date-group">
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={prevDate}
            tabIndex={nonFocusable ? '-1' : '0'}
            disabled={disablePrev}
          >
            <PrevIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={nextDate}
            tabIndex={nonFocusable ? '-1' : '0'}
            disabled={disableNext}
          >
            <NextIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

DateInput.propTypes = {
  handleClickDateInput: PropTypes.func,
  showIcon: PropTypes.bool,
  tabIndex: PropTypes.string,
  isFocus: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  handleChangeDate: PropTypes.func,
  dateFormat: PropTypes.string,
  isSingle: PropTypes.bool,
  onFocus: PropTypes.func,
  name: PropTypes.string,
  nonFocusable: PropTypes.bool,
  fromDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

DateInput.defaultProps = {
  handleClickDateInput: () => {},
  showIcon: false,
  tabIndex: '',
  isFocus: false,
  value: null,
  placeholder: null,
  handleChangeDate: () => {},
  dateFormat: 'dd/MM/yyyy',
  isSingle: false,
  onFocus: () => {},
  name: '',
  nonFocusable: false,
  fromDate: null,
  minDate: null,
  maxDate: null,
};

export default DateInput;
