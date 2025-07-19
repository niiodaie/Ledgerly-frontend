import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  DollarSign
} from 'lucide-react';

// Mock data
const mockVendors = [
  {
    id: 1,
    name: 'Staples',
    email: 'billing@staples.com',
    phone: '+1-555-0123',
    address: '123 Business St, City, State 12345',
    taxId: '12-3456789',
    paymentTerms: 30,
    totalSpent: 1250.78,
    transactionCount: 8,
    lastTransaction: '2024-01-15'
  },
  {
    id: 2,
    name: 'Restaurant ABC',
    email: 'info@restaurantabc.com',
    phone: '+1-555-0456',
    address: '456 Food Ave, City, State 12345',
    taxId: '98-7654321',
    paymentTerms: 0,
    totalSpent: 450.25,
    transactionCount: 5,
    lastTransaction: '2024-01-13'
  },
  {
    id: 3,
    name: 'SoftwareCorp',
    email: 'support@softwarecorp.com',
    phone: '+1-555-0789',
    address: '789 Tech Blvd, City, State 12345',
    taxId: '11-2233445',
    paymentTerms: 15,
    totalSpent: 299.99,
    transactionCount: 10,
    lastTransaction: '2024-01-12'
  }
];

export default function Vendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState(mockVendors);
  const [filteredVendors, setFilteredVendors] = useState(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    paymentTerms: '30',
    notes: ''
  });

  // Filter vendors based on search
  useEffect(() => {
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [vendors, searchTerm]);

  const handleAddVendor = () => {
    const vendor = {
      id: Date.now(),
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone,
      address: newVendor.address,
      taxId: newVendor.taxId,
      paymentTerms: parseInt(newVendor.paymentTerms),
      notes: newVendor.notes,
      totalSpent: 0,
      transactionCount: 0,
      lastTransaction: null
    };

    setVendors([vendor, ...vendors]);
    setNewVendor({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      paymentTerms: '30',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setNewVendor({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      taxId: vendor.taxId,
      paymentTerms: vendor.paymentTerms.toString(),
      notes: vendor.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateVendor = () => {
    const updatedVendor = {
      ...editingVendor,
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone,
      address: newVendor.address,
      taxId: newVendor.taxId,
      paymentTerms: parseInt(newVendor.paymentTerms),
      notes: newVendor.notes
    };

    setVendors(vendors.map(vendor => 
      vendor.id === editingVendor.id ? updatedVendor : vendor
    ));
    
    setEditingVendor(null);
    setNewVendor({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      paymentTerms: '30',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
  };

  const totalSpent = filteredVendors.reduce((sum, vendor) => sum + vendor.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">
            Manage your business vendors and suppliers
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </DialogTitle>
              <DialogDescription>
                {editingVendor ? 'Update the vendor details below.' : 'Enter the details for your new vendor.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Vendor name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@example.com"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0123"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Street address, City, State, ZIP"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taxId" className="text-right">
                  Tax ID
                </Label>
                <Input
                  id="taxId"
                  placeholder="12-3456789"
                  value={newVendor.taxId}
                  onChange={(e) => setNewVendor({...newVendor, taxId: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentTerms" className="text-right">
                  Payment Terms
                </Label>
                <Input
                  id="paymentTerms"
                  type="number"
                  placeholder="30"
                  value={newVendor.paymentTerms}
                  onChange={(e) => setNewVendor({...newVendor, paymentTerms: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this vendor"
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={editingVendor ? handleUpdateVendor : handleAddVendor}
                disabled={!newVendor.name}
              >
                {editingVendor ? 'Update Vendor' : 'Add Vendor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredVendors.length}</div>
            <p className="text-xs text-muted-foreground">
              Active vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredVendors.length > 0 ? (totalSpent / filteredVendors.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per vendor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
          <CardDescription>
            All your business vendors and suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      {vendor.taxId && (
                        <div className="text-sm text-muted-foreground">
                          Tax ID: {vendor.taxId}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {vendor.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3" />
                          {vendor.email}
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3 w-3" />
                          {vendor.phone}
                        </div>
                      )}
                      {vendor.address && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-3 w-3" />
                          {vendor.address}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vendor.paymentTerms} days
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${vendor.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>{vendor.transactionCount}</TableCell>
                  <TableCell>
                    {vendor.lastTransaction || 'No transactions'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

