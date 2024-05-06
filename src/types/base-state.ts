export interface PendingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

export interface BaseState {
  pending: PendingState;
  errors: ErrorState;
}