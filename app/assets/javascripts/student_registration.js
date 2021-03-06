$(document).ready(handle_student_registration_page)
$(document).on('page:load', handle_student_registration_page)

function handle_student_registration_page(){
  $('#current-course-offered-table table').DataTable({
    paging: false
  });

  preference_handler();

}

function click_event(){
  var option = $($("#course-schedule-section").find(".schedule-options h1").next())

  option.off().mouseenter(function(){
    var id = $(this).attr("id").split("-")
    var num = parseInt(id[id.length -1])
    selected_data = test[num]
    var text = $(this).prev().text();
    $(this).css("background","#ADD8E6")
    $(this).prev().text("Double Click To Select The Schedule");
    console.log(3)
    $(this).mouseleave(function(){
      console.log(3)
      $(this).prev().text(text);
      $(this).css("background", "white")
    });
    $(this).off().dblclick(function(){
      console.log(selected_data)
      $.ajax({
        url: "/scheduler_generator/select_a_schedule",
        method: "GET",
        dataType: "json",
        data: {selected: selected_data},
        success: function(data){
          url = window.location.href.split("/")
          url = url.splice(0, url.length -1)
          url = url.join("/")
          console.log(url)
          $(location).attr('href', url)
        }
      });
    });
  })
}


var test;
function preference_handler(){
  var day_data = undefined;
  var time_data = undefined;
  $("#weekday-selection").selectize({
    allowEmptyOption: true,
    delimiter: ',',
    maxItems: 5,
    onChange: function(data){
      day_data = data;
    }
  });
  $("#time-selection").selectize({
    allowEmptyOption: true,
    delimiter: ',',
    maxItems: 3,
    onChange: function(data){
      time_data = data;
    }
  });


  $("#preference-submit-button").off().on("click", function(){
    var text = $(this).text();
    if (text == "Reset"){
      $(this).text("Submit")
      $("#current-course-offered-table").show();
      $("#course-schedule-section").find(".schedule-options").remove()
    }
    else{
      $("#loading").show();
      $("#preference-submit-button").hide()
      if (day_data == undefined || day_data.length == 5){
        day_data = "all";
      }
      if (time_data == undefined){
        time_data = "all";
      }
      var number_of_class = $("#number-of-class-option").val();
      if (number_of_class == ""){
        number_of_class = "4"
      }
      $.ajax({
        url: "/scheduler_generator/preference_generator",
        method: "GET",
        dataType: "json",
        data: {days: day_data, time: time_data, number_of_class: number_of_class},
        success: function(data){
          test = data;
          $("#current-course-offered-table").hide();
          for (var i = 0; i < data.length; i ++){
            $("#course-schedule-section").append("<div class='schedule-options'><h1 style='padding-top: 30px'>Option " + (i +1) +"</h1><div id='schedule-option-" + i+ "' style='cursor: pointer'></div>");
            var option = $("#course-schedule-section").find("#schedule-option-" + i);

            time_events = []
            for (var j= 0; j < data[i].length; j++){
              time_events = time_events.concat(construct_time_event(data[i][j]));
            }
            var selected_data = data[i];
            option.fullCalendar({
              header: false,
              defaultView: "agendaWeek",
              weekends: false,
              minTime: "08:00:00",
              maxTime: "23:00:00",
              slotDuration: "00:15:00",
              slotLabelFormat: 'h(:mm)a',
              events: time_events

            });
            click_event();
          }
          $("#loading").hide();
          $("#preference-submit-button").text("Reset");
          $("#preference-submit-button").show();
        }
      });

    }

  });


}

function construct_time_event(object){
  var mapping = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thrusday": 4, "Friday": 5};
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  var events = []
  var name = object.course_name
  var lecture = object.lecture
  if (lecture != null || lecture != undefined){
    var lecture_day = lecture.day.split(" - ");
    var lecture_time = lecture.time.split(" - ");
    start_time = get_time(lecture_time[0]);
    end_time = get_time(lecture_time[1]);
    for (var i = 0; i < lecture_day.length; i++){
      events.push(
        {
          title: "Lecture "+ name,
          start: new Date(y, m, d + (mapping[lecture_day[i]] - date.getDay()), start_time[0], start_time[1], 0),
          end: new Date(y, m, d + (mapping[lecture_day[i]] - date.getDay()), end_time[0], end_time[1], 0),
          color: "red"
        }
      )
    }
  }
  var tutorial = object.tutorial;
  if (tutorial != null || tutorial != undefined){
    tutorial_time = tutorial.time.split(" - ");
    start_time = get_time(tutorial_time[0]);
    end_time = get_time(tutorial_time[1]);
    events.push(
      {
        title: "Tutorial " + name,
        start: new Date(y, m, d + (mapping[tutorial.day] - date.getDay()), start_time[0], start_time[1], 0),
        end: new Date(y, m, d + (mapping[tutorial.day] - date.getDay()), end_time[0], end_time[1], 0),
        color: "blue"
      }
    )
  }
  var lab = object.lab;
  if (lab != null || lab != undefined){
    lab_time = lab.time.split(" - ");
    start_time = get_time(lab_time[0]);
    end_time = get_time(lab_time[1]);
    events.push(
      {
        title: "Lab " + name,
        start: new Date(y, m, d + (mapping[lab.day] - date.getDay()), start_time[0], start_time[1], 0),
        end: new Date(y, m, d + (mapping[lab.day] - date.getDay()), end_time[0], end_time[1], 0),
        color: "green"
      }
    )
  }
  return events
}

function get_time(time){
  var the_time = time.match(/\d+:\d+/)[0].split(":");
  if (time.indexOf("PM") != -1 && the_time[0] != "12"){
    the_time[0] = parseInt(the_time[0]) + 12
  }
  else {
    the_time[0] = parseInt(the_time[0])
  }
  the_time[1] = parseInt(the_time[1])
  return the_time
}
