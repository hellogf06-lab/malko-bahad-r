import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Download, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';

const FileAttachments = ({ entityId, entityType, attachments = [], onAttachmentsChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const newAttachments = await Promise.all(
        files.map(async (file) => {
          // localStorage için base64'e çevir
          const base64 = await fileToBase64(file);
          
          return {
            id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            data: base64,
            uploadedAt: new Date().toISOString(),
            entityId,
            entityType
          };
        })
      );

      const updated = [...attachments, ...newAttachments];
      onAttachmentsChange(updated);
      
      // localStorage'a kaydet
      saveAttachments(entityId, entityType, updated);
    } catch (error) {
      console.error('File upload error:', error);
      alert('Dosya yükleme başarısız oldu');
    } finally {
      setUploading(false);
    }
  }, [attachments, entityId, entityType, onAttachmentsChange]);

  const handleDelete = useCallback((attachmentId) => {
    if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

    const updated = attachments.filter(att => att.id !== attachmentId);
    onAttachmentsChange(updated);
    saveAttachments(entityId, entityType, updated);
  }, [attachments, entityId, entityType, onAttachmentsChange]);

  const handleDownload = useCallback((attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xlsx,.xls"
          />
          <Upload className="mx-auto mb-2 text-gray-400" size={40} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {uploading ? 'Yükleniyor...' : 'Dosya yüklemek için tıklayın'}
          </p>
          <p className="text-xs text-gray-400">
            PDF, Word, Excel, Resim (Max 10MB)
          </p>
        </label>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ekli Dosyalar ({attachments.length})
          </h4>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText className="text-blue-500 flex-shrink-0" size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Download size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const saveAttachments = (entityId, entityType, attachments) => {
  const key = `attachments_${entityType}_${entityId}`;
  localStorage.setItem(key, JSON.stringify(attachments));
};

export const loadAttachments = (entityId, entityType) => {
  const key = `attachments_${entityType}_${entityId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export default FileAttachments;
