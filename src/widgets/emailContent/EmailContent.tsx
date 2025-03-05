import { EmailRequest } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Mail } from "lucide-react";
import { useSamuelEventListenr } from "@/hooks/useSamuelEventListener";
import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";
import { getSamuelConfig, getSamuelUser } from "@/lib/utils";
import axios from "axios";

export const EmailContent = () => {
  const [email, setEmail] = useState<EmailRequest | undefined>();

  const handleRunWorkflow = async (taskInputs?: any) => {
    const executionId = uuid();
    const { uid } = getSamuelUser();
    const { appId, serverUrl, widgetKey } = getSamuelConfig();

    const workflowId = taskInputs?.workflowId;
    if (!workflowId) throw new Error("workflowId is required");

    const response = await axios.post(
      `${serverUrl}/workflow-defs/run-sync`,
      { executionId, uid, integrationId: workflowId, appId, taskInputs },
      { headers: { widgetKey, appid: appId } }
    );
    console.log(response.data);
    return response.data;
  };

  const handleEvent = useCallback((eventData: { ticketId: string }) => {
    async function fetchEmailDetails() {
      const response = await handleRunWorkflow({
        workflowId: "get-details-for-email-request-8289",
        data: { ticketId: eventData.ticketId },
      });
      setEmail(response.data);
    }
    fetchEmailDetails();
  }, []);

  useSamuelEventListenr("email-selected", handleEvent);

  const formattedDate = email
    ? format(new Date(email.timestamp), "EEEE, MMMM d, yyyy 'at' h:mm a")
    : undefined;

  return (
    <div className="p-6 border-b animate-fade-in">
      {!email ? (
        <div className="text-center text-muted-foreground">
          No Email Selected
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold">{email?.subject}</h2>
            {email?.kind === "urgent" && (
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-1 h-6 rounded-full",
                  "bg-red-50 text-red-600"
                )}
              >
                <span className="capitalize">Urgent Priority</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg">
            <Avatar className="h-10 w-10 border bg-muted">
              <User className="h-5 w-5" />
            </Avatar>

            <div>
              <div className="font-medium">{email?.fromName}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {email?.fromEmail}
              </div>
            </div>
          </div>

          <div className="mt-2 bg-white p-4 rounded-lg border text-gray-800">
            <p className="whitespace-pre-line">{email?.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};
