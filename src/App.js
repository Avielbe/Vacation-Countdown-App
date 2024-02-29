import React, { useState, useEffect } from 'react';
import { HDate, HebrewCalendar, Location } from '@hebcal/core';
import './style.css';
const millisecondsPerSecond = 1000;
const millisecondsPerMinute = millisecondsPerSecond * 60;
const millisecondsPerHour = millisecondsPerMinute * 60;
const millisecondsPerDay = millisecondsPerHour * 24;
const millisecondsPerWeek = millisecondsPerDay * 7;

// Component to calculate time remaining until the next vacation:
function MainCountdownTimer({ nextVacation, nextVacationName }) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(nextVacation)
  );

  function calculateTimeRemaining(nextVacation) {
    const now = new Date();

    const difference = nextVacation - now;
    // const hoursRemaining = Math.floor(difference / millisecondsPerHour);
    // const daysRemaining = Math.floor(difference / millisecondsPerDay);
    // const weeksRemaining = Math.floor(difference / millisecondsPerWeek);
    const daysRemaining = Math.floor(difference / millisecondsPerDay);
    const hoursRemaining = Math.floor((difference % millisecondsPerDay) / millisecondsPerHour);
    const minutesRemaining = Math.floor((difference % millisecondsPerHour) / millisecondsPerMinute);
    const secondsRemaining = Math.floor((difference % millisecondsPerMinute) / millisecondsPerSecond);
  
    return { daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining };
  }

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(nextVacation));
  }, [nextVacation]);
/////
  useEffect(() => {
    const refreshSeconds= setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(nextVacation));
    }, 1000);

    return () => clearInterval(refreshSeconds); // Cleanup the interval on component unmounts (because it refesh every seconds)
  }, [nextVacation]);


  return (
    <div className="countdown">
          <div className="countdown-timer">
          <div className="countdown-item">
            <p className="countdown-digit">{timeRemaining.daysRemaining}</p>
            <p className="countdown-description">ימים</p>
          </div>
            <p className="countdown-separator">:</p>

          <div className="countdown-item">
            <p className="countdown-digit">{timeRemaining.hoursRemaining}</p>
            <p className="countdown-description">שעות</p>
          </div>
            <p className="countdown-separator">:</p>

          <div className="countdown-item">
            <p className="countdown-digit">{timeRemaining.minutesRemaining}</p>
            <p className="countdown-description">דקות</p>
            
          </div>
          <p className="countdown-separator">:</p>
          
          <div className="countdown-item">
            <p className="countdown-digit">{timeRemaining.secondsRemaining}</p>
            <p className="countdown-description">שניות</p>
          </div>
        </div>
      <div className="background">
        <img
          src="https://tinypic.host/images/2024/02/22/_4eea4620-dd46-4bf8-960d-dd1d1dc1c424.jpeg"
          alt="Background Image"
        ></img>
      </div>

      <h1>עד לחופשת {nextVacationName}</h1>
      {/* <p>On {nextVacation.toDateString()}</p> */}

    </div>
  );
}

// Component to calculate the next vacations
function NextVacation() {
  const vacations = SchoolVacations();
  const [isVacationListCollapsed, setIsVacationListCollapsed] = useState(true);
  // const nextVacation = vacations[0];
  // const nextVacation = vacations.length > 0 ? vacations[0].getDate().greg() : new Date();
  const nextVacation =
    vacations.length > 0 ? vacations[0].gregorianDate : new Date();
  const nextVacationName = vacations.length > 0 ? vacations[0].name : '';

  return (
    <div>
      <MainCountdownTimer
        nextVacation={nextVacation}
        nextVacationName={nextVacationName}
      />

      {/* <h1
        onClick={() => setIsVacationListCollapsed(!isVacationListCollapsed)}
        style={{ cursor: 'pointer' }}
      >
        Upcoming Vacations {isVacationListCollapsed ? '+' : '-'}
      </h1>
      {!isVacationListCollapsed && (
        <div>
          {vacations.map((vacation, index) => (
            <div key={index}>
              <p>
                {vacation.emoji} {vacation.name} - {vacation.duration} <br />
                {vacation.gregorianDate.toDateString()} / {vacation.hebrewDate}
              </p>
              <MiniCountdown eventDate={vacation.gregorianDate} />
              <hr></hr>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

// Oragenazid all the vaaction of the schools
function SchoolVacations() {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    const year = new Date().getFullYear();
    const events = HebrewCalendar.calendar({
      year: year,
      isHebrewYear: false,
      vacation: true,
    });

    let schoolVacations = [
      'Erev Rosh Hashana',
      'Erev Yom Kippur',
      'Chanukah: 2 Candles',
      'Purim',
      'Pesach I',
      "Yom HaAtzma'ut",
      'Shavuot I',
    ];

    let holidayDetails = {
      'Erev Rosh Hashana': {
        emoji: '🍎',
        description: 'ראש השנה',
        duration: '3 ימים',
      },
      'Erev Yom Kippur': {
        emoji: '🙏',
        description: 'יום-כפור וסוכות',
        duration: '14 ימים',
      },
      'Chanukah: 2 Candles': {
        emoji: '🕎',
        description: 'חנוכה',
        duration: '7 ימים',
      },
      Purim: { emoji: '🎭', description: 'פורים', duration: '2 ימים' },
      'Pesach I': { emoji: '🍷', description: 'פסח', duration: '15 יום' },
      "Yom HaAtzma'ut": {
        emoji: '🇮🇱',
        description: 'יום העצמאות',
        duration: 'יום 1',
      },
      'Shavuot I': { emoji: '🌾', description: 'שבועות', duration: '2 ימים' },
    };

    const futureVacations = events
      .filter(
        (event) =>
          event.getDate().greg() >= new Date() &&
          schoolVacations.includes(event.getDesc())
      )
      .map((event) => {
        let details = holidayDetails[event.getDesc()] || {
          emoji: '🎉',
          description: event.getDesc(),
        };
        let gregorianDate = new Date(event.getDate().greg().getTime());

        let hebrewDate =
          event.getDesc() === 'Pesach I'
            ? new HDate(6, 1, event.getDate().getFullYear()).toString()
            : event.getDate().toString();

        // If the event is Passover, subtract 9 days from the date
        if (event.getDesc() === 'Pesach I') {
          gregorianDate.setDate(gregorianDate.getDate() - 9);
        }

        return {
          name: details.description,
          emoji: details.emoji,
          duration: details.duration,
          hebrewDate: hebrewDate,
          gregorianDate: gregorianDate,
        };
      });
    let elemnterySummerVacationDate = new Date(year, 6, 1);
    // let highschoolSummerVacationDate = new Date(year, 5, 21);
    const summerVacation = {
      name: 'החופש הגדול',
      emoji: '🏖️',
      duration: 'חודשיים',
      hebrewDate: new HDate(elemnterySummerVacationDate).toString(),
      gregorianDate: elemnterySummerVacationDate,
      isSummerVacation: true,
    };
    // Set the Summer Vacation After Shavuot
    let shavuotIndex = futureVacations.findIndex(
      (vacation) => vacation.name === 'שבועות'
    );
    futureVacations.splice(shavuotIndex + 1, 0, summerVacation);
    setVacations(futureVacations);
  }, []);
  return vacations;
}

function MiniCountdown({ eventName, eventDate, eventEmoji }) {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(eventDate)
  );

  function calculateTimeRemaining(date) {
    const now = new Date();
    const difference = date - now;
    const daysRemaining = Math.floor(difference / millisecondsPerDay);
    return daysRemaining;
  }

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(eventDate));
  }, [eventDate]);

  return (
    <div className="mini-countdown">
      <h2>{eventEmoji}</h2>
      <h2>{eventName}</h2>
      <p> רק עוד: {timeRemaining} ימים</p>
    </div>
  );
}

//Main Component
export default function App() {
  const vacations = SchoolVacations();
  const nextVacation = vacations[1];

  if (!nextVacation) {
    return <div>No upcoming vacations found</div>;
  }

  const nextSaturday = new Date();
  nextSaturday.setDate(
    nextSaturday.getDate() + ((7 - nextSaturday.getDay() + 6) % 7) + 1
  );
  const summerVacation = vacations.find(
    (vacation) => vacation.isSummerVacation
  );

  return (
    <div className="App">
      <NextVacation />
      <MiniCountdown
        eventName={summerVacation.name}
        eventDate={summerVacation.gregorianDate}
        eventEmoji="🏖️"
      />
      <MiniCountdown
        eventName="שבת הקרובה"
        eventDate={nextSaturday}
        eventEmoji="🕯️🕯️"
      />
      <MiniCountdown
        eventName={`חופשת ${nextVacation.name}`}
        eventDate={nextVacation.gregorianDate}
        eventEmoji={nextVacation.emoji}
      />
    </div>
  );
}
