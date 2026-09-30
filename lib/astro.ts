// Pure astronomical calculations — no network calls, ever. Everything here
// is computed from the current time plus a handful of orbital/positional
// constants, low-precision series good to well under a degree (Meeus,
// "Astronomical Algorithms"), which is far more precision than a status
// bar needs. Used by components/navigation.tsx's cycling telemetry and by
// app/not-found.tsx.
export type Observer = { lat: number; lon: number }
export type Equatorial = { ra: number; dec: number } // degrees
export type Horizontal = { alt: number; az: number } // degrees; az measured from North

export const NYC: Observer = { lat: 40.7128, lon: -74.006 }

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

function normalizeDegrees(deg: number): number {
  const d = deg % 360
  return d < 0 ? d + 360 : d
}

export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

export function moonPhase(date: Date): { age: number; illumination: number; name: string } {
  const jd = julianDay(date)
  const d = jd - 2451545.0

  // D = mean elongation of the Moon from the Sun, in degrees; the rest of
  // the series is evaluated from its radian form.
  const Ddeg = normalizeDegrees(297.8501921 + 12.19074911 * d)
  const D = Ddeg * DEG_TO_RAD
  const M = normalizeDegrees(357.5291092 + 0.98560028 * d) * DEG_TO_RAD
  const Mp = normalizeDegrees(134.9633964 + 13.06499295 * d) * DEG_TO_RAD

  const phaseAngle =
    180 -
    Ddeg -
    6.289 * Math.sin(Mp) +
    2.1 * Math.sin(M) -
    1.274 * Math.sin(2 * D - Mp) -
    0.658 * Math.sin(2 * D) -
    0.214 * Math.sin(2 * Mp) -
    0.11 * Math.sin(D)

  const illumination = (1 + Math.cos(phaseAngle * DEG_TO_RAD)) / 2
  const synodicMonth = 29.530588853
  // Elongation maps linearly onto the ~29.53-day synodic cycle.
  const age = (synodicMonth * Ddeg) / 360

  let name: string
  const frac = (age % synodicMonth) / synodicMonth
  if (frac < 0.03 || frac > 0.97) name = "new moon"
  else if (frac < 0.22) name = "waxing crescent"
  else if (frac < 0.28) name = "first quarter"
  else if (frac < 0.47) name = "waxing gibbous"
  else if (frac < 0.53) name = "full moon"
  else if (frac < 0.72) name = "waning gibbous"
  else if (frac < 0.78) name = "last quarter"
  else name = "waning crescent"

  return { age: age % synodicMonth, illumination, name }
}

// Greenwich Mean Sidereal Time, in degrees. Meeus 12.4.
export function greenwichMeanSiderealTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000
  return normalizeDegrees(gmst)
}

export function localSiderealTime(jd: number, lonDeg: number): number {
  return normalizeDegrees(greenwichMeanSiderealTime(jd) + lonDeg)
}

export function equatorialToHorizontal(eq: Equatorial, obs: Observer, date: Date): Horizontal {
  const jd = julianDay(date)
  const lst = localSiderealTime(jd, obs.lon)
  const hourAngle = normalizeDegrees(lst - eq.ra) * DEG_TO_RAD
  const dec = eq.dec * DEG_TO_RAD
  const lat = obs.lat * DEG_TO_RAD

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle)
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)))

  const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat))
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * RAD_TO_DEG
  if (Math.sin(hourAngle) > 0) az = 360 - az

  return { alt: alt * RAD_TO_DEG, az }
}

// Low-precision Sun position (Meeus ch. 25), good to ~0.01 deg.
export function sunPosition(date: Date): Equatorial {
  const jd = julianDay(date)
  const T = (jd - 2451545.0) / 36525

  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T)
  const M = normalizeDegrees(357.52911 + 35999.05029 * T)
  const Mrad = M * DEG_TO_RAD

  const C =
    (1.914602 - 0.004817 * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad)

  const trueLong = normalizeDegrees(L0 + C)
  const omega = 125.04 - 1934.136 * T
  const apparentLong = trueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD)
  const obliquity = 23.439291 - 0.0130042 * T

  const lambda = apparentLong * DEG_TO_RAD
  const eps = obliquity * DEG_TO_RAD

  const ra = normalizeDegrees(Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) * RAD_TO_DEG)
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda)) * RAD_TO_DEG

  return { ra, dec }
}

// J2000 positions of a handful of bright, recognizable stars. Precession is
// irrelevant at status-bar precision over a human lifetime.
export const STARS: readonly { name: string; ra: number; dec: number }[] = [
  { name: "Sirius", ra: 101.287, dec: -16.716 },
  { name: "Vega", ra: 279.234, dec: 38.784 },
  { name: "Arcturus", ra: 213.915, dec: 19.182 },
  { name: "Capella", ra: 79.172, dec: 45.998 },
  { name: "Betelgeuse", ra: 88.793, dec: 7.407 },
  { name: "Polaris", ra: 37.955, dec: 89.264 },
  { name: "Rigel", ra: 78.634, dec: -8.202 },
  { name: "Procyon", ra: 114.825, dec: 5.225 },
]

// Terse, lowercase status-bar readouts, e.g. "moon 78% waxing gibbous". The
// star line always names whichever bright star is currently highest for
// the observer, so the line is never about something below the horizon.
export function telemetryReadouts(now: Date, obs: Observer = NYC): string[] {
  const moon = moonPhase(now)
  const sun = sunPosition(now)
  const sunHoriz = equatorialToHorizontal(sun, obs, now)

  let highest = STARS[0]
  let highestAlt = -90
  for (const star of STARS) {
    const horiz = equatorialToHorizontal({ ra: star.ra, dec: star.dec }, obs, now)
    if (horiz.alt > highestAlt) {
      highestAlt = horiz.alt
      highest = star
    }
  }

  const jd = julianDay(now)
  const lst = localSiderealTime(jd, obs.lon) / 15 // hours
  const lstH = Math.floor(lst)
  const lstM = Math.floor((lst - lstH) * 60)

  const sunPhase = sunHoriz.alt > 0 ? "day" : sunHoriz.alt > -6 ? "civil twilight" : sunHoriz.alt > -18 ? "twilight" : "astronomical night"

  const starLine =
    highestAlt > 0
      ? `${highest.name.toLowerCase()} alt ${highestAlt.toFixed(1)}° az ${equatorialToHorizontal({ ra: highest.ra, dec: highest.dec }, obs, now).az.toFixed(1)}°`
      : `sun alt ${sunHoriz.alt.toFixed(1)}° · ${sunPhase}`

  return [
    `moon ${Math.round(moon.illumination * 100)}% ${moon.name}`,
    starLine,
    `lst ${lstH.toString().padStart(2, "0")}h${lstM.toString().padStart(2, "0")}m · ${obs.lat.toFixed(2)}n ${Math.abs(obs.lon).toFixed(2)}w`,
  ]
}
