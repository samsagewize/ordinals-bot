
export interface Collection {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  floorPrice: number;
  holders: number;
  blockchain: 'Solana' | 'Ethereum' | 'Polygon';
}

export interface VerificationRule {
  id: string;
  roleName: string;
  roleColor: string;
  condition: string;
  requirement: number;
  collectionId: string;
}

export interface DashboardStats {
  totalVerified: number;
  activeUsers: number;
  totalRolesAssigned: number;
  revenueGenerated: number;
}

export type View = 'dashboard' | 'collections' | 'roles' | 'security' | 'ai-assistant';
