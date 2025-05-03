import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Layout from './components/Layout';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: '📱', placeholder: 'https://facebook.com/username' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/username' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
  { id: 'youtube', name: 'YouTube', icon: '🎥', placeholder: 'https://youtube.com/c/username' }
];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const center = {
  lat: -37.8136,
  lng: 144.9631
};

const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "all",
      stylers: [{ saturation: -100 }]
    }
  ],
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false
};

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    website: '',
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    previousWebsite: '',
    businessId: '',
    openingHours: {
      alwaysOpen: false,
      noOpeningHours: false,
      schedule: {
        MONDAY: { open: '09:00', close: '17:00', enabled: true },
        TUESDAY: { open: '09:00', close: '17:00', enabled: true },
        WEDNESDAY: { open: '09:00', close: '17:00', enabled: true },
        THURSDAY: { open: '09:00', close: '17:00', enabled: true },
        FRIDAY: { open: '09:00', close: '17:00', enabled: true },
        SATURDAY: { open: '10:00', close: '15:00', enabled: false },
        SUNDAY: { open: '10:00', close: '15:00', enabled: false }
      }
    },
    socialMedia: {}
  });

  const [selectedAccounts, setSelectedAccounts] = useState(['facebook']);
  const [mapCenter, setMapCenter] = useState(center);

  const handleAddAccount = () => {
    const availablePlatforms = socialPlatforms.filter(platform => 
      !selectedAccounts.includes(platform.id)
    );
    if (availablePlatforms.length > 0) {
      setSelectedAccounts([...selectedAccounts, availablePlatforms[0].id]);
    }
  };

  const handleRemoveAccount = (platformId) => {
    setSelectedAccounts(selectedAccounts.filter(id => id !== platformId));
    setFormData(prev => {
      const newSocialMedia = { ...prev.socialMedia };
      delete newSocialMedia[platformId];
      return { ...prev, socialMedia: newSocialMedia };
    });
  };

  const onMapClick = useCallback((event) => {
    setMapCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleScheduleChange = (day, type, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        schedule: {
          ...prev.openingHours.schedule,
          [day]: {
            ...prev.openingHours.schedule[day],
            [type]: value
          }
        }
      }
    }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        schedule: {
          ...prev.openingHours.schedule,
          [day]: {
            ...prev.openingHours.schedule[day],
            enabled: !prev.openingHours.schedule[day].enabled
          }
        }
      }
    }));
  };

  return (
    <Layout>
    <div className="contact-container">
      <div className="header-section">
        <h1 className="title">Contact Information</h1>
        <p className="subtitle">Complete your business details to create your website</p>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <div className="input-group">
            <label>Website URL</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="yourwebsite.com"
              className="input-field"
            />
          </div>

          <div className="name-fields">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Business Street"
              className="input-field"
            />
          </div>

          <div className="postal-city">
            <div className="input-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="12345"
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (234) 567-8900"
              className="input-field"
            />
          </div>
        </div>

        <div className="map-section">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={14}
              onClick={onMapClick}
              options={mapOptions}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <div className="business-hours">
        <h3 className="section-title">Business Hours</h3>
        <div className="hours-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.openingHours.alwaysOpen}
              onChange={() => setFormData(prev => ({
                ...prev,
                openingHours: { 
                  ...prev.openingHours, 
                  alwaysOpen: !prev.openingHours.alwaysOpen,
                  noOpeningHours: false
                }
              }))}
            />
            <span>Always Open</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.openingHours.noOpeningHours}
              onChange={() => setFormData(prev => ({
                ...prev,
                openingHours: { 
                  ...prev.openingHours, 
                  noOpeningHours: !prev.openingHours.noOpeningHours,
                  alwaysOpen: false
                }
              }))}
            />
            <span>No Opening Hours Available</span>
          </label>
        </div>

        {!formData.openingHours.alwaysOpen && !formData.openingHours.noOpeningHours && (
          <div className="schedule-grid">
            {Object.entries(formData.openingHours.schedule).map(([day, hours]) => (
              <div key={day} className="schedule-row">
                <label className="day-label">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
                {hours.enabled && (
                  <>
                    <div className="time-input">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                      />
                    </div>
                    <div className="time-input">
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="social-media">
        <h3 className="section-title">Social Media Accounts</h3>
        <div className="social-inputs">
          {selectedAccounts.map(platformId => {
            const platform = socialPlatforms.find(p => p.id === platformId);
            return (
              <div key={platform.id} className="social-input">
                <span className="platform-icon">{platform.icon}</span>
                <span className="platform-name">{platform.name}</span>
                <input
                  type="text"
                  value={formData.socialMedia[platform.id] || ''}
                  onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                  placeholder={platform.placeholder}
                  className="social-field"
                />
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveAccount(platform.id)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        {selectedAccounts.length < socialPlatforms.length && (
          <button className="add-account-btn" onClick={handleAddAccount}>
            + Add another account
          </button>
        )}
      </div>

      <div className="navigation-buttons">
        <button className="previous-btn" onClick={() => router.push('/content')}>
          ← Previous
        </button>
        <button className="continue-btn" onClick={() => router.push('/legal')}>
          Continue →
        </button>
      </div>

      <style jsx>{`
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .title {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .subtitle {
          color: #4a5568;
          font-size: 1.1rem;
        }

        .section-title {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .form-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          outline: none;
        }

        .name-fields, .postal-city {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .business-hours {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 3rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .hours-options {
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 1.25rem;
          height: 1.25rem;
        }

        .schedule-grid {
          display: grid;
          gap: 1rem;
        }

        .schedule-row {
          display: grid;
          grid-template-columns: 200px 1fr 1fr;
          gap: 1.5rem;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .day-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .time-input input {
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          width: 100%;
        }

        .social-media {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 3rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .social-input {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .platform-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .platform-name {
          min-width: 100px;
          font-weight: 500;
        }

        .social-field {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        .add-account-btn {
          color: #4299e1;
          background: none;
          border: 2px dashed #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          transition: all 0.3s ease;
        }

        .add-account-btn:hover {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
        }

        .previous-btn, .continue-btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .previous-btn {
          background: white;
          border: 2px solid #e2e8f0;
          color: #4a5568;
        }

        .previous-btn:hover {
          background: #f8fafc;
        }

        .continue-btn {
          background: #4299e1;
          border: none;
          color: white;
        }

        .continue-btn:hover {
          background: #3182ce;
        }
      `}</style>
    </div>
    </Layout>
  );
}