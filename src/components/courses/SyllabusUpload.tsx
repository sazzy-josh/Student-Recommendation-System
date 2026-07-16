'use client';

import { useState } from 'react';
import { coursesApi } from '@/lib/api';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X } from 'lucide-react';

interface SyllabusUploadProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onUploaded?: () => void;
}

export function SyllabusUpload({ open, course, onClose, onUploaded }: SyllabusUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open || !course) return null;

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      await coursesApi.uploadSyllabus(course.id, file);
      setSuccess(true);
      onUploaded?.();
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">Upload Syllabus</h2>
          <Button variant="ghost" size="sm" onClick={handleClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {course.code} — {course.title}
        </p>

        {success ? (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm">Syllabus uploaded. Text extraction has been triggered.</p>
            <Button className="mt-4" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="syllabus-file">PDF file</Label>
              <input
                id="syllabus-file"
                type="file"
                accept="application/pdf"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!file || isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
