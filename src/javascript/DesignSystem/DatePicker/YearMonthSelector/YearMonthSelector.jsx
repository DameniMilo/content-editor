import * as React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Input, Select} from '@jahia/design-system-kit';
import {MenuItem} from '@material-ui/core';
import dayjs from 'dayjs';

const style = () => {
    const commonStyle = {
        height: '24px',
        fontSize: '14px !important'
    };

    return ({
        selectorMonth: {
            ...commonStyle,
            margin: '0 16px'
        },

        selectorYear: {
            ...commonStyle,
            marginRight: '16px'
        }
    });
};

const YearMonthSelectorCmp = ({date, months, onChange, classes}) => {
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();

    const fromMonth = new Date(selectedYear - 50, 0);
    const toMonth = new Date(selectedYear + 50, 11);

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChangeMonth = e => {
        onChange(new Date(selectedYear, e.target.value));
    };

    const handleChangeYear = e => {
        onChange(new Date(e.target.value, selectedMonth));
    };

    return (
        <form className="DayPicker-Caption">
            <Select
                className={classes.selectorMonth}
                value={selectedMonth}
                renderValue={value => dayjs().month(value).format('MMM')}
                input={<Input id="month" name="month"/>}
                onChange={handleChangeMonth}
            >
                {months.map((month, i) => {
                    return (
                        <MenuItem key={month} value={i}>{month}</MenuItem>
                    );
                })}
            </Select>

            <Select
                className={classes.selectorYear}
                value={selectedYear}
                input={<Input id="year" name="year"/>}
                onChange={handleChangeYear}
            >
                {years.map(year => {
                    return (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    );
                })}
            </Select>
        </form>
    );
};

YearMonthSelectorCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};

export const YearMonthSelector = withStyles(style)(YearMonthSelectorCmp);

YearMonthSelector.displayName = 'YearMonthSelector';
