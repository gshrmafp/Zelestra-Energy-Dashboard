import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  owner: string;
  energyType: string;
  capacity: number;
  location: string;
  status: string;
  year: number;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: String, 
    required: true 
  },
  energyType: { 
    type: String, 
    required: true,
    enum: ['solar', 'wind', 'hydro', 'biomass', 'geothermal', 'other']
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['planning', 'in-progress', 'operational', 'decommissioned']
  },
  year: { 
    type: Number, 
    required: true 
  },
  latitude: { 
    type: Number 
  },
  longitude: { 
    type: Number 
  }
}, {
  timestamps: true
});

// Index for geospatial queries
ProjectSchema.index({ latitude: 1, longitude: 1 });

// Index for common queries
ProjectSchema.index({ energyType: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ location: 'text' });

export default mongoose.model<IProject>('Project', ProjectSchema);
