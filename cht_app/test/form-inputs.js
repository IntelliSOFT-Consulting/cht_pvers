const { DateTime, Duration } = require('luxon');
const NOW = DateTime.local();

module.exports = {
  padrScenarios: {
    availability:[
      ['No'],
    ],
    reaction: [
      ['Yes'],
      ['Japheth Kiprotich', '+254700123432', 'Self', 'Mombasa', 'Reaction'],
      ['Vomiting_or_diarrhea,Dizziness_or_drowsiness','', '2023-08-23', 'Yes'],
      ['1', 'Medicine', 'Manufacturer', 'Location', '2023-08-20', '2023-08-23', '2024-10-20'],
      ['Death'],
    ],

    // Poor Quality Medicine
    medicine: [
      ['Yes'],
      ['Japheth Kiprotich', '+254700123432', 'Self', 'Mombasa', 'Medicine'],
      ['The_label_looks_wrong'],
      ['1', 'Medicine', 'Manufacturer', 'Location', '2023-08-20', '2023-08-23', '2024-10-20'],
      ['Unknown'],
    ]
  },
  submissionScenario: {
    male: (creationDate) => [
      [creationDate, 'facility', 'no'],
      [1, 1],
      ['Test Male Person', 'male', 'none']
    ],
    female: (creationDate) => [
      [creationDate, 'facility', 'no'],
      [1, 1],
      ['Test Female Person', 'female', 'yes']
    ]
  },
};
