"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Phone,
  UserPlus,
  Users,
  Sparkles,
  ArrowUpRight,
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

interface CustomersViewProps {
  initialCustomers: Customer[];
  initialUsage: { canManageCustomers: boolean };
}

export function CustomersView({ initialCustomers, initialUsage }: CustomersViewProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  const { data: usageData = initialUsage } = useQuery<{ canManageCustomers: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    initialData: initialUsage,
    enabled: !!session,
  });

  const { data: customers = initialCustomers, isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => fetch("/api/customers").then((r) => r.json()),
    initialData: initialCustomers,
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
      <div className="bg-[#fcfdfe] min-h-screen">
        <DashboardHeader 
          title="Customers" 
          description="Client directory with auto-fill capabilities."
        />
        <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-6 border border-[#e1e9f0] bg-white rounded-2xl p-8 shadow-none">
            <div className="h-14 w-14 rounded-2xl bg-[#f5f3ff] flex items-center justify-center mx-auto border border-[#e1e9f0] text-[#0f77ff]">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5f3ff] text-[#0f77ff] border border-[#e1e9f0]">
                <Sparkles className="h-3.5 w-3.5" />
                Pro & Authority Feature
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#091135]">Client Observatory Database</h2>
              <p className="text-xs text-[#36394a] leading-relaxed">
                Maintain reusable customer directories, automatically calculate custom tax IDs, and auto-populate invoice templates in one click.
              </p>
            </div>
            <Button asChild size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium px-6 h-9 text-xs rounded-lg shadow-sm">
              <Link href="/dashboard/subscription" className="inline-flex items-center gap-1.5">
                Upgrade to Pro Plan
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdfe] min-h-screen w-full flex flex-col flex-1">
      <DashboardHeader 
        title="Customers" 
        description="Manage recurring clients and speed up invoice generation."
      >
        <Button onClick={handleOpenAdd} size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium text-xs h-9 px-3.5 shadow-sm">
          <UserPlus className="mr-1.5 h-4 w-4" />
          Add Customer
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-8 pt-6 w-full">
        <div className="flex items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
            <Input 
              placeholder="Search by client name or email..." 
              className="pl-9 bg-white border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading && customers.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-[#0f77ff]" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 bg-white border border-[#e1e9f0] rounded-xl">
            <div className="w-12 h-12 bg-[#f5f3ff] rounded-xl border border-[#e1e9f0] flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-[#0f77ff]" />
            </div>
            <h3 className="text-base font-semibold text-[#091135]">No customers found</h3>
            <p className="text-xs text-[#36394a] mt-1 mb-5 max-w-xs">
              {search 
                ? "Try adjusting your search criteria." 
                : "Add client records to autofill client details when generating invoices."}
            </p>
            <Button onClick={handleOpenAdd} size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs">
              <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add First Customer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer._id} className="rounded-xl border border-[#e1e9f0] bg-white shadow-none hover:border-[#0f77ff]/40 transition-all group">
                <CardHeader className="pb-3 border-b border-[#e1e9f0] px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] font-bold text-sm shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <CardTitle className="text-sm font-semibold text-[#091135] truncate max-w-[170px]">
                          {customer.name}
                        </CardTitle>
                        <p className="text-xs text-[#36394a] truncate max-w-[170px]">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-[#36394a] hover:text-[#091135] hover:bg-[#f5f3ff]" 
                        onClick={() => handleEdit(customer)}
                        title="Edit client"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Remove ${customer.name}?`)) deleteMutation.mutate(customer._id);
                        }}
                        title="Delete client"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-3.5 space-y-2 text-xs text-[#36394a]">
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#8e9bb0]" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-2 leading-relaxed">
                      <MapPin className="h-3.5 w-3.5 text-[#8e9bb0] shrink-0 mt-0.5" />
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
        <DialogContent className="sm:max-w-[500px] border-[#e1e9f0] bg-white rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#091135]">
              {editingCustomer?._id ? "Edit Customer Record" : "New Customer Record"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#36394a]">
              These details will be available for quick auto-fill within the invoice builder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-[#091135]">Client Name *</Label>
                <Input 
                  id="name" 
                  value={editingCustomer?.name || ""} 
                  onChange={(e) => setEditingCustomer(p => ({ ...p, name: e.target.value }))}
                  placeholder="Acme Corp / Jane Doe"
                  className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#091135]">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={editingCustomer?.email || ""} 
                  onChange={(e) => setEditingCustomer(p => ({ ...p, email: e.target.value }))}
                  placeholder="billing@client.com"
                  className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-[#091135]">Phone</Label>
                <Input 
                  id="phone" 
                  value={editingCustomer?.phone || ""} 
                  onChange={(e) => setEditingCustomer(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555-0199"
                  className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="taxId" className="text-xs font-semibold text-[#091135]">Tax ID / VAT</Label>
                <Input 
                  id="taxId" 
                  value={editingCustomer?.taxId || ""} 
                  onChange={(e) => setEditingCustomer(p => ({ ...p, taxId: e.target.value }))}
                  placeholder="US-12345"
                  className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold text-[#091135]">Billing Address</Label>
              <Textarea 
                id="address" 
                rows={3}
                value={editingCustomer?.address || ""} 
                onChange={(e) => setEditingCustomer(p => ({ ...p, address: e.target.value }))}
                placeholder="456 Client Boulevard, Suite 10, New York, NY"
                className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs bg-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#e1e9f0] text-xs h-9">
              Cancel
            </Button>
            <Button 
              onClick={() => saveMutation.mutate(editingCustomer!)} 
              disabled={saveMutation.isPending}
              className="bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs h-9 px-4 font-medium"
            >
              {saveMutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {editingCustomer?._id ? "Update Customer" : "Save Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
