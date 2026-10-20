// Pictured Rocks weekend, Oct 24–26 2026. All times are Michigan time (EDT, UTC-4).

export type LatLng = [number, number];

export type Place = {
  id: string;
  name: string;
  pos: LatLng;
  /** How close (meters) counts as "you're here". */
  radius: number;
  /** Destination string for Google Maps directions. */
  nav: string;
};

export type StopKind = "home" | "drive" | "visit" | "hike" | "cruise" | "food" | "stay";

export type Checkpoint = { name: string; pos: LatLng; at: string; mile: number };

export type Stop = {
  id: string;
  day: DayId;
  kind: StopKind;
  title: string;
  place: Place;
  start: string;
  end: string;
  /** Hard deadline to be on site (cruise boarding). Missing it means missing the stop. */
  arriveBy?: string;
  hard?: boolean;
  todo: string[];
  tips?: string[];
  backup?: string;
  checkpoints?: Checkpoint[];
};

export type DayId = "sat" | "sun" | "mon";

export const DAYS: { id: DayId; label: string; date: string; theme: string }[] = [
  { id: "sat", label: "Sat", date: "2026-10-24", theme: "Drive up · Kitch-iti-kipi · Boat tour" },
  { id: "sun", label: "Sun", date: "2026-10-25", theme: "Chapel Loop · Miners Castle · Falls" },
  { id: "mon", label: "Mon", date: "2026-10-26", theme: "Tahquamenon Falls · Drive home" },
];

const P = {
  home: { id: "home", name: "Farmington Hills", pos: [42.4853, -83.3772], radius: 4000, nav: "Farmington Hills, MI" },
  mackinac: { id: "mackinac", name: "Mackinac Bridge", pos: [45.8174, -84.7278], radius: 3000, nav: "Mackinac Bridge, MI" },
  kitch: { id: "kitch", name: "Kitch-iti-kipi (Big Spring)", pos: [46.0042, -86.3819], radius: 600, nav: "Kitch-iti-kipi, Manistique, MI" },
  town: { id: "town", name: "Downtown Munising", pos: [46.4118, -86.6497], radius: 700, nav: "Downtown Munising, MI" },
  dock: { id: "dock", name: "Pictured Rocks Cruises dock", pos: [46.4128, -86.6545], radius: 250, nav: "Pictured Rocks Cruises, 100 W City Park Dr, Munising, MI" },
  house: { id: "house", name: "The house · 1302 Bay St", pos: [46.4158, -86.6315], radius: 150, nav: "1302 Bay St, Munising, MI 49862" },
  bay: { id: "bay", name: "Lake chairs · Sunset Motel yard", pos: [46.4166, -86.6309], radius: 200, nav: "Sunset Motel on the Bay, 1315 Bay St, Munising, MI" },
  chapelTh: { id: "chapelTh", name: "Chapel trailhead", pos: [46.5135, -86.443], radius: 400, nav: "Chapel Falls Trailhead, Munising Township, MI" },
  chapelLoop: { id: "chapelLoop", name: "Chapel Loop trail", pos: [46.5289, -86.4443], radius: 3200, nav: "Chapel Falls Trailhead, Munising Township, MI" },
  minersFalls: { id: "minersFalls", name: "Miners Falls", pos: [46.4747, -86.5314], radius: 900, nav: "Miners Falls Trailhead, MI" },
  minersCastle: { id: "minersCastle", name: "Miners Castle overlook", pos: [46.4955, -86.5513], radius: 600, nav: "Miners Castle, Munising, MI" },
  munisingFalls: { id: "munisingFalls", name: "Munising Falls", pos: [46.4227, -86.6212], radius: 450, nav: "Munising Falls, Munising, MI" },
  sandPoint: { id: "sandPoint", name: "Sand Point Beach", pos: [46.4495, -86.6071], radius: 600, nav: "Sand Point Beach, Munising, MI" },
  tahq: { id: "tahq", name: "Upper Tahquamenon Falls", pos: [46.578, -85.253], radius: 900, nav: "Upper Tahquamenon Falls, Paradise, MI" },
} satisfies Record<string, Place>;

export const PLACES: Place[] = Object.values(P);

export const STOPS: Stop[] = [
  // Saturday
  {
    id: "depart", day: "sat", kind: "home", title: "Roll out", place: P.home,
    start: "2026-10-24T05:30:00-04:00", end: "2026-10-24T06:00:00-04:00",
    todo: ["Cooler with the cooked food + rice/dal/spices", "Rain jackets, warm layers, hiking shoes", "Headlamps + power bank", "Recreation Passport on the plate (or buy at the gate)", "Full tank before I-75"],
    tips: ["Leave by 6:00 or the 3 PM cruise gets tight."],
  },
  {
    id: "drive-north", day: "sat", kind: "drive", title: "Drive north · I-75, Mackinac, US-2", place: P.mackinac,
    start: "2026-10-24T06:00:00-04:00", end: "2026-10-24T11:45:00-04:00",
    todo: ["Gas and a break in Mackinaw City around 10:00", "Mackinac Bridge toll", "US-2 west hugs Lake Michigan, enjoy the view"],
  },
  {
    id: "kitch", day: "sat", kind: "visit", title: "Kitch-iti-kipi", place: P.kitch,
    start: "2026-10-24T11:45:00-04:00", end: "2026-10-24T12:30:00-04:00",
    todo: ["Ride the self-pull raft across the spring", "Look straight down: 40 ft of crystal-clear water and giant trout", "Quick photos, back on the road by 12:30"],
    tips: ["State park: needs the Recreation Passport."],
  },
  {
    id: "drive-munising", day: "sat", kind: "drive", title: "Drive to Munising · M-94", place: P.town,
    start: "2026-10-24T12:30:00-04:00", end: "2026-10-24T13:45:00-04:00",
    todo: ["About 1 hr 10 min through Hiawatha forest"],
  },
  {
    id: "lunch-sat", day: "sat", kind: "food", title: "Quick lunch in town", place: P.town,
    start: "2026-10-24T13:45:00-04:00", end: "2026-10-24T14:30:00-04:00",
    todo: ["Eat fast, boarding is at 2:30", "Grab coffee / snacks for the boat"],
    tips: ["Running late? Eat in the car and go straight to the dock."],
  },
  {
    id: "cruise", day: "sat", kind: "cruise", title: "Spray Falls boat cruise", place: P.dock,
    start: "2026-10-24T15:00:00-04:00", end: "2026-10-24T17:00:00-04:00",
    arriveBy: "2026-10-24T14:30:00-04:00", hard: true,
    todo: ["Tickets on phone (3 × $56)", "Grab an upper-deck spot early", "Wear the warmest layer, the wind on Lake Superior is cold", "Watch for Spray Falls dropping straight into the lake"],
    backup: "If the 3 PM sailing is missed or cancelled for weather, take the Sunday 12 PM cruise and hike Chapel after lunch.",
  },
  {
    id: "checkin", day: "sat", kind: "stay", title: "Check in at the house", place: P.house,
    start: "2026-10-24T17:10:00-04:00", end: "2026-10-24T18:00:00-04:00",
    todo: ["Check-in per William's message (lockbox/code)", "Food into the fridge", "Pack tomorrow's hike bag"],
  },
  {
    id: "sunset-sat", day: "sat", kind: "visit", title: "Sunset by the lake", place: P.bay,
    start: "2026-10-24T18:00:00-04:00", end: "2026-10-24T19:00:00-04:00",
    todo: ["Chairs in the Sunset Motel front yard, the host said it is fine", "Sunset over Munising Bay + Grand Island"],
  },
  {
    id: "dinner-sat", day: "sat", kind: "stay", title: "Dinner at home base", place: P.house,
    start: "2026-10-24T19:00:00-04:00", end: "2026-10-24T23:30:00-04:00",
    todo: ["Heat up dinner", "Charge phones + power banks", "Alarm for 7:00"],
  },

  // Sunday
  {
    id: "breakfast-sun", day: "sun", kind: "stay", title: "Breakfast + pack the hike bag", place: P.house,
    start: "2026-10-25T07:00:00-04:00", end: "2026-10-25T07:45:00-04:00",
    todo: ["2 L water each", "Lunch + snacks for Mosquito Beach", "Rain jacket, layers, headlamp", "Download the offline map, there is no signal on the trail"],
  },
  {
    id: "drive-chapel", day: "sun", kind: "drive", title: "Drive to Chapel trailhead", place: P.chapelTh,
    start: "2026-10-25T07:45:00-04:00", end: "2026-10-25T08:30:00-04:00",
    todo: ["H-58 east, then Chapel Rd. The last 5 mi is gravel, go slow"],
  },
  {
    id: "chapel", day: "sun", kind: "hike", title: "Chapel Loop · 10 mi", place: P.chapelLoop,
    start: "2026-10-25T08:30:00-04:00", end: "2026-10-25T13:15:00-04:00",
    todo: ["Loop order: Chapel Falls, Chapel Rock, the cliffs, Mosquito Beach, Mosquito Falls", "Lunch break at Mosquito Beach", "Stay back from cliff edges, they are undercut"],
    tips: ["Behind pace? Turn back at Chapel Rock for a 6.4 mi out-and-back."],
    checkpoints: [
      { name: "Trailhead", pos: [46.5135, -86.443], at: "2026-10-25T08:30:00-04:00", mile: 0 },
      { name: "Chapel Falls", pos: [46.529, -86.4443], at: "2026-10-25T09:05:00-04:00", mile: 1.3 },
      { name: "Chapel Rock", pos: [46.5487, -86.4381], at: "2026-10-25T10:00:00-04:00", mile: 3.2 },
      { name: "Mosquito Beach", pos: [46.5305, -86.4972], at: "2026-10-25T11:30:00-04:00", mile: 6.4 },
      { name: "Mosquito Falls", pos: [46.5165, -86.4783], at: "2026-10-25T12:20:00-04:00", mile: 8.0 },
      { name: "Back at the car", pos: [46.5135, -86.443], at: "2026-10-25T13:15:00-04:00", mile: 10.0 },
    ],
  },
  {
    id: "miners-falls", day: "sun", kind: "visit", title: "Miners Falls", place: P.minersFalls,
    start: "2026-10-25T13:55:00-04:00", end: "2026-10-25T14:40:00-04:00",
    todo: ["1.2 mi round trip through the forest", "Stairs down to the viewing deck"],
  },
  {
    id: "miners-castle", day: "sun", kind: "visit", title: "Miners Castle overlook", place: P.minersCastle,
    start: "2026-10-25T14:50:00-04:00", end: "2026-10-25T15:45:00-04:00",
    todo: ["Lower overlook for the classic castle shot", "Walk down to Miners Beach if legs allow"],
  },
  {
    id: "munising-falls", day: "sun", kind: "visit", title: "Munising Falls", place: P.munisingFalls,
    start: "2026-10-25T16:10:00-04:00", end: "2026-10-25T16:45:00-04:00",
    todo: ["Easy 0.4 mi paved walk", "50 ft falls in a sandstone bowl"],
  },
  {
    id: "sand-point", day: "sun", kind: "visit", title: "Sand Point Beach", place: P.sandPoint,
    start: "2026-10-25T16:55:00-04:00", end: "2026-10-25T17:50:00-04:00",
    todo: ["Chill on the beach, views of the cliffs across the bay", "Skip stones, rest the legs"],
  },
  {
    id: "dinner-sun", day: "sun", kind: "stay", title: "Dinner + laundry at the house", place: P.house,
    start: "2026-10-25T18:00:00-04:00", end: "2026-10-25T23:30:00-04:00",
    todo: ["Cook dinner", "Washer for muddy clothes", "Pack most bags tonight"],
  },

  // Monday
  {
    id: "checkout", day: "mon", kind: "stay", title: "Pack + check out", place: P.house,
    start: "2026-10-26T07:30:00-04:00", end: "2026-10-26T09:00:00-04:00",
    todo: ["Dishes done, trash out", "Sweep for chargers + jackets", "Lock up per William's instructions (checkout by 11)"],
  },
  {
    id: "drive-tahq", day: "mon", kind: "drive", title: "Drive to Tahquamenon · M-28, M-123", place: P.tahq,
    start: "2026-10-26T09:00:00-04:00", end: "2026-10-26T10:45:00-04:00",
    todo: ["About 1 hr 45 min, gas in Newberry if needed"],
  },
  {
    id: "tahq", day: "mon", kind: "visit", title: "Upper Tahquamenon Falls + lunch", place: P.tahq,
    start: "2026-10-26T10:45:00-04:00", end: "2026-10-26T12:45:00-04:00",
    todo: ["Brink-of-the-falls viewing stairs", "Root-beer-colored water (tannins, not dirt)", "Lunch at Tahquamenon Falls Brewery next to the lot"],
    tips: ["State park: same Recreation Passport."],
  },
  {
    id: "drive-home", day: "mon", kind: "drive", title: "Drive home · Mackinac, I-75", place: P.home,
    start: "2026-10-26T12:45:00-04:00", end: "2026-10-26T18:00:00-04:00",
    todo: ["About 5 hrs", "Gas + dinner stop around Gaylord"],
  },
  {
    id: "home", day: "mon", kind: "home", title: "Home", place: P.home,
    start: "2026-10-26T18:00:00-04:00", end: "2026-10-26T23:59:00-04:00",
    todo: ["Unload, rest, show everyone the pictures"],
  },
];

export const TRIP_START = STOPS[0].start;
export const TRIP_END = "2026-10-26T23:59:00-04:00";

export const PREP_TODO = [
  "Book the Sat 3 PM Spray Falls cruise (picturedrocks.com)",
  "Confirm check-in details with William",
  "Michigan Recreation Passport for Kitch-iti-kipi + Tahquamenon",
  "Cook + pack the food, cooler + ice",
  "Download the offline map for Alger County",
  "Rain jackets, warm layers, hiking shoes, headlamps",
];
