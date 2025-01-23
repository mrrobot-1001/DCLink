"use client"
import Dashboard from "../../components/Dashboard"
import withAuth from "../../hoc/withAuth"

function DashboardPage() {
  return <Dashboard />
}

export default withAuth(DashboardPage)

