import React from 'react';
const pad = n => String(n).padStart(2, '0');
const fmt = (d, mode) => {
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return mode === 'date' ? date : mode === 'time' ? time : `${date}T${time}`;
};
export default function RNCDateTimePicker({ value = new Date(), mode = 'datetime', onChange }) {
  const type = mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local';
  return React.createElement('input', {
    type, value: fmt(value, mode), style: { font: 'inherit', padding: 8, borderRadius: 6, border: '1px solid #ccc' },
    onChange: e => {
      const v = e.target.value; if (!v) return;
      const d = mode === 'time' ? new Date(`${fmt(value, 'date')}T${v}`) : new Date(v);
      onChange && onChange({ type: 'set' }, d);
    },
  });
}
