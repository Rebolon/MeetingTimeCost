Template.meetingSummary.helpers({
  "submitted": function () {
    var submitDate = new Date(this.submitted);
    return submitDate.toLocaleDateString() + ' ' + submitDate.toLocaleTimeString();
  },
  
	"meeting": function() {
		var id = Session.get('selectedMeeting');
		if (id) {
			return Meeting.findOne(id);
		}
	},

	"displayDate": function(dateToDisplay) {
		return (dateToDisplay ? dateToDisplay.toLocaleString() : null);
	},

	"getDuration": function() {
		var id = Session.get('selectedMeeting'),
		    meeting = Meeting.findOne(id),
		    duration = (new MeetingTimeCost.Duration).getDuration(meeting),
		    hours, minutes, seconds;

		if (duration) {
			hours = duration.getHours().toString();
			minutes = duration.getMinutes().toString();
			seconds = duration.getSeconds().toString();
			return ('0' + hours).substr(-2) + ':' 
            + ('0' + minutes).substr(-2) + ':' 
            + ('0' + seconds).substr(-2);
		}
	},

	"getCost": function() {
		var id = Session.get('selectedMeeting'),
        meeting = Meeting.findOne(id),
		    cost = (new MeetingTimeCost.Meeting).getCost(meeting),
		    intVal = parseInt(cost);

		return (!isNaN(intVal) ? intVal : 0) ;
	}
});
