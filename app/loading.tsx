import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container py-8">
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-xl">
          <Skeleton className="h-[500px] w-full" />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-10 w-3/4 mb-3" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="world">World</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="h-full overflow-hidden border-0 shadow-lg">
                <div className="relative w-full h-48 overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

