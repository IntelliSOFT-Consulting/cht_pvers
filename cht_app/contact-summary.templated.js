const thisContact = contact;
const thisLineage = lineage;
 

const fields = [
  { appliesToType: 'person', label: 'contact.age', value: thisContact.date_of_birth, width: 4, filter: 'age' },
  { appliesToType: 'person', label: 'contact.sex', value: 'contact.sex.' + thisContact.sex, translate: true, width: 4 },
  { appliesToType: 'person', label: 'person.field.phone', value: thisContact.phone, width: 4 },
  { appliesToType: 'person', label: 'contact.parent', value: thisLineage, filter: 'lineage' },
];

const cards = [
  {
    label: 'contact.profile.death.title',
    appliesToType: 'person',
    appliesIf: () => contact && contact.date_of_date,
    fields: () => ([
      {
        label: 'contact.profile.death.date',
        value: contact.date_of_death,
        filter: 'simpleDate',
        translate: false,
        width: 6
      }
    ]),
  }
];

module.exports = {
  fields: fields,
  cards: cards
};

