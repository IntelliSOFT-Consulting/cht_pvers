module.exports = [
 
  {
  name: 'padr-after-registration',
  title: 'First Assessment',
  icon: 'icon-healthcare',
  appliesTo: 'contacts',
  appliesToType: ['patient'],
  appliesIf: c => user.parent && user.parent.contact_type === 'chw_area' && !c.contact.date_of_death && !c.contact.muted,
  actions: [{ form: 'padr' }],
  events: [{
    start: 0,
    days: 0,
    end: 0,
  }],
}

];