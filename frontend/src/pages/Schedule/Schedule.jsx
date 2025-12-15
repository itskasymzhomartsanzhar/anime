import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@/components/organisms/Menu/Menu';
import './Schedule.scss';
import placeholder from '@/assets/placeholder.jpg';

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    generateWeekDays();
  }, []);

  const generateWeekDays = () => {
    const today = new Date();
    const days = [];
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      days.push({
        name: dayNames[i],
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString()
      });
    }

    setWeekDays(days);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dayNames = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье'
    ];

    const monthNames = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ];


    return {
      day: today.getDate(),
      dayName: dayNames[today.getDay()],
      month: monthNames[today.getMonth()],
      year: today.getFullYear(),
      time: today.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const currentDate = getCurrentDate();

  // Mock schedule data
  const scheduleData = [
    {
      id: 1,
      title: 'Название аниме очень длинное...',
      episode: 'Финальный эпизод',
      time: '00:00',
      image: placeholder,
      isWatched: true
    },
    {
      id: 2,
      title: 'Название аниме',
      episode: 'Эпизод 12',
      time: '00:00',
      image: placeholder,
      isWatched: false
    },
    {
      id: 3,
      title: 'Название аниме',
      episode: 'Эпизод 12',
      time: '00:00',
      image: placeholder,
      isWatched: false
    },
    {
      id: 4,
      title: 'Название аниме',
      episode: 'Эпизод 12',
      time: '00:00',
      image: placeholder,
      isWatched: false
    },
    {
      id: 5,
      title: 'Название аниме',
      episode: 'Эпизод 12',
      time: '00:00',
      image: placeholder,
      isWatched: false
    }
  ];

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  const handleAddStory = () => {
    // TODO: Implement add story functionality
    console.log('Add story');
  };

  const handleAirPlay = () => {
    // TODO: Implement AirPlay functionality
    console.log('AirPlay');
  };

  return (
    <div className="schedule">
      {/* Header */}
      <div className="schedule__header">
        <div className="schedule__date">
          <h1 className="schedule__day">{currentDate.day}</h1>
          <div className="schedule__date-info">
            <span className="schedule__day-name">{currentDate.dayName}</span>
            <span className="schedule__full-date">{currentDate.month} {currentDate.year}, {currentDate.time}</span>
          </div>
        </div>

      </div>

      {/* Week Calendar */}
      <div className="schedule__calendar">
        {weekDays.map((day, index) => (
          <button
            key={index}
            className={`schedule__calendar-day ${day.isToday ? 'schedule__calendar-day--active' : ''}`}
            onClick={() => setSelectedDate(day.fullDate)}
          >
            <span className="schedule__calendar-day-name">{day.name}</span>
            <span className="schedule__calendar-day-date">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="schedule__list">
        {scheduleData.map((item) => (
          <div
            key={item.id}
            className="schedule__item"
            onClick={() => handleAnimeClick(item.id)}
          >
            <div className="schedule__item-content">
              <h3 className="schedule__item-title">{item.title}</h3>
              <p className="schedule__item-episode">{item.episode}</p>
            </div>
            <div className="schedule__item-right">
              <span className="schedule__item-time">{item.time}</span>
              <button
                className={`schedule__item-check ${item.isWatched ? 'schedule__item-check--watched' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Toggle watched status
                }}
              >
                {item.isWatched && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Menu />
    </div>
  );
};

export default Schedule;
