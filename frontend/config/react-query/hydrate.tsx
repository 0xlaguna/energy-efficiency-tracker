"use client"

import React from "react"
import {
  HydrationBoundary,
  HydrationBoundaryProps,
} from "@tanstack/react-query"

export default function Hydrate(props: HydrationBoundaryProps) {
  return <HydrationBoundary {...props} />
}
