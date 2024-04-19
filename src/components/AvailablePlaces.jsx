import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // HTTP request to fetch data from the backend API

  // 1st option -> will cause an infinite loop, so not preferred
  // fetch method is provided by the browser

  // fetch('https://localhost:3000/places').then((response) => {
  //   return response.json();
  // }).then((data) => setAvailablePlaces(data.places));

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
