import React, { useState, useEffect } from 'react';

const NotificationComponent = () => {
  const [notificationSupported, setNotificationSupported] = useState(
    'Notification' in window
  );
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const handleNotificationClick = () => {
    if (notificationPermission === 'granted') {
      if (currentNotification) {
        currentNotification.close();
      }
      const notification = new Notification('Hello, World!');
      setCurrentNotification(notification);

      setTimeout(() => {
        notification.close();
        setCurrentNotification(null);
      }, 3000); // close notification after 3 seconds
    } else if (notificationPermission !== 'denied') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          if (currentNotification) {
            currentNotification.close();
          }
          const notification = new Notification('Hello, World!');
          setCurrentNotification(notification);

          setTimeout(() => {
            notification.close();
            setCurrentNotification(null);
          }, 3000); // close notification after 3 seconds
        }
      });
    }
  };

  return (
    <div>
      {notificationSupported && (
        <button onClick={handleNotificationClick}>Show Notification</button>
      )}
      {!notificationSupported && (
        <p>Browser notifications are not supported in this browser.</p>
      )}
    </div>
  );
};

export default NotificationComponent;
