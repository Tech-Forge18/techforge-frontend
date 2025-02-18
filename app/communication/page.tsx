import { MainLayout } from "@/components/layout/main-layout"
import { InternalChat } from "@/components/communication/internal-chat"
import { AnnouncementsFeed } from "@/components/communication/announcements-feed"

export default function CommunicationPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Communication</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InternalChat />
          <AnnouncementsFeed />
        </div>
      </div>
    </MainLayout>
  )
}

