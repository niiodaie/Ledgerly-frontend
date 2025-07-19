import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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
  Calculator,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Package
} from 'lucide-react';

export default function TaxTidy() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [taxSummary, setTaxSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeSummary: true,
    includeIncome: true,
    includeExpenses: true,
    includeDeductions: true,
    includeQuarterly: true,
    includeDocuments: false
  });

  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (selectedYear) {
      loadTaxSummary();
    }
  }, [selectedYear]);

  const loadTaxSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/tax-summary/${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load tax summary');
      }

      const data = await response.json();
      setTaxSummary(data.report);
    } catch (error) {
      console.error('Error loading tax summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTaxData = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/reports/tax-export/${selectedYear}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(exportOptions)
      });

      if (!response.ok) {
        throw new Error('Failed to generate tax export');
      }

      const data = await response.json();
      
      // Download the generated file
      const downloadResponse = await fetch(`/api/reports/tax-export/download/${data.export.fileName}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (downloadResponse.ok) {
        const blob = await downloadResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.export.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }

    } catch (error) {
      console.error('Error exporting tax data:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'deductions':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'documentation':
        return <FileText className="h-4 w-4 text-yellow-600" />;
      case 'planning':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading tax summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TaxTidy</h1>
          <p className="text-muted-foreground">
            Automated tax preparation and export tools
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Tax Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Tax Data for {selectedYear}</DialogTitle>
                <DialogDescription>
                  Select which reports to include in your tax export package.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {Object.entries({
                  includeSummary: 'Tax Summary Report',
                  includeIncome: 'Income Statement',
                  includeExpenses: 'Expense Report',
                  includeDeductions: 'Deductible Expenses',
                  includeQuarterly: 'Quarterly Summary',
                  includeDocuments: 'Supporting Documents'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={exportOptions[key]}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        [key]: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={key} className="text-sm font-medium">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleExportTaxData} disabled={exporting}>
                  {exporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Generate Export
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {taxSummary && (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Tax Summary</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          {/* Tax Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.summary.totalIncome)}</div>
                  <p className="text-xs text-muted-foreground">
                    Gross business income
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.summary.totalDeductions)}</div>
                  <p className="text-xs text-muted-foreground">
                    Business expense deductions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxable Income</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.summary.taxableIncome)}</div>
                  <p className="text-xs text-muted-foreground">
                    After deductions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Tax</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.summary.estimatedTax)}</div>
                  <p className="text-xs text-muted-foreground">
                    {taxSummary.summary.effectiveTaxRate.toFixed(1)}% effective rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tax Rate Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Effective Tax Rate</CardTitle>
                <CardDescription>
                  Your estimated effective tax rate for {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Effective Rate</span>
                    <span>{taxSummary.summary.effectiveTaxRate.toFixed(2)}%</span>
                  </div>
                  <Progress value={taxSummary.summary.effectiveTaxRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Based on simplified tax calculation. Consult a tax professional for accurate estimates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quarterly Tab */}
          <TabsContent value="quarterly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Breakdown</CardTitle>
                <CardDescription>
                  Income, expenses, and estimated tax payments by quarter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quarter</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Est. Tax Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(taxSummary.quarterlyBreakdown).map(([quarter, data]) => (
                      <TableRow key={quarter}>
                        <TableCell className="font-medium">{quarter}</TableCell>
                        <TableCell>{formatCurrency(data.income)}</TableCell>
                        <TableCell>{formatCurrency(data.expenses)}</TableCell>
                        <TableCell className={data.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.profit)}
                        </TableCell>
                        <TableCell>{formatCurrency(data.estimatedTax)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Quarterly Payment Reminder:</strong> Estimated tax payments are typically due on 
                January 15, April 15, June 15, and September 15. Make sure to submit payments on time to avoid penalties.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Deductions Tab */}
          <TabsContent value="deductions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(taxSummary.deductibleExpenses).map(([category, data]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>
                      {data.count} transactions • {formatCurrency(data.total)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Deductible</span>
                        <span className="font-medium">{formatCurrency(data.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average per Transaction</span>
                        <span>{formatCurrency(data.count > 0 ? data.total / data.count : 0)}</span>
                      </div>
                      <Progress 
                        value={(data.total / taxSummary.summary.totalDeductions) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {((data.total / taxSummary.summary.totalDeductions) * 100).toFixed(1)}% of total deductions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {taxSummary.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getRecommendationIcon(rec.type)}
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                      </div>
                      {getPriorityBadge(rec.priority)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>General Tax Tips</CardTitle>
                <CardDescription>
                  Best practices for business tax preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Keep Detailed Records</p>
                      <p className="text-sm text-muted-foreground">
                        Maintain receipts and documentation for all business expenses throughout the year.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Separate Business and Personal</p>
                      <p className="text-sm text-muted-foreground">
                        Use separate bank accounts and credit cards for business expenses.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Track Mileage</p>
                      <p className="text-sm text-muted-foreground">
                        Keep a log of business-related travel for potential deductions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Consult a Professional</p>
                      <p className="text-sm text-muted-foreground">
                        Work with a qualified tax professional for complex situations and tax planning.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

