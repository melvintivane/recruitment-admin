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
  
  const [selectedCountry, setSelectedCountry] = useState<string>(initialValues?.country || "");
  const [selectedState, setSelectedState] = useState<string>(initialValues?.state || "");
  const [selectedCity, setSelectedCity] = useState<string>(initialValues?.city || "");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryObj = countries.find(c => c.isoCode === selectedCountry);
      const countryName = countryObj?.name || "";
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
      onLocationChange({
        country: countryName,
        state: "",
        city: ""
      });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateObj = states.find(s => s.isoCode === selectedState);
      const stateName = stateObj?.name || "";
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      setSelectedCity("");
      onLocationChange({
        country: countries.find(c => c.isoCode === selectedCountry)?.name || "",
        state: stateName,
        city: ""
      });
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      onLocationChange({
        country: countries.find(c => c.isoCode === selectedCountry)?.name || "",
        state: states.find(s => s.isoCode === selectedState)?.name || "",
        city: selectedCity
      });
    }
  }, [selectedCity]);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Location Information</h5>
      
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="country">
            <Form.Label>Country *</Form.Label>
            <Form.Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
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
            <Form.Label>State *</Form.Label>
            <Form.Select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              disabled={!selectedCountry}
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
            <Form.Label>City *</Form.Label>
            <Form.Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              disabled={!selectedState}
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