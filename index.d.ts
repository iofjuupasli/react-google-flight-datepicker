import * as React from "react";

declare module "@outofaxis/react-google-flight-datepicker" {
  export interface RangeDatePickerProps {
    isOpen: boolean;
    onIsOpenChange: (isOpen: boolean) => void;
    startDate: Date;
    endDate: Date;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    className?: string;
    disabled?: boolean;
    onChange: (startDate: Date, endDate: Date) => void;
    onFocus?: (input: "Start Date" | "End Date" | "") => void;
    startWeekDay?: "monday" | "sunday";
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    monthFormat?: string;
    highlightToday?: boolean;
    topBar?: React.ReactNode;
    DoneButton?: React.ElementType<{ onClick: Function }>;
    dialogTargetOffset?: string;
    children?: ({
      startDateInput,
      endDateInput,
      topBar,
    }: {
      startDateInput: React.ReactNode;
      endDateInput: React.ReactNode;
      topBar: React.ReactNode;
    }) => React.ReactNode;
  }

  export class RangeDatePicker extends React.Component<RangeDatePickerProps> {}

  export interface SingleDatePickerProps {
    isOpen: boolean;
    onIsOpenChange: (isOpen: boolean) => void;
    startDate: Date;
    startDatePlaceholder?: string;
    className?: string;
    disabled?: boolean;
    onChange: (startDate: Date) => void;
    onFocus?: (input: "Start Date") => void;
    startWeekDay?: "monday" | "sunday";
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    monthFormat?: string;
    highlightToday?: boolean;
    topBar?: React.ReactNode;
    DoneButton?: React.ElementType<{ onClick: Function }>;
    dialogTargetOffset?: string;
    children?: ({
      startDateInput,
      endDateInput,
      topBar,
    }: {
      startDateInput: React.ReactNode;
      endDateInput: React.ReactNode;
      topBar: React.ReactNode;
    }) => React.ReactNode;
  }

  export class SingleDatePicker extends React.Component<
    SingleDatePickerProps
  > {}
}
