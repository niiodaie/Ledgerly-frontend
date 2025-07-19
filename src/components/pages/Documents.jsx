import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import OCRUpload from '../OCRUpload';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  Plus,
  Search,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  File,
  Image,
  FileImage,
  Scan
} from 'lucide-react';

// Mock data
const mockDocuments = [
  {
    id: 1,
    name: 'Receipt - Staples Office Supplies',
    type: 'receipt',
    fileType: 'image/jpeg',
    size: 245760, // bytes
    uploadDate: '2024-01-15',
    expenseId: 1,
    tags: ['office', 'supplies'],
    url: '/documents/receipt-1.jpg'
  },
  {
    id: 2,
    name: 'Invoice - Software License',
    type: 'invoice',
    fileType: 'application/pdf',
    size: 512000,
    uploadDate: '2024-01-12',
    expenseId: 3,
    tags: ['software', 'license'],
    url: '/documents/invoice-2.pdf'
  },
  {
    id: 3,
    name: 'Contract - Client ABC',
    type: 'contract',
    fileType: 'application/pdf',
    size: 1024000,
    uploadDate: '2024-01-10',
    incomeId: 1,
    tags: ['contract', 'client'],
    url: '/documents/contract-3.pdf'
  },
  {
    id: 4,
    name: 'Bank Statement - January 2024',
    type: 'bank_statement',
    fileType: 'application/pdf',
    size: 768000,
    uploadDate: '2024-01-01',
    tags: ['bank', 'statement'],
    url: '/documents/statement-4.pdf'
  }
];

const documentTypes = [
  { value: 'receipt', label: 'Receipt' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'contract', label: 'Contract' },
  { value: 'tax_document', label: 'Tax Document' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'other', label: 'Other' }
];

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    tags: ''
  });

  // Filter documents based on search and type
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType) {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedType]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewDocument({
        ...newDocument,
        name: newDocument.name || file.name
      });
    }
  };

  const handleUploadDocument = () => {
    if (!selectedFile) return;

    const document = {
      id: Date.now(),
      name: newDocument.name,
      type: newDocument.type,
      fileType: selectedFile.type,
      size: selectedFile.size,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      url: URL.createObjectURL(selectedFile) // In real app, this would be uploaded to storage
    };

    setDocuments([document, ...documents]);
    setNewDocument({
      name: '',
      type: '',
      tags: ''
    });
    setSelectedFile(null);
    setIsUploadDialogOpen(false);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    } else if (fileType === 'application/pdf') {
      return <File className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  const handleDocumentUploaded = (document) => {
    setDocuments([document, ...documents]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">
            Manage your business documents and receipts
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Manual Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Upload a document to your vault. Supported formats: PDF, JPG, PNG, GIF.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File *
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    className="col-span-3"
                  />
                </div>
                {selectedFile && (
                  <div className="col-span-4 text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Document name"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type *
                  </Label>
                  <Select value={newDocument.type} onValueChange={(value) => setNewDocument({...newDocument, type: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="tag1, tag2, tag3"
                    value={newDocument.tags}
                    onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleUploadDocument}
                  disabled={!selectedFile || !newDocument.name || !newDocument.type}
                >
                  Upload Document
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* OCR Upload and Document Management Tabs */}
      <Tabs defaultValue="ocr" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ocr" className="flex items-center space-x-2">
            <Scan className="h-4 w-4" />
            <span>OCR Upload</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Document Vault</span>
          </TabsTrigger>
        </TabsList>

        {/* OCR Upload Tab */}
        <TabsContent value="ocr" className="space-y-6">
          <OCRUpload onDocumentUploaded={handleDocumentUploaded} />
          
          {/* OCR Tips */}
          <Card>
            <CardHeader>
              <CardTitle>OCR Tips for Best Results</CardTitle>
              <CardDescription>
                Follow these guidelines to get the most accurate text extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Image Quality</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use good lighting and avoid shadows</li>
                    <li>• Keep the document flat and straight</li>
                    <li>• Ensure text is clear and readable</li>
                    <li>• Avoid blurry or low-resolution images</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Document Types</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Receipts: Include vendor name and total</li>
                    <li>• Invoices: Ensure invoice number is visible</li>
                    <li>• Contracts: Focus on key terms and dates</li>
                    <li>• Statements: Include account and period info</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredDocuments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Documents stored
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
                <p className="text-xs text-muted-foreground">
                  Total file size
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredDocuments.filter(doc => {
                    const uploadDate = new Date(doc.uploadDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return uploadDate >= weekAgo;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  This week
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
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Document List</CardTitle>
              <CardDescription>
                All your uploaded documents and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getFileIcon(document.fileType)}
                          <div>
                            <div className="font-medium">{document.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {document.fileType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {documentTypes.find(type => type.value === document.type)?.label || document.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(document.size)}</TableCell>
                      <TableCell>{document.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(document.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = document.url;
                              link.download = document.name;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(document.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

