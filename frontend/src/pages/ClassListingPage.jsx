import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook from react-router-dom
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet styles are included

const ClassListingPage = () => {
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    certification: "all",
    price: [0, 200],
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const classes = [
    { id: 1, name: "Yoga for Beginners", location: "Online", certified: true, price: "$50", teachingExperience: "5 years of teaching yoga", description: "A beginner-friendly yoga class designed to improve flexibility and mindfulness.", reviews: "4.5/5", position: [49.1, -122.6], studentsEnrolled: 120 },
    { id: 2, name: "Advanced Coding Bootcamp", location: "San Francisco, CA", certified: true, price: "$1200", teachingExperience: "10 years in software development", description: "An intensive course for experienced programmers to enhance their coding skills.", reviews: "4.8/5", position: [37.7749, -122.4194], studentsEnrolled: 250 },
    { id: 3, name: "Creative Writing Workshop", location: "Online", certified: false, price: "$80", teachingExperience: "3 years of creative writing", description: "A workshop focused on improving storytelling and writing skills.", reviews: "4.2/5", position: [40.7128, -74.0060], studentsEnrolled: 90 },
    { id: 4, name: "Photography for Beginners", location: "Los Angeles, CA", certified: true, price: "$150", teachingExperience: "8 years of photography", description: "Learn the basics of photography and capture beautiful images.", reviews: "4.7/5", position: [34.0522, -118.2437], studentsEnrolled: 200 },
    { id: 5, name: "Business Management Essentials", location: "Online", certified: true, price: "$250", teachingExperience: "12 years in business management", description: "A comprehensive course on leadership, strategy, and business management.", reviews: "4.6/5", position: [51.5074, -0.1278], studentsEnrolled: 180 },
    { id: 6, name: "Digital Marketing Mastery", location: "New York, NY", certified: true, price: "$350", teachingExperience: "6 years in digital marketing", description: "A deep dive into the world of digital marketing, from SEO to paid ads.", reviews: "4.9/5", position: [40.7128, -74.0060], studentsEnrolled: 300 },
    { id: 7, name: "Music Theory Fundamentals", location: "Online", certified: false, price: "$40", teachingExperience: "4 years of music education", description: "Learn the basics of music theory to improve your musical understanding.", reviews: "4.3/5", position: [41.8781, -87.6298], studentsEnrolled: 80 },
    { id: 8, name: "Advanced Yoga Techniques", location: "San Diego, CA", certified: true, price: "$100", teachingExperience: "7 years of advanced yoga teaching", description: "An advanced yoga course for those looking to deepen their practice.", reviews: "4.7/5", position: [32.7157, -117.1611], studentsEnrolled: 150 },
    { id: 9, name: "Graphic Design Fundamentals", location: "Online", certified: true, price: "$120", teachingExperience: "5 years in graphic design", description: "Learn the fundamentals of graphic design, including software tools and design principles.", reviews: "4.6/5", position: [34.0522, -118.2437], studentsEnrolled: 230 },
    { id: 10, name: "Web Development Bootcamp", location: "Austin, TX", certified: true, price: "$450", teachingExperience: "10 years of web development", description: "Learn full-stack web development with hands-on projects.", reviews: "4.8/5", position: [30.2672, -97.7431], studentsEnrolled: 500 },
    { id: 11, name: "Interior Design Basics", location: "Online", certified: true, price: "$180", teachingExperience: "5 years of interior design", description: "A beginner's course on creating beautiful and functional interior spaces.", reviews: "4.4/5", position: [39.7392, -104.9903], studentsEnrolled: 110 },
    { id: 12, name: "Public Speaking Mastery", location: "Los Angeles, CA", certified: false, price: "$95", teachingExperience: "15 years of public speaking coaching", description: "Master the art of public speaking and become a confident speaker.", reviews: "4.9/5", position: [34.0522, -118.2437], studentsEnrolled: 200 },
    { id: 13, name: "Financial Planning for Beginners", location: "Chicago, IL", certified: true, price: "$220", teachingExperience: "10 years of financial advising", description: "A course to help you understand personal finance and planning for the future.", reviews: "4.7/5", position: [41.8781, -87.6298], studentsEnrolled: 140 },
    { id: 14, name: "Introduction to Machine Learning", location: "Online", certified: true, price: "$350", teachingExperience: "6 years in data science", description: "An introductory course on machine learning algorithms and applications.", reviews: "4.5/5", position: [37.7749, -122.4194], studentsEnrolled: 500 },
    { id: 15, name: "Personal Fitness Training", location: "Miami, FL", certified: false, price: "$70", teachingExperience: "3 years as a personal trainer", description: "Get in shape with personalized fitness training and workout routines.", reviews: "4.3/5", position: [25.7617, -80.1918], studentsEnrolled: 160 },
    { id: 16, name: "Healthy Cooking Class", location: "Online", certified: true, price: "$90", teachingExperience: "7 years in healthy cooking", description: "Learn how to cook nutritious meals and improve your eating habits.", reviews: "4.6/5", position: [34.0522, -118.2437], studentsEnrolled: 130 },
    { id: 17, name: "Introduction to Data Analysis", location: "Online", certified: true, price: "$200", teachingExperience: "5 years in data analysis", description: "Learn how to analyze and interpret data using various tools and techniques.", reviews: "4.4/5", position: [51.5074, -0.1278], studentsEnrolled: 220 },
    { id: 18, name: "Fashion Design Basics", location: "Los Angeles, CA", certified: false, price: "$150", teachingExperience: "8 years in fashion design", description: "Learn the fundamentals of fashion design and start creating your own clothes.", reviews: "4.2/5", position: [34.0522, -118.2437], studentsEnrolled: 100 },
    { id: 19, name: "Introduction to Philosophy", location: "Online", certified: true, price: "$60", teachingExperience: "5 years as a philosophy teacher", description: "A beginner's guide to understanding the basics of philosophy and its key concepts.", reviews: "4.5/5", position: [52.3676, 4.9041], studentsEnrolled: 200 },
    { id: 20, name: "Photography Masterclass", location: "Paris, France", certified: true, price: "$500", teachingExperience: "15 years in professional photography", description: "A comprehensive photography course covering everything from basics to advanced techniques.", reviews: "4.9/5", position: [48.8566, 2.3522], studentsEnrolled: 180 },
  ];


  const toggleDescription = (id) => {
    setExpandedClassId(expandedClassId === id ? null : id);
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesType =
      filters.type === "all" ||
      (filters.type === "online" && cls.location === "Online") ||
      (filters.type === "in-person" && cls.location !== "Online");

    const matchesCertification =
      filters.certification === "all" ||
      (filters.certification === "certified" && cls.certified) ||
      (filters.certification === "uncertified" && !cls.certified);

    const matchesPrice =
      Number(cls.price.replace(/\D/g, "")) <= filters.price[1];

    return matchesType && matchesCertification && matchesPrice;
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Filter Classes</h2>

        {/* Class Type Filter */}
        <div>
          <h3 className="text-sm font-medium">Class Type</h3>
          <div className="flex gap-2 my-2">
            <button
              onClick={() => setFilters({ ...filters, type: "in-person" })}
              className={`px-4 py-2 rounded ${filters.type === "in-person" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              In Person
            </button>
            <button
              onClick={() => setFilters({ ...filters, type: "online" })}
              className={`px-4 py-2 rounded ${filters.type === "online" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Online
            </button>
            <button
              onClick={() => setFilters({ ...filters, type: "all" })}
              className={`px-4 py-2 rounded ${filters.type === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              All
            </button>
          </div>
        </div>

        {/* Certification Filter */}
        <div>
          <h3 className="text-sm font-medium">Certification</h3>
          <select
            className="w-full p-2 rounded border"
            value={filters.certification}
            onChange={(e) => setFilters({ ...filters, certification: e.target.value })}
          >
            <option value="all">All</option>
            <option value="certified">Certified</option>
            <option value="uncertified">Uncertified</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="my-4">
          <h3 className="text-sm font-medium">Price Per Lesson</h3>
          <input
            type="range"
            min="0"
            max="2000"  // Adjust the max price to reflect a larger price range
            value={filters.price[1]}
            onChange={(e) => setFilters({ ...filters, price: [0, Number(e.target.value)] })}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Up to ${filters.price[1]}</p>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 p-4 overflow-y-scroll">
          <h2 className="text-lg font-semibold mb-4">
            {filteredClasses.length} Classes
          </h2>
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="mb-4 p-4 border rounded shadow hover:shadow-lg"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDescription(cls.id)}
              >
                <div>
                  <h3 className="text-lg font-medium">{cls.name}</h3>
                  <p className="text-gray-500">{cls.teachingExperience}</p>
                  <p className="text-gray-700">{cls.price}</p>
                </div>
                <button className="text-blue-500">
                  {expandedClassId === cls.id ? "Hide" : "Show"} Details
                </button>
              </div>
              <div
                className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${expandedClassId === cls.id ? "max-h-96" : "max-h-0"}`}
              >
                <p>{cls.description}</p>
                <p className="text-sm text-gray-500 mt-1">{cls.location}</p>
                <p className="text-sm text-gray-500">Rating: {cls.reviews}</p>
                <p className="text-sm text-gray-500">Enrolled Students: {cls.studentsEnrolled}</p>
                <div className="flex gap-4 mt-4">
                  <button className="px-4 py-2 bg-green-500 text-white rounded">
                    Book Slot
                  </button>
                  <button
                    onClick={() => navigate(`/tutorpage/${cls.id}`)}  // Pass class id for navigation
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    See More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map displaying class locations */}
        <div className="w-1/2">
          <MapContainer
            center={[49.1, -122.6]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredClasses.map((cls) => (
              <Marker key={cls.id} position={cls.position}>
                <Popup>
                  <div>
                    <h3 className="font-medium">{cls.name}</h3>
                    <p>{cls.location}</p>
                    <p>{cls.price}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ClassListingPage;