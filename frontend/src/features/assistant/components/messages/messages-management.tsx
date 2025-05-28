import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageComposer } from "./message-composer"
import { MessagesList } from "./messages-list"

export function MessagesManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleMessageSent = () => {
    // Trigger a refresh of the messages list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des messages</h1>
      </div>

      <Tabs defaultValue="composer">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="composer">Nouveau message</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="mt-6 space-y-6">
          <MessageComposer onMessageSent={handleMessageSent} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <MessagesList refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
