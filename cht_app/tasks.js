
module.exports = [

  /*
   Create a Task when a new contact is created
   NOTE: Only show if the current user is a CHW  
   */

  {
    name: 'assessment-after-registration',
    icon: 'icon-healthcare',
    title: 'Household Member Assessment',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: c => c.contact.role === 'patient' && user.role === 'chw', /*Todo: add check for CHW*/
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
  // Create a CHW Task to ensure the Patient went to the hospital: :7 Days
  {
    name: 'chw-follow-up',
    icon: 'icon-followup',
    title: 'CHW Referral Follow Up:',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: c => c.contact.role === 'patient' && user.role === 'chw', /*Todo: add check for CHW*/
    actions: [{ form: 'chwfollow' }],
    events: [
      {
        id: 'chw-follow-up-form',
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

  // CREATE a death confirmation task for CHW Supervisor

  {
    name: 'supervisor-death-confirmation',
    icon: 'icon-death-coffin',
    title: 'Death Confirmation',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    appliesIf: function (contact, report) {
      return (Utils.getField(report, 'reporter.group_report.death') === 'yes' && user.role === 'chw_supervisor');
    },
    actions: [{ form: 'death_confirmation' }],
    events: [
      {
        id: 'death-confirmation-form',
        days: 5,
        start: 5,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'death_confirmation',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }

  },
  {
    name: 'supervisor-death-confirmation-alt',
    icon: 'icon-death-coffin',
    title: 'Death Confirmation',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    appliesIf: function (contact, report) {
      return (Utils.getField(report, 'outcome_details.group_outcome_details.outcome') === 'death' && user.role === 'chw_supervisor');
    },
    actions: [{ form: 'death_confirmation' }],
    events: [
      {
        id: 'death-confirmation-form-alt',
        days: 5,
        start: 5,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'death_confirmation',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }

  },

  // Create a Task for Supervisor to follow up patient if not avaialable:: 5 days maximum
  {
    name: 'supervisor-padr-follow-up',
    icon: 'icon-followup',
    title: 'CHW Supervisor Follow Up',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    appliesIf: function (contact, report) {
      return (Utils.getField(report, 'availability.availability_report.available') === 'no' && user.role === 'chw_supervisor');
    },
    actions: [{ form: 'padr' }],
    events: [
      {
        id: 'padr-follow-up-report',
        days: 5,
        start: 5,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'padr',
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
      return (Utils.getField(report, 'reporter.group_report.reaction') === 'yes' && user.role === 'chw_supervisor') || (Utils.getField(report, 'reporter.group_report.quality') === 'yes' && user.role === 'chw_supervisor');
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
      return Utils.getField(report, 'reaction.group_reaction.on') === 'yes' && user.role === 'chw_supervisor';
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