// // notificationcontext.tsx
// import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
// import * as Notifications from "expo-notifications";
// import registerForPushNotificationsAsync from "./notification";

// interface NotificationContextType {
//   expoPushToken: string | null;
//   notification: Notifications.Notification | null;
//   error: Error | null;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotification must be used within a NotificationProvider");
//   }
//   return context;
// };

// interface NotificationProviderProps {
//   children: ReactNode;
// }

// export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//   const [notification, setNotification] = useState<Notifications.Notification | null>(null);
//   const [error, setError] = useState<Error | null>(null);

//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     registerForPushNotificationsAsync()
//       .then(setExpoPushToken)
//       .catch(setError);

//     notificationListener.current = Notifications.addNotificationReceivedListener(setNotification);

//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log("User tapped on notification:", response);
//     });

//     return () => {
//       notificationListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };
