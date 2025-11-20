import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_TITLE, APP_LOGO } from "@/const";
import { LogOut, DollarSign, Ticket, Users, TrendingUp, Search, Download } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/pdfInvoice";

export default function AdminDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const { data: incomeEntries = [], isLoading: loadingIncome } = trpc.income.getAll.useQuery();
  const { data: ticketEntries = [], isLoading: loadingTickets } = trpc.ticket.getAll.useQuery();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handlePNRClick = (pnr: string, flightName: string) => {
    const airline = flightName.toLowerCase();
    let url = '';

    if (airline.includes('qatar')) {
      url = `https://www.qatarairways.com/en/manage-booking.html?pnr=${pnr}`;
    } else if (airline.includes('emirates')) {
      url = `https://www.emirates.com/english/manage-booking/retrieve-booking.aspx?pnr=${pnr}`;
    } else if (airline.includes('etihad')) {
      url = `https://www.etihad.com/en/manage/retrieve-booking?pnr=${pnr}`;
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(flightName + ' manage booking ' + pnr)}`;
    }

    window.open(url, '_blank');
  };

  const handleDownloadInvoice = async () => {
    try {
      const staffName = selectedStaff === 'all' ? 'All Staff' : selectedStaff;
      const period = selectedMonth === 'all' 
        ? `${selectedYear}` 
        : `${selectedYear}-${selectedMonth}`;

      await generateInvoicePDF({
        staffName,
        period,
        incomeEntries: filteredIncomeEntries.map((entry: any) => ({
          date: new Date(entry.date).toLocaleDateString(),
          type: entry.type,
          description: entry.description || '',
          amount: entry.amount,
        })),
        ticketEntries: filteredTicketEntries.map((entry: any) => ({
          date: new Date(entry.issueDate).toLocaleDateString(),
          passengerName: entry.passengerName,
          pnr: entry.pnr,
          flightName: entry.flightName,
          from: entry.from,
          to: entry.to,
        })),
        totalIncome: filteredIncomeEntries.reduce((sum: number, entry: any) => 
          sum + (entry.type === 'income' ? entry.amount : 0), 0),
        totalOTP: filteredIncomeEntries.reduce((sum: number, entry: any) => 
          sum + (entry.type === 'otp' ? entry.amount : 0), 0),
        totalTickets: filteredTicketEntries.length,
      });
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  // Get unique staff names
  const staffNames = useMemo(() => {
    const names = new Set<string>();
    incomeEntries.forEach((entry: any) => names.add(entry.userName));
    ticketEntries.forEach((entry: any) => names.add(entry.userName));
    return Array.from(names).sort();
  }, [incomeEntries, ticketEntries]);

  // Filter entries by staff, year, and month
  const filteredIncomeEntries = useMemo(() => {
    return incomeEntries.filter((entry: any) => {
      if (selectedStaff !== "all" && entry.userName !== selectedStaff) return false;
      if (selectedYear !== "all" && !entry.date.startsWith(selectedYear)) return false;
      if (selectedMonth !== "all") {
        const entryMonth = entry.date.split('-')[1];
        if (entryMonth !== selectedMonth) return false;
      }
      return true;
    });
  }, [incomeEntries, selectedStaff, selectedYear, selectedMonth]);

  const filteredTicketEntries = useMemo(() => {
    let filtered = ticketEntries.filter((entry: any) => {
      if (selectedStaff !== "all" && entry.userName !== selectedStaff) return false;
      if (selectedYear !== "all" && !entry.issueDate.startsWith(selectedYear)) return false;
      if (selectedMonth !== "all") {
        const entryMonth = entry.issueDate.split('-')[1];
        if (entryMonth !== selectedMonth) return false;
      }
      return true;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ticket: any) =>
        ticket.passengerName.toLowerCase().includes(query) ||
        ticket.pnr.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [ticketEntries, selectedStaff, selectedYear, selectedMonth, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const incomeAdd = filteredIncomeEntries
      .filter((e: any) => e.type === 'Income Add')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const incomeMinus = filteredIncomeEntries
      .filter((e: any) => e.type === 'Income Minus' || e.type === 'Income Payment')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const otpAdd = filteredIncomeEntries
      .filter((e: any) => e.type === 'OTP Add')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const otpMinus = filteredIncomeEntries
      .filter((e: any) => e.type === 'OTP Minus' || e.type === 'OTP Payment')
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      totalIncome: incomeAdd - incomeMinus,
      totalOTP: otpAdd - otpMinus,
      totalTickets: filteredTicketEntries.length,
    };
  }, [filteredIncomeEntries, filteredTicketEntries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold text-white">AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES</h1>
              <p className="text-sm text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <ChangePasswordModal />
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Daily Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {stats.totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total OTP Cash</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {stats.totalOTP.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTickets}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Filter by Staff</label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Staff</SelectItem>
                    {staffNames.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Filter by Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Years</SelectItem>
                    {Array.from({ length: 26 }, (_, i) => 2025 + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Filter by Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                    <SelectItem value="05">May</SelectItem>
                    <SelectItem value="06">June</SelectItem>
                    <SelectItem value="07">July</SelectItem>
                    <SelectItem value="08">August</SelectItem>
                    <SelectItem value="09">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Actions</label>
                <Button onClick={handleDownloadInvoice} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="income" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Income/OTP</TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Ticket Sales</TabsTrigger>
          </TabsList>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Income & OTP Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300">Staff Name</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Time</TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Amount</TableHead>
                        <TableHead className="text-slate-300">Description</TableHead>
                        <TableHead className="text-slate-300">Recipient</TableHead>
                        <TableHead className="text-slate-300">Received From</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingIncome ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">Loading...</TableCell>
                        </TableRow>
                      ) : filteredIncomeEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">No entries found for the selected filters</TableCell>
                        </TableRow>
                      ) : (
                        filteredIncomeEntries.map((entry: any) => (
                          <TableRow key={entry.id} className="border-slate-700 hover:bg-slate-700/50">
                            <TableCell className="text-slate-200 font-medium">{entry.userName}</TableCell>
                            <TableCell className="text-slate-200">{entry.date}</TableCell>
                            <TableCell className="text-slate-200">{entry.time}</TableCell>
                            <TableCell>
                              <Badge variant={entry.type.includes('Add') ? 'default' : 'destructive'} className="bg-slate-700 text-white">
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-200 font-medium">QR {entry.amount}</TableCell>
                            <TableCell className="text-slate-200">{entry.description}</TableCell>
                            <TableCell className="text-slate-200">{entry.recipient || '-'}</TableCell>
                            <TableCell className="text-slate-200">{entry.receivedFrom || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Ticket Entries</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search by name or PNR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300">Staff Name</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Passenger</TableHead>
                        <TableHead className="text-slate-300">PNR</TableHead>
                        <TableHead className="text-slate-300">Flight</TableHead>
                        <TableHead className="text-slate-300">Route</TableHead>
                        <TableHead className="text-slate-300">Source</TableHead>
                        <TableHead className="text-slate-300">Ticket Copy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingTickets ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">Loading...</TableCell>
                        </TableRow>
                      ) : filteredTicketEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">
                            {searchQuery ? 'No tickets found matching your search' : 'No tickets found for the selected filters'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTicketEntries.map((ticket: any) => {
                          const isHighlighted = searchQuery && 
                            (ticket.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             ticket.pnr.toLowerCase().includes(searchQuery.toLowerCase()));
                          return (
                          <TableRow key={ticket.id} className={`border-slate-700 hover:bg-slate-700/50 transition-colors ${isHighlighted ? 'bg-yellow-900/40 border-yellow-600/50' : ''}`}>
                            <TableCell className="text-slate-200 font-medium">{ticket.userName}</TableCell>
                            <TableCell className="text-slate-200">{ticket.issueDate}</TableCell>
                            <TableCell className="text-slate-200">{ticket.passengerName}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => handlePNRClick(ticket.pnr, ticket.flightName)}
                                className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                              >
                                {ticket.pnr}
                              </button>
                            </TableCell>
                            <TableCell className="text-slate-200">{ticket.flightName}</TableCell>
                            <TableCell className="text-slate-200">{ticket.from} → {ticket.to}</TableCell>
                            <TableCell className="text-slate-200">{ticket.source || '-'}</TableCell>
                            <TableCell>
                              {ticket.ticketCopyUrl ? (
                                <a href={ticket.ticketCopyUrl} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </a>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )})
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
