// Sample data for EV Charging Station Management System

export interface Port {
  id: string;
  type: 'CCS' | 'CHAdeMO' | 'Type2' | 'Tesla';
  status: 'available' | 'occupied' | 'offline';
  power: number; // kW
}

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance?: number; // km
  status: 'online' | 'offline' | 'maintenance';
  ports: Port[];
  pricePerKwh: number;
  amenities: string[];
  rating: number;
  totalPorts: number;
  availablePorts: number;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  portId: string;
  portType: string;
  startTime: string;
  endTime?: string;
  soc: number; // State of Charge %
  kWhUsed: number;
  cost: number;
  timeRemaining?: number; // minutes
  status: 'active' | 'completed' | 'cancelled';
}

export interface Transaction {
  id: string;
  date: string;
  stationName: string;
  type: 'charging' | 'wallet_topup' | 'subscription';
  amount: number;
  kWh?: number;
  duration?: number; // minutes
  paymentMethod: 'wallet' | 'card' | 'bank';
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'staff' | 'admin';
  phone: string;
  walletBalance: number;
  vehicleModel?: string;
  batteryCapacity?: number;
  subscriptionPlan?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  discountPercentage: number;
}

// Sample Stations
export const sampleStations: Station[] = [
  {
    id: 'st-001',
    name: 'Central Plaza Charging Hub',
    lat: 10.7769,
    lng: 106.7009,
    address: '123 Nguyen Hue, District 1, HCMC',
    distance: 1.2,
    status: 'online',
    ports: [
      { id: 'p1', type: 'CCS', status: 'available', power: 150 },
      { id: 'p2', type: 'CCS', status: 'occupied', power: 150 },
      { id: 'p3', type: 'CHAdeMO', status: 'available', power: 100 },
      { id: 'p4', type: 'Type2', status: 'available', power: 22 },
    ],
    pricePerKwh: 4500,
    amenities: ['WiFi', 'Coffee Shop', 'Restroom', 'Parking'],
    rating: 4.8,
    totalPorts: 4,
    availablePorts: 3,
  },
  {
    id: 'st-002',
    name: 'Vincom Mega Mall Station',
    lat: 10.7812,
    lng: 106.6958,
    address: '72 Le Thanh Ton, District 1, HCMC',
    distance: 2.5,
    status: 'online',
    ports: [
      { id: 'p1', type: 'CCS', status: 'occupied', power: 200 },
      { id: 'p2', type: 'CCS', status: 'occupied', power: 200 },
      { id: 'p3', type: 'Tesla', status: 'available', power: 250 },
      { id: 'p4', type: 'Type2', status: 'available', power: 22 },
      { id: 'p5', type: 'Type2', status: 'offline', power: 22 },
    ],
    pricePerKwh: 5000,
    amenities: ['Shopping Mall', 'Restaurant', 'Cinema'],
    rating: 4.6,
    totalPorts: 5,
    availablePorts: 2,
  },
  {
    id: 'st-003',
    name: 'Airport Express Charging',
    lat: 10.8184,
    lng: 106.6580,
    address: 'Tan Son Nhat Airport, HCMC',
    distance: 8.3,
    status: 'online',
    ports: [
      { id: 'p1', type: 'CCS', status: 'available', power: 350 },
      { id: 'p2', type: 'CCS', status: 'available', power: 350 },
      { id: 'p3', type: 'CHAdeMO', status: 'available', power: 150 },
    ],
    pricePerKwh: 5500,
    amenities: ['24/7 Service', 'Convenience Store'],
    rating: 4.9,
    totalPorts: 3,
    availablePorts: 3,
  },
  {
    id: 'st-004',
    name: 'Tech Park Station',
    lat: 10.8006,
    lng: 106.7183,
    address: '123 Quang Trung, District 12, HCMC',
    distance: 5.7,
    status: 'maintenance',
    ports: [
      { id: 'p1', type: 'Type2', status: 'offline', power: 22 },
      { id: 'p2', type: 'Type2', status: 'offline', power: 22 },
    ],
    pricePerKwh: 4000,
    amenities: ['Covered Parking'],
    rating: 4.2,
    totalPorts: 2,
    availablePorts: 0,
  },
];

// Sample Current User
export const currentUser: User = {
  id: 'user-001',
  name: 'Nguyen Van A',
  email: 'nguyenvana@email.com',
  role: 'driver',
  phone: '+84 901 234 567',
  walletBalance: 450000,
  vehicleModel: 'VinFast VF8',
  batteryCapacity: 87.7,
  subscriptionPlan: 'Premium',
};

// Sample Charging Session
export const activeSession: ChargingSession = {
  id: 'ses-001',
  stationId: 'st-001',
  stationName: 'Central Plaza Charging Hub',
  portId: 'p2',
  portType: 'CCS',
  startTime: '2025-10-24T14:30:00',
  soc: 67,
  kWhUsed: 32.5,
  cost: 146250,
  timeRemaining: 18,
  status: 'active',
};

// Sample Transactions
export const sampleTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2025-10-24T14:30:00',
    stationName: 'Central Plaza Charging Hub',
    type: 'charging',
    amount: 146250,
    kWh: 32.5,
    duration: 45,
    paymentMethod: 'wallet',
    status: 'completed',
  },
  {
    id: 'tx-002',
    date: '2025-10-23T09:15:00',
    stationName: 'Vincom Mega Mall Station',
    type: 'charging',
    amount: 225000,
    kWh: 45,
    duration: 60,
    paymentMethod: 'card',
    status: 'completed',
  },
  {
    id: 'tx-003',
    date: '2025-10-22T16:20:00',
    stationName: 'Wallet Top-up',
    type: 'wallet_topup',
    amount: 500000,
    paymentMethod: 'bank',
    status: 'completed',
  },
  {
    id: 'tx-004',
    date: '2025-10-20T11:00:00',
    stationName: 'Airport Express Charging',
    type: 'charging',
    amount: 192500,
    kWh: 35,
    duration: 40,
    paymentMethod: 'wallet',
    status: 'completed',
  },
  {
    id: 'tx-005',
    date: '2025-10-01T00:00:00',
    stationName: 'Premium Subscription',
    type: 'subscription',
    amount: 299000,
    paymentMethod: 'card',
    status: 'completed',
  },
];

// Sample Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-001',
    name: 'Basic',
    price: 0,
    duration: 'Free',
    benefits: ['Standard charging rates', 'Basic support'],
    discountPercentage: 0,
  },
  {
    id: 'plan-002',
    name: 'Premium',
    price: 299000,
    duration: 'Monthly',
    benefits: [
      '10% discount on all charges',
      'Priority booking',
      '24/7 support',
      'Free parking at stations',
    ],
    discountPercentage: 10,
  },
  {
    id: 'plan-003',
    name: 'Business',
    price: 799000,
    duration: 'Monthly',
    benefits: [
      '20% discount on all charges',
      'Priority booking',
      'Dedicated account manager',
      'Fleet management tools',
      'Monthly reports',
    ],
    discountPercentage: 20,
  },
];

// Sample Analytics Data for Admin
export const revenueByStation = [
  { station: 'Central Plaza', revenue: 45600000, sessions: 1245 },
  { station: 'Vincom Mega', revenue: 38900000, sessions: 987 },
  { station: 'Airport Express', revenue: 52300000, sessions: 1456 },
  { station: 'Tech Park', revenue: 21400000, sessions: 543 },
];

export const utilizationByHour = [
  { hour: '00:00', utilization: 12 },
  { hour: '03:00', utilization: 8 },
  { hour: '06:00', utilization: 35 },
  { hour: '09:00', utilization: 68 },
  { hour: '12:00', utilization: 82 },
  { hour: '15:00', utilization: 75 },
  { hour: '18:00', utilization: 91 },
  { hour: '21:00', utilization: 58 },
];
