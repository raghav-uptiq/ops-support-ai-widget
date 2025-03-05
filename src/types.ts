export type EmailPriority = "low" | "medium" | "high" | "urgent";

export type EmailStatus = "Processing" | "Completed" | "Failed";

export type ActionType =
  | "acknowledgment"
  | "response"
  | "whatsapp_alert"
  | "api_call";

export interface EmailRequest {
  _id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  text: string;
  html: string;
  timestamp: string;
  priority: EmailPriority;
  status: EmailStatus;
  kind: "urgent" | "qna" | "actionRequired" | "none";
  actions: (EmailAction | APICallAction | WhatsAppAlertAction)[];
}

export interface EmailAction {
  type: "acknowledgmentEmail" | "response";
  timestamp: string;
  description?: string;
  email: {
    to: string;
    subject: string;
    heading: string;
    body: string;
  };
}

export interface APICallAction {
  type: "apiCall";
  timestamp: string;
  description?: string;
  apiCall: {
    endpoint: string;
    result: "Error" | "Success";
    error?: string;
    response?: any;
  };
}

export interface WhatsAppAlertAction {
  type: "sendToWhatsappSupport";
  description?: string;
  timestamp: string;
  message: { content: string };
}

export interface Action1 {
  id: string;
  requestId: string;
  type: ActionType;
  description: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  metadata?: Record<string, any>;
}

export type Action = EmailAction | APICallAction | WhatsAppAlertAction;
