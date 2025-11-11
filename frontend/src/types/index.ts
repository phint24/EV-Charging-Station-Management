export type ConnectorType = 'CCS' | 'CHADEMO' | 'AC_TYPE_2' | 'AC_TYPE_1';
export type SessionStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
export type ChargingPointStatus = 'AVAILABLE' | 'CHARGING' | 'RESERVED' | 'OFFLINE' | 'FAULTED';

export interface AuthResponse {
    token: string;
    email: string;
    role: 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';
}

export interface UserSummaryDto {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface VehicleDto {
    id: number;
    vehicleId: string;
    brand: string;
    model: string;
    batteryCapacity: number;
    connectorType: ConnectorType;
}

export interface CreateVehicleRequest {
    vehicleId: string;
    brand: string;
    model: string;
    batteryCapacity: number;
    connectorType: ConnectorType;
}

export interface EVDriverProfileDto {
    id: number;
    userAccount: UserSummaryDto;
    phoneNumber: string | null;
    walletBalance: number;
    vehicles: VehicleDto[];
}

export interface ChargeSessionDto {
    sessionId: number;
    driverId: number;
    vehicleId: number;
    chargingPointId: number;
    stationId: number;
    startTime: string;
    endTime: string | null;
    energyUsed: number;
    cost: number;
    status: SessionStatus;
}

export interface CreateSessionData {
    driverId: number;
    vehicleId: number;
    chargingPointId: number;
}

export interface StopSessionData {
    energyUsed: number;
}

export interface ChargingStationDto {
    stationId: number;
    name: string;
    location: string;
    status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE' | 'FAULTED';
    totalChargingPoint: number;
    availableChargers: number;
}

export interface ChargingPointDto {
    chargingPointId: number;
    stationId: number;
    type: ConnectorType;
    power: number;
    status: ChargingPointStatus;
}