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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
  DollarSign,
  Edit,
  Trash2,
  Calendar,
  TrendingUp
} from 'lucide-react';

// Mock data
const mockIncome = [
  {
    id: 1,
    amount: 2500.00,
    description: 'Payment from Client ABC',
    date: '2024-01-14',
    category: 'Service Revenue',
    source: 'Client ABC',
    tags: ['consulting', 'project']
  },
  {
    id: 2,
    amount: 1200.00,
    description: 'Monthly retainer fee',
    date: '2024-01-01',
    category: 'Service Revenue',
    source: 'Client XYZ',
    tags: ['retainer', 'monthly']
  },
  {
    id: 3,
    amount: 150.00,
    description: 'Interest from savings account',
    date: '2024-01-01',
    category: 'Interest Income',
    source: 'Bank',
    tags: ['interest', 'passive']
  }
];

const incomeCategories = [
  'Service Revenue',
  'Sales Revenue',
  'Interest Income',
  'Rental Income',
  'Investment Income',
  'Other Income'
];

export default function Income() {
  const { user } = useAuth();
  const [income, setIncome] = useState(mockIncome);
  const [filteredIncome, setFilteredIncome] = useState(mockIncome);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  
  const [newIncome, setNewIncome] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    source: '',
    tags: ''
  });

  // Filter income based on search and category
  useEffect(() => {
    let filtered = income;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredIncome(filtered);
  }, [income, searchTerm, selectedCategory]);

  const handleAddIncome = () => {
    const incomeItem = {
      id: Date.now(),
      amount: parseFloat(newIncome.amount),
      description: newIncome.description,
      date: newIncome.date,
      category: newIncome.category,
      source: newIncome.source,
      tags: newIncome.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setIncome([incomeItem, ...income]);
    setNewIncome({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      source: '',
      tags: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditIncome = (incomeItem) => {
    setEditingIncome(incomeItem);
    setNewIncome({
      amount: incomeItem.amount.toString(),
      description: incomeItem.description,
      date: incomeItem.date,
      category: incomeItem.category,
      source: incomeItem.source,
      tags: incomeItem.tags.join(', ')
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateIncome = () => {
    const updatedIncome = {
      ...editingIncome,
      amount: parseFloat(newIncome.amount),
      description: newIncome.description,
      date: newIncome.date,
      category: newIncome.category,
      source: newIncome.source,
      tags: newIncome.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setIncome(income.map(item => 
      item.id === editingIncome.id ? updatedIncome : item
    ));
    
    setEditingIncome(null);
    setNewIncome({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      source: '',
      tags: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteIncome = (id) => {
    setIncome(income.filter(item => item.id !== id));
  };

  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground">
            Track and manage your business income
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIncome ? 'Edit Income' : 'Add New Income'}
              </DialogTitle>
              <DialogDescription>
                {editingIncome ? 'Update the income details below.' : 'Enter the details for your new income.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Income description"
                  value={newIncome.description}
                  onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newIncome.date}
                  onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={newIncome.category} onValueChange={(value) => setNewIncome({...newIncome, category: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  Source
                </Label>
                <Input
                  id="source"
                  placeholder="Income source"
                  value={newIncome.source}
                  onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  value={newIncome.tags}
                  onChange={(e) => setNewIncome({...newIncome, tags: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={editingIncome ? handleUpdateIncome : handleAddIncome}
                disabled={!newIncome.amount || !newIncome.description}
              >
                {editingIncome ? 'Update Income' : 'Add Income'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredIncome.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredIncome.length > 0 ? (totalIncome / filteredIncome.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search income..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Income List</CardTitle>
          <CardDescription>
            All your recorded income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncome.map((incomeItem) => (
                <TableRow key={incomeItem.id}>
                  <TableCell>{incomeItem.date}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{incomeItem.description}</div>
                      {incomeItem.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {incomeItem.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {incomeItem.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{incomeItem.source}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    +${incomeItem.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditIncome(incomeItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIncome(incomeItem.id)}
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

