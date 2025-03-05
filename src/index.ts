import "./index.css";
import { registerWidgetAsWebComponent } from "./lib/utils";
import { EmailActions } from "./widgets/emailActions";
import { EmailContent } from "./widgets/emailContent";
import { EmailsList } from "./widgets/emailsList";
import { FirstWidget } from "./widgets/firstWidget";

// all widgets to be exported as web components. tag should be unique
const widgets = [
  {
    tag: "first-widget",
    component: FirstWidget,
  },
  {
    tag: "emails-list",
    component: EmailsList,
  },
  {
    tag: "email-details",
    component: EmailContent,
  },
  {
    tag: "email-actions",
    component: EmailActions,
  },
];

// Register the widgets as a web components
widgets.forEach(registerWidgetAsWebComponent);
