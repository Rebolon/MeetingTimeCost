Template.meetingItem.events({
  'click a .glyphicon.glyphicon-remove-circle': function (id) {
    // @TODO euh pouruqoi y a un id en argument de la fonction ici ?
    console.log('click a .glyphicon.glyphicon-remove-circle, id : ', id);
    
    var meeting = this,
        modal = "<p>Réunion du " + new Date(meeting.submitted) + ": " + meeting.title + "</p>";
    document.querySelector('#alertRemoveMeeting .modal-body').innerHTML = modal;
    
    Session.set('selectedMeeting', this._id);
    $('#alertRemoveMeeting').modal({});
  }
});
