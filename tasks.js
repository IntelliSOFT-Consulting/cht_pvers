module.exports = [


  // Create a Task when a new contact is created
  {
    name: 'padr-after-registration',
    icon: 'icon-healthcare',
    title: 'Patient Consultation',
    appliesTo: 'contacts',
    appliesToType: [ 'person' ],
    actions: [ { form: 'padr' } ],
    events: [
      {
        id: 'padr-form',
        days:7,
        start:7,
        end:0,
      }
    ] 
  },

  
  
];