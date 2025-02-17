import { type FC } from "react"

const IndexPopup: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold">Dev Detector</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main content goes here */}
        </div>
      </main>
    </div>
  )
}

export default IndexPopup
