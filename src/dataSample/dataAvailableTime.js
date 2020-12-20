let AvailableTime = [
  {
    day: new Date().toDateString().slice(0, 3),
    start: new Date().toTimeString().slice(0, 5),
    end: new Date().toTimeString().slice(0, 5),

    status: true,
    desc: 'Privat Fia',
  },
  {
    day: new Date().toDateString().slice(0, 3),
    start: new Date().toTimeString().slice(0, 5),
    end: new Date().toTimeString().slice(0, 5),
    status: true,
    desc: 'Privat Anggi',
  },
  {
    day: new Date().toDateString().slice(0, 3),
    start: new Date().toTimeString().slice(0, 5),
    end: new Date().toTimeString().slice(0, 5),
    status: false,
    desc: null,
  },
  {
    day: new Date().toDateString().slice(0, 3),
    start: new Date().toTimeString().slice(0, 5),
    end: new Date().toTimeString().slice(0, 5),
    status: false,
    desc: null,
  },
];

export default AvailableTime;
