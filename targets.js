//Define a function to get the household ID based on the hierarchy configuration
const getHouseholdId = (contact) => contact.contact && contact.contact.type === 'clinic' ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

//Define a function to determine if contact is patient
// const isPatient = (contact) => contact.contact && contact.contact.type === 'person' && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;

module.exports = [
  {
    id: 'sadr-all-time',
    type: 'count',
    icon: 'icon-sadr',
    goal: 15,
    translation_key: 'targets.sadr.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['sadr'],
    date: 'now'
  },
  {
    id: 'sadr-this-month',
    type: 'count',
    icon: 'icon-sadr',
    goal: 15,
    translation_key: 'targets.sadr.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['sadr'],
    date: 'reported'
  },
  
  {
    id: 'households-with-sadr-this-month',
    type: 'count',
    icon: 'icon-household',
    goal: 15,
    translation_key: 'targets.households.with.sadr.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['sadr'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    }
  },
  
  // AEFI
  {
    id: 'aefi-all-time',
    type: 'count',
    icon: 'icon-aefi',
    goal: 15,
    translation_key: 'targets.aefi.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['aefi'],
    date: 'now'
  },
  {
    id: 'aefi-this-month',
    type: 'count',
    icon: 'icon-aefi',
    goal: 15,
    translation_key: 'targets.aefi.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['aefi'],
    date: 'reported'
  },
  
  {
    id: 'households-with-aefi-this-month',
    type: 'count',
    icon: 'icon-household',
    goal: 15,
    translation_key: 'targets.households.with.aefi.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['aefi'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    }
  },

  // PQHPTs
  {
    id: 'pqhpt-all-time',
    type: 'count',
    icon: 'icon-pqhpt',
    goal: 15,
    translation_key: 'targets.pqhpt.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'reports',
    appliesToType: ['pqhpt'],
    date: 'now'
  },
  {
    id: 'pqhpt-this-month',
    type: 'count',
    icon: 'icon-pqhpt',
    goal: 15,
    translation_key: 'targets.pqhpt.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['pqhpt'],
    date: 'reported'
  },
  
  {
    id: 'households-with-pqhpt-this-month',
    type: 'count',
    icon: 'icon-household',
    goal: 15,
    translation_key: 'targets.households.with.pqhpt.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['pqhpt'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    }
  },
];