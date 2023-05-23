const { DateTime, Duration } = require('luxon');
const NOW = DateTime.local();

module.exports = {

  contact: {
    child: [
      'Test',
      'male',
      'child',
      NOW.minus(Duration.fromObject({ years: 1 })).toISODate(),
      
    ],
    adult: [
      'Parent Name',
      'male',
      'adult',
      'yes',
      '2000-01-01', 
    ], 
  }
};
