
module.exports = [

 /*
  Create a Task when a new contact is created
  NOTE: Only show if the current user is a CHW  
  */

  {
    name: 'assessment-after-registration',
    icon: 'icon-healthcare',
    title: 'CHW Consultation',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: c => c.contact.role === 'patient', /*Todo: add check for CHW*/
    actions: [{ form: 'assessment' }],
    events: [
      {
        id: 'assessment-form',
        days: 7,
        start: 7,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'assessment',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }

  },
  /*Create a Task when chw submits an assessment form
  NOTE: Only the supervisor should get this task
  */
  {
    name: 'padr-after-assessment',
    icon: 'icon-healthcare',
    title: 'Household Visit',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    actions: [{ form: 'padr' }],
    events: [
      {
        id: 'padr-form',
        days: 7,
        start: 7,
        end: 2,
      }
    ],
    appliesIf: function (contact, report) {
      return Utils.getField(report, 'reporter.group_report.reaction') === 'yes' || Utils.getField(report, 'reporter.group_report.quality') === 'yes';
    },
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'padr',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }

  },

  /*
  Create a Task when a report is submitted with ongoing reaction
  NOTE: Supervisor should get this for follow up
  */
  {
    name: 'serious-case',
    icon: 'icon-followup',
    title: 'Ongoing Adverse Reaction',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    actions: [{ form: 'follow' }],
    events: [
      {
        id: 'alarm-on-ongoing-reaction',
        days: 7,
        start: 7,
        end: 2,
      }
    ],
    priority: {
      level: 'high',
    },
    appliesIf: function (contact, report) {
      return Utils.getField(report, 'reaction.group_reaction.on') === 'yes';
    },
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'follow',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  }

];