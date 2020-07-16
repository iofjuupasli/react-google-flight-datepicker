import React, { useEffect, useState, useRef } from 'react';
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
import { Rifm } from 'rifm';
import CalendarIcon from '../../assets/svg/calendar.svg';
import PrevIcon from '../../assets/svg/prev.svg';
import NextIcon from '../../assets/svg/next.svg';

const parseDigits = dateString => (dateString.match(/\d+/g) || []).join('');

const formatDate = dateString => {
  const digits = parseDigits(dateString);
  const chars = digits.split('');

  return chars
    .reduce(
      (r, v, index) => (index === 2 || index === 4 ? `${r}/${v}` : `${r}${v}`),
      '',
    )
    .substr(0, 10);
};

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
  const validate = value => isValid(value)
      && getYear(value) >= 2000 && getYear(value) < 2100
      && (!fromDate || !isAfter(fromDate, value));

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

  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocus) {
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isFocus]);

  const isError = formattedDate && !validate(parse(formattedDate, dateFormat, new Date()));

  return (
    <div
      className={cx('date', { 'is-focus': isFocus, 'is-single': isSingle, 'is-error': isError })}
      role="button"
      tabIndex={nonFocusable ? '-1' : tabIndex}
      onClick={handleClickDateInput}
      id="start-date-input-button"
    >
      {showIcon && (
        <CalendarIcon className="icon-calendar" viewBox="0 0 24 24" />
      )}
      <Rifm
        accept={/\d+/g}
        mask={(formattedDate || '').length >= 10}
        format={dateString => {
          const res = formatDate(dateString);
          if (dateString.endsWith('/')) {
            if (res.length === 2) {
              return `${res}/`;
            }
            if (res.length === 5) {
              return `${res}/`;
            }
          }

          return res;
        }}
        append={v => (v.length === 2 || v.length === 5 ? `${v}/` : v)}
        value={formattedDate || ''}
        onChange={value => {
          setFormattedDate(value);
          const parsed = parse(value, dateFormat, new Date());
          if (validate(parsed)) {
            handleChangeDate(parsed);
          }
        }}
      >
        {({ value, onChange }) => (
          <input
            ref={inputRef}
            className="selected-date"
            placeholder={placeholder}
            value={value}
            onFocus={onDateInputFocus}
            onChange={onChange}
          />
        )}
      </Rifm>
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
