const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    index: true
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  
  // Ayurvedic Classification
  ayurvedicClassification: {
    category: {
      type: String,
      enum: [
        'Rasayana',
        'Vajikarana',
        'Kayachikitsa',
        'Panchakarma',
        'Shalya Tantra',
        'Shalakya Tantra',
        'Prasuti Tantra',
        'Kaumarabhritya',
        'Agada Tantra'
      ]
    },
    guna: [{
      type: String,
      enum: ['guru', 'laghu', 'mridu', 'tikshna', 'sara', 'sthira', 'snigdha', 'ruksha', 'ushna', 'shita']
    }],
    rasa: [{
      type: String,
      enum: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya']
    }],
    virya: {
      type: String,
      enum: ['ushna', 'shita']
    },
    vipaka: {
      type: String,
      enum: ['madhura', 'amla', 'katu']
    },
    doshaEffect: {
      vata: {
        type: String,
        enum: ['increases', 'decreases', 'neutral']
      },
      pitta: {
        type: String,
        enum: ['increases', 'decreases', 'neutral']
      },
      kapha: {
        type: String,
        enum: ['increases', 'decreases', 'neutral']
      }
    }
  },
  
  // Composition
  composition: {
    primaryIngredients: [{
      name: String,
      quantity: String,
      percentage: Number
    }],
    secondaryIngredients: [{
      name: String,
      quantity: String,
      percentage: Number
    }],
    excipients: [String],
    preservatives: [String]
  },
  
  // Form and Dosage
  form: {
    type: String,
    enum: [
      'tablet',
      'capsule',
      'syrup',
      'powder',
      'oil',
      'paste',
      'decoction',
      'ghee',
      'jam',
      'pills',
      'drops',
      'injection'
    ],
    required: true
  },
  strength: {
    value: Number,
    unit: {
      type: String,
      enum: ['mg', 'g', 'ml', 'drops', 'percentage']
    }
  },
  packSize: {
    quantity: Number,
    unit: String
  },
  
  // Therapeutic Information
  therapeuticUses: [String],
  indications: [String],
  contraindications: [String],
  sideEffects: [String],
  drugInteractions: [{
    medicine: String,
    interaction: String,
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major']
    }
  }],
  
  // Dosage Information
  dosage: {
    adult: {
      min: Number,
      max: Number,
      unit: String,
      frequency: String,
      duration: String
    },
    pediatric: {
      min: Number,
      max: Number,
      unit: String,
      frequency: String,
      duration: String,
      ageGroup: String
    },
    geriatric: {
      min: Number,
      max: Number,
      unit: String,
      frequency: String,
      duration: String
    }
  },
  
  // Storage and Handling
  storage: {
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit']
      }
    },
    humidity: {
      min: Number,
      max: Number,
      unit: String
    },
    lightSensitive: {
      type: Boolean,
      default: false
    },
    specialInstructions: [String]
  },
  
  // Manufacturing Information
  manufacturer: {
    name: {
      type: String,
      required: true
    },
    license: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    contact: {
      phone: String,
      email: String,
      website: String
    }
  },
  
  // Regulatory Information
  regulatory: {
    drugLicense: String,
    ayushLicense: String,
    fssaiLicense: String,
    gmpCertificate: String,
    ndcNumber: String,
    schedule: {
      type: String,
      enum: ['H', 'H1', 'X', 'G', 'S']
    },
    prescriptionRequired: {
      type: Boolean,
      default: true
    }
  },
  
  // Pricing
  pricing: {
    mrp: {
      type: Number,
      required: true
    },
    costPrice: Number,
    sellingPrice: Number,
    discount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    stock: {
      quantity: Number,
      unit: String,
      lowStockThreshold: {
        type: Number,
        default: 10
      }
    },
    suppliers: [{
      name: String,
      contact: String,
      leadTime: Number, // in days
      minimumOrder: Number
    }]
  },
  
  // Images and Documents
  images: [{
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['primary', 'secondary', 'packaging', 'ingredients']
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['leaflet', 'certificate', 'license', 'test_report']
    }
  }],
  
  // Reviews and Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Government Integration
  governmentData: {
    ndhmId: String,
    ayushId: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    lastUpdated: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'pending_approval'],
    default: 'pending_approval'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Virtual for full name with strength
medicineSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.strength.value}${this.strength.unit}`;
});

// Virtual for is low stock
medicineSchema.virtual('isLowStock').get(function() {
  return this.availability.stock.quantity <= this.availability.stock.lowStockThreshold;
});

// Virtual for is out of stock
medicineSchema.virtual('isOutOfStock').get(function() {
  return this.availability.stock.quantity <= 0;
});

// Index for better performance
medicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text' });
medicineSchema.index({ 'ayurvedicClassification.category': 1 });
medicineSchema.index({ 'manufacturer.name': 1 });
medicineSchema.index({ status: 1, isActive: 1 });
medicineSchema.index({ 'pricing.mrp': 1 });
medicineSchema.index({ 'availability.isAvailable': 1 });

// Pre-save middleware to update timestamps
medicineSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update stock
medicineSchema.methods.updateStock = function(quantity, operation = 'add') {
  if (operation === 'add') {
    this.availability.stock.quantity += quantity;
  } else if (operation === 'subtract') {
    this.availability.stock.quantity = Math.max(0, this.availability.stock.quantity - quantity);
  } else if (operation === 'set') {
    this.availability.stock.quantity = quantity;
  }
  
  // Update availability status
  this.availability.isAvailable = this.availability.stock.quantity > 0;
  
  return this.save();
};

// Method to add review
medicineSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    date: new Date()
  });
  
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
  
  return this.save();
};

// Method to check drug interaction
medicineSchema.methods.checkInteraction = function(otherMedicine) {
  return this.drugInteractions.find(interaction => 
    interaction.medicine.toLowerCase().includes(otherMedicine.name.toLowerCase()) ||
    otherMedicine.name.toLowerCase().includes(interaction.medicine.toLowerCase())
  );
};

// Method to get dosage for age group
medicineSchema.methods.getDosageForAge = function(age) {
  if (age < 18) {
    return this.dosage.pediatric;
  } else if (age > 65) {
    return this.dosage.geriatric;
  } else {
    return this.dosage.adult;
  }
};

// Static method to search medicines
medicineSchema.statics.searchMedicines = function(query, filters = {}) {
  const searchQuery = {
    $and: [
      { isActive: true },
      { status: 'active' }
    ]
  };
  
  if (query) {
    searchQuery.$and.push({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } },
        { brandName: { $regex: query, $options: 'i' } },
        { therapeuticUses: { $in: [new RegExp(query, 'i')] } }
      ]
    });
  }
  
  if (filters.category) {
    searchQuery.$and.push({
      'ayurvedicClassification.category': filters.category
    });
  }
  
  if (filters.form) {
    searchQuery.$and.push({
      form: filters.form
    });
  }
  
  if (filters.minPrice || filters.maxPrice) {
    const priceFilter = {};
    if (filters.minPrice) priceFilter.$gte = filters.minPrice;
    if (filters.maxPrice) priceFilter.$lte = filters.maxPrice;
    searchQuery.$and.push({
      'pricing.mrp': priceFilter
    });
  }
  
  return this.find(searchQuery).sort({ averageRating: -1, name: 1 });
};

module.exports = mongoose.model('Medicine', medicineSchema);