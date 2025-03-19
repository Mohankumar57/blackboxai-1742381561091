import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { fileUtils } from '../../utils/helpers';

const FileUpload = ({
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  onUpload,
  onRemove,
  uploadedFiles = [],
  error,
  helperText,
  disabled = false,
  showPreview = true,
  previewType = 'list', // 'list' or 'grid'
  sx = {}
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = async (files) => {
    if (disabled || uploading) return;

    const selectedFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Validate files
    for (const file of selectedFiles) {
      // Check file type
      if (accept && !accept.split(',').some(type => file.type.match(type.trim()))) {
        errors.push(`${file.name}: Invalid file type`);
        continue;
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds ${fileUtils.formatFileSize(maxSize)}`);
        continue;
      }

      validFiles.push(file);
    }

    // Check max files limit
    if (!multiple && validFiles.length > 1) {
      errors.push('Only one file can be uploaded');
      validFiles.length = 1;
    } else if (multiple && validFiles.length + uploadedFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files can be uploaded`);
      validFiles.length = maxFiles - uploadedFiles.length;
    }

    // Show errors if any
    if (errors.length > 0) {
      console.error('File upload errors:', errors);
      // You might want to show these errors to the user through a toast or other UI
    }

    // Upload valid files
    if (validFiles.length > 0) {
      setUploading(true);
      try {
        for (let i = 0; i < validFiles.length; i++) {
          const progress = ((i + 1) / validFiles.length) * 100;
          setUploadProgress(progress);
          await onUpload(validFiles[i]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Render file preview
  const renderFilePreview = () => {
    if (!showPreview || uploadedFiles.length === 0) return null;

    if (previewType === 'grid') {
      return (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2,
            mt: 2
          }}
        >
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {file.name}
              </Typography>
              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <List sx={{ mt: 2 }}>
        {uploadedFiles.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              onRemove && (
                <IconButton edge="end" onClick={() => onRemove(file)}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary={file.name}
              secondary={fileUtils.formatFileSize(file.size)}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ ...sx }}>
      {/* Upload Area */}
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: 2,
          borderRadius: 2,
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderStyle: 'dashed',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
          '&:hover': {
            bgcolor: disabled ? 'inherit' : 'action.hover'
          }
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          {multiple ? 'Upload Files' : 'Upload File'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {dragActive
            ? 'Drop files here'
            : `Drag & drop ${multiple ? 'files' : 'a file'} here or click to browse`}
        </Typography>

        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ display: 'block', mt: 1 }}
          >
            {helperText}
          </Typography>
        )}
      </Box>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* File Preview */}
      {renderFilePreview()}
    </Box>
  );
};

// Preset configurations for common use cases
export const ImageUpload = (props) => (
  <FileUpload
    accept="image/*"
    maxSize={2 * 1024 * 1024} // 2MB
    helperText="Supported formats: JPG, PNG, GIF (max 2MB)"
    {...props}
  />
);

export const DocumentUpload = (props) => (
  <FileUpload
    accept=".pdf,.doc,.docx"
    maxSize={10 * 1024 * 1024} // 10MB
    helperText="Supported formats: PDF, DOC, DOCX (max 10MB)"
    {...props}
  />
);

export const CSVUpload = (props) => (
  <FileUpload
    accept=".csv"
    maxSize={5 * 1024 * 1024} // 5MB
    helperText="Upload CSV file (max 5MB)"
    multiple={false}
    {...props}
  />
);

// Usage example:
/*
const MyComponent = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = async (file) => {
    // Handle file upload
    const newFile = {
      name: file.name,
      size: file.size,
      // Add other properties as needed
    };
    setFiles(prev => [...prev, newFile]);
  };

  const handleRemove = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file.name !== fileToRemove.name));
  };

  return (
    <FileUpload
      multiple
      maxFiles={3}
      onUpload={handleUpload}
      onRemove={handleRemove}
      uploadedFiles={files}
      helperText="Upload up to 3 files (max 5MB each)"
    />
  );
};
*/

export default FileUpload;
