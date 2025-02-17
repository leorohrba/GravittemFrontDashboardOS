import moment from 'moment'

const colorOptions = [
  { color: '#4CAF50' },
  { color: '#AB47BC' },
  { color: '#FDD835' },
  { color: '#26C6DA' },
  { color: '#FB8C00' },
  { color: '#795548' },
  { color: '#1976D2' },
  { color: '#F06292' },
  { color: '#D32F2F' },
  { color: '#3949AB' },
]

export const getColor = (index) => {
  if (index < colorOptions.length) {
    return colorOptions[index].color
  }
  
  return `#${(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)}` // cor randômica
  
}

export function getTimeRange(currentRange, direction) {
  const beginMoment = currentRange[0].clone();
  let endMoment = currentRange[1].clone();
  const endRange = currentRange[1].clone();

  const startDate = beginMoment.toDate();
  const endDate = endMoment.toDate();

  if (
    startDate.getDate() === 1 &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear() &&
    endDate.getDate() ===
      endRange
        .endOf("month")
        .toDate()
        .getDate()
  ) {
    if (direction === -1) {
      beginMoment.subtract(1, "months");
      const copy = beginMoment.clone();
      endMoment = copy.endOf("month");
    } else {
      beginMoment.add(1, "months");
      const copy = beginMoment.clone();
      endMoment = copy.endOf("month");
    }
  } else if (
      startDate.getDate() === 1 &&
      startDate.getMonth() === 0 &&
      endDate.getMonth() === 11 &&
      startDate.getFullYear() === endDate.getFullYear() &&
      endDate.getDate() === 31
    ) {
      if (direction === -1) {
        beginMoment.subtract(1, "years");
        const copy = beginMoment.clone();
        endMoment = copy.endOf("year");
      } else {
        beginMoment.add(1, "years");
        const copy = beginMoment.clone();
        endMoment = copy.endOf("year");
      }
    } else {
      const var1 = beginMoment.clone();
      const var2 = endMoment.clone();

      const days = var2.diff(var1, "days") + 1;

      if (direction === -1) {
        beginMoment.subtract(days, "days");
        endMoment.subtract(days, "days");
      } else {
        beginMoment.add(days, "days");
        endMoment.add(days, "days");
      }
    }

  return [beginMoment, endMoment];
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }
  const year = now.getFullYear();

  if (type === "month") {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, "months");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
