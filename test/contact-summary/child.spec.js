const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const inputs = require('../form-inputs');
const harness = new TestHarness({
  subject: 'patient_id1'
});

describe('patient relation - guardian', () => {

  before(async () => await harness.start());

  after(async () => await harness.stop());

  beforeEach(async () => await harness.clear());
  
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });
 
  it('relation is a guardian', async () => {
    const result = await harness.fillContactForm('padr', ['name', 'female', 'over_5', 'guardian', '30', '0', undefined, undefined, 'none']);
    expect(result.errors).to.be.empty;
    
    const summary = await harness.getContactSummary(result.contacts[0]);
    const guardianField = summary.fields.find(f => f.label === '/padr/reporter/group_report/relation:label');
    expect(guardianField).to.exist;
    expect(guardianField.value).to.equal('Guardian');
  });
 
});