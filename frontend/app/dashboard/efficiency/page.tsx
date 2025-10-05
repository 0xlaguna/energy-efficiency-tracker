"use client"

import { useState } from "react"
import { BarChart3, Calculator, Search } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BuildingLookup from "@/components/efficiency/building-lookup"
import EfficiencyForm from "@/components/efficiency/efficiency-form"

const Page = () => {
  const [activeTab, setActiveTab] = useState("calculate")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Energy Efficiency Dashboard
        </h1>
        <p className="text-muted-foreground">
          Calculate energy efficiency metrics and analyze building performance
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculate" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </TabsTrigger>
          <TabsTrigger value="lookup" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Lookup
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculate" className="space-y-6">
          <EfficiencyForm />
        </TabsContent>

        <TabsContent value="lookup" className="space-y-6">
          <BuildingLookup />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Analytics Coming Soon
            </h3>
            <p className="text-muted-foreground">
              Advanced analytics and reporting features will be available here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
