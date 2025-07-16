export default function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-card rounded-lg shadow-sm p-6 border">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-3">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">Total Users</dt>
              <dd>
                <div className="text-lg font-medium">1,482</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 border">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-3">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">Monthly Revenue</dt>
              <dd>
                <div className="text-lg font-medium">$8,294.32</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 border">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-3">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">Videos Processed</dt>
              <dd>
                <div className="text-lg font-medium">3,721</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 border">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-3">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">Active Subscriptions</dt>
              <dd>
                <div className="text-lg font-medium">247</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
