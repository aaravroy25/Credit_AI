import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "../i18n.js";
import { COUNTRY_COORDS, FLAGSHIP_ZOOM } from "../data/countryCoords.js";
import { apiUrl } from "../api.js";

// Fix default marker icon paths (Vite + Leaflet quirk — without this, pins are invisible)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/[email protected]/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/[email protected]/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/[email protected]/dist/images/marker-shadow.png",
});

const flagshipIcon = new L.Icon({
  iconUrl: "https://unpkg.com/[email protected]/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/[email protected]/dist/images/marker-shadow.png",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  className: "flagship-marker",
});

function FlyTo({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], zoom || 5, { duration: 0.8 });
  }, [coords, zoom, map]);
  return null;
}

// Forces Leaflet to recalculate its size after the container is actually
// visible/painted — the #1 cause of "grey tiles" / broken-looking maps.
function FixSize() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 400);
    window.addEventListener("resize", () => map.invalidateSize());
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

export default function LocationSelector({ countries, value, onChange }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("map"); // "map" | "search"
  const [countryDetail, setCountryDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedCountry = countries.find((c) => c.code === value.countryCode);

  useEffect(() => {
    if (!value.countryCode) {
      setCountryDetail(null);
      return;
    }
    setDetailLoading(true);
    fetch(apiUrl(`/api/locations/countries/${value.countryCode}`))
      .then((r) => r.json())
      .then((d) => setCountryDetail(d))
      .catch(() => setCountryDetail(null))
      .finally(() => setDetailLoading(false));
  }, [value.countryCode]);

  const isSupported = countryDetail?.supported;
  const states = isSupported ? Object.keys(countryDetail.states) : [];
  const cities = isSupported && value.state ? countryDetail.states[value.state] || [] : [];

  const coords = value.countryCode ? COUNTRY_COORDS[value.countryCode] : null;
  const zoom = FLAGSHIP_ZOOM[value.countryCode] || 5.5;

  return (
    <div>
      <div className="map-toggle-row">
        <button
          type="button"
          className={"toggle-btn " + (mode === "map" ? "active" : "")}
          onClick={() => setMode("map")}
        >
          🗺️ {t("selectOnMap")}
        </button>
        <button
          type="button"
          className={"toggle-btn " + (mode === "search" ? "active" : "")}
          onClick={() => setMode("search")}
        >
          🔎 {t("searchInstead")}
        </button>
      </div>

      {mode === "map" && (
        <div className="leaflet-map-container">
          <MapContainer
            center={[20, 10]}
            zoom={2}
            minZoom={2}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", background: "#dce8ef" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FixSize />
            {countries.map((c) => {
              const pos = COUNTRY_COORDS[c.code];
              if (!pos) return null;
              return (
                <Marker
                  key={c.code}
                  position={[pos.lat, pos.lng]}
                  icon={c.supported ? flagshipIcon : new L.Icon.Default()}
                  eventHandlers={{
                    click: () => onChange({ countryCode: c.code, state: "", city: "" }),
                  }}
                >
                  <Popup>
                    <strong>{c.name}</strong>
                    {c.supported && <div style={{ color: "#0f8b8d", fontSize: 12 }}>★ Flagship market — deep data</div>}
                  </Popup>
                </Marker>
              );
            })}
            <FlyTo coords={coords} zoom={zoom} />
          </MapContainer>
        </div>
      )}
      {mode === "map" && (
        <p className="field-hint" style={{ marginTop: -10, marginBottom: 16 }}>
          ★ markers are flagship markets with full alternative-data support. Any other pin still
          works — click it, or switch to search below.
        </p>
      )}

      <div className="form-grid">
        <div className="field">
          <label>{t("country")}</label>
          <select
            value={value.countryCode}
            onChange={(e) => onChange({ countryCode: e.target.value, state: "", city: "" })}
          >
            <option value="">—</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.supported ? "★ " : ""}{c.name}
              </option>
            ))}
          </select>
        </div>

        {isSupported ? (
          <>
            <div className="field">
              <label>{t("state")}</label>
              <select
                value={value.state}
                disabled={!states.length}
                onChange={(e) => onChange({ ...value, state: e.target.value, city: "" })}
              >
                <option value="">—</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("city")}</label>
              <select
                value={value.city}
                disabled={!cities.length}
                onChange={(e) => onChange({ ...value, city: e.target.value })}
              >
                <option value="">—</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label>{t("state")}</label>
              <input
                type="text"
                placeholder="Type your state/province"
                value={value.state}
                disabled={!value.countryCode || detailLoading}
                onChange={(e) => onChange({ ...value, state: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t("city")}</label>
              <input
                type="text"
                placeholder="Type your city"
                value={value.city}
                disabled={!value.countryCode || detailLoading}
                onChange={(e) => onChange({ ...value, city: e.target.value })}
              />
            </div>
          </>
        )}
      </div>

      {countryDetail && (
        <>
          <div className="field-hint" style={{ marginTop: 14 }}>
            {isSupported
              ? t("dataRailsTitle")
              : "This market isn't deep-mapped yet, so we'll use generic alternative data sources:"}
          </div>
          <div className="data-rail-tags">
            {countryDetail.dataRails.map((r) => (
              <span className="rail-tag" key={r}>{r}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
