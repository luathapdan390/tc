export interface TransactionPayload {
  lydo: string;
  thu: number;
  chi: number;
}

export interface GASResponse {
  result: string;
  // Add other properties if your specific GAS script returns them
  [key: string]: any;
}

export enum Tab {
  MANUAL = 'MANUAL',
  AI = 'AI',
  HISTORY = 'HISTORY'
}

export interface LoggedTransaction extends TransactionPayload {
  id: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
}