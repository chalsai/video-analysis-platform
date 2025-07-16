import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminDashboardStats from "@/components/admin/admin-dashboard-stats"
import AdminRecentActivity from "@/components/admin/admin-recent-activity"
import AdminRevenueChart from "@/components/admin/admin-revenue-chart"

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AdminDashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRevenueChart />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="mb-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">View All Users</h3>
                    <p className="text-sm text-muted-foreground">Manage user accounts</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Add New User</h3>
                    <p className="text-sm text-muted-foreground">Create a new user account</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">User Reports</h3>
                    <p className="text-sm text-muted-foreground">View user activity reports</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subscriptions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Manage Plans</h3>
                    <p className="text-sm text-muted-foreground">Edit subscription plans</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">User Subscriptions</h3>
                    <p className="text-sm text-muted-foreground">View and modify user subscriptions</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Subscription Analytics</h3>
                    <p className="text-sm text-muted-foreground">View subscription metrics</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payments">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Payment History</h3>
                    <p className="text-sm text-muted-foreground">View all transactions</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Payment Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure payment providers</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Invoices</h3>
                    <p className="text-sm text-muted-foreground">Manage and generate invoices</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">All Videos</h3>
                    <p className="text-sm text-muted-foreground">Browse all uploaded videos</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Processing Queue</h3>
                    <p className="text-sm text-muted-foreground">Manage video processing</p>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer">
                    <h3 className="font-medium">Storage Usage</h3>
                    <p className="text-sm text-muted-foreground">Monitor storage metrics</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
