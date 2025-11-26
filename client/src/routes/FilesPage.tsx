import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/apiClient';
import { DocumentFile } from '../types';

const FilesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: files = [] } = useQuery<DocumentFile[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await api.get('/files');
      return res.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] }),
    onError: (err: any) => setError(err?.response?.data?.message || 'Upload failed')
  });

  const deleteFile = async (id: string) => {
    await api.delete(`/files/${id}`);
    queryClient.invalidateQueries({ queryKey: ['files'] });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    uploadMutation.mutate(formData);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Files</h1>
      <div className="bg-white border border-slate-200 p-4 rounded shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <input type="file" accept=".docx" multiple onChange={onFileChange} />
          {uploadMutation.isPending && <span className="text-sm text-slate-500">Uploading...</span>}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Size</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-t border-slate-100">
                <td className="p-3">{f.originalName}</td>
                <td className="p-3 capitalize">{f.status}</td>
                <td className="p-3">{(f.size / 1024).toFixed(1)} KB</td>
                <td className="p-3">{new Date(f.createdAt).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteFile(f._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!files.length && (
              <tr>
                <td className="p-3 text-slate-500" colSpan={5}>
                  No files uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilesPage;
