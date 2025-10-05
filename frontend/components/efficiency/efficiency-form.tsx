"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { EfficiencyFormData, PeriodFormData } from "@/types/v0/efficiency"
import useMutateEfficiency from "@/hooks/data/useMutateEfficiency"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const periodSchema = z.object({
  period: z.string().min(1, "Period name is required"),
  time_range: z.string().min(1, "Time range is required"),
  days: z.array(z.string()).min(1, "At least one day must be selected"),
  current_electric_kwh: z.number().min(0, "Must be positive"),
  current_gas_therms: z.number().min(0, "Must be positive"),
  baseline_electric_kwh: z.number().min(0, "Must be positive"),
  baseline_gas_therms: z.number().min(0, "Must be positive"),
  electric_rate: z.number().min(0, "Must be positive"),
  gas_rate: z.number().min(0, "Must be positive"),
})

const formSchema = z.object({
  building_id: z.string().min(1, "Building ID is required"),
  measure_name: z.string().min(1, "Measure name is required"),
  periods: z.array(periodSchema).min(1, "At least one period is required"),
})

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const PERIOD_OPTIONS = [
  { value: "business_hours", label: "Business Hours" },
  { value: "after_hours", label: "After Hours" },
  { value: "weekend", label: "Weekend" },
  { value: "peak_hours", label: "Peak Hours" },
  { value: "shoulder_hours", label: "Shoulder Hours" },
  { value: "off_peak", label: "Off Peak" },
]

const TIME_RANGE_OPTIONS = [
  "00:00-24:00",
  "06:00-18:00",
  "08:00-18:00",
  "18:00-08:00",
  "09:00-17:00",
  "22:00-06:00",
]

interface EfficiencyFormProps {
  onSuccess?: () => void
}

export default function EfficiencyForm({ onSuccess }: EfficiencyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const calculateEfficiency = useMutateEfficiency()

  const form = useForm<EfficiencyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      building_id: "",
      measure_name: "",
      periods: [
        {
          period: "business_hours",
          time_range: "08:00-18:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          current_electric_kwh: 0,
          current_gas_therms: 0,
          baseline_electric_kwh: 0,
          baseline_gas_therms: 0,
          electric_rate: 0,
          gas_rate: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "periods",
  })

  const onSubmit = async (data: EfficiencyFormData) => {
    setIsSubmitting(true)
    try {
      calculateEfficiency.mutateEfficiency(data)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Calculation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPeriod = () => {
    append({
      period: "business_hours",
      time_range: "08:00-18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      current_electric_kwh: 0,
      current_gas_therms: 0,
      baseline_electric_kwh: 0,
      baseline_gas_therms: 0,
      electric_rate: 0,
      gas_rate: 0,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Energy Efficiency</CardTitle>
        <CardDescription>
          Enter building data and period information to calculate efficiency
          metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Building Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="building_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 507f1f77bcf86cd799439011"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="measure_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measure Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Smart HVAC System Upgrade"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Periods */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Operational Periods</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPeriod}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Period {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`periods.${index}.period`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PERIOD_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`periods.${index}.time_range`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Range</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_RANGE_OPTIONS.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`periods.${index}.days`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Days of Week</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {DAYS_OF_WEEK.map((day) => (
                              <div
                                key={day}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${field.id}-${day}`}
                                  checked={form
                                    .watch(`periods.${index}.days`)
                                    .includes(day)}
                                  onCheckedChange={(checked) => {
                                    const currentDays = form.getValues(
                                      `periods.${index}.days`
                                    )
                                    if (checked) {
                                      form.setValue(`periods.${index}.days`, [
                                        ...currentDays,
                                        day,
                                      ])
                                    } else {
                                      form.setValue(
                                        `periods.${index}.days`,
                                        currentDays.filter((d) => d !== day)
                                      )
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`${field.id}-${day}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {day.slice(0, 3)}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">
                        Current Consumption
                      </h5>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.current_electric_kwh`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Electric (kWh)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`periods.${index}.current_gas_therms`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gas (Therms)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">
                        Baseline Consumption
                      </h5>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.baseline_electric_kwh`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Electric (kWh)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`periods.${index}.baseline_gas_therms`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gas (Therms)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name={`periods.${index}.electric_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Electric Rate ($/kWh)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`periods.${index}.gas_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gas Rate ($/Therm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Calculating..." : "Calculate Efficiency"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
