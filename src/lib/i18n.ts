export type Language = "en" | "hi";

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  navFindMatch: { en: "Find Match", hi: "सहेली ढूंढें" },
  navAutoTrust: { en: "Auto Trust", hi: "ऑटो भरोसा" },
  navActiveRide: { en: "Active Ride", hi: "सक्रिय राइड" },
  navProfile: { en: "Profile", hi: "प्रोफ़ाइल" },

  // Top Bar & Disclosures
  networkOnline: { en: "Network Online", hi: "नेटवर्क सक्रिय" },
  pilotActive: { en: "Pilot Active", hi: "पायलट चालू" },
  demoMode: { en: "Demo", hi: "डेमो" },
  pilotDisclosure: {
    en: "Pilot Demo Mode • Simulated Transit Data for Evaluation",
    hi: "पायलट डेमो मोड • मूल्यांकन हेतु सिमुलेटेड ट्रांजिट डेटा",
  },
  landingPageLink: { en: "Landing Page", hi: "मुख्य पृष्ठ" },
  bhopalHub: { en: "Bhopal", hi: "भोपाल" },
  safeHavenBtn: { en: "Safe Havens", hi: "सेफ हेवन" },
  offlineCacheReady: { en: "Offline Safe-Cache Ready", hi: "ऑफलाइन सेफ-कैश सक्रिय" },

  // Find Match Tab
  instantDemoTitle: { en: "Instant Commute Match Test", hi: "तुरंत कम्यूट मैच टेस्ट" },
  tryDemoBtn: { en: "Try Demo", hi: "डेमो देखें" },
  demoDesc: {
    en: "Pre-loads Rani Kamalapati Station → Arera Colony E-6 with verified co-riders & 50% fare split.",
    hi: "रानी कमलापति स्टेशन → अरेरा कॉलोनी E-6 के लिए सत्यापित सह-यात्री और 50% किराया छूट।",
  },
  noSignupRequired: { en: "⚡ No signup or KYC required", hi: "⚡ कोई साइनअप या KYC आवश्यक नहीं" },
  originStationLabel: { en: "Origin Transit Station", hi: "शुरुआती ट्रांजिट स्टेशन" },
  destDropLabel: { en: "Destination Drop Pin", hi: "गंतव्य ड्रॉप पिन" },
  landmarkLabel: { en: "Landmark", hi: "लैंडमार्क" },
  liveRouteMap: { en: "Live Route Overlap Map (OSRM)", hi: "लाइव रूट ओवरलैप मैप (OSRM)" },
  haversineCorridorOverlap: { en: "Haversine Corridor Overlap", hi: "हावरसाइन रूट ओवरलैप" },
  fairFareSplit: { en: "Fair Fare Split", hi: "उचित किराया बंटवारा" },
  youSave: { en: "You Save", hi: "आपकी बचत" },
  corridorShared: { en: "Corridor Shared", hi: "साझा दूरी" },
  verifiedCoRiders: { en: "Verified Co-Riders (≥ 65% Overlap)", hi: "सत्यापित सह-यात्री (≥ 65% ओवरलैप)" },
  availableCount: { en: "Available", hi: "उपलब्ध" },
  connectAndRide: { en: "Connect & Ride", hi: "जुड़ें और चलें" },
  quickColonyChips: { en: "Quick 1-Tap Residential Colonies", hi: "1-टैप प्रमुख आवासीय कॉलोनियां" },
  eveningModeTitle: { en: "Evening Safe-Corridor Active", hi: "शाम का सुरक्षित कॉरिडोर सक्रिय" },
  eveningModeDesc: {
    en: "Well-lit arterial route with active community auto posts & auto-guardian mode enabled.",
    hi: "सक्रिय कम्युनिटी ऑटो पोस्ट और ऑटो-गार्डियन युक्त रोशनी वाला सुरक्षित मुख्य मार्ग।",
  },
  eveningModeToggle: { en: "Night Safe Shield", hi: "नाइट सेफ शील्ड" },

  // Auto Trust Tab & Community Ledger
  autoTrustTitle: { en: "Crowdsourced Community Auto Ledger", hi: "कम्युनिटी ऑटो लेजर" },
  autoTrustSubtitle: {
    en: "Bhopal's open safety ledger vouched by women commuters • Look up or review any auto plate.",
    hi: "भोपाल की महिला यात्रियों द्वारा संचालित सुरक्षा लेजर • किसी भी ऑटो का नंबर जांचें या रेटिंग जोड़ें।",
  },
  lookupLabel: { en: "Check Auto Number Plate", hi: "ऑटो नंबर प्लेट जांचें" },
  checkPlateLabel: { en: "Check Auto Number Plate", hi: "ऑटो नंबर प्लेट जांचें" },
  scanQrBtn: { en: "Community Feed", hi: "कम्युनिटी फीड" },
  verifyBtn: { en: "Check Plate", hi: "जांचें" },
  searchPlaceholder: { en: "Enter Auto Plate (e.g. MP-04-4821, MP-04-7732)", hi: "ऑटो नंबर दर्ज करें (उदा. MP-04-4821, MP-04-7732)" },
  quickStandBadges: { en: "Sample Auto Plates (Click to Inspect)", hi: "नमूना ऑटो नंबर (जांचने हेतु टैप करें)" },
  verifiedStandDriver: { en: "Community Verified Auto", hi: "कम्युनिटी सत्यापित ऑटो" },
  verifiedSince: { en: "Verified Since", hi: "सत्यापित वर्ष" },
  womenSafeRides: { en: "Women-Safe Rides", hi: "महिला-सुरक्षित राइड्स" },
  safetyRating: { en: "Safety Rating", hi: "सुरक्षा रेटिंग" },
  zeroComplaints: { en: "Zero safety complaints", hi: "शून्य सुरक्षा शिकायत" },
  communitySafetyTags: { en: "Community Safety Tags", hi: "कम्युनिटी सुरक्षा टैग्स" },
  vouchForDriver: { en: "Vouch for Auto", hi: "ऑटो का समर्थन करें" },
  vouchedRecorded: { en: "Vouched (+1 Recorded)", hi: "समर्थित (+1 दर्ज)" },
  useInRide: { en: "Use in Ride", hi: "राइड में चुनें" },

  // Community Ledger Log & Rate Modal
  logAutoBtn: { en: "+ Log & Rate an Auto", hi: "+ ऑटो का रिव्यू जोड़ें" },
  logAutoModalTitle: { en: "Log Auto to Community Ledger", hi: "कम्युनिटी लेजर में ऑटो दर्ज करें" },
  logAutoModalDesc: {
    en: "Crowdsource safety in Bhopal. Your review helps other women commuters travel without fear.",
    hi: "भोपाल में सुरक्षा को सशक्त बनाएं। आपका रिव्यू अन्य महिलाओं को सुरक्षित यात्रा करने में मदद करता है।",
  },
  plateInputLabel: { en: "Auto Registration Plate", hi: "ऑटो रजिस्ट्रेशन नंबर" },
  plateInputPlaceholder: { en: "e.g. MP-04-7732", hi: "उदा. MP-04-7732" },
  driverNameOptional: { en: "Driver Name (Optional)", hi: "चालक का नाम (वैकल्पिक)" },
  hubStationLabel: { en: "Transit Hub / Stand", hi: "ट्रांजिट हब / स्टैंड" },
  verdictLabel: { en: "Safety Verdict", hi: "सुरक्षा निर्णय" },
  verdictSafe: { en: "Safe & Recommended", hi: "हर तरह से सुरक्षित व अनुशंसित" },
  verdictNeutral: { en: "Neutral / Okay", hi: "सामान्य / ठीक-ठाक" },
  verdictCaution: { en: "Flag Caution", hi: "सतर्क रहें / शिकायत" },
  behaviorTagsLabel: { en: "Quick 1-Tap Behavior Tags", hi: "1-टैप व्यवहार टैग्स" },
  tagPolite: { en: "Polite & Respectful", hi: "विनम्र व्यवहार" },
  tagFairFare: { en: "Fair Fare / No Haggling", hi: "उचित किराया / मोलभाव नहीं" },
  tagSafeRoute: { en: "Followed Safe Route", hi: "सुरक्षित मार्ग का पालन" },
  tagWellMaintained: { en: "Well-Maintained Auto", hi: "साफ-सुथरा ऑटो" },
  tagNightVerified: { en: "Night Safe", hi: "रात में सुरक्षित" },
  tagSosButton: { en: "SOS Button Fitted", hi: "SOS बटन उपलब्ध" },
  shortNoteLabel: { en: "1-Line Commuter Note", hi: "1-लाइन यात्री टिप्पणी" },
  shortNotePlaceholder: {
    en: "e.g. Drove safely via well-lit main road, very courteous.",
    hi: "उदा. मुख्य सड़क से सुरक्षित ले गए, विनम्र व्यवहार।",
  },
  submitLedgerBtn: { en: "Log to Community Ledger", hi: "कम्युनिटी लेजर में दर्ज करें" },
  cancelBtn: { en: "Cancel", hi: "रद्द करें" },
  recentLedgerFeed: { en: "Live Community Auto Ledger Feed", hi: "लाइव कम्युनिटी ऑटो लेजर फीड" },
  recentLedgerDesc: {
    en: "Recent crowdsourced safety ratings by women commuters across Bhopal hubs.",
    hi: "भोपाल के प्रमुख स्टेशनों से महिला यात्रियों द्वारा हाल ही में दर्ज की गई रेटिंग्स।",
  },
  postRideVouchTitle: { en: "Vouch for Auto in Community Ledger", hi: "कम्युनिटी लेजर में ऑटो का रिव्यू जोड़ें" },
  postRideVouchDesc: {
    en: "Help sister commuters by logging this auto into the Bhopal Community Ledger.",
    hi: "भोपाल कम्युनिटी लेजर में इस ऑटो का रिव्यू दर्ज कर अन्य बहनों की मदद करें।",
  },
  postRideVouchSuccess: {
    en: "Thank you! Your vouch is logged into the Community Ledger (+1 Trip Added).",
    hi: "धन्यवाद! आपका समर्थन कम्युनिटी लेजर में सुरक्षित रूप से दर्ज हो गया (+1 राइड जुड़ी)।",
  },

  // Active Ride Tab & Quick Meet
  tripSecurityHandshake: { en: "Trip Security Stage Handshake", hi: "ट्रिप सुरक्षा हैंडशेक चरण" },
  stage1Title: { en: "Stage 1: Shared Ride Active", hi: "चरण 1: साझा राइड सक्रिय" },
  stage2Title: { en: "Comfort Guardian Mode Activated", hi: "कम्फर्ट गार्डियन मोड सक्रिय" },
  handshakeBtn: {
    en: "Co-Rider Dropped at Stop (Trigger Handshake)",
    hi: "सहेली स्टॉप पर उतरी (हैंडशेक दर्ज करें)",
  },
  handshakeDesc: {
    en: "Click when co-rider exits the auto at her designated stop.",
    hi: "सह-यात्री के अपने स्टॉप पर उतरने पर यहां टैप करें।",
  },
  coRiderDroppedSafely: { en: "Co-Rider Dropped Safely", hi: "सह-यात्री सुरक्षित उतरी" },
  handshakeVerified: { en: "Handshake Verified", hi: "हैंडशेक सत्यापित" },
  guardianLiveLink: { en: "Guardian Live Tracking Link", hi: "गार्डियन लाइव ट्रैकिंग लिंक" },
  copyGuardianLink: { en: "Copy Guardian Link", hi: "गार्डियन लिंक कॉपी करें" },
  copiedSuccess: { en: "Copied to Clipboard!", hi: "क्लिपबोर्ड पर कॉपी हुआ!" },
  openGuardianView: { en: "Open Guardian View", hi: "गार्डियन व्यू खोलें" },
  remainingSoloLeg: { en: "Remaining Solo Leg Progress", hi: "अंतिम अकेले सफर की प्रगति" },
  homeSafeBtn: { en: "I've Reached Home Safely 🎉", hi: "मैं सुरक्षित घर पहुंच गई 🎉" },
  homeSafeCelebration: { en: "Arrived Safely at Doorstep!", hi: "घर के दरवाज़े पर सुरक्षित आगमन!" },
  guardianConcluded: {
    en: "Comfort Guardian mode has concluded successfully. Your emergency guardians have been notified.",
    hi: "कम्फर्ट गार्डियन सुरक्षा सफलतापूर्वक पूरी हुई। आपके परिजनों को सूचना भेज दी गई है।",
  },
  startNewRide: { en: "Start New Ride", hi: "नई राइड शुरू करें" },
  callHelpline: { en: "Bhopal Helpline 1090", hi: "भोपाल हेल्पलाइन 1090" },
  whatsAppFamily: { en: "Share via WhatsApp", hi: "व्हाट्सएप पर शेयर करें" },

  // Privacy Quick-Meet Chips
  quickMeetTitle: { en: "Privacy-First Meetup Coordination", hi: "प्राइवेसी-सुरक्षित मिलन समन्वय" },
  quickMeetSubtitle: {
    en: "Coordinate hub meetup without sharing personal phone numbers.",
    hi: "बिना निजी फोन नंबर बांटे स्टेशन पर आसानी से मिलें।",
  },
  chipGate1: { en: "At Station Exit Gate 1", hi: "स्टेशन एग्जिट गेट 1 पर हूं" },
  chipPrepaid: { en: "Near Prepaid Auto Booth", hi: "प्रीपेड ऑटो बूथ के पास खड़ी हूं" },
  chip2Mins: { en: "2 mins away from stand", hi: "2 मिनट में स्टैंड पर पहुंच रही हूं" },
  chipWestBridge: { en: "Near West Foot Overbridge", hi: "वेस्ट फुट ओवरब्रिज के पास" },
  replyReceived: { en: "Co-Rider Reply", hi: "सहेली का उत्तर" },

  // Milestone 4: Saheli PIN & Show Driver Card
  saheliPinLabel: { en: "Mutual 4-Digit Saheli PIN", hi: "4-अंकीय सहेली बोर्डिंग पिन" },
  saheliPinHelper: {
    en: "Verify each other visually at crowded station gates — both riders see the same PIN.",
    hi: "स्टेशन गेट पर भीड़ में अपनी सहेली से इस 4-अंकीय पिन का मिलान करें (दोनों की स्क्रीन पर एक ही पिन दिखेगा)।",
  },
  showDriverBtn: { en: "Show Driver Card (ड्राईवर को दिखाएं)", hi: "ड्राईवर को दिखाएं (Show Driver Card)" },
  showDriverCardTitle: { en: "Official Fare & Route Card", hi: "सहेलीमाइल तय किराया व रूट कार्ड" },
  showDriverCardSub: {
    en: "Show this screen to auto driver — Pre-split fare, zero haggling.",
    hi: "यह स्क्रीन सीधे ऑटो ड्राईवर को दिखाएं — पहले से तय किराया, मोलभाव से मुक्ति।",
  },
  originLabelCard: { en: "Origin Station", hi: "शुरुआती स्टैंड" },
  sharedRouteCard: { en: "Shared Corridor", hi: "साझा रूट" },
  totalFareCard: { en: "Total Metered Fare", hi: "कुल मीटर किराया" },
  splitFormulaCard: { en: "Fair Split", hi: "बंटवारा" },
  perRiderFare: { en: "per passenger", hi: "प्रति सवारी" },
  closeCardBtn: { en: "Close Fare Card", hi: "कार्ड बंद करें" },

  // Safe Havens Bottom Sheet
  safeHavensTitle: { en: "24×7 Verified Safe Havens", hi: "24×7 सत्यापित सुरक्षित आश्रय (Safe Havens)" },
  safeHavensSub: {
    en: "Well-lit emergency shelter points around Rani Kamalapati Station with active security & assistance.",
    hi: "रानी कमलापति स्टेशन के निकट 24×7 सुरक्षा गार्ड और रोशनी वाले आपातकालीन सुरक्षित केंद्र।",
  },
  callNowBtn: { en: "Call", hi: "कॉल करें" },
  directionsBtn: { en: "Maps", hi: "दिशा देखें" },
  cctvMonitored: { en: "24×7 Well-Lit & Guarded", hi: "24×7 रोशनी व गार्ड युक्त" },
};
