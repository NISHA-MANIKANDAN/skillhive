import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, File, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  setName,
  setSkill,
  setLocation,
  setAvailability,
  setFees,
  setRequirements,
  setCurriculum,
  addTimeSlot,
  addLesson,
  deleteLesson,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  resetForm,
  createSkillWithFiles,
  createSkill
} from '../store/slice/skillSlice';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

// Default values for form initialization
const DEFAULT_VALUES = {
  name: 'John Doe',
  skill: 'Piano Teaching',
  location: {
    isOnline: true,
    street: '123 Main Street',
    suite: 'Apt 4B',
    country: 'Canada',
    city: 'Toronto',
    province: 'Ontario',
    postalCode: 'M5V 2H1'
  },
  availability: [
    {
      fromDay: 'Monday',
      toDay: 'Friday',
      fromTime: '09:00',
      toTime: '17:00'
    }
  ],
  fees: {
    classLength: '60 mins',
    price: '50',
    attendants: '5',
    priceChange: '10'
  },
  requirements: {
    ageLimit: '8+',
    languages: 'English, French',
    requirements: 'Basic music knowledge preferred but not required.',
    materials: 'Students should have access to a piano or keyboard for practice.'
  },
  certificates: [
    {
      name: 'Piano Performance Grade 8',
      issuer: 'Royal Conservatory of Music',
      date: '2022-05-15',
      fileInfo: {
        name: 'piano_certificate.pdf',
        size: 1024000,
        type: 'application/pdf'
      }
    }
  ],
  curriculum: {
    lessons: [
      {
        title: 'Introduction to Piano Basics',
        objective: 'Learn proper hand positioning and basic notes',
        description: 'In this lesson, students will learn the fundamentals of piano playing, including proper sitting posture, hand positioning, and basic finger exercises.'
      }
    ]
  }
};

const RegistrationSkills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.form);
  const { status, error } = formData || { status: null, error: null };
  const [skillStatus, setSkillStatus] = useState({
    isSubmitted: false,
    isVerified: false,
    message: ''
  });
  
  // Add state to store the actual File objects separate from Redux
  const [filesForUpload, setFilesForUpload] = useState([null]);
  // Track whether default values have been set
  const [defaultsSet, setDefaultsSet] = useState(false);

  // Initialize form with default values on first render
  useEffect(() => {
    // Only set defaults once and only if form state exists but name is empty
    if (!defaultsSet && formData && !formData.name) {
      // Set basic form fields
      dispatch(setName(DEFAULT_VALUES.name));
      dispatch(setSkill(DEFAULT_VALUES.skill));
      dispatch(setLocation(DEFAULT_VALUES.location));
      dispatch(setAvailability(DEFAULT_VALUES.availability));
      dispatch(setFees(DEFAULT_VALUES.fees));
      dispatch(setRequirements(DEFAULT_VALUES.requirements));
      
      // Set curriculum
      dispatch(setCurriculum(DEFAULT_VALUES.curriculum));
      
      // Handle certificates separately to ensure they're properly added
      if (DEFAULT_VALUES.certificates.length > 0) {
        // First add certificate without data to create the entry
        dispatch(addCertificate());
        
        // Then update each field
        const cert = DEFAULT_VALUES.certificates[0];
        dispatch(updateCertificate({
          index: 0,
          field: 'name',
          value: cert.name
        }));
        dispatch(updateCertificate({
          index: 0,
          field: 'issuer',
          value: cert.issuer
        }));
        dispatch(updateCertificate({
          index: 0,
          field: 'date',
          value: cert.date
        }));
        dispatch(updateCertificate({
          index: 0,
          field: 'fileInfo',
          value: cert.fileInfo
        }));
      }
      
      setDefaultsSet(true);
    }
  }, [dispatch, formData, defaultsSet]);

  useEffect(() => {
    if (status === 'succeeded') {
      // Set skill status to "pending verification"
      setSkillStatus({
        isSubmitted: true,
        isVerified: false,
        message: 'Your skill has been submitted and is pending verification. You will be notified once it is approved.'
      });
      
      dispatch(resetForm());
      // Reset files array as well
      setFilesForUpload([]);
      setDefaultsSet(false);
      
      // Don't navigate away immediately to show the success message
      setTimeout(() => {
        navigate('/register-skills');
      }, 3000);
    }
  }, [status, navigate, dispatch]);

  // Add a handler for certificate deletion to also update local filesForUpload state
  useEffect(() => {
    if (formData && formData.certificates) {
      // Make sure filesForUpload array length matches certificates length
      if (formData.certificates.length !== filesForUpload.length) {
        const newFilesArray = [...filesForUpload];
        
        // If we have more certificates than files, add null slots
        while (newFilesArray.length < formData.certificates.length) {
          newFilesArray.push(null);
        }
        
        // If we have more files than certificates, remove excess
        if (newFilesArray.length > formData.certificates.length) {
          newFilesArray.length = formData.certificates.length;
        }
        
        setFilesForUpload(newFilesArray);
      }
    }
  }, [formData?.certificates?.length, filesForUpload.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Always use FormData for consistency
      const formDataObj = new FormData();
      
      // Add basic form data
      formDataObj.append('staffName', formData.name);
      formDataObj.append('skillName', formData.skill);
      
      // Add JSON data for complex objects
      formDataObj.append('location', JSON.stringify(formData.location));
      formDataObj.append('availability', JSON.stringify(formData.availability));
      formDataObj.append('fees', JSON.stringify(formData.fees));
      formDataObj.append('requirements', JSON.stringify(formData.requirements));
      formDataObj.append('curriculum', JSON.stringify(formData.curriculum));
      
      // Handle faqs if they exist
      if (formData.faqs && formData.faqs.length > 0) {
        formDataObj.append('faqs', JSON.stringify(formData.faqs));
      } else {
        formDataObj.append('faqs', JSON.stringify([]));
      }
      
      // Safely handle certificates - ensure the array exists before processing
      const certificatesData = formData.certificates && formData.certificates.length > 0 
        ? formData.certificates.map(cert => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || ''
          }))
        : [];
        
      formDataObj.append('certificates', JSON.stringify(certificatesData));
      
      // Add certificate files if they exist
      if (filesForUpload && filesForUpload.length > 0) {
        filesForUpload.forEach((file, index) => {
          if (file && typeof file === 'object') {
            formDataObj.append('certificateFiles', file, file.name);
          }
        });
      }
      
      // Always use createSkillWithFiles for consistency
      dispatch(createSkillWithFiles(formDataObj));
    }
  };

  const validateForm = () => {
    if (!formData.location.city || !formData.location.province) {
      alert('Please fill in required location fields');
      return false;
    }
    if (formData.availability.length === 0) {
      alert('Please add at least one availability slot');
      return false;
    }
    if (!formData.fees.price) {
      alert('Please set a price');
      return false;
    }
    if (formData.certificates.length === 0) {
      alert('Please add at least one certificate');
      return false;
    }
    
    // Check if all certificates have required fields
    for (let i = 0; i < formData.certificates.length; i++) {
      const cert = formData.certificates[i];
      if (!cert.name || !cert.issuer || !cert.date) {
        alert('Please complete all certificate information');
        return false;
      }
      
      // File is required for certificates - check in local state or fileInfo
      if (!filesForUpload[i] && !cert.fileInfo) {
        alert('Please upload all certificate files');
        return false;
      }
    }
    
    return true;
  };

  const handleLocationChange = (field, value) => {
    dispatch(setLocation({ ...formData.location, [field]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    dispatch(setAvailability(newAvailability));
  };

  const handleFeesChange = (field, value) => {
    dispatch(setFees({ ...formData.fees, [field]: value }));
  };

  const handleRequirementsChange = (field, value) => {
    dispatch(setRequirements({ ...formData.requirements, [field]: value }));
  };

  const handleCurriculumChange = (index, field, value) => {
    const newLessons = [...formData.curriculum.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    dispatch(setCurriculum({ ...formData.curriculum, lessons: newLessons }));
  };

  const handleCertificateChange = (index, field, value) => {
    // For regular fields, dispatch the update action
    dispatch(updateCertificate({ index, field, value }));
  };

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Store file metadata in Redux (but not the file itself)
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };
      handleCertificateChange(index, 'fileInfo', fileInfo);
      
      // Store actual File object in component state
      const newFilesState = [...filesForUpload];
      newFilesState[index] = file;
      setFilesForUpload(newFilesState);
    }
  };

  const handleDeleteCertificate = (index) => {
    // Delete from Redux state
    dispatch(deleteCertificate(index));
    
    // Also delete from local file state
    const newFilesState = [...filesForUpload];
    newFilesState.splice(index, 1);
    setFilesForUpload(newFilesState);
  };

  // Render status banner based on skill verification
  const renderStatusBanner = () => {
    if (!skillStatus.isSubmitted) return null;

    if (skillStatus.isVerified) {
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircle className="mr-2" size={20} />
          <span>Your skill has been verified and is now live!</span>
        </div>
      );
    } else {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
          <Clock className="mr-2" size={20} />
          <span>{skillStatus.message}</span>
        </div>
      );
    }
  };

  const handleAddCertificate = () => {
    dispatch(addCertificate());
    // Also add a null placeholder in the files array
    setFilesForUpload([...filesForUpload, null]);
  };

  // Guard against formData being null or undefined
  if (!formData) {
    return <div className="max-w-4xl mx-auto p-6">Loading form data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Status Banners */}
      {renderStatusBanner()}
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Booking configurations</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Verification Status:</span>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Pending Review
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name || ''}
              onChange={(e) => dispatch(setName(e.target.value))}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
            <input
              type="text"
              placeholder="Skill Name"
              value={formData.skill || ''}
              onChange={(e) => dispatch(setSkill(e.target.value))}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          
          {/* Location Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Class location</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={formData.location?.isOnline || false}
                  onChange={(e) => handleLocationChange('isOnline', e.target.checked)}
                />
                <span>Available for online lessons</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street Address"
                value={formData.location?.street || ''}
                onChange={(e) => handleLocationChange('street', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <input
                type="text"
                placeholder="Apt, Suite (optional)"
                value={formData.location?.suite || ''}
                onChange={(e) => handleLocationChange('suite', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={formData.location?.country || 'Canada'}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="rounded-md border border-gray-300 p-2"
              >
                <option value="Canada">Canada</option>
              </select>
              <input
                type="text"
                placeholder="Town / City"
                value={formData.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              <input
                type="text"
                placeholder="Province"
                value={formData.location?.province || ''}
                onChange={(e) => handleLocationChange('province', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              <input
                type="text"
                placeholder="Postal Code/Zip"
                value={formData.location?.postalCode || ''}
                onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>

          {/* Availability Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">When are you available to teach?</h3>
            <div className="space-y-4">
              {formData.availability && formData.availability.map((slot, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <select
                    value={slot.fromDay || ''}
                    onChange={(e) => handleAvailabilityChange(index, 'fromDay', e.target.value)}
                    className="rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">From day</option>
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={slot.toDay || ''}
                    onChange={(e) => handleAvailabilityChange(index, 'toDay', e.target.value)}
                    className="rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">To day</option>
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={slot.fromTime || ''}
                    onChange={(e) => handleAvailabilityChange(index, 'fromTime', e.target.value)}
                    className="rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">From time</option>
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <select
                    value={slot.toTime || ''}
                    onChange={(e) => handleAvailabilityChange(index, 'toTime', e.target.value)}
                    className="rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">To time</option>
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                type="button"
                onClick={() => dispatch(addTimeSlot())}
                className="flex items-center text-cyan-600 space-x-2"
              >
                <Plus size={20} />
                <span>Add time slot</span>
              </button>
            </div>
          </div>

          {/* Fees Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">Fees and conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  value={formData.fees?.classLength || '60 mins'}
                  onChange={(e) => handleFeesChange('classLength', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="30 mins">30 mins</option>
                  <option value="60 mins">60 mins</option>
                  <option value="90 mins">90 mins</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.fees?.price || ''}
                  onChange={(e) => handleFeesChange('price', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Attendants"
                  value={formData.fees?.attendants || ''}
                  onChange={(e) => handleFeesChange('attendants', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                  min="1"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price Change per Student"
                  value={formData.fees?.priceChange || ''}
                  onChange={(e) => handleFeesChange('priceChange', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          {/* Requirements Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Age Limit"
                  value={formData.requirements?.ageLimit || ''}
                  onChange={(e) => handleRequirementsChange('ageLimit', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Languages"
                  value={formData.requirements?.languages || ''}
                  onChange={(e) => handleRequirementsChange('languages', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
            <div>
              <textarea
                placeholder="Additional Requirements"
                value={formData.requirements?.requirements || ''}
                onChange={(e) => handleRequirementsChange('requirements', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={3}
              />
            </div>
            <div>
              <textarea
                placeholder="Required Materials"
                value={formData.requirements?.materials || ''}
                onChange={(e) => handleRequirementsChange('materials', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={3}
              />
            </div>
          </div>
          
          {/* Certificates Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">Certificates and Qualifications</h3>
            <p className="text-gray-600 text-sm">Please add certificates that verify your qualifications for this skill</p>
            <div className="space-y-4">
              {formData.certificates && formData.certificates.map((cert, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Certificate Name"
                      value={cert.name || ''}
                      onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization"
                      value={cert.issuer || ''}
                      onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      placeholder="Date Issued"
                      value={cert.date || ''}
                      onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    />
                    <div className="w-full">
                      <label className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center">
                          <File size={20} className="mr-2 text-gray-500" />
                          <span>
                            {filesForUpload[index] ? filesForUpload[index].name : 
                             (cert.fileInfo ? cert.fileInfo.name : 'Upload Certificate')}
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(index, e)}
                          required={!filesForUpload[index] && !cert.fileInfo}
                        />
                      </label>
                      {(filesForUpload[index] || cert.fileInfo) && (
                        <p className="text-xs text-green-600 mt-1">
                          File selected: {filesForUpload[index] ? filesForUpload[index].name : cert.fileInfo.name} 
                          {filesForUpload[index] ? 
                            `(${(filesForUpload[index].size / 1024).toFixed(1)} KB)` : 
                            cert.fileInfo?.size ? `(${(cert.fileInfo.size / 1024).toFixed(1)} KB)` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCertificate(index)}
                    className="text-red-500 flex items-center space-x-2 mt-2"
                  >
                    <Trash2 size={20} />
                    <span>Delete Certificate</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCertificate}
                className="flex items-center text-cyan-600 space-x-2"
              >
                <Plus size={20} />
                <span>Add Certificate</span>
              </button>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">Curriculum</h3>
            <div className="space-y-4">
              {formData.curriculum?.lessons && formData.curriculum.lessons.map((lesson, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Lesson title"
                    value={lesson.title || ''}
                    onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  <input
                    type="text"
                    placeholder="Lesson objective"
                    value={lesson.objective || ''}
                    onChange={(e) => handleCurriculumChange(index, 'objective', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  <textarea
                    placeholder="Lesson description"
                    value={lesson.description || ''}
                    onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(deleteLesson(index))}
                    className="text-red-500 flex items-center space-x-2 mt-2"
                  >
                    <Trash2 size={20} />
                    <span>Delete Lesson</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => dispatch(addLesson())}
                className="flex items-center text-cyan-600 space-x-2"
              >
                <Plus size={20} />
                <span>Add lesson</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <p className="text-sm text-gray-500 italic">
              Note: Your skill will be reviewed by our team before it appears publicly.
            </p>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {status === 'loading' ? 'Creating...' : 'Create Skill'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationSkills;