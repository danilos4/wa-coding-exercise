export interface Lead {
    id: string;
    name: string;
    phoneNumber: string;
    zipCode: string;
    hasCommunicationPermission: boolean;
    email?: string;
    createdAt: Date;
  }