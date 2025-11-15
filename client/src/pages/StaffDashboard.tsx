import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE } from "@/const";
import { LogOut, Plus, DollarSign, Ticket as TicketIcon, TrendingUp } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  const { data: incomeEntries = [], isLoading: loadingIncome } = trpc.income.getMy.useQuery();
  const { data: ticketEntries = [], isLoading: loadingTickets } = trpc.ticket.getMy.useQuery();

  const createIncomeMutation = trpc.income.create.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      toast.success('Income entry added successfully');
      setIncomeDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add income entry');
    },
  });

  const createTicketMutation = trpc.ticket.create.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      toast.success('Ticket entry added successfully');
      setTicketDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add ticket entry');
    },
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleIncomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createIncomeMutation.mutate({
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as any,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      recipient: formData.get('recipient') as string || undefined,
    });
  };

  const handleTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTicketMutation.mutate({
      issueDate: formData.get('issueDate') as string,
      passengerName: formData.get('passengerName') as string,
      pnr: formData.get('pnr') as string,
      tripType: formData.get('tripType') as any,
      flightName: formData.get('flightName') as string,
      from: formData.get('from') as string,
      to: formData.get('to') as string,
      departureDate: formData.get('departureDate') as string,
      arrivalDate: formData.get('arrivalDate') as string,
      returnDate: formData.get('returnDate') as string || undefined,
      fromIssuer: formData.get('fromIssuer') as string,
      bdNumber: formData.get('bdNumber') as string || undefined,
      qrNumber: formData.get('qrNumber') as string || undefined,
    });
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

    return {
      totalIncome: incomeAdd - incomeMinus,
      totalOTP: otpAdd - otpMinus,
      totalTickets: ticketEntries.length,
    };
  }, [incomeEntries, ticketEntries]);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
            <p className="text-sm text-gray-600">Staff Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">Staff Member</p>
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My Income</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">QR {stats.totalIncome.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Net income balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My OTP</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">QR {stats.totalOTP.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Net OTP balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My Tickets</CardTitle>
              <TicketIcon className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalTickets}</div>
              <p className="text-xs text-gray-500 mt-1">Tickets issued</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Income Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Income Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleIncomeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" defaultValue={today} required />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" defaultValue={now} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income Add">Income Add</SelectItem>
                      <SelectItem value="Income Minus">Income Minus</SelectItem>
                      <SelectItem value="Income Payment">Income Payment</SelectItem>
                      <SelectItem value="OTP Add">OTP Add</SelectItem>
                      <SelectItem value="OTP Minus">OTP Minus</SelectItem>
                      <SelectItem value="OTP Payment">OTP Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" min="0" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="recipient">Recipient (Optional)</Label>
                  <Input id="recipient" name="recipient" />
                </div>
                <Button type="submit" className="w-full" disabled={createIncomeMutation.isPending}>
                  {createIncomeMutation.isPending ? 'Adding...' : 'Add Entry'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Ticket Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" name="issueDate" type="date" defaultValue={today} required />
                  </div>
                  <div>
                    <Label htmlFor="passengerName">Passenger Name</Label>
                    <Input id="passengerName" name="passengerName" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pnr">PNR</Label>
                    <Input id="pnr" name="pnr" required />
                  </div>
                  <div>
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select name="tripType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Way">1 Way</SelectItem>
                        <SelectItem value="Return">Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="flightName">Flight Name</Label>
                  <Input id="flightName" name="flightName" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from">From</Label>
                    <Input id="from" name="from" required />
                  </div>
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input id="to" name="to" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <Input id="departureDate" name="departureDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                    <Input id="arrivalDate" name="arrivalDate" type="date" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="returnDate">Return Date (Optional)</Label>
                  <Input id="returnDate" name="returnDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="fromIssuer">From Issuer</Label>
                  <Input id="fromIssuer" name="fromIssuer" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bdNumber">BD Number (Optional)</Label>
                    <Input id="bdNumber" name="bdNumber" />
                  </div>
                  <div>
                    <Label htmlFor="qrNumber">QR Number (Optional)</Label>
                    <Input id="qrNumber" name="qrNumber" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createTicketMutation.isPending}>
                  {createTicketMutation.isPending ? 'Adding...' : 'Add Ticket'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income">My Income Entries</TabsTrigger>
            <TabsTrigger value="tickets">My Ticket Entries</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
}
