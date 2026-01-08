export const getUnreadNotificationCount = (notifications) => {
  const lastSeenId = Number(
    localStorage.getItem("lastSeenNotificationId") || 0
  );

  return notifications.filter((n) => n.id > lastSeenId).length;
};
