import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE } from "@/const";
import { LogOut, DollarSign, Ticket, Users, TrendingUp, TrendingDown } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [dateRange] = useState({ start: '', end: '' });

  const { data: incomeEntries = [], isLoading: loadingIncome } = trpc.income.list.useQuery({
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined,
  });

  const { data: ticketEntries = [], isLoading: loadingTickets } = trpc.ticket.list.useQuery({
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined,
  });

  const { data: users = [] } = trpc.users.list.useQuery();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const incomeAdd = incomeEntries
      .filter(e => e.type === 'Income Add')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const incomeMinus = incomeEntries
      .filter(e => e.type === 'Income Minus')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const otpAdd = incomeEntries
      .filter(e => e.type === 'OTP Add')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const otpMinus = incomeEntries
      .filter(e => e.type === 'OTP Minus')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncome = incomeAdd - incomeMinus;
    const totalOTP = otpAdd - otpMinus;

    return {
      totalIncome,
      totalOTP,
      totalTickets: ticketEntries.length,
      totalStaff: users.filter(u => u.role === 'user').length,
    };
  }, [incomeEntries, ticketEntries, users]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
            <ChangePasswordModal />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">QR {stats.totalIncome.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Net income balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total OTP</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">QR {stats.totalOTP.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Net OTP balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
              <Ticket className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalTickets}</div>
              <p className="text-xs text-gray-500 mt-1">Tickets issued</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Staff Members</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalStaff}</div>
              <p className="text-xs text-gray-500 mt-1">Active staff</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income">Income Entries</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Entries</TabsTrigger>
            <TabsTrigger value="staff">Staff Members</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingIncome ? (
                  <div className="text-center py-8">Loading...</div>
                ) : incomeEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No income entries found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Recipient</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incomeEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.time}</TableCell>
                            <TableCell>{entry.userName}</TableCell>
                            <TableCell>
                              <Badge variant={entry.type.includes('Add') ? 'default' : 'secondary'}>
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className={entry.type.includes('Add') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {entry.type.includes('Add') ? '+' : '-'}QR {entry.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                            <TableCell>{entry.recipient || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTickets ? (
                  <div className="text-center py-8">Loading...</div>
                ) : ticketEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No ticket entries found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead>Passenger</TableHead>
                          <TableHead>PNR</TableHead>
                          <TableHead>Flight</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Trip Type</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ticketEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.issueDate}</TableCell>
                            <TableCell>{entry.userName}</TableCell>
                            <TableCell>{entry.passengerName}</TableCell>
                            <TableCell className="font-mono text-sm">{entry.pnr}</TableCell>
                            <TableCell>{entry.flightName}</TableCell>
                            <TableCell>{entry.from} → {entry.to}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{entry.tripType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  entry.status === 'Confirmed' ? 'default' : 
                                  entry.status === 'Pending' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {entry.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Members</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No staff members found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Sign In</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                            <TableCell>{user.email || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleString() : 'Never'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
