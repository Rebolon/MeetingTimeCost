Meteor.startup(function () {
  Meteor.publish('Meeting', function () {
    return Meeting.find();
  });
});
