import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";

interface LocationSelectorProps {
  onLocationChange: (location: {
    country: string;
    state: string;
    city: string;
  }) => void;
  initialValues?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

const LocationSelector = ({ onLocationChange, initialValues }: LocationSelectorProps) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  
  // Estado para armazenar os códigos ISO
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  
  // Estado para os nomes exibidos nos selects
  const [selectedCountry, setSelectedCountry] = useState<string>(initialValues?.country || "");
  const [selectedState, setSelectedState] = useState<string>(initialValues?.state || "");
  const [selectedCity, setSelectedCity] = useState<string>(initialValues?.city || "");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Efeito para inicializar os valores
  useEffect(() => {
    if (initialValues?.country) {
      const country = countries.find(c => c.name === initialValues.country);
      if (country) {
        setSelectedCountryCode(country.isoCode);
        setSelectedCountry(country.name);
        
        if (initialValues.state) {
          const countryStates = State.getStatesOfCountry(country.isoCode);
          setStates(countryStates);
          
          const state = countryStates.find(s => s.name === initialValues.state);
          if (state) {
            setSelectedStateCode(state.isoCode);
            setSelectedState(state.name);
            
            if (initialValues.city) {
              const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode);
              setCities(stateCities);
              setSelectedCity(initialValues.city);
            }
          }
        }
      }
    }
  }, [countries, initialValues]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const country = countries.find(c => c.isoCode === isoCode);
    
    if (country) {
      setSelectedCountryCode(isoCode);
      setSelectedCountry(country.name);
      setStates(State.getStatesOfCountry(isoCode));
      setSelectedStateCode("");
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
      
      onLocationChange({
        country: country.name,
        state: "",
        city: ""
      });
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const state = states.find(s => s.isoCode === isoCode);
    
    if (state) {
      setSelectedStateCode(isoCode);
      setSelectedState(state.name);
      setCities(City.getCitiesOfState(selectedCountryCode, isoCode));
      setSelectedCity("");
      
      onLocationChange({
        country: selectedCountry,
        state: state.name,
        city: ""
      });
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    onLocationChange({
      country: selectedCountry,
      state: selectedState,
      city: cityName
    });
  };

  return (
    <div className="mb-5">
      <h5 className="mb-3">Location Information</h5>
      
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="country">
            <Form.Label>Country *</Form.Label>
            <Form.Select
              value={selectedCountryCode}
              onChange={handleCountryChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Select
              value={selectedStateCode}
              onChange={handleStateChange}
              disabled={!selectedCountryCode}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Select
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedStateCode}
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={`${city.name}-${index}`} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default LocationSelector;