import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Upload, Download, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

interface CSVKeywordImportProps {
  onImport: (keywords: Array<{
    englishText: string;
    japaneseText: string;
    englishAudioUrl: string;
    japaneseAudioUrl: string;
  }>) => void;
}

export const CSVKeywordImport: React.FC<CSVKeywordImportProps> = ({ onImport }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const template = `Japanese,English,Japanese Audio URL,English Audio URL
こんにちは,Hello,https://s3.../konnichiwa_jp.mp3,https://s3.../hello_en.mp3
ありがとう,Thank you,https://s3.../arigatou_jp.mp3,https://s3.../thankyou_en.mp3
さようなら,Goodbye,https://s3.../sayonara_jp.mp3,https://s3.../goodbye_en.mp3`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setPreview([]);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have a header row and at least one data row');
      }

      // Parse CSV (simple parser for this use case)
      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['Japanese', 'English', 'Japanese Audio URL', 'English Audio URL'];
      
      // Check if headers match (case-insensitive)
      const headersMatch = expectedHeaders.every(expected => 
        headers.some(h => h.toLowerCase() === expected.toLowerCase())
      );

      if (!headersMatch) {
        throw new Error(`CSV headers must be: ${expectedHeaders.join(', ')}`);
      }

      // Parse data rows
      const keywords = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parsing (doesn't handle quotes/escaping)
        const values = line.split(',').map(v => v.trim());
        
        if (values.length < 4) {
          console.warn(`Skipping row ${i + 1}: insufficient columns`);
          continue;
        }

        keywords.push({
          japaneseText: values[0] || '',
          englishText: values[1] || '',
          japaneseAudioUrl: values[2] || '',
          englishAudioUrl: values[3] || '',
        });
      }

      if (keywords.length === 0) {
        throw new Error('No valid keywords found in CSV');
      }

      setPreview(keywords);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file');
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      setPreview([]);
    }
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Alert severity="info">
          Import keywords from a CSV file. The CSV should have columns for Japanese text, 
          English text, and audio URLs for both languages.
        </Alert>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadTemplate}
          >
            Download Template
          </Button>

          <Button
            component="label"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload CSV'}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {preview.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview ({preview.length} keywords)
            </Typography>
            
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Japanese</TableCell>
                    <TableCell>English</TableCell>
                    <TableCell align="center">JP Audio</TableCell>
                    <TableCell align="center">EN Audio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.map((keyword, index) => (
                    <TableRow key={index}>
                      <TableCell>{keyword.japaneseText}</TableCell>
                      <TableCell>{keyword.englishText}</TableCell>
                      <TableCell align="center">
                        {keyword.japaneseAudioUrl ? (
                          <CheckCircle color="success" fontSize="small" />
                        ) : (
                          <ErrorIcon color="error" fontSize="small" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {keyword.englishAudioUrl ? (
                          <CheckCircle color="success" fontSize="small" />
                        ) : (
                          <ErrorIcon color="error" fontSize="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleImport}
                fullWidth
              >
                Import {preview.length} Keywords
              </Button>
              <Button
                variant="outlined"
                onClick={() => setPreview([])}
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};