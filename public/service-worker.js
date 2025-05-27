self.addEventListener('push', event => {
  const data = event.data.json()
  
  const options = {
    body: data.description,
    icon: '/notification-icon.png',
    badge: '/notification-badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id,
      url: data.url || '/dashboard/notifications'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', event => {
  const notification = event.notification
  const action = event.action
  const data = notification.data

  notification.close()

  if (action === 'close') return

  // Open the target URL when notification is clicked
  event.waitUntil(
    clients.openWindow(data.url)
  )
})

// Handle background sync for offline notifications
self.addEventListener('sync', event => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications())
  }
})

async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/sync')
    const notifications = await response.json()
    
    // Process any missed notifications
    notifications.forEach(notification => {
      self.registration.showNotification(notification.title, {
        body: notification.description,
        icon: '/notification-icon.png',
        badge: '/notification-badge.png',
      })
    })
  } catch (error) {
    console.error('Error syncing notifications:', error)
  }
} 