export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertState {
  type: AlertType;
  title: string;
  message: string;
}