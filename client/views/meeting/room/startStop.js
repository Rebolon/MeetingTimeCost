Session.setDefault('time', '00:00:00');
Session.setDefault('cost', 0);

var intervals = {
  cost: null,
  time: null
},
    
    initCounters = function (meeting) {
      var meetingLib = (new MeetingTimeCost.Meeting),
          durationLib = new MeetingTimeCost.Duration,
          costBySeconds = meetingLib.getCostBySeconds(meeting),
          // j'aime pas passer par un timeout pour initialiser les boutons... comment faire mieux ?
          domTimeCounter,
          domCostCounter,
          duration = durationLib.getDuration(meeting),
          initialTimer;
      
      if (duration) {        
        intervals.time = setInterval(function () {
          duration.setSeconds(duration.getSeconds()+1);
          Session.set('time', ("0" + duration.getHours()).substr(-2) + ":" 
                      + ("0" + duration.getMinutes()).substr(-2) + ":" 
                      + ("0" + duration.getSeconds()).substr(-2));
        }, 1000);
        
        intervals.cost = setInterval(function () {
          Session.set('cost', Session.get('cost') + costBySeconds);
        }, 1000);
      }
    };

Template.meetingStartStop.rendered = function () {
  var id = Session.get('selectedMeeting'),
      meeting = Meeting.findOne(id);
  
  if (!intervals.cost) {
    initCounters(meeting);
  }
}

Template.meetingStartStop.helpers({
  "meeting": function () {
    var id = Session.get('selectedMeeting'),
        meeting = Meeting.findOne(id);
    
    return meeting;
  },
  
  "getPendingTimer": function () {
    return Session.get('time');
  },
  
  "costBySeconds": function () {
    return Session.get('cost');
  }
});

Template.meetingStartStop.events({
  'click #btnStartMeeting': function () {
    var id = Session.get('selectedMeeting'),
        meeting = Meeting.findOne(id);
    if (meeting
        && !meeting.startTime) {
      
      // peut etre passer par le serveur, mais pour faire vite on garde ca pour l'instant
      Meeting.update({"_id": id}, {"$set": {"startTime": new Date()}});
      document.querySelector('#btnStartMeeting').disabled = "disabled";
      
      initCounters(meeting);
    }
  },
  
  'click #btnEndMeeting': function () {
    var id = Session.get('selectedMeeting'),
        meeting = Meeting.findOne(id);
    if (meeting
        && !meeting.endTime) {
      
      // peut etre passer par le serveur, mais pour faire vite on garde ca pour l'instant
      Meeting.update({"_id": id}, {"$set": {"endTime": new Date()}});
      document.querySelector('#btnEndMeeting').disabled = "disabled";
      
      clearInterval(intervals.cost);
      clearInterval(intervals.time);
      
      Meteor.Router.to('/meeting/summary/' + meeting._id);
    }
  }
});
