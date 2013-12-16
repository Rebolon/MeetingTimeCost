var alertBox = function (type, content) {
  var alertType = (_.contains(['danger', 'success', 'info', 'block'], type) ? type : 'block'),
      html = null,
      existingEl = document.querySelector('#alert');
  
  if (existingEl) {
    existingEl.parent.removeChild(existingEl);
  }
  
  existingEl = document.createElement('div');
  existingEl.setAttribute('id', 'alert');
  existingEl.setAttribute('class', 'alert ' + ' alert-' + alertType + ' fade in out');
  existingEl.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button> \
<h4>' + alertType + '</h4> ' + content;
  
  document.querySelector('#meetingUserMessage').appendChild(existingEl);
  
  Meteor.setTimeout(function() {
    $('#alert').alert('close');
  }, 5000);
  return true;
}

Template.meetingSubmit.helpers({
  "selected": function funcMeetingIsNewOrEdit() {
    var selected = Session.get('selectedMeeting');
    if (selected) {
      return Meeting.findOne(selected);
    }
    return null;
  }
});

Template.meetingSubmit.events({
  'click #btnGotoSummary': function funcGotoSummary() {
    var selectedMeeting = Session.get('selectedMeeting');
    if (selectedMeeting) {
      Meteor.Router.to('/meeting/summary/' + selectedMeeting);
    }
  },
  
  'click #btnAddMeeting': function() {
    var meeting = {
      title: document.querySelector('#title').value
    };
    
    Meteor.call('createMeeting', meeting, function(error, id) {
      if (error)
        return alertBox('danger', error.reason);
      
      Session.set('selectedMeeting', id);
      alertBox('success', 'Une réunion a bien été créé.');
      
      Meteor.Router.to('/meeting/edit/' + id);
    });
  },
  
  'click #btnAddMember': function () {
    var member = {
      "email": document.querySelector('#email').value,
      "salary": document.querySelector('#salary').value
    };
    
    Meteor.call('addMemberToMeeting', Session.get('selectedMeeting'), member, function(error, id) {
      if (error)
        return alertBox('error', error.reason);
      
      document.querySelector('#email').value = '';
      document.querySelector('#salary').value = '';
    });
  },
  
  'click #btnEditMeeting': function () {
    var meeting = {
      title: document.querySelector('#title').value
    };
    
    if (Session.get('selectedMeeting')) {
      meeting._id = Session.get('selectedMeeting');
    }
    
    if (meeting.title !== Meeting.findOne(Session.get('selectedMeeting')).title) {
      Meteor.call('createMeeting', meeting, function(error, id) {
        if (error)
          return alertBox('error', error.reason);
        
        alertBox('success', 'Réunion mise à jour');
      });
    };
  }
});
