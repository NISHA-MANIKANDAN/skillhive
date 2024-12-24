import { Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  setLocation,
  setAvailability,
  setFees,
  setRequirements,
  setCurriculum,
  addTimeSlot,
  addLesson,
  deleteLesson,
  createSkill,
  resetForm
} from '../store/slice/skillSlice';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

const RegistrationSkills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.form);
  const { status, error } = formData;

  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(resetForm());
      navigate('/register-skills');
    }
  }, [status, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createSkill({
        location: formData.location,
        availability: formData.availability,
        fees: formData.fees,
        requirements: formData.requirements,
        curriculum: formData.curriculum,
        faqs: formData.faqs
      }));
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
    alert('Successfully created');
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

  const handleCurriculumChange = (index, field, value) => {
    const newLessons = [...formData.curriculum.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    dispatch(setCurriculum({ ...formData.curriculum, lessons: newLessons }));
  };

  const handleDeleteLesson = (index) => {
    dispatch(deleteLesson(index));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Booking configurations</h2>

        {/* Location Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Class location</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={formData.location.isOnline}
                onChange={(e) => handleLocationChange('isOnline', e.target.checked)}
              />
              <span>Available for online lessons</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Street Address"
              value={formData.location.street}
              onChange={(e) => handleLocationChange('street', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <input
              type="text"
              placeholder="Apt, Suite (optional)"
              value={formData.location.suite}
              onChange={(e) => handleLocationChange('suite', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={formData.location.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              className="rounded-md border border-gray-300 p-2"
            >
              <option value="Canada">Canada</option>
            </select>
            <input
              type="text"
              placeholder="Town / City"
              value={formData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
            <input
              type="text"
              placeholder="Province"
              value={formData.location.province}
              onChange={(e) => handleLocationChange('province', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
            <input
              type="text"
              placeholder="Postal Code/Zip"
              value={formData.location.postalCode}
              onChange={(e) => handleLocationChange('postalCode', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>

        {/* Availability Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium">When are you available to teach?</h3>
          <div className="space-y-4">
            {formData.availability.map((slot, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  value={slot.fromDay}
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
                  value={slot.toDay}
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
                  value={slot.fromTime}
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
                  value={slot.toTime}
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
              className="flex items-center text-blue-500 space-x-2"
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
                value={formData.fees.classLength}
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
                value={formData.fees.price}
                onChange={(e) => handleFeesChange('price', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Curriculum Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium">Curriculum</h3>
          <div className="space-y-4">
            {formData.curriculum.lessons.map((lesson, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <input
                  type="text"
                  placeholder="Lesson title"
                  value={lesson.title}
                  onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
                <input
                  type="text"
                  placeholder="Lesson objective"
                  value={lesson.objective}
                  onChange={(e) => handleCurriculumChange(index, 'objective', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
                <textarea
                  placeholder="Lesson description"
                  value={lesson.description}
                  onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteLesson(index)}
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
              className="flex items-center text-blue-500 space-x-2"
            >
              <Plus size={20} />
              <span>Add lesson</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating...' : 'Create Skill'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationSkills;