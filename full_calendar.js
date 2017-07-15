var initialize_calendar;
initialize_calendar = function() {
  $('.calendar').each(function(){
    var calendar = $(this);
    calendar.fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      selectable: true,
      selectHelper: true,
      editable: true,
      eventLimit: true,
      events: '/events.json',

      slotDuration: '00:05:00',
      minTime: "11:00:00",
      maxTime: "19:00:00",
      timeFormat: 'hh:mm a',

      dayClick: function(date, jsEvent, view) {
                  console.log(view.name);
                  if (view.name === "month") {
                      $('.calendar').fullCalendar('gotoDate', date);
                      $('.calendar').fullCalendar('changeView', 'agendaDay');
                  }
              },

              select: function(start, end, jsEvent,view) {
                console.log(view.name);
                if (view.name === "agendaDay") {
                $.getScript('/events/new', function() {
                  $('#event_date_range').val(moment(start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(end).format("MM/DD/YYYY HH:mm"))
                  date_range_picker();
                  $('.start_hidden').val(moment(start).format('YYYY-MM-DD HH:mm'));
                  $('.end_hidden').val(moment(end).format('YYYY-MM-DD HH:mm'));
                });
              }
                calendar.fullCalendar('unselect');
              },

      eventDrop: function(event, delta, revertFunc) {
        event_data = {
          event: {
            id: event.id,
            start: event.start.format(),
            end: event.end.format()
          }
        };
        $.ajax({
            url: event.update_url,
            data: event_data,
            type: 'PATCH'
        });
      },

      eventClick: function(event, jsEvent, view) {
        console.log('test');
        $.getScript(event.edit_url, function() {
          $('#event_date_range').val(moment(event.start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(event.end).format("MM/DD/YYYY HH:mm"))
          date_range_picker();
          $('.start_hidden').val(moment(event.start).format('YYYY-MM-DD HH:mm'));
          $('.end_hidden').val(moment(event.end).format('YYYY-MM-DD HH:mm'));
        });
      }
    });
  })
};
$(document).on('turbolinks:load', initialize_calendar);
