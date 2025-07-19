import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Plus
} from 'lucide-react';

export default function OCRUpload({ onExpenseCreated, onDocumentUploaded }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showResultDialog, setShowResultDialog] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const formData = new FormData();
      formData.append('image', file);

      // Determine endpoint based on file name or user selection
      const endpoint = file.name.toLowerCase().includes('receipt') ? 'receipt' : 'invoice';
      
      const response = await fetch(`/api/ocr/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setResult(data);
      setShowResultDialog(true);

      // Notify parent components
      if (onDocumentUploaded) {
        onDocumentUploaded(data.document);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [onDocumentUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleCreateExpense = async () => {
    if (!result?.suggested_expense) return;

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(result.suggested_expense)
      });

      if (!response.ok) {
        throw new Error('Failed to create expense');
      }

      const expense = await response.json();
      
      if (onExpenseCreated) {
        onExpenseCreated(expense);
      }

      setShowResultDialog(false);
      setResult(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (confidence >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>OCR Document Upload</span>
          </CardTitle>
          <CardDescription>
            Upload receipts and invoices to automatically extract expense data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing document...</p>
                  <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{progress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileImage className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your document here' : 'Upload receipt or invoice'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to select • JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>• Supported formats: JPEG, PNG, GIF</p>
            <p>• Maximum file size: 10MB</p>
            <p>• OCR will automatically extract vendor, amount, and date information</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>OCR Processing Complete</span>
            </DialogTitle>
            <DialogDescription>
              We've extracted the following information from your document
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Extraction Confidence:</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getConfidenceColor(result.ocr_result.confidence)}`}>
                    {result.ocr_result.confidence}%
                  </span>
                  {getConfidenceBadge(result.ocr_result.confidence)}
                </div>
              </div>

              {/* Extracted Data */}
              {result.ocr_result.parsed_data && (
                <div className="space-y-3">
                  <h4 className="font-medium">Extracted Information:</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {result.ocr_result.parsed_data.vendor && (
                      <div>
                        <label className="text-xs text-muted-foreground">Vendor</label>
                        <p className="font-medium">{result.ocr_result.parsed_data.vendor}</p>
                      </div>
                    )}
                    {result.ocr_result.parsed_data.amount && (
                      <div>
                        <label className="text-xs text-muted-foreground">Amount</label>
                        <p className="font-medium">${result.ocr_result.parsed_data.amount.toFixed(2)}</p>
                      </div>
                    )}
                    {result.ocr_result.parsed_data.date && (
                      <div>
                        <label className="text-xs text-muted-foreground">Date</label>
                        <p className="font-medium">{result.ocr_result.parsed_data.date}</p>
                      </div>
                    )}
                    {result.ocr_result.suggested_category && (
                      <div>
                        <label className="text-xs text-muted-foreground">Suggested Category</label>
                        <p className="font-medium">{result.ocr_result.suggested_category}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Raw Text Preview */}
              <div className="space-y-2">
                <h4 className="font-medium">Extracted Text:</h4>
                <div className="bg-muted p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{result.ocr_result.text}</pre>
                </div>
              </div>

              {/* Suggested Expense */}
              {result.suggested_expense && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Ready to Create Expense</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-blue-700">Amount:</span> ${result.suggested_expense.amount?.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-blue-700">Category:</span> {result.suggested_expense.category}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-blue-700">Description:</span> {result.suggested_expense.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowResultDialog(false)}>
              <Eye className="mr-2 h-4 w-4" />
              View Document
            </Button>
            {result?.suggested_expense && (
              <Button onClick={handleCreateExpense}>
                <Plus className="mr-2 h-4 w-4" />
                Create Expense
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

