import { useSamuelEventListenr } from "@/hooks/useSamuelEventListener";
import { getSamuelConfig, getSamuelContext, getSamuelUser } from "@/lib/utils";
import { useCallback } from "react";
import { TestFormDialog } from "./TestFormDialog";

export const FirstWidget = () => {
  // sample accessing samuel related config
  // this config can be used to some specific actions related to passed context, user etc.
  const config = getSamuelConfig();
  const user = getSamuelUser();
  const context = getSamuelContext();
  console.log({ config, user, context });

  // samuel event handler function
  const handleEvent = useCallback((eventData: any) => {
    // do something with the event data which is emitted along with the event from the workflow
    console.log(eventData);
  }, []);

  // listening to samuel events
  // here 'test-event' is emitted event from workflow change it accordingly.
  useSamuelEventListenr("test-event", handleEvent);

  return (
    <div className="bg-white w-full rounded-md h-full max-h-full flex flex-col overflow-hidden">
      {/* header */}
      <div className="h-12 flex items-center px-3 border-b">
        <p className="font-semibold text-foreground">First Custom Widget</p>
      </div>
      {/*  scrollable container */}
      <div className="p-4 flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <p className="text-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          perspiciatis commodi veritatis, neque velit eaque maiores, temporibus
          hic sit excepturi eligendi nostrum! Exercitationem quaerat incidunt
          debitis, optio modi sint quas.
        </p>
        <p className="text-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          perspiciatis commodi veritatis, neque velit eaque maiores, temporibus
          hic sit excepturi eligendi nostrum! Exercitationem quaerat incidunt
          debitis, optio modi sint quas.
        </p>
        <p className="text-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          perspiciatis commodi veritatis, neque velit eaque maiores, temporibus
          hic sit excepturi eligendi nostrum! Exercitationem quaerat incidunt
          debitis, optio modi sint quas.
        </p>
        <TestFormDialog />
      </div>
    </div>
  );
};
