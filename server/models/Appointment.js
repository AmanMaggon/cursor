const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Basic Information
  appointmentId: {
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
  
  // Appointment Details
  type: {
    type: String,
    enum: ['consultation', 'follow_up', 'panchakarma', 'emergency'],
    required: true
  },
  category: {
    type: String,
    enum: ['online', 'offline', 'home_visit'],
    required: true
  },
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30, // in minutes
    required: true
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['clinic', 'online', 'home'],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    meetingLink: String, // for online consultations
    instructions: String
  },
  
  // Status and Flow
  status: {
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled'
    ],
    default: 'scheduled'
  },
  
  // Consultation Details
  consultation: {
    chiefComplaint: String,
    symptoms: [String],
    duration: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    },
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
      bmi: Number
    },
    examination: {
      general: String,
      systemic: String,
      ayurvedic: {
        prakriti: String,
        vikriti: String,
        doshaImbalance: String,
        agni: String,
        ama: String
      }
    },
    diagnosis: String,
    treatmentPlan: String,
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date,
    notes: String
  },
  
  // Panchakarma Specific
  panchakarma: {
    therapy: {
      type: String,
      enum: [
        'Vamana',
        'Virechana',
        'Basti',
        'Nasya',
        'Raktamokshana',
        'Abhyanga',
        'Shirodhara',
        'Pizhichil',
        'Kizhi',
        'Udvartana'
      ]
    },
    duration: Number, // in days
    sessions: [{
      date: Date,
      time: String,
      therapist: String,
      notes: String,
      completed: {
        type: Boolean,
        default: false
      }
    }],
    preTherapyPreparation: String,
    postTherapyCare: String,
    contraindications: [String]
  },
  
  // Payment Information
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['online', 'cash', 'upi', 'card']
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundReason: String
  },
  
  // Prescription
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  
  // Reminders and Notifications
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push']
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    }
  }],
  
  // Cancellation/Rescheduling
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'system']
    },
    reason: String,
    cancelledAt: Date,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  },
  
  rescheduling: {
    originalDate: Date,
    originalTime: String,
    rescheduledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin']
    },
    reason: String,
    rescheduledAt: Date
  },
  
  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date,
    isPublic: {
      type: Boolean,
      default: false
    }
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

// Virtual for appointment date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  return new Date(`${this.scheduledDate.toDateString()} ${this.scheduledTime}`);
});

// Virtual for is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.appointmentDateTime;
});

// Virtual for is past
appointmentSchema.virtual('isPast').get(function() {
  return new Date() > this.appointmentDateTime;
});

// Virtual for can be cancelled
appointmentSchema.virtual('canBeCancelled').get(function() {
  const now = new Date();
  const appointmentTime = this.appointmentDateTime;
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' || this.status === 'confirmed' && hoursUntilAppointment > 2;
});

// Index for better performance
appointmentSchema.index({ patient: 1, scheduledDate: -1 });
appointmentSchema.index({ doctor: 1, scheduledDate: -1 });
appointmentSchema.index({ appointmentId: 1 });
appointmentSchema.index({ status: 1, scheduledDate: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ createdAt: -1 });

// Pre-save middleware to generate appointment ID
appointmentSchema.pre('save', async function(next) {
  if (!this.appointmentId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.appointmentId = `APT${year}${month}${day}${random}`;
  }
  this.updatedAt = new Date();
  next();
});

// Method to calculate BMI
appointmentSchema.methods.calculateBMI = function() {
  if (this.consultation.vitalSigns.weight && this.consultation.vitalSigns.height) {
    const weight = this.consultation.vitalSigns.weight;
    const height = this.consultation.vitalSigns.height / 100; // convert cm to m
    this.consultation.vitalSigns.bmi = Math.round((weight / (height * height)) * 10) / 10;
  }
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentTime = this.appointmentDateTime;
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return (this.status === 'scheduled' || this.status === 'confirmed') && 
         hoursUntilAppointment > 4; // Can reschedule if more than 4 hours before
};

// Method to cancel appointment
appointmentSchema.methods.cancel = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledBy,
    reason,
    cancelledAt: new Date()
  };
  return this.save();
};

// Method to reschedule appointment
appointmentSchema.methods.reschedule = function(newDate, newTime, rescheduledBy, reason) {
  this.rescheduling = {
    originalDate: this.scheduledDate,
    originalTime: this.scheduledTime,
    rescheduledBy,
    reason,
    rescheduledAt: new Date()
  };
  
  this.scheduledDate = newDate;
  this.scheduledTime = newTime;
  this.status = 'scheduled';
  
  return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema);