"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, Users } from "lucide-react"

export function SectionCards() {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 lg:px-6 mb-8">
      <Card className="flex-1">
        <CardHeader className="flex items-center justify-center pb-2 pt-6">
          <CardTitle className="text-center text-4xl font-bold tabular-nums text-white">
            150
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-center justify-center pb-6">
          <div className="text-lg flex items-center gap-2 font-medium text-gray-400">
            <Users className="h-5 w-5" />
            Total Employees
          </div>
        </CardFooter>
      </Card>

      <Card className="flex-1">
        <CardHeader className="flex items-center justify-center pb-2 pt-6">
          <CardTitle className="text-center text-4xl font-bold tabular-nums text-white">
            150,000
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-center justify-center pb-6">
          <div className="text-lg flex items-center gap-2 font-medium text-gray-400">
            <Users className="h-5 w-5" />
            Total Salary
          </div>
        </CardFooter>
      </Card>

      <Card className="flex-1">
        <CardHeader className="flex items-center justify-center pb-2 pt-6">
          <CardTitle className="text-center text-4xl font-bold tabular-nums text-white">
            10
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-center justify-center pb-6">
          <div className="text-lg flex items-center gap-2 font-medium text-gray-400">
            <Users className="h-5 w-5" />
            Total Departments
          </div>
        </CardFooter>
      </Card>

      <Card className="flex-1">
        <CardHeader className="flex items-center justify-center pb-2 pt-6">
          <CardTitle className="text-center text-4xl font-bold tabular-nums text-white">
            IT
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-center justify-center pb-6">
          <div className="text-lg flex items-center gap-2 font-medium text-gray-400">
            <Users className="h-5 w-5" />
            Largest Department
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
