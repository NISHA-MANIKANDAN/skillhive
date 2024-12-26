import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Configuring Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveLocationPage = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setError("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full flex flex-col items-center p-8 gap-6">
        {/* Map Section */}
        <div className="flex-1 w-full h-[500px] mb-6 rounded-lg overflow-hidden">
          {location.lat && location.lng ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              style={{ width: "100%", height: "500px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <p>
                    <strong>Your Location</strong>
                  </p>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p className="text-gray-700">{error || "Loading map..."}</p>
          )}
        </div>

        {/* Explore Classes Section */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Classes preview"
            className="w-36 h-36 object-cover rounded-md"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Feeling Lost? Don't Worry!</h2>
            <p className="text-gray-600">
              All the fun stuff is right around the corner. Click below to explore exciting classes and learn more.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              onClick={() => navigate("/classes")}
            >
              Explore Classes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;