export interface BusinessAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

export interface BusinessContact {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tiktok?: string;
    };
}

export interface BusinessSettings {
    timezone: string;
    currency: string;
    language: string;
    defaultAppointmentDuration: number;
    bufferTimeBetweenAppointments: number;
}

export interface BusinessHours {
    day: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breaks?: Array<{ openTime: string; closeTime: string }>;
}

export interface Business {
    _id: string;
    businessName: string;
    subdomain: string;
    businessDescription?: string;
    businessType: string;
    logo?: string;
    images?: string[];
    address: BusinessAddress;
    contact: BusinessContact;
    settings: BusinessSettings;
    businessHours: BusinessHours[];
}
