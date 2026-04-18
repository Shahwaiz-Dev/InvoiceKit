"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Plus, 
  User, 
  Mail, 
  MapPin, 
  Search, 
  Trash2, 
  Edit2, 
  Lock,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  taxId: string;
  website: string;
}

export default function CustomersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  const { data: usageData } = useQuery<{ canManageCustomers: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => fetch("/api/customers").then((r) => r.json()),
    enabled: !!session && usageData?.canManageCustomers,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Customer>) =>
      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setIsDialogOpen(false);
        setEditingCustomer(null);
        toast.success(editingCustomer?._id ? "Customer updated" : "Customer added");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/customers/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer removed");
    },
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCustomer({ name: "", email: "", address: "", phone: "", taxId: "", website: "" });
    setIsDialogOpen(true);
  };

  if (usageData && !usageData.canManageCustomers) {
    return (
      <>
        <DashboardHeader 
          title="Customers" 
          description="Manage your frequent clients and auto-fill their details."
        />
        <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-6">
            <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto border-2 border-amber-100">
               <Lock className="h-10 w-10 text-amber-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Authority Feature</h2>
                <p className="text-muted-foreground">
                  Customer management is exclusively available on the <strong>Authority</strong> plan. 
                  Upgrade now to build your client database.
                </p>
            </div>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 font-bold px-8">
                <Link href="/dashboard/settings">Upgrade to Authority</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader 
        title="Customers" 
        description="Manage your frequent clients and auto-fill their details."
      >
        <Button onClick={handleOpenAdd}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center gap-4 max-w-sm mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search name or email..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : filteredCustomers.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center py-24 text-center">
                 <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-muted-foreground" />
                 </div>
                 <h3 className="text-lg font-medium">No customers found</h3>
                 <p className="text-sm text-muted-foreground mb-6">
                    {search ? "Try a different search term" : "Add your first customer to get started"}
                 </p>
                 {!search && (
                    <Button variant="outline" onClick={handleOpenAdd}>
                        Add Customer
                    </Button>
                 )}
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                    <Card key={customer._id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-2">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <CardTitle className="text-base truncate max-w-[180px]">{customer.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(customer)}>
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if (confirm("Are you sure?")) deleteMutation.mutate(customer._id);
                                        }}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {customer.phone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="h-5 w-5 rounded bg-muted/30 flex items-center justify-center">📞</div>
                                    {customer.phone}
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5" />
                                    <span className="line-clamp-2">{customer.address}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer?._id ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. This customer will be available to select in the editor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        value={editingCustomer?.name || ""} 
                        onChange={(e) => setEditingCustomer(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email" 
                        type="email"
                        value={editingCustomer?.email || ""} 
                        onChange={(e) => setEditingCustomer(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        id="phone" 
                        value={editingCustomer?.phone || ""} 
                        onChange={(e) => setEditingCustomer(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+1 234 567"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT</Label>
                    <Input 
                        id="taxId" 
                        value={editingCustomer?.taxId || ""} 
                        onChange={(e) => setEditingCustomer(p => ({ ...p, taxId: e.target.value }))}
                        placeholder="US-12345"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                    id="address" 
                    rows={3}
                    value={editingCustomer?.address || ""} 
                    onChange={(e) => setEditingCustomer(p => ({ ...p, address: e.target.value }))}
                    placeholder="123 client street, city, country"
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(editingCustomer!)} disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCustomer?._id ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
