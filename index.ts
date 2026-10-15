export type UserRole = 'provider' | 'ngo' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  location: string;
  phone: string;
  pickupRadiusKm?: number;
  foodPreferences?: string[];
}

export type FoodCategory =
  | 'Cooked Meals'
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Packaged Meals'
  | 'Dairy & Dessert'
  | 'Beverages';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain Friendly';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ListingStatus =
  | 'active'
  | 'urgent'
  | 'accepted'
  | 'in_transit'
  | 'completed'
  | 'expired';

export interface Coordinates {
  x: number; // 0 to 100 on simulated grid
  y: number; // 0 to 100 on simulated grid
  lat?: number;
  lng?: number;
}

export interface FoodListing {
  id: string;
  title: string;
  category: FoodCategory;
  quantityMeals: number;
  weightKg: number;
  providerId: string;
  providerName: string;
  providerAddress: string;
  distanceKm: number;
  preparedTime: string;
  availableUntil: string;
  urgency: UrgencyLevel;
  status: ListingStatus;
  dietaryType: DietaryType;
  temperatureHandling: 'Hot (>60°C)' | 'Refrigerated (<4°C)' | 'Room Temp';
  pickupLocation: string;
  notes?: string;
  coordinates: Coordinates;
  acceptedByNgoId?: string;
  acceptedByNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  matchScore?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface NGO {
  id: string;
  name: string;
  type: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacityMealsDaily: number;
  currentDemandMeals: number;
  preferredDietary: DietaryType[];
  distanceKm: number;
  matchScore: number;
  reliabilityScore: number;
  imageUrl?: string;
  coordinates: Coordinates;
  activeOpportunitiesCount: number;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Two Wheeler' | 'Van' | 'Electric Cargo' | 'Car';
  status: 'available' | 'busy' | 'offline';
  completedPickups: number;
  impactScore: number;
  totalDistanceKm: number;
  coordinates: Coordinates;
}

export type PickupStatus = 'accepted' | 'assigned' | 'in_transit' | 'delivered';

export interface PickupRecord {
  id: string;
  listingId: string;
  foodTitle: string;
  quantityMeals: number;
  weightKg: number;
  providerName: string;
  providerAddress: string;
  ngoName: string;
  ngoAddress: string;
  volunteerName: string;
  volunteerPhone: string;
  status: PickupStatus;
  etaMinutes: number;
  distanceKm: number;
  createdAt: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  routeProgressPercent: number; // 0 to 100
  providerCoords: Coordinates;
  ngoCoords: Coordinates;
  courierCoords: Coordinates;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'accepted' | 'volunteer' | 'completed' | 'ai_insight';
  timestamp: string;
  read: boolean;
  targetView?: string;
}

export interface PredictionInput {
  foodType: string;
  mealType: string;
  mealsPrepared: number;
  expectedAttendance: number;
  day: string;
  eventType: string;
  historicalAverageConsumption: number;
  notes?: string;
}

export interface PredictionResult {
  source?: string;
  predictedConsumption: number;
  predictedSurplus: number;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  explanation: string;
  reductionRecommendationPercent: number;
  optimalPreparation?: number;
}

export interface AnalyticsTrendPoint {
  day: string;
  date: string;
  prepared: number;
  consumed: number;
  surplus: number;
  rescued: number;
}

export interface SurplusZone {
  name: string;
  zoneId: string;
  totalSurplusMeals: number;
  activeProviders: number;
  topCategory: string;
  rescueRatePercent: number;
}
