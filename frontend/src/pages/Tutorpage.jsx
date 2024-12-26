import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TutorPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [openFaq, setOpenFaq] = useState(null); // To track which FAQ is open
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Fetch data from data.json based on class ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const result = await response.json();
        const classData = result.find((cls) => cls.id === parseInt(id)); // Find class by ID
        setData(classData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleJoinCourse = () => {
    if (isAuthenticated) {
      setShowBookingForm(true);
    } else {
      navigate("/sign-in");
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const { profile, classDetails, faq, location } = data;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="rounded-full w-24 h-24 mb-4"
            />
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-gray-500">{profile.title}</p>
            <p className="mt-2 text-gray-600">{profile.experience}</p>
          </div>
        </div>

        {/* Class Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">{classDetails.title}</h2>
          <p className="text-gray-700 mb-4">{classDetails.summary}</p>
          {classDetails.description.map((paragraph, index) => (
            <p key={index} className="text-gray-600 mb-4">
              {paragraph}
            </p>
          ))}
          <ul className="text-gray-700 mb-4">
            <li>Rates:</li>
            {classDetails.rates.map((rate, index) => (
              <li key={index}>
                - {rate.price} for {rate.type}
              </li>
            ))}
          </ul>
          <p className="text-gray-600">{classDetails.extras.trialLesson}</p>
          <p className="text-gray-600 mt-2">Call or Text: {classDetails.extras.contact.phone}</p>
          <p className="text-gray-600">
            Website: <a href={classDetails.extras.contact.website} className="text-blue-600">{classDetails.extras.contact.website}</a>
          </p>
          <button
            onClick={handleJoinCourse}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Join the Course
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{location.title}</h2>
        <iframe
          src={location.map.iframeSrc}
          width={location.map.width}
          height={location.map.height}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Course Location"
        ></iframe>
      </div>

      {/* FAQ Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left flex justify-between items-center p-2 border-b"
              >
                <h3 className="font-semibold">{item.question}</h3>
                <span>{openFaq === index ? "-" : "+"}</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96" : "max-h-0"}`}
              >
                <p className="text-gray-600 mt-2">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Book a Slot</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Preferred Date</label>
                <input type="date" className="w-full p-2 border rounded" />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
            <button
              onClick={() => setShowBookingForm(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorPage;
