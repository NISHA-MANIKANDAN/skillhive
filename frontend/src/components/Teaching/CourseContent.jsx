import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Play, Download, BookOpen, CheckCircle, Clock, Award, FileText, Video } from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

const CourseContent = () => {
  const { id: skillId } = useParams();
  const navigate = useNavigate();
  const [skillData, setSkillData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        // Get all skills to find matching skill
        try {
          const allSkillsResponse = await axios.get(
            `${API_BASE_URL}/skills`,
            config
          );
          
          // Find the specific skill by ID
          const currentSkill = allSkillsResponse.data.find(
            skill => skill._id === skillId
          );
          
          if (currentSkill) {
            setSkillData(currentSkill);
          } else {
            console.warn("Skill not found in the skills list");
          }
        } catch (skillError) {
          console.error("Error fetching skills:", skillError);
          // Continue execution even if skills fetch fails
        }
        
        // Get the course modules - add a console.log to see what's returned
        try {
          const modulesResponse = await axios.get(
            `${API_BASE_URL}/courses/skill/${skillId}/content`,
            config
          );
          
          console.log("Modules response:", modulesResponse.data);
          
          // Ensure modules is an array
          const modulesArray = Array.isArray(modulesResponse.data) 
            ? modulesResponse.data 
            : modulesResponse.data.modules || [];
            
          setModules(modulesArray);
          
          // Set first module as active by default
          if (modulesArray.length > 0) {
            setActiveModule(modulesArray[0]);
          }
          
          // Calculate progress - in a real implementation, this would come from the API
          const completedModules = 0; // Placeholder - would be real count from API
          const totalModules = modulesArray.length;
          setProgress(totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0);
        } catch (moduleError) {
          console.error("Error fetching modules:", moduleError);
          setError("Failed to load course modules.");
          setModules([]);
        }
        
      } catch (error) {
        console.error("Error fetching course content:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (error.response?.status === 404) {
          setError("Course content not found.");
        } else {
          setError("Failed to load course content. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [skillId]);

  const handleModuleSelect = (module) => {
    setActiveModule(module);
  };
  
  const markModuleComplete = async (moduleId) => {
    try {
      const token = sessionStorage.getItem("token");
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.post(
        `${API_BASE_URL}/courses/module/${moduleId}/complete`,
        { skillId },
        config
      );
      
      // Update progress state
      // In a real implementation, you would refetch the progress or update state properly
      const newProgress = Math.min(progress + Math.round(100 / modules.length), 100);
      setProgress(newProgress);
      
      alert("Module marked as complete!");
    } catch (error) {
      console.error("Error marking module as complete:", error);
      alert("Failed to mark module as complete.");
    }
  };
  
  const isModuleCompleted = (moduleId) => {
    // In a real implementation, this would check against the actual completed modules
    return false;
  };
  
  const getModuleIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'document':
        return <FileText size={16} className="text-blue-500" />;
      default:
        return <BookOpen size={16} className="text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-700 flex items-center">
            <Clock className="mr-2" size={20} />
            Error
          </h2>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-yellow-700 flex items-center">
            <Clock className="mr-2" size={20} />
            No Content
          </h2>
          <p className="mt-2 text-yellow-600">No course content available for this skill.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="container mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white mb-4 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to My Skills
          </button>
          
          <h1 className="text-3xl font-bold">{skillData?.skillName || 'React.js'}</h1>
          <p className="mt-1 text-blue-100">Instructor: {skillData?.staffName || 'n'}</p>
          
          <div className="mt-4 flex items-center">
            <div className="bg-white bg-opacity-20 rounded-full h-2 w-64 mr-3">
              <div 
                className="bg-white rounded-full h-2" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm">{progress}% Complete</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Modules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen size={18} className="mr-2" /> Course Modules
              </h2>
              
              <div className="space-y-2">
                {Array.isArray(modules) && modules.map((module, index) => (
                  <button
                    key={module._id || index}
                    onClick={() => handleModuleSelect(module)}
                    className={`w-full text-left p-2 rounded-md flex items-center justify-between ${
                      activeModule?._id === module._id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 flex-shrink-0 bg-blue-100 text-blue-800 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                        {module.order || (index + 1)}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate">{module.name}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          {getModuleIcon(module.type)}
                          <span className="ml-1 capitalize">{module.type}</span>
                        </div>
                      </div>
                    </div>
                    {isModuleCompleted(module._id) && (
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content - Module Details */}
          <div className="lg:col-span-3">
            {activeModule ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center">
                      {getModuleIcon(activeModule.type)}
                      <span className="ml-2 text-sm uppercase text-gray-500 font-medium">{activeModule.type}</span>
                    </div>
                    <h2 className="text-2xl font-bold mt-1">{activeModule.name}</h2>
                  </div>
                  {!isModuleCompleted(activeModule._id) && (
                    <button
                      onClick={() => markModuleComplete(activeModule._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2" /> Mark Complete
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-100 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 font-medium mb-1">Description:</p>
                  <p>{activeModule.description}</p>
                </div>
                
                <div className="prose max-w-none">
                  {/* Video module */}
                  {activeModule.type === 'video' && (
                    <div className="mt-4 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                      <Play size={40} className="text-blue-600 mb-2" />
                      <p className="text-center text-gray-600">Video Lesson</p>
                      <button className="mt-3 text-blue-600 flex items-center text-sm hover:underline">
                        <Play size={14} className="mr-1" /> Watch Video
                      </button>
                    </div>
                  )}
                  
                  {/* Document module */}
                  {activeModule.type === 'document' && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Document Content</h3>
                      {activeModule.files && Array.isArray(activeModule.files) && activeModule.files.length > 0 ? (
                        <div className="space-y-2">
                          {activeModule.files.map((file, index) => (
                            <div key={index} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                              <FileText size={16} className="mr-2 text-blue-600" />
                              <span>{file.originalname || 'Document'}</span>
                              <a 
                                href={file.url || '#'} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-blue-600 text-sm hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No documents attached to this module.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-64">
                <Award size={40} className="text-blue-600 mb-3" />
                <h2 className="text-xl font-semibold">Welcome to {skillData?.skillName || 'React.js'}</h2>
                <p className="text-gray-600 mt-2">Select a module from the curriculum to begin your learning journey.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;