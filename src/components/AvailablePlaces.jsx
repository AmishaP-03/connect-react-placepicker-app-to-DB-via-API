import { useEffect, useState } from 'react';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // HTTP request to fetch data from the backend API

  // 1st option -> will cause an infinite loop, so not preferred
  // fetch method is provided by the browser

  // fetch('https://localhost:3000/places').then((response) => {
  //   return response.json();
  // }).then((data) => setAvailablePlaces(data.places));

  // 2nd option ->
  // useEffect to solve the infinite loop issue. fetch method will be executed only once when the component is loaded for the first
  // useEffect(() => {
  //     fetch('http://localhost:3000/places').then((response) => {
  //       return response.json();
  //     }).then((data) => setAvailablePlaces(data.places));
  // }, []);

  // 3rd option, most modern ->
  // We cannot use async directly on react specific elements like component functions, callback functions used in react hooks etc
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response =  await fetch('http://localhost:3000/places');
      const data = await response.json();
      setAvailablePlaces(data.places);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={loading}
      loadingText={"Fetching data...."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
