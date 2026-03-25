"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { GripVerticalIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, PlusIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, SearchIcon } from "lucide-react"

import { supabase } from "../supabaseClient"

export const schema = z.object({
  id: z.number(),
  name: z.string(), 
  department: z.string(), 
  position: z.string(),
  salary: z.any(), 
  address: z.string(),
  email: z.string(),
})

type Employee = z.infer<typeof schema>

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function DraggableRow({ row }: { row: Row<Employee> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function AddEmployeeDrawer({ onDataChange }: { onDataChange: () => void }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    name: "", department: "", position: "", salary: "", address: "", email: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await supabase.from('employees').insert([formData])
    
    setIsLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Employee added successfully!")
      setIsOpen(false)
      onDataChange()
      setFormData({ name: "", department: "", position: "", salary: "", address: "", email: "" })
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add Employee</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] sm:h-full sm:w-[400px] mt-24">
        <DrawerHeader>
          <DrawerTitle>Add New Employee</DrawerTitle>
          <DrawerDescription>Fill in the details to add a new team member.</DrawerDescription>
        </DrawerHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Department</Label>
            <Input required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Position</Label>
            <Input required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Salary</Label>
            <Input required type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Address</Label>
            <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <DrawerFooter className="px-0 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Employee"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

function EditEmployeeDrawer({ item, onDataChange }: { item: Employee, onDataChange: () => void }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(item)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { id, ...updateData } = formData 
    const { error } = await supabase.from('employees').update(updateData).eq('id', item.id)
    
    setIsLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Employee updated!")
      setIsOpen(false)
      onDataChange()
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground font-semibold">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] sm:h-full sm:w-[400px] mt-24">
        <DrawerHeader>
          <DrawerTitle>Edit Employee</DrawerTitle>
          <DrawerDescription>Update details for {item.name}</DrawerDescription>
        </DrawerHeader>
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 px-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Department</Label>
            <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Position</Label>
            <Input value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Salary</Label>
            <Input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Address</Label>
            <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <DrawerFooter className="px-0 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Employee"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

export function DataTable({
  data: initialData,
  onDataChange,
}: {
  data: Employee[]
  onDataChange: () => void 
}) {
  const [data, setData] = React.useState(() => initialData)

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // --- NEW STATE FOR THE DELETE MODAL ---
  const [employeeToDelete, setEmployeeToDelete] = React.useState<number | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  // --------------------------------------

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // --- UPDATED DELETE FUNCTION ---
  const confirmDelete = async () => {
    if (employeeToDelete === null) return

    setIsDeleting(true)
    const { error } = await supabase.from('employees').delete().eq('id', employeeToDelete)
    setIsDeleting(false)

    if (error) {
      toast.error("Failed to delete employee.")
    } else {
      toast.success("Employee deleted.")
      setEmployeeToDelete(null) // Close the modal on success
      onDataChange()
    }
  }
  // -------------------------------

  const columns: ColumnDef<Employee>[] = React.useMemo(() => [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <EditEmployeeDrawer item={row.original} onDataChange={onDataChange} />,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">{row.original.id}</Badge>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">{row.original.department}</Badge>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">{row.original.position}</Badge>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">${row.original.salary}</Badge>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">{row.original.address}</Badge>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">{row.original.email}</Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 p-0">
              <EllipsisVerticalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.email)}>
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* UPDATED: We now just set the ID to trigger the modal instead of window.confirm */}
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10"
              onClick={() => setEmployeeToDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onDataChange])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 relative">
      
      {/* --- NEW DELETE CONFIRMATION MODAL --- */}
      {employeeToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md p-6 mx-4 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-semibold text-card-foreground">Are you absolutely sure?</h2>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete this employee from your database.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEmployeeToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Employee"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------- */}

      <div className="flex items-center justify-between px-4 lg:px-6 mb-2">
        <div className="flex items-center w-full max-w-sm relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8 w-full"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon className="mr-2 h-4 w-4" />
                Columns
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(val) => column.toggleVisibility(!!val)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <AddEmployeeDrawer onDataChange={onDataChange} />
        </div>
      </div>
      
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">Rows per page</Label>
              <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(val) => table.setPageSize(Number(val))}>
                <SelectTrigger size="sm" className="w-20"><SelectValue placeholder={table.getState().pagination.pageSize} /></SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeftIcon /></Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeftIcon /></Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRightIcon /></Button>
              <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRightIcon /></Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}