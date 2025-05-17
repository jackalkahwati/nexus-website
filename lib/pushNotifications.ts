const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY || ''

export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js')
    console.log('Service Worker registered')

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })

    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return true
  } catch (error) {
    console.error('Error registering push notifications:', error)
    return false
  }
}

export async function unregisterPushNotifications() {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error('Error unregistering push notifications:', error)
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
} 