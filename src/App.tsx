import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/sass/styles.scss";
import { Event, FetchData, urls } from "./static";

const localizer = momentLocalizer(moment);

const App = () => {
  const [loading, setLoading] = useState(true); // start app in loading state
  const [events, setEvents] = useState([] as Event[]); // the events consumed by the calendar
  const [firstDate, setFirstDate] = useState(null as null | string); // the date the calendare has to focus
  const [corsProblems] = useState(true); // do we have cors problems with our data sources?

  // launching the background logic on mount
  useEffect(() => {
    (async () => {
      // aggregate all events in a covenient data structure
      const ret = await Promise.all(
        urls.map(u =>
          (!corsProblems
            ? Axios.get(u.url)
            : new Promise<any>(res => res(u))
          ).then(
            (
              { data }: { data: FetchData } // making the requests
            ) => {
              // and build new event based on availability for specific hour
              return Object.keys(data.data.availability).flatMap(t =>
                data.data.availability[t].map((open, openi) => ({
                  id: `${data.data.days[openi]} ${t}`,
                  title: t,
                  start: moment(`${data.data.days[openi]} ${t}`).toDate(),
                  end: moment(`${data.data.days[openi]} ${t}`)
                    .add(30, "minutes")
                    .toDate(),
                  status: open
                }))
              );
            }
          )
        )
      );

      // set events for calendar
      setEvents(ret.flat());

      // set the date to focus the calendar
      setFirstDate(ret.flat()[0].id.split(" ")[0]);

      setLoading(false);
    })();
  }, []);

  if (loading) return <div>loading</div>;

  return (
    <div style={{ maxHeight: "100vh", overflowY: "scroll" }}>
      <Calendar
        localizer={localizer}
        events={events}
        step={15}
        timeslots={2}
        scrollToTime={moment(`${firstDate as string} 19:00`).toDate()}
        defaultView="week"
        defaultDate={moment(firstDate as string).toDate()}
        startAccessor="start"
        endAccessor="end"
        min={moment(`${firstDate as string} 19:00`).toDate()} // set the minimum time to show
        eventPropGetter={({ status }) => ({
          // modify the event style based on status
          style: {
            backgroundColor:
              status === 0
                ? "#eee"
                : status === 1
                ? "rgb(46, 204, 113)"
                : "#f00",
            color: status === 0 ? "#000" : "#fff",
            borderColor: "#fff",
            height: "calc(100% -8px)",
            margin: 4
          }
        })}
        components={{
          // modify the event title based on status
          event: ({ event: { status } }) => (
            <b>
              {status === 0 ? "Unavailable" : status === 1 ? "Free" : "Booked"}
            </b>
          )
        }}
      />
    </div>
  );
};

export default App;
