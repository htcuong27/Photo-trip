import React, { Component } from "react";
import Div from '../Div/';
import Span from '../Span/';
import Icon from '../Icon/';
import styles from './styles.scss';
import config from '../../config';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
export default class Calendar extends Component {
  static defaultProps = {
    date: new Date(),
    onDateSelect: null,
    onPrevButtonPress: null,
    onNextButtonPress: null,
    weekFirstDay: 0,
    dayNames: [
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    ],
    monthNames: [
      "January", "February", "March",
      "April",   "May",      "June",
      "July",    "August",   "September",
      "October", "November", "December"
    ]
  };

  static propTypes = {
    date: React.PropTypes.object,
    onDateSelect: React.PropTypes.func,
    onPrevButtonPress: React.PropTypes.func,
    onNextButtonPress: React.PropTypes.func,
    dayNames: React.PropTypes.array,
    monthNames: React.PropTypes.array,
    weekFirstDay: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    const date = props.initialDate || new Date();
    this.state = {
      date
    };
  }

  handleNextButtonPress() {
    const date = new Date(this.state.date);
    date.setMonth(date.getMonth() + 1);
    this.setState({
        date
    });
  }

  handlePrevButtonPress() {
    const date = new Date(this.state.date);
    date.setMonth(date.getMonth() - 1);
    this.setState({
        date
    });
  }

  handleDayPress(dateNumber) {
    const month = this.state.date.getMonth();
    const year  = this.state.date.getFullYear();
    const selectedDate = new Date(year, month, dateNumber);
    const today = new Date();
    if (this.props.isMinToday === true) {
      if (selectedDate.getFullYear() >= today.getFullYear() &&
          (selectedDate.getMonth() >= today.getMonth()) && dateNumber >= today.getDate()) {
        this.setState({ date: selectedDate });
        if (this.props.onDateSelect !== null) {
          this.props.onDateSelect(selectedDate);
        }
      }
    } else {
      this.setState({ date: selectedDate });
      if (this.props.onDateSelect !== null) {
        this.props.onDateSelect(selectedDate);
      }
    }
  }
  getDate() {
    return this.state.date;
  }

  renderBar() {
      const { date } = this.state;
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = this.props.monthNames[month];

      return (
        <Div style={styles.BgCalendar}>
          <Div style={styles.barYear}>
            <Span style={styles.barText}>
              {year}
            </Span>
          </Div>
          <Div style={styles.bar}>
            <Div style={styles.barTouchable} onClick={() => this.handlePrevButtonPress()}>
              <Div style={[styles.barButton, styles.barButtonPrev]}>
                <Span>
                  <Icon size={18} color='#fff' name="fi-small-chevron-left" />
                </Span>
              </Div>
            </Div>
            <Div style={styles.barMonth}>
              <Span style={styles.barText}>
                {monthName + " "}
              </Span>
            </Div>
            <Div style={styles.barTouchable} onClick={() => this.handleNextButtonPress()}>
              <Div style={[styles.barButton, styles.barButtonNext]}>
                <Span>
                  <Icon size={18} color='#fff' name="fi-small-chevron-right" />
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      );
  }

  renderDayNames() {
      const elements = [];

      for (let i = 0; i < 7; i++) {
        const dayIndex = (this.props.weekFirstDay + i) % 7;
        elements.push(
          <Div key={i} style={styles.dayInner}>
            <Span style={[styles.shadedText, styles.dayText]}>
              {this.props.dayNames[dayIndex]}
            </Span>
          </Div>
        );
      }

      return (
        <Div style={styles.week}>
          {elements}
        </Div>
      );
  }

  renderCalendarDay(index, dateNumber) {
        const weekDay = (index + this.props.weekFirstDay) % 7;
        const isWeekend = weekDay === 0 || weekDay  === 6;
        const { date } = this.state;

        const today = new Date();
        // Ngay duoc chon lon hon ngay hien tai va thang dc chon lon hon thang hien tai trong cung 1 nam thi se an
        const isHidden1 = dateNumber > today.getDate() && date.getMonth() >= today.getMonth() && date.getFullYear() === today.getFullYear();
        // Nam dc chon lon hon nam hien tai thi se an
        const isHidden2 = date.getFullYear() > today.getFullYear();
        // Thang dc chon lon hon thang hien tai trong cung 1 nam thi an
        const isHidden3 = date.getMonth() > today.getMonth() && date.getFullYear() === today.getFullYear();
        const isHidden = isHidden1 || isHidden2 || isHidden3;
        // const isToday = this.props.isPay === true ? (date.getDate() === dateNumber) : (date.getDate() === dateNumber && isHidden1 !== true && isHidden2 !== true && isHidden3 !== true);
        const isToday = date.getDate() === dateNumber;

        /*
        const isToday = date.getDate() === dateNumber &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();*/
        const isHiddenDateSmallerToday = date.getFullYear() < today.getFullYear() ||
          (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) ||
            (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && dateNumber < today.getDate());
        return (
          <Div key={dateNumber} style={styles.dayOuter}>
            <Div onClick={() => this.handleDayPress(dateNumber)}>
              <Div 
                style={[
                  styles.dayInner,
                  (isToday && isHiddenDateSmallerToday !== true) ?
                    styles.todayDayInner :
                    {} 
                ]}
              >
                {(this.props.isMinToday !== true && this.props.isMaxtoday !== true) &&
                  <Span
                    style={[
                      styles.dayText,
                      (isWeekend) ?
                        styles.dayWeekendText :
                          { color: '#000' }
                    ]}
                  >
                    {dateNumber}
                  </Span>
                }
                {this.props.isMinToday === true &&
                  <Span
                    style={[
                      styles.dayText,
                      (isWeekend) ?
                        styles.dayWeekendText :
                          (isHiddenDateSmallerToday ? 
                            { color: 'rgba(1,1,1,0.24)' } : { color: '#000' }
                          )
                    ]}
                  >
                    {dateNumber}
                  </Span>
                }
              </Div>
            </Div>
          </Div>
        );
        /*return (
            <Div key={dateNumber} style={styles.dayOuter}>
                <Div onClick={() => this.handleDayPress(dateNumber)}>
                    <Div 
                      style={[
                        styles.dayInner,
                        isToday ?
                          styles.todayDayInner :
                          {} 
                      ]}
                    >
                        <Span
                          style={[
                            styles.dayText,
                            (isWeekend && isHidden !== true) ?
                              styles.dayWeekendText :
                                ((isToday && isHidden !== true) ?
                                  { color: '#FFF' } :
                                    ((isHidden === true && this.props.isMaxToDay === true || isMinToday === true) ?
                                      { color: 'rgba(1,1,1,0.24)' } :
                                        { color: '#000' }))]}>
                            {dateNumber}
                        </Span>
                    </Div>
                </Div>
            </Div>
        );*/
    }

  renderCalendarDayEmpty(dateNumber) {
      return (
          <Div key={dateNumber} style={styles.dayOuter}>
              <Div style={styles.dayInner}>
                  <Span style={styles.dayText}> </Span>
              </Div>
          </Div>
      );
  }

  renderCalendarWeek(startDateNumber, weekOffset, daysLeft) {
      const days = [];
      const weekKey = startDateNumber;

      for (let i = 0; i < weekOffset; i++) {
          days.push(this.renderCalendarDayEmpty(- weekOffset + i));
      }

      let i = weekOffset;
      for (; i < 7 && daysLeft > 0; i++) {
          days.push(this.renderCalendarDay(i, startDateNumber++));
          daysLeft--;
      }

      for (; i < 7; i++) {
          days.push(this.renderCalendarDayEmpty(startDateNumber++));
      }

      return (
          <Div key={weekKey} style={styles.week}>
              {days}
          </Div>
      );
  }

  render() {
    const { date } = this.state;
    let monthFirstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    monthFirstDayOfWeek = (monthFirstDayOfWeek - this.props.weekFirstDay + 7) % 7;
    let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let startDateNumber = 1;

    const weeks = [];

    if (monthFirstDayOfWeek !== 0) {
        weeks.push(this.renderCalendarWeek(startDateNumber, monthFirstDayOfWeek, daysInMonth));
        daysInMonth     -= (7 - monthFirstDayOfWeek) % 7;
        startDateNumber += (7 - monthFirstDayOfWeek) % 7;
    }

    while (daysInMonth  > 0) {
        weeks.push(this.renderCalendarWeek(startDateNumber, 0, daysInMonth));
        startDateNumber += 7;
        daysInMonth     -= 7;
    }

    return (
        <Div style={[styles.calendar]}>
            {this.renderBar()}
            {this.renderDayNames()}
            {weeks}
        </Div>
    );
  }
}
