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
import { APP_TITLE, APP_LOGO } from "@/const";
import { LogOut, Plus, DollarSign, Ticket as TicketIcon, TrendingUp, Search, Edit, Trash2, Download, Upload } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/pdfInvoice";

export default function StaffDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [editIncomeId, setEditIncomeId] = useState<number | null>(null);
  const [editTicketId, setEditTicketId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketFile, setTicketFile] = useState<File | null>(null);

  const { data: incomeEntries = [], isLoading: loadingIncome } = trpc.income.getMy.useQuery();
  const { data: ticketEntries = [], isLoading: loadingTickets } = trpc.ticket.getMy.useQuery();

  const createIncomeMutation = trpc.income.create.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      toast.success('Income entry added successfully');
      setIncomeDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add income entry');
    },
  });

  const updateIncomeMutation = trpc.income.update.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      toast.success('Income entry updated successfully');
      setIncomeDialogOpen(false);
      setEditIncomeId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update income entry');
    },
  });

  const deleteIncomeMutation = trpc.income.delete.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      toast.success('Income entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete income entry');
    },
  });

  const uploadTicketCopyMutation = trpc.ticket.uploadTicketCopy.useMutation();

  const createTicketMutation = trpc.ticket.create.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      toast.success('Ticket entry added successfully');
      setTicketDialogOpen(false);
      setTicketFile(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add ticket entry');
    },
  });

  const updateTicketMutation = trpc.ticket.update.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      toast.success('Ticket entry updated successfully');
      setTicketDialogOpen(false);
      setEditTicketId(null);
      setTicketFile(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket entry');
    },
  });

  const deleteTicketMutation = trpc.ticket.delete.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      toast.success('Ticket entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ticket entry');
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

  const handleDownloadInvoice = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const period = `${currentYear}`;

      await generateInvoicePDF({
        staffName: user?.name || 'Staff',
        period,
        incomeEntries: incomeEntries.map((entry: any) => ({
          date: new Date(entry.date).toLocaleDateString(),
          type: entry.type,
          description: entry.description || '',
          amount: entry.amount,
        })),
        ticketEntries: ticketEntries.map((entry: any) => ({
          date: new Date(entry.issueDate).toLocaleDateString(),
          passengerName: entry.passengerName,
          pnr: entry.pnr,
          flightName: entry.flightName,
          from: entry.from,
          to: entry.to,
        })),
        totalIncome: stats.totalIncome,
        totalOTP: stats.totalOTP,
        totalTickets: stats.totalTickets,
      });
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketFile(e.target.files[0]);
    }
  };

  const uploadFile = async (): Promise<{ url: string; fileName: string } | null> => {
    if (!ticketFile) return null;

    try {
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(ticketFile);
      });

      const result = await uploadTicketCopyMutation.mutateAsync({
        fileName: ticketFile.name,
        fileData,
        mimeType: ticketFile.type,
      });

      return result;
    } catch (error) {
      toast.error('Failed to upload file');
      return null;
    }
  };

  const handleIncomeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as any,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      recipient: formData.get('recipient') as string || undefined,
      receivedFrom: formData.get('receivedFrom') as string || undefined,
    };

    if (editIncomeId) {
      updateIncomeMutation.mutate({ id: editIncomeId, ...data });
    } else {
      createIncomeMutation.mutate(data);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let ticketCopyUrl: string | undefined;
    let ticketCopyFileName: string | undefined;

    if (ticketFile) {
      const uploadResult = await uploadFile();
      if (uploadResult) {
        ticketCopyUrl = uploadResult.url;
        ticketCopyFileName = uploadResult.fileName;
      }
    }

    const data = {
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
      source: formData.get('source') as string || undefined,
      bdNumber: formData.get('bdNumber') as string || undefined,
      qrNumber: formData.get('qrNumber') as string || undefined,
      ticketCopyUrl,
      ticketCopyFileName,
      status: formData.get('status') as any || 'Pending',
    };

    if (editTicketId) {
      updateTicketMutation.mutate({ id: editTicketId, ...data });
    } else {
      createTicketMutation.mutate(data);
    }
  };

  const handleEditIncome = (entry: any) => {
    setEditIncomeId(entry.id);
    setIncomeDialogOpen(true);
  };

  const handleEditTicket = (entry: any) => {
    setEditTicketId(entry.id);
    setTicketDialogOpen(true);
  };

  const handleDeleteIncome = (id: number) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      deleteIncomeMutation.mutate({ id });
    }
  };

  const handleDeleteTicket = (id: number) => {
    if (confirm('Are you sure you want to delete this ticket entry?')) {
      deleteTicketMutation.mutate({ id });
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

  // Calculate statistics
  const stats = useMemo(() => {
    const incomeAdd = incomeEntries
      .filter((e: any) => e.type === 'Income Add')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const incomeMinus = incomeEntries
      .filter((e: any) => e.type === 'Income Minus' || e.type === 'Income Payment')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const otpAdd = incomeEntries
      .filter((e: any) => e.type === 'OTP Add')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const otpMinus = incomeEntries
      .filter((e: any) => e.type === 'OTP Minus' || e.type === 'OTP Payment')
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    return {
      totalIncome: incomeAdd - incomeMinus,
      totalOTP: otpAdd - otpMinus,
      totalTickets: ticketEntries.length,
    };
  }, [incomeEntries, ticketEntries]);

  // Filter tickets by search query
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return ticketEntries;
    
    const query = searchQuery.toLowerCase();
    return ticketEntries.filter((ticket: any) =>
      ticket.passengerName.toLowerCase().includes(query) ||
      ticket.pnr.toLowerCase().includes(query)
    );
  }, [ticketEntries, searchQuery]);

  const editingIncome = editIncomeId ? incomeEntries.find((e: any) => e.id === editIncomeId) : null;
  const editingTicket = editTicketId ? ticketEntries.find((e: any) => e.id === editTicketId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold text-white">AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES</h1>
              <p className="text-sm text-slate-400">Staff Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">Staff Member</p>
            </div>
            <Button onClick={handleDownloadInvoice} variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-900/20">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
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
              <CardTitle className="text-sm font-medium text-slate-300">My Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {stats.totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">My OTP</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {stats.totalOTP.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">My Tickets</CardTitle>
              <TicketIcon className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTickets}</div>
            </CardContent>
          </Card>
        </div>

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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Income & OTP Entries</CardTitle>
                  <Dialog open={incomeDialogOpen} onOpenChange={(open) => {
                    setIncomeDialogOpen(open);
                    if (!open) setEditIncomeId(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>{editIncomeId ? 'Edit' : 'Add'} Income Entry</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleIncomeSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date" className="text-slate-300">Date</Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              defaultValue={editingIncome?.date || new Date().toISOString().split('T')[0]}
                              required
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="time" className="text-slate-300">Time</Label>
                            <Input
                              id="time"
                              name="time"
                              type="time"
                              defaultValue={editingIncome?.time || new Date().toLocaleTimeString('en-GB', { hour12: false })}
                              required
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="type" className="text-slate-300">Type</Label>
                          <Select name="type" defaultValue={editingIncome?.type || "Income Add"} required>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
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
                          <Label htmlFor="amount" className="text-slate-300">Amount (QR)</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={editingIncome?.amount || ''}
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-slate-300">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={editingIncome?.description || ''}
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="recipient" className="text-slate-300">Recipient (Optional)</Label>
                          <Input
                            id="recipient"
                            name="recipient"
                            defaultValue={editingIncome?.recipient || ''}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="receivedFrom" className="text-slate-300">Received From (Optional)</Label>
                          <Input
                            id="receivedFrom"
                            name="receivedFrom"
                            defaultValue={editingIncome?.receivedFrom || ''}
                            placeholder="Who gave you this money?"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={createIncomeMutation.isPending || updateIncomeMutation.isPending}>
                          {editIncomeId ? 'Update' : 'Add'} Entry
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Time</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingIncome ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-400">Loading...</TableCell>
                      </TableRow>
                    ) : incomeEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-400">No entries found</TableCell>
                      </TableRow>
                    ) : (
                      incomeEntries.map((entry: any) => (
                        <TableRow key={entry.id} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="text-slate-200">{entry.date}</TableCell>
                          <TableCell className="text-slate-200">{entry.time}</TableCell>
                          <TableCell>
                            <Badge variant={entry.type.includes('Add') ? 'default' : 'destructive'} className="bg-slate-700 text-white">
                              {entry.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-200">QR {entry.amount}</TableCell>
                          <TableCell className="text-slate-200">{entry.description}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditIncome(entry)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteIncome(entry.id)} className="border-red-600 text-red-400 hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Ticket Entries</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search by name or PNR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white w-64"
                      />
                    </div>
                    <Dialog open={ticketDialogOpen} onOpenChange={(open) => {
                      setTicketDialogOpen(open);
                      if (!open) {
                        setEditTicketId(null);
                        setTicketFile(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Ticket
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>{editTicketId ? 'Edit' : 'Add'} Ticket Entry</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleTicketSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="issueDate" className="text-slate-300">Issue Date</Label>
                              <Input
                                id="issueDate"
                                name="issueDate"
                                type="date"
                                defaultValue={editingTicket?.issueDate || new Date().toISOString().split('T')[0]}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="passengerName" className="text-slate-300">Passenger Name</Label>
                              <Input
                                id="passengerName"
                                name="passengerName"
                                defaultValue={editingTicket?.passengerName || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="pnr" className="text-slate-300">PNR</Label>
                              <Input
                                id="pnr"
                                name="pnr"
                                defaultValue={editingTicket?.pnr || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="tripType" className="text-slate-300">Trip Type</Label>
                              <Select name="tripType" defaultValue={editingTicket?.tripType || "1 Way"} required>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="1 Way">1 Way</SelectItem>
                                  <SelectItem value="Return">Return</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="flightName" className="text-slate-300">Flight Name</Label>
                            <Input
                              id="flightName"
                              name="flightName"
                              defaultValue={editingTicket?.flightName || ''}
                              required
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="from" className="text-slate-300">From</Label>
                              <Input
                                id="from"
                                name="from"
                                defaultValue={editingTicket?.from || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="to" className="text-slate-300">To</Label>
                              <Input
                                id="to"
                                name="to"
                                defaultValue={editingTicket?.to || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="departureDate" className="text-slate-300">Departure Date</Label>
                              <Input
                                id="departureDate"
                                name="departureDate"
                                type="date"
                                defaultValue={editingTicket?.departureDate || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="arrivalDate" className="text-slate-300">Arrival Date</Label>
                              <Input
                                id="arrivalDate"
                                name="arrivalDate"
                                type="date"
                                defaultValue={editingTicket?.arrivalDate || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="returnDate" className="text-slate-300">Return Date (Optional)</Label>
                            <Input
                              id="returnDate"
                              name="returnDate"
                              type="date"
                              defaultValue={editingTicket?.returnDate || ''}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="fromIssuer" className="text-slate-300">From Issuer</Label>
                              <Input
                                id="fromIssuer"
                                name="fromIssuer"
                                defaultValue={editingTicket?.fromIssuer || ''}
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="source" className="text-slate-300">Source (Agency)</Label>
                              <Input
                                id="source"
                                name="source"
                                defaultValue={editingTicket?.source || ''}
                                placeholder="Where did you purchase this ticket?"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bdNumber" className="text-slate-300">BD Number (Optional)</Label>
                              <Input
                                id="bdNumber"
                                name="bdNumber"
                                defaultValue={editingTicket?.bdNumber || ''}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="qrNumber" className="text-slate-300">QR Number (Optional)</Label>
                              <Input
                                id="qrNumber"
                                name="qrNumber"
                                defaultValue={editingTicket?.qrNumber || ''}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="ticketFile" className="text-slate-300">Ticket Copy (PDF/PNG/Image)</Label>
                            <Input
                              id="ticketFile"
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleFileChange}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            {ticketFile && (
                              <p className="mt-2 text-sm text-green-400">Selected: {ticketFile.name}</p>
                            )}
                            {editingTicket?.ticketCopyFileName && !ticketFile && (
                              <p className="mt-2 text-sm text-slate-400">Current: {editingTicket.ticketCopyFileName}</p>
                            )}
                          </div>

                          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={createTicketMutation.isPending || updateTicketMutation.isPending}>
                            {editTicketId ? 'Update' : 'Add'} Ticket
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Passenger</TableHead>
                        <TableHead className="text-slate-300">PNR</TableHead>
                        <TableHead className="text-slate-300">Flight</TableHead>
                        <TableHead className="text-slate-300">Route</TableHead>
                        <TableHead className="text-slate-300">Source</TableHead>
                        <TableHead className="text-slate-300">Ticket Copy</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingTickets ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">Loading...</TableCell>
                        </TableRow>
                      ) : filteredTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">
                            {searchQuery ? 'No tickets found matching your search' : 'No tickets found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTickets.map((ticket: any) => {
                          const isHighlighted = searchQuery && 
                            (ticket.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             ticket.pnr.toLowerCase().includes(searchQuery.toLowerCase()));
                          return (
                          <TableRow key={ticket.id} className={`border-slate-700 hover:bg-slate-700/50 transition-colors ${isHighlighted ? 'bg-yellow-900/40 border-yellow-600/50' : ''}`}>
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
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditTicket(ticket)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteTicket(ticket.id)} className="border-red-600 text-red-400 hover:bg-red-900/20">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
