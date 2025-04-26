
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import mapboxgl from 'mapbox-gl';

// Set Mapbox Access Token Globally
// This is a public token for this example - typically would be in env var
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhdGl0dWQzIiwiYSI6ImNtOXlycGJiNjFpOGEybXEwNGRvaGo0NmwifQ.o9pk9WZT4UjsBz768aC1Zg';

createRoot(document.getElementById("root")!).render(<App />);
