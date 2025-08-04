import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Film, 
  Image, 
  File, 
  Check, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Save,
  Trash2
} from "lucide-react";
import axios from "axios";

const CourseContentUpload = () => {
    const { id: skillId } = useParams();
  const navigate = useNavigate();
  
  const [skillData, setSkillData] = useState(null);
  const [contentModules, setContentModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingModule, setDeletingModule] = useState(null);
  
  // New module form state
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleType, setModuleType] = useState("video"); // video, document, quiz, etc.
  const [moduleFiles, setModuleFiles] = useState([]);
  
  // API base URL
  const API_BASE_URL = "http://localhost:4000/api";
  
  useEffect(() => {
    fetchSkillData();
    fetchExistingContent();
  }, [skillId]);
  
  const fetchSkillData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/courses/skill/${skillId}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSkillData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching skill data:", err);
      setError("Failed to load skill information. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExistingContent = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/courses/skill/${skillId}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data && response.data.modules) {
        setContentModules(response.data.modules);
      } else {
        setContentModules([]);
      }
    } catch (err) {
      console.error("Error fetching existing content:", err);
      // We don't set an error here as this might be a new course with no content
      setContentModules([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setModuleFiles(files);
  };
  
  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    
    if (!moduleName.trim()) {
      setError("Module name is required");
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      
      // Step 1: Create the module first
      const moduleData = {
        name: moduleName,
        description: moduleDescription,
        type: moduleType,
        skillId: skillId
      };
      
      const moduleResponse = await axios.post(
        `${API_BASE_URL}/courses/modules`,
        moduleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const moduleId = moduleResponse.data.moduleId;
      
      // Step 2: Upload files if any
      if (moduleFiles.length > 0) {
        const formData = new FormData();
        moduleFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('moduleId', moduleId);
        
        await axios.post(
          `${API_BASE_URL}/courses/upload`,
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          }
        );
      }
      
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setModuleName("");
        setModuleDescription("");
        setModuleFiles([]);
        setUploadProgress(0);
        // Refresh content list
        fetchExistingContent();
      }, 2000);
      
    } catch (err) {
      console.error("Error creating module:", err);
      setError(err.response?.data?.message || "Failed to create module. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      return;
    }
    
    try {
      setDeletingModule(moduleId);
      const token = sessionStorage.getItem("token");
      
      await axios.delete(`${API_BASE_URL}/courses/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh content list
      fetchExistingContent();
    } catch (err) {
      console.error("Error deleting module:", err);
      setError("Failed to delete module. Please try again.");
    } finally {
      setDeletingModule(null);
    }
  };
  
  const handleDeleteFile = async (moduleId, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = sessionStorage.getItem("token");
      
      await axios.delete(`${API_BASE_URL}/courses/modules/${moduleId}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh content list
      fetchExistingContent();
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file. Please try again.");
    }
  };
  
  const getFileIcon = (type) => {
    switch(type) {
      case 'video':
        return <Film className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };
  
  const getFileTypeIcon = (mimeType) => {
    if (mimeType.startsWith('video/')) {
      return <Film className="w-4 h-4 mr-1" />;
    } else if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4 mr-1" />;
    } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="w-4 h-4 mr-1" />;
    } else {
      return <File className="w-4 h-4 mr-1" />;
    }
  };
  
  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading course content...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm my-8 p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Profile
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Course Content Upload
        </h1>
        {skillData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-800 mb-1">
              {skillData.skillName}
            </h2>
            <p className="text-green-700">
              {skillData.isVerified 
                ? `Verified on: ${new Date(skillData.updatedAt || Date.now()).toLocaleDateString()}`
                : "Pending verification"}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Module</h2>
        
        <form onSubmit={handleModuleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Name*
            </label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter module name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter module description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              value={moduleType}
              onChange={(e) => setModuleType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, MP4, PPT up to 50MB
                </p>
              </div>
            </div>
            
            {/* Display selected files */}
            {moduleFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                <ul className="space-y-2">
                  {moduleFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <File className="w-4 h-4 mr-2" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Upload progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          {uploadSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Module uploaded successfully!
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Module
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Content Display */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Course Content</h2>
        
        {contentModules.length > 0 ? (
          <div className="space-y-4">
            {contentModules.map((module) => (
              <div key={module._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getFileIcon(module.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                      <button 
                        onClick={() => handleDeleteModule(module._id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        disabled={deletingModule === module._id}
                      >
                        {deletingModule === module._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
                    </p>
                    
                    {module.files && module.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Files:</p>
                        <ul className="space-y-1">
                          {module.files.map((file) => (
                            <li key={file._id} className="text-sm flex items-center justify-between">
                              <div className="flex items-center">
                                {getFileTypeIcon(file.fileType)}
                                <a 
                                  href={`${API_BASE_URL}${file.fileUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline mr-2"
                                >
                                  {file.name}
                                </a>
                                <span className="text-xs text-gray-500">
                                  ({formatFileSize(file.fileSize)})
                                </span>
                              </div>
                              <button 
                                onClick={() => handleDeleteFile(module._id, file._id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(module.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No content modules found. Create your first module using the form above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentUpload;