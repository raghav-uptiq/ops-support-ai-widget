import {
  Mail,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RotateCw,
  MessageSquare,
} from "lucide-react";
import { EmailPriority, EmailStatus } from "./types";

export const getPriorityIcon = (priority: EmailPriority) => {
  switch (priority) {
    case "urgent":
      return Clock;
    default:
      return Mail;
  }
};

export const getStatusIcon = (status: EmailStatus) => {
  switch (status) {
    case "Processing":
      return RotateCw;
    case "Completed":
      return CheckCircle2;
    case "Failed":
      return AlertTriangle;
    default:
      return Mail;
  }
};

export const getActionIcon = (type: string) => {
  switch (type) {
    case "acknowledgmentEmail":
      return Mail;
    case "response":
      return MessageSquare;
    case "sendToWhatsappSupport":
      return AlertTriangle;
    case "apiCall":
      return RotateCw;
    default:
      return Mail;
  }
};
