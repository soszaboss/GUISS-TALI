import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationComposer } from "./notification-composer"
import { NotificationsList } from "./notifications-list"

export function NotificationsManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleNotificationSent = () => {
    // Trigger a refresh of the notifications list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications aux patients</h1>
      </div>

      <Tabs defaultValue="composer">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="composer">Nouvelle notification</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="mt-6 space-y-6">
          <NotificationComposer onNotificationSent={handleNotificationSent} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <NotificationsList refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
