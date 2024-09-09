import { JSDOM } from 'jsdom';
import * as moment from 'moment-timezone';

type Connectivity = 'on' | 'off' | 'maybe' | 'unknown';
type OutagesTable = Connectivity[][];

const URL = 'https://oblenergo.cv.ua/shutdowns/';
const TZ = 'Europe/Kiev';

interface OutagesData {
  table: OutagesTable;
  date: string;
  hasData: boolean;
}

function mapValues(text: string): Connectivity {
  switch (text.trim().toLowerCase()) {
    case 'з':
      return 'on';
    case 'в':
      return 'off';
    case 'мз':
      return 'maybe';
    default:
      return 'unknown';
  }
}

async function fetchData(fetchTomorrow: boolean = false): Promise<OutagesData> {
  const dom = await JSDOM.fromURL(fetchTomorrow ? URL + '?next' : URL);
  const groupRowsEl = dom.window.document.querySelectorAll('#gsv div[id^=inf]');
  const dateEl = dom.window.document.querySelector('#gsv ul p');
  const date = dateEl?.textContent?.trim()! || Date.now().toString();

  const today = moment.tz("Europe/Kiev").format("DD.MM.YYYY")
  const tomorrow = moment.tz("Europe/Kiev").add(1, 'day').format("DD.MM.YYYY")

  if (!fetchTomorrow && date !== today ) {
    return {
      date,
      table: [],
      hasData: false
    }
  }

  if (fetchTomorrow && date !== tomorrow ) {
    return {
      date,
      table: [],
      hasData: false
    }
  }

  const table = Array.from(groupRowsEl, (row) =>
    Array.from(row.children, (cell) => mapValues(cell.textContent ?? ''))
  );



  return { date, table, hasData: true };
}

export async function returnJson(fetchTomorrow: boolean = false) {
  return await fetchData(fetchTomorrow);
}
