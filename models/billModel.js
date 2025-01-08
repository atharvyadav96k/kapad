const mongoose = require('mongoose');

const getFinancialYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return currentDate >= new Date(year, 3, 1) ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

const itemSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId},
  partyName: { type: String},
  chalanNo: { type: Number },
  baleNo: { type: Number },
  date: { type: Date, default: Date.now },
  year: { type: String, default: getFinancialYear },
  products: [
    {
      name: String,
      remark: String,
      quality: [
        {
          size: Number,
          count: Number
        }
      ]
    }
  ]
});


itemSchema.index({ chalanNo: 1, year: 1 }, { unique: true });
itemSchema.index({ baleNo: 1, year: 1 }, { unique: true });

itemSchema.pre('save', async function (next) {
  const financialYear = getFinancialYear();

  // Ensure the year is correctly set for the new entry
  if (!this.year || this.year !== financialYear) {
    this.year = financialYear;
  }

  // Generate chalanNo
  if (!this.chalanNo) {
    const lastChalan = await this.constructor.findOne({ year: financialYear }).sort({ chalanNo: -1 });
    this.chalanNo = lastChalan ? lastChalan.chalanNo + 1 : 1;
  }

  // Generate baleNo
  if (!this.baleNo) {
    const lastBale = await this.constructor.findOne({ year: financialYear }).sort({ baleNo: -1 });
    this.baleNo = lastBale ? lastBale.baleNo + 1 : 1;
  }

  next();
});

module.exports = mongoose.model('Bills', itemSchema);
