//Define a function to get the household ID based on the hierarchy configuration
const getHouseholdId = (contact) => contact.contact && contact.contact.type === 'clinic' ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

//Define a function to determine if contact is patient
// const isPatient = (contact) => contact.contact && contact.contact.type === 'person' && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;

module.exports = [
  {
    id: 'padr-all-time',
    type: 'count',
    icon: 'icon-sadr',
    goal: 15,
    translation_key: 'targets.padr.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    date: 'now'
  },
  {
    id: 'padr-this-month',
    type: 'count',
    icon: 'icon-sadr',
    goal: 15,
    translation_key: 'targets.padr.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    date: 'reported'
  },
  
  {
    id: 'households-with-padr-this-month',
    type: 'count',
    icon: 'icon-household',
    goal: 15,
    translation_key: 'targets.households.with.padr.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['padr'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    }
  }
];