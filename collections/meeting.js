Emails = new Meteor.Collection('emails');
Members = new Meteor.Collection('members');
Meeting = new Meteor.Collection('meeting');

var checkDbRights = function funcCheckRights (userId, ownerId) {
	return userId === ownerId;
};

var DbAuthorization = {
        update: function funcUpdMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        remove: function funcDelMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        insert: function funcAddMember(userId, doc) {
                return !! userId;
        }
};

Members.allow(DbAuthorization);
Meeting.allow(DbAuthorization);

Meteor.methods({
	createMeeting: function(meetingAttributes) {
		var user = Meteor.user(),
		meetingWithSameSubject = Meeting.findOne({title: meetingAttributes.title});
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to create a new meeting");
		// ensure the meeting has a title
		if (!meetingAttributes.title)
			throw new Meteor.Error(422, 'Please fill in a headline');
		// check that there are no previous meeing with the same title
		if (meetingAttributes.title && meetingWithSameSubject) {
			throw new Meteor.Error(302,
				'This meeting has already been posted',
				meetingWithSameSubject._id);
		}

		var meeting = {
			title: meetingAttributes.title + (this.isSimulation ? ' *' : ''),
			ownerId: user._id
		};

		// MaJ du champ cote client
		if (this.isSimulation) {
			document.querySelector('#title').value = meeting.title;
		}

		if (meetingAttributes._id) {
			var meetingId = Meeting.update({_id: meetingAttributes._id}, {$set: meeting});
		} else {
			meeting.submitted = new Date().getTime();
			var meetingId = Meeting.insert(meeting);
		}
		return meetingId;
	},

	addMember: function(meetingId, memberAttributes) {
		var user = Meteor.user(),
                meeting = Meeting.findOne({_id: meetingId});
                // ensure the user is logged in
                if (!user)
                        throw new Meteor.Error(401, "You need to login to create a new meeting");
                // ensure member constraint
                if (!meeting)
                        throw new Meteor.Error(422, 'Please create a meeting first');
		if (!memberAttributes.salary)
			throw new Meteor.Error(422, 'Please fill at least salary');
		// j'aime pas trop le fait que chec envoi une exception qu'on ne maitrise pas... du coup faut utiliser try/catch
		try {
			check(parseInt(memberAttributes.salary), Number);
		} catch (e) {
			throw new Meteor.Error(422, 'Salary must be a number');
		}

                var member = {
                        email: memberAttributes.email + (this.isSimulation ? ' (new)' : ''),
                        salary: parseInt(memberAttributes.salary)
                };

                var meetingId = Meeting.update({_id: meeting._id}, {$push: {members: member}});
                return meetingId;
	}
});
