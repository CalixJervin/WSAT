import { UsersIcon, WalletIcon, BuildingIcon, AwardIcon } from "lucide-react"

interface SectionCardsProps {
  employees?: any[] 
}

export function SectionCards({ employees = [] }: SectionCardsProps) {
  
  // 1. Total Employees
  const totalEmployees = employees.length

  // 2. Total Salary
  const totalSalary = employees.reduce((sum, emp) => {
    return sum + (Number(emp.salary) || 0)
  }, 0)
  
  const formattedSalary = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0, 
  }).format(totalSalary)

  // 3. Total Departments
  const uniqueDepartments = new Set(
    employees.map((emp) => emp.department).filter(Boolean)
  ).size

  // 4. Largest Department
  const departmentCounts = employees.reduce((acc: Record<string, number>, emp) => {
    const dept = emp.department
    if (dept) {
      acc[dept] = (acc[dept] || 0) + 1
    }
    return acc
  }, {})

  let largestDepartment = "None"
  let maxCount = 0
  for (const [dept, count] of Object.entries(departmentCounts)) {
    if (count > maxCount) {
      largestDepartment = dept
      maxCount = count
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-4xl font-bold">{totalEmployees}</div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <UsersIcon className="h-4 w-4" />
          Total Employees
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-4xl font-bold">{formattedSalary}</div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <WalletIcon className="h-4 w-4" />
          Total Salary
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-4xl font-bold">{uniqueDepartments}</div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <BuildingIcon className="h-4 w-4" />
          Total Departments
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-4xl font-bold truncate max-w-full px-4" title={largestDepartment}>
          {largestDepartment}
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <AwardIcon className="h-4 w-4" />
          Largest Department
        </div>
      </div>
    </div>
  )
}