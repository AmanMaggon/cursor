const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  // Basic Information
  prescriptionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Participants
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  
  // Prescription Details
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  type: {
    type: String,
    enum: ['new', 'refill', 'emergency', 'follow_up'],
    default: 'new'
  },
  
  // Medical Information
  diagnosis: {
    primary: {
      type: String,
      required: true
    },
    secondary: [String],
    icd10Code: String,
    ayurvedicDiagnosis: {
      doshaImbalance: String,
      dhatuAffected: [String],
      malaAffected: [String],
      agniStatus: String,
      amaPresence: Boolean
    }
  },
  
  // Prescribed Medicines
  medicines: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      quantity: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        enum: ['mg', 'g', 'ml', 'drops', 'tablets', 'capsules', 'spoons'],
        required: true
      }
    },
    frequency: {
      type: String,
      required: true,
      enum: ['once_daily', 'twice_daily', 'thrice_daily', 'four_times_daily', 'as_needed', 'custom']
    },
    customFrequency: String,
    timing: {
      type: String,
      enum: ['before_meals', 'after_meals', 'with_meals', 'empty_stomach', 'bedtime', 'as_needed']
    },
    duration: {
      days: Number,
      weeks: Number,
      months: Number
    },
    totalQuantity: Number,
    instructions: String,
    sideEffects: [String],
    contraindications: [String],
    isRefillable: {
      type: Boolean,
      default: true
    },
    maxRefills: {
      type: Number,
      default: 3
    },
    refillsUsed: {
      type: Number,
      default: 0
    }
  }],
  
  // Ayurvedic Treatments
  ayurvedicTreatments: [{
    treatment: {
      type: String,
      enum: [
        'Abhyanga',
        'Shirodhara',
        'Pizhichil',
        'Kizhi',
        'Udvartana',
        'Vamana',
        'Virechana',
        'Basti',
        'Nasya',
        'Raktamokshana'
      ]
    },
    duration: String,
    frequency: String,
    instructions: String,
    precautions: [String]
  }],
  
  // Lifestyle Recommendations
  lifestyle: {
    diet: {
      recommended: [String],
      avoided: [String],
      timing: String,
      quantity: String
    },
    exercise: {
      type: String,
      duration: String,
      frequency: String,
      precautions: [String]
    },
    sleep: {
      timing: String,
      duration: String,
      recommendations: [String]
    },
    stressManagement: [String],
    otherRecommendations: [String]
  },
  
  // Follow-up Instructions
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: Date,
    purpose: String,
    tests: [{
      name: String,
      purpose: String,
      instructions: String
    }]
  },
  
  // Emergency Instructions
  emergencyInstructions: {
    whenToContact: [String],
    emergencySymptoms: [String],
    emergencyContact: String
  },
  
  // Digital Signature
  digitalSignature: {
    doctorSignature: String,
    timestamp: Date,
    hash: String,
    certificate: String
  },
  
  // Status and Tracking
  status: {
    type: String,
    enum: ['draft', 'issued', 'dispensed', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Dispensing Information
  dispensing: {
    chemist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chemist'
    },
    dispensedAt: Date,
    dispensedMedicines: [{
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      quantity: Number,
      batchNumber: String,
      expiryDate: Date,
      price: Number
    }],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial']
    }
  },
  
  // Patient Adherence
  adherence: {
    medicinesTaken: [{
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      date: Date,
      taken: Boolean,
      notes: String
    }],
    overallAdherence: {
      type: Number,
      min: 0,
      max: 100
    },
    lastUpdated: Date
  },
  
  // Government Compliance
  compliance: {
    ndhmRecorded: {
      type: Boolean,
      default: false
    },
    ndhmId: String,
    ayushReported: {
      type: Boolean,
      default: false
    },
    dataRetentionPeriod: {
      type: Number,
      default: 7 // years
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total medicines count
prescriptionSchema.virtual('totalMedicines').get(function() {
  return this.medicines.length;
});

// Virtual for is expired
prescriptionSchema.virtual('isExpired').get(function() {
  if (!this.medicines.length) return false;
  
  const maxDuration = Math.max(...this.medicines.map(med => {
    const duration = med.duration.days || (med.duration.weeks * 7) || (med.duration.months * 30);
    return duration;
  }));
  
  const expiryDate = new Date(this.date);
  expiryDate.setDate(expiryDate.getDate() + maxDuration);
  
  return new Date() > expiryDate;
});

// Virtual for can be refilled
prescriptionSchema.virtual('canBeRefilled').get(function() {
  return this.medicines.some(med => 
    med.isRefillable && med.refillsUsed < med.maxRefills
  );
});

// Index for better performance
prescriptionSchema.index({ patient: 1, date: -1 });
prescriptionSchema.index({ doctor: 1, date: -1 });
prescriptionSchema.index({ prescriptionId: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ 'dispensing.chemist': 1 });

// Pre-save middleware to generate prescription ID
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.prescriptionId = `RX${year}${month}${day}${random}`;
  }
  this.updatedAt = new Date();
  next();
});

// Method to calculate total quantity for a medicine
prescriptionSchema.methods.calculateTotalQuantity = function(medicineIndex) {
  const medicine = this.medicines[medicineIndex];
  if (!medicine) return 0;
  
  const frequencyMap = {
    'once_daily': 1,
    'twice_daily': 2,
    'thrice_daily': 3,
    'four_times_daily': 4,
    'as_needed': 1,
    'custom': 1
  };
  
  const dailyDoses = frequencyMap[medicine.frequency] || 1;
  const duration = medicine.duration.days || 
                  (medicine.duration.weeks * 7) || 
                  (medicine.duration.months * 30) || 1;
  
  return dailyDoses * duration * medicine.dosage.quantity;
};

// Method to add medicine to prescription
prescriptionSchema.methods.addMedicine = function(medicineData) {
  const totalQuantity = this.calculateTotalQuantity(this.medicines.length);
  medicineData.totalQuantity = totalQuantity;
  this.medicines.push(medicineData);
  return this.save();
};

// Method to issue prescription
prescriptionSchema.methods.issue = function(doctorSignature) {
  this.status = 'issued';
  this.digitalSignature = {
    doctorSignature,
    timestamp: new Date(),
    hash: this.generateHash(),
    certificate: 'AyurSutra Digital Certificate'
  };
  return this.save();
};

// Method to generate hash for digital signature
prescriptionSchema.methods.generateHash = function() {
  const crypto = require('crypto');
  const data = JSON.stringify({
    prescriptionId: this.prescriptionId,
    patient: this.patient,
    doctor: this.doctor,
    date: this.date,
    medicines: this.medicines
  });
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Method to check medicine adherence
prescriptionSchema.methods.calculateAdherence = function() {
  if (!this.adherence.medicinesTaken.length) return 0;
  
  const totalDoses = this.adherence.medicinesTaken.length;
  const takenDoses = this.adherence.medicinesTaken.filter(dose => dose.taken).length;
  
  this.adherence.overallAdherence = Math.round((takenDoses / totalDoses) * 100);
  this.adherence.lastUpdated = new Date();
  
  return this.adherence.overallAdherence;
};

module.exports = mongoose.model('Prescription', prescriptionSchema);