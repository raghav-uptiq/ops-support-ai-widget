import { EmailRequest } from "@/types";
import { ActionItem } from "./ActionItem";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { getSamuelConfig, getSamuelUser } from "@/lib/utils";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSamuelEventListenr } from "@/hooks/useSamuelEventListener";

export const EmailActions = () => {
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

  // Sort actions by timestamp, newest first
  const sortedActions = [...(email?.actions || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="h-full overflow-y-auto" style={{ maxHeight: "100%" }}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-xs">
            Request received:{" "}
            {email
              ? format(new Date(email.timestamp), "MMM d, yyyy 'at' h:mm a")
              : "-"}
          </span>
        </div>

        {sortedActions.length === 0 ? (
          <div className="text-center p-6 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">No actions taken yet</p>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-medium mb-3">Actions Taken</h3>
            {sortedActions.map((action) => (
              <ActionItem key={action.timestamp} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
