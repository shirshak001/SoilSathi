import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supported languages
export type Language = 'en' | 'hi' | 'ta' | 'bn' | 'te' | 'pa' | 'kn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

// Translation interface
export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    confirm: string;
    back: string;
    next: string;
    done: string;
    yes: string;
    no: string;
    ok: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // Navigation & Headers
  navigation: {
    profile: string;
    privacySecurity: string;
    paymentMethods: string;
    settings: string;
    dashboard: string;
    droneService: string;
    soilAnalysis: string;
    plantCare: string;
    weather: string;
    community: string;
    store: string;
  };

  // Profile Screen
  profile: {
    title: string;
    personalInfo: string;
    farmingDetails: string;
    about: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    farmSize: string;
    cropTypes: string;
    experience: string;
    bio: string;
    activeFields: string;
    acres: string;
    yearsExp: string;
    updateSuccess: string;
  };

  // Privacy & Security
  privacy: {
    title: string;
    security: string;
    privacy: string;
    dataManagement: string;
    accountActions: string;
    changePassword: string;
    lastChanged: string;
    twoFactorAuth: string;
    extraSecurity: string;
    biometricLogin: string;
    fingerprintFace: string;
    autoLogout: string;
    inactivityLogout: string;
    activeSessions: string;
    manageDevices: string;
    locationSharing: string;
    weatherData: string;
    dataCollection: string;
    usageData: string;
    marketingEmails: string;
    promotional: string;
    analyticsSharing: string;
    appUsage: string;
    deviceTracking: string;
    crossDevice: string;
    downloadData: string;
    dataCopy: string;
    backupSettings: string;
    lastBackup: string;
    clearCache: string;
    freeStorage: string;
    deactivateAccount: string;
    temporaryDisable: string;
    deleteAccount: string;
    permanentDelete: string;
    privacyMatters: string;
    privacyDescription: string;
  };

  // Payment Methods
  payment: {
    title: string;
    summary: string;
    totalSpent: string;
    activePayments: string;
    nextBilling: string;
    addPayment: string;
    creditCard: string;
    bankAccount: string;
    digitalWallet: string;
    default: string;
    lastUsed: string;
    expires: string;
    recentTransactions: string;
    completed: string;
    pending: string;
    failed: string;
    removePayment: string;
    confirmRemove: string;
    droneSpray: string;
    premiumSub: string;
    weatherAlert: string;
    soilReport: string;
    equipmentRental: string;
  };

  // Settings
  settings: {
    title: string;
    account: string;
    notifications: string;
    automation: string;
    preferences: string;
    support: string;
    accountActions: string;
    profileInfo: string;
    updateDetails: string;
    privacySec: string;
    managePrivacy: string;
    paymentMethods: string;
    managePayments: string;
    pushNotifications: string;
    importantUpdates: string;
    weatherAlerts: string;
    weatherNotifications: string;
    autoWatering: string;
    automaticWatering: string;
    smartMonitoring: string;
    aiMonitoring: string;
    language: string;
    locationServices: string;
    weatherLocation: string;
    helpFaq: string;
    getHelp: string;
    contactSupport: string;
    reachTeam: string;
    rateApp: string;
    shareFeeback: string;
    about: string;
    appVersion: string;
    signOut: string;
    logOut: string;
    appearance: string;
    theme: string;
  };

  // Dashboard
  dashboard: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    todayOverview: string;
    fieldStatus: string;
    droneServices: string;
    quickActions: string;
    seeAll: string;
    viewHistory: string;
    gardenZones: string;
    waterSaved: string;
    nextWatering: string;
    healthyPlants: string;
    manageZones: string;
    waterSchedule: string;
    plantCareReminders: string;
    weatherTips: string;
    nextIrrigation: string;
    irrigationProgress: string;
    wellIrrigated: string;
    professionalSpray: string;
    fertilizers: string;
    pesticides: string;
    nutrients: string;
    startingFrom: string;
    book: string;
  };

  // Common Messages
  messages: {
    comingSoon: string;
    featureAvailable: string;
    confirmSignOut: string;
    signOutMessage: string;
    successSaved: string;
    errorOccurred: string;
    noDataFound: string;
    loadingData: string;
  };
}

// English translations (default)
const englishTranslations: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  },
  navigation: {
    profile: 'Profile',
    privacySecurity: 'Privacy & Security',
    paymentMethods: 'Payment Methods',
    settings: 'Settings',
    dashboard: 'Dashboard',
    droneService: 'Drone Service',
    soilAnalysis: 'Soil Analysis',
    plantCare: 'Plant Care',
    weather: 'Weather',
    community: 'Community',
    store: 'Store',
  },
  profile: {
    title: 'Profile',
    personalInfo: 'Personal Information',
    farmingDetails: 'Farming Details',
    about: 'About',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    location: 'Location',
    farmSize: 'Farm Size',
    cropTypes: 'Crop Types',
    experience: 'Experience',
    bio: 'Bio',
    activeFields: 'Active Fields',
    acres: 'Acres',
    yearsExp: 'Years Exp.',
    updateSuccess: 'Profile updated successfully!',
  },
  privacy: {
    title: 'Privacy & Security',
    security: 'Security',
    privacy: 'Privacy',
    dataManagement: 'Data Management',
    accountActions: 'Account Actions',
    changePassword: 'Change Password',
    lastChanged: 'Last changed 30 days ago',
    twoFactorAuth: 'Two-Factor Authentication',
    extraSecurity: 'Add an extra layer of security',
    biometricLogin: 'Biometric Login',
    fingerprintFace: 'Use fingerprint or face ID',
    autoLogout: 'Auto Logout',
    inactivityLogout: 'Automatically log out after inactivity',
    activeSessions: 'Active Sessions',
    manageDevices: 'Manage logged in devices',
    locationSharing: 'Location Sharing',
    weatherData: 'Share location for weather data',
    dataCollection: 'Data Collection',
    usageData: 'Allow collection of usage data',
    marketingEmails: 'Marketing Emails',
    promotional: 'Receive promotional emails',
    analyticsSharing: 'Analytics Sharing',
    appUsage: 'Share app usage analytics',
    deviceTracking: 'Device Tracking',
    crossDevice: 'Allow app to track across devices',
    downloadData: 'Download My Data',
    dataCopy: 'Get a copy of your data',
    backupSettings: 'Backup Settings',
    lastBackup: 'Last backup: Yesterday',
    clearCache: 'Clear Cache',
    freeStorage: 'Free up storage space',
    deactivateAccount: 'Deactivate Account',
    temporaryDisable: 'Temporarily disable your account',
    deleteAccount: 'Delete Account',
    permanentDelete: 'Permanently delete your account',
    privacyMatters: '🔒 Your Privacy Matters',
    privacyDescription: 'We\'re committed to protecting your privacy and securing your data. Review and customize your privacy settings below to control how your information is used.',
  },
  payment: {
    title: 'Payment Methods',
    summary: '💳 Payment Summary',
    totalSpent: 'Total Spent This Month',
    activePayments: 'Active Payment Methods',
    nextBilling: 'Next Billing Date',
    addPayment: 'Add Payment Method',
    creditCard: 'Credit/Debit Card',
    bankAccount: 'Bank Account',
    digitalWallet: 'Digital Wallet',
    default: 'DEFAULT',
    lastUsed: 'Last used',
    expires: 'Expires',
    recentTransactions: 'Recent Transactions',
    completed: 'completed',
    pending: 'pending',
    failed: 'failed',
    removePayment: 'Remove Payment Method',
    confirmRemove: 'Are you sure you want to remove this payment method?',
    droneSpray: 'Drone Spraying Service',
    premiumSub: 'Premium Subscription',
    weatherAlert: 'Weather Alert Service',
    soilReport: 'Soil Analysis Report',
    equipmentRental: 'Equipment Rental',
  },
  settings: {
    title: 'Settings',
    account: 'Account',
    notifications: 'Notifications',
    automation: 'Automation',
    preferences: 'App Preferences',
    support: 'Support',
    accountActions: 'Account Actions',
    profileInfo: 'Profile Information',
    updateDetails: 'Update your personal details',
    privacySec: 'Privacy & Security',
    managePrivacy: 'Manage your privacy settings',
    paymentMethods: 'Payment Methods',
    managePayments: 'Manage payment options',
    pushNotifications: 'Push Notifications',
    importantUpdates: 'Receive important updates',
    weatherAlerts: 'Weather Alerts',
    weatherNotifications: 'Get weather notifications',
    autoWatering: 'Auto Watering',
    automaticWatering: 'Enable automatic watering system',
    smartMonitoring: 'Smart Monitoring',
    aiMonitoring: 'AI-powered plant monitoring',
    language: 'Language',
    locationServices: 'Location Services',
    weatherLocation: 'Enable location for weather data',
    helpFaq: 'Help & FAQ',
    getHelp: 'Get help and support',
    contactSupport: 'Contact Support',
    reachTeam: 'Reach out to our team',
    rateApp: 'Rate the App',
    shareFeeback: 'Share your feedback',
    about: 'About',
    appVersion: 'App version and info',
    signOut: 'Sign Out',
    logOut: 'Log out of your account',
    appearance: 'Appearance',
    theme: 'Theme',
  },
  dashboard: {
    goodMorning: 'Good Morning!',
    goodAfternoon: 'Good Afternoon!',
    goodEvening: 'Good Evening!',
    todayOverview: 'Today\'s Overview',
    fieldStatus: 'Field Status',
    droneServices: 'Drone Services',
    quickActions: 'Quick Actions',
    seeAll: 'See All',
    viewHistory: 'View History',
    gardenZones: 'Garden Zones',
    waterSaved: 'Water Saved',
    nextWatering: 'Next Watering',
    healthyPlants: 'Healthy Plants',
    manageZones: 'Manage your zones',
    waterSchedule: 'Water Schedule',
    plantCareReminders: 'Plant Care Reminders',
    weatherTips: 'Weather Tips',
    nextIrrigation: 'Next irrigation in 2 hours',
    irrigationProgress: 'Irrigation in progress',
    wellIrrigated: 'Well irrigated',
    professionalSpray: 'Professional Drone Spraying',
    fertilizers: 'Fertilizers',
    pesticides: 'Pesticides',
    nutrients: 'Nutrients',
    startingFrom: 'Starting from',
    book: 'Book',
  },
  messages: {
    comingSoon: 'Coming Soon',
    featureAvailable: 'This feature will be available soon',
    confirmSignOut: 'Sign Out',
    signOutMessage: 'Are you sure you want to sign out?',
    successSaved: 'Successfully saved!',
    errorOccurred: 'An error occurred',
    noDataFound: 'No data found',
    loadingData: 'Loading data...',
  },
};

// Hindi translations
const hindiTranslations: Translations = {
  common: {
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    remove: 'हटाएं',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    next: 'आगे',
    done: 'पूर्ण',
    yes: 'हाँ',
    no: 'नहीं',
    ok: 'ठीक',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    warning: 'चेतावनी',
    info: 'जानकारी',
  },
  navigation: {
    profile: 'प्रोफ़ाइल',
    privacySecurity: 'गोपनीयता और सुरक्षा',
    paymentMethods: 'भुगतान के तरीके',
    settings: 'सेटिंग्स',
    dashboard: 'डैशबोर्ड',
    droneService: 'ड्रोन सेवा',
    soilAnalysis: 'मिट्टी विश्लेषण',
    plantCare: 'पौधे की देखभाल',
    weather: 'मौसम',
    community: 'समुदाय',
    store: 'स्टोर',
  },
  profile: {
    title: 'प्रोफ़ाइल',
    personalInfo: 'व्यक्तिगत जानकारी',
    farmingDetails: 'कृषि विवरण',
    about: 'के बारे में',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'फोन नंबर',
    location: 'स्थान',
    farmSize: 'खेत का आकार',
    cropTypes: 'फसल के प्रकार',
    experience: 'अनुभव',
    bio: 'बायो',
    activeFields: 'सक्रिय खेत',
    acres: 'एकड़',
    yearsExp: 'वर्ष अनुभव',
    updateSuccess: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!',
  },
  privacy: {
    title: 'गोपनीयता और सुरक्षा',
    security: 'सुरक्षा',
    privacy: 'गोपनीयता',
    dataManagement: 'डेटा प्रबंधन',
    accountActions: 'खाता कार्य',
    changePassword: 'पासवर्ड बदलें',
    lastChanged: '30 दिन पहले बदला गया',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    extraSecurity: 'सुरक्षा की अतिरिक्त परत जोड़ें',
    biometricLogin: 'बायोमेट्रिक लॉगिन',
    fingerprintFace: 'फिंगरप्रिंट या फेस आईडी का उपयोग करें',
    autoLogout: 'ऑटो लॉगआउट',
    inactivityLogout: 'निष्क्रियता के बाद स्वचालित रूप से लॉग आउट करें',
    activeSessions: 'सक्रिय सत्र',
    manageDevices: 'लॉग इन डिवाइसेस प्रबंधित करें',
    locationSharing: 'स्थान साझाकरण',
    weatherData: 'मौसम डेटा के लिए स्थान साझा करें',
    dataCollection: 'डेटा संग्रह',
    usageData: 'उपयोग डेटा संग्रह की अनुमति दें',
    marketingEmails: 'मार्केटिंग ईमेल',
    promotional: 'प्रचारक ईमेल प्राप्त करें',
    analyticsSharing: 'एनालिटिक्स साझाकरण',
    appUsage: 'ऐप उपयोग एनालिटिक्स साझा करें',
    deviceTracking: 'डिवाइस ट्रैकिंग',
    crossDevice: 'ऐप को डिवाइसेस में ट्रैक करने की अनुमति दें',
    downloadData: 'मेरा डेटा डाउनलोड करें',
    dataCopy: 'अपने डेटा की एक प्रति प्राप्त करें',
    backupSettings: 'बैकअप सेटिंग्स',
    lastBackup: 'अंतिम बैकअप: कल',
    clearCache: 'कैश साफ़ करें',
    freeStorage: 'स्टोरेज स्पेस खाली करें',
    deactivateAccount: 'खाता निष्क्रिय करें',
    temporaryDisable: 'अस्थायी रूप से अपना खाता अक्षम करें',
    deleteAccount: 'खाता हटाएं',
    permanentDelete: 'स्थायी रूप से अपना खाता हटाएं',
    privacyMatters: '🔒 आपकी गोपनीयता महत्वपूर्ण है',
    privacyDescription: 'हम आपकी गोपनीयता की सुरक्षा और आपके डेटा को सुरक्षित रखने के लिए प्रतिबद्ध हैं। अपनी जानकारी का उपयोग कैसे किया जाता है, इसे नियंत्रित करने के लिए नीचे अपनी गोपनीयता सेटिंग्स की समीक्षा और अनुकूलन करें।',
  },
  payment: {
    title: 'भुगतान के तरीके',
    summary: '💳 भुगतान सारांश',
    totalSpent: 'इस महीने कुल खर्च',
    activePayments: 'सक्रिय भुगतान विधियां',
    nextBilling: 'अगली बिलिंग तारीख',
    addPayment: 'भुगतान विधि जोड़ें',
    creditCard: 'क्रेडिट/डेबिट कार्ड',
    bankAccount: 'बैंक खाता',
    digitalWallet: 'डिजिटल वॉलेट',
    default: 'डिफ़ॉल्ट',
    lastUsed: 'अंतिम उपयोग',
    expires: 'समाप्ति',
    recentTransactions: 'हाल के लेनदेन',
    completed: 'पूर्ण',
    pending: 'लंबित',
    failed: 'असफल',
    removePayment: 'भुगतान विधि हटाएं',
    confirmRemove: 'क्या आप वाकई इस भुगतान विधि को हटाना चाहते हैं?',
    droneSpray: 'ड्रोन स्प्रेइंग सेवा',
    premiumSub: 'प्रीमियम सब्सक्रिप्शन',
    weatherAlert: 'मौसम अलर्ट सेवा',
    soilReport: 'मिट्टी विश्लेषण रिपोर्ट',
    equipmentRental: 'उपकरण किराया',
  },
  settings: {
    title: 'सेटिंग्स',
    account: 'खाता',
    notifications: 'सूचनाएं',
    automation: 'स्वचालन',
    preferences: 'ऐप प्राथमिकताएं',
    support: 'सहायता',
    accountActions: 'खाता कार्य',
    profileInfo: 'प्रोफ़ाइल जानकारी',
    updateDetails: 'अपनी व्यक्तिगत जानकारी अपडेट करें',
    privacySec: 'गोपनीयता और सुरक्षा',
    managePrivacy: 'अपनी गोपनीयता सेटिंग्स प्रबंधित करें',
    paymentMethods: 'भुगतान के तरीके',
    managePayments: 'भुगतान विकल्प प्रबंधित करें',
    pushNotifications: 'पुश सूचनाएं',
    importantUpdates: 'महत्वपूर्ण अपडेट प्राप्त करें',
    weatherAlerts: 'मौसम अलर्ट',
    weatherNotifications: 'मौसम सूचनाएं प्राप्त करें',
    autoWatering: 'ऑटो वाटरिंग',
    automaticWatering: 'स्वचालित पानी सिस्टम सक्षम करें',
    smartMonitoring: 'स्मार्ट मॉनिटरिंग',
    aiMonitoring: 'एआई-संचालित पौधे की निगरानी',
    language: 'भाषा',
    locationServices: 'स्थान सेवाएं',
    weatherLocation: 'मौसम डेटा के लिए स्थान सक्षम करें',
    helpFaq: 'सहायता और FAQ',
    getHelp: 'सहायता और समर्थन प्राप्त करें',
    contactSupport: 'सहायता से संपर्क करें',
    reachTeam: 'हमारी टीम से संपर्क करें',
    rateApp: 'ऐप को रेट करें',
    shareFeeback: 'अपनी प्रतिक्रिया साझा करें',
    about: 'के बारे में',
    appVersion: 'ऐप संस्करण और जानकारी',
    signOut: 'साइन आउट',
    logOut: 'अपने खाते से लॉग आउट करें',
    appearance: 'दिखावट',
    theme: 'थीम',
  },
  dashboard: {
    goodMorning: 'सुप्रभात!',
    goodAfternoon: 'शुभ दोपहर!',
    goodEvening: 'शुभ संध्या!',
    todayOverview: 'आज का अवलोकन',
    fieldStatus: 'खेत की स्थिति',
    droneServices: 'ड्रोन सेवाएं',
    quickActions: 'त्वरित कार्य',
    seeAll: 'सभी देखें',
    viewHistory: 'इतिहास देखें',
    gardenZones: 'उद्यान क्षेत्र',
    waterSaved: 'पानी बचाया',
    nextWatering: 'अगला पानी',
    healthyPlants: 'स्वस्थ पौधे',
    manageZones: 'अपने क्षेत्रों का प्रबंधन करें',
    waterSchedule: 'पानी का कार्यक्रम',
    plantCareReminders: 'पौधे की देखभाल रिमाइंडर',
    weatherTips: 'मौसम सुझाव',
    nextIrrigation: '2 घंटे में अगली सिंचाई',
    irrigationProgress: 'सिंचाई प्रगति में',
    wellIrrigated: 'अच्छी तरह सिंचित',
    professionalSpray: 'पेशेवर ड्रोन स्प्रेइंग',
    fertilizers: 'उर्वरक',
    pesticides: 'कीटनाशक',
    nutrients: 'पोषक तत्व',
    startingFrom: 'से शुरू',
    book: 'बुक करें',
  },
  messages: {
    comingSoon: 'जल्द आ रहा है',
    featureAvailable: 'यह सुविधा जल्द ही उपलब्ध होगी',
    confirmSignOut: 'साइन आउट',
    signOutMessage: 'क्या आप वाकई साइन आउट करना चाहते हैं?',
    successSaved: 'सफलतापूर्वक सेव हुआ!',
    errorOccurred: 'एक त्रुटि हुई',
    noDataFound: 'कोई डेटा नहीं मिला',
    loadingData: 'डेटा लोड हो रहा है...',
  },
};

// Tamil translations
const tamilTranslations: Translations = {
  common: {
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    add: 'சேர்',
    remove: 'அகற்று',
    confirm: 'உறுதிப்படுத்து',
    back: 'திரும்பு',
    next: 'அடுத்து',
    done: 'முடிந்தது',
    yes: 'ஆம்',
    no: 'இல்லை',
    ok: 'சரி',
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    warning: 'எச்சரிக்கை',
    info: 'தகவல்',
  },
  navigation: {
    profile: 'சுயவிவரம்',
    privacySecurity: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    paymentMethods: 'கட்டணம் முறைகள்',
    settings: 'அமைப்புகள்',
    dashboard: 'டாஷ்போர்டு',
    droneService: 'ட்ரோன் சேவை',
    soilAnalysis: 'மண் பகுப்பாய்வு',
    plantCare: 'செடி பராமரிப்பு',
    weather: 'வானிலை',
    community: 'சமூகம்',
    store: 'கடை',
  },
  profile: {
    title: 'சுயவிவரம்',
    personalInfo: 'தனிப்பட்ட தகவல்',
    farmingDetails: 'விவசாய விவரங்கள்',
    about: 'பற்றி',
    fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல் முகவரி',
    phone: 'தொலைபேசி எண்',
    location: 'இடம்',
    farmSize: 'பண்ணை அளவு',
    cropTypes: 'பயிர் வகைகள்',
    experience: 'அனுபவம்',
    bio: 'பயோ',
    activeFields: 'செயலில் உள்ள நிலங்கள்',
    acres: 'ஏக்கர்',
    yearsExp: 'வருட அனுபவம்',
    updateSuccess: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
  },
  privacy: {
    title: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    security: 'பாதுகாப்பு',
    privacy: 'தனியுரிமை',
    dataManagement: 'தரவு மேலாண்மை',
    accountActions: 'கணக்கு செயல்கள்',
    changePassword: 'கடவுச்சொல்லை மாற்று',
    lastChanged: '30 நாட்களுக்கு முன் மாற்றப்பட்டது',
    twoFactorAuth: 'இரு-காரணி அங்கீகாரம்',
    extraSecurity: 'கூடுதல் பாதுகாப்பு அடுக்கு சேர்க்கவும்',
    biometricLogin: 'பயோமெட்ரிக் உள்நுழைவு',
    fingerprintFace: 'கைரேகை அல்லது முக அடையாளத்தைப் பயன்படுத்தவும்',
    autoLogout: 'தானியங்கு வெளியேற்றம்',
    inactivityLogout: 'செயலற்ற நிலைக்குப் பிறகு தானாகவே வெளியேறு',
    activeSessions: 'செயலில் உள்ள அமர்வுகள்',
    manageDevices: 'உள்நுழைந்த சாதனங்களை நிர்வகிக்கவும்',
    locationSharing: 'இடம் பகிர்வு',
    weatherData: 'வானிலை தரவுக்கு இடத்தைப் பகிரவும்',
    dataCollection: 'தரவு சேகரிப்பு',
    usageData: 'பயன்பாட்டு தரவு சேகரிப்பை அனுமதிக்கவும்',
    marketingEmails: 'மார்க்கெட்டிங் மின்னஞ்சல்கள்',
    promotional: 'விளம்பர மின்னஞ்சல்களைப் பெறவும்',
    analyticsSharing: 'பகுப்பாய்வு பகிர்வு',
    appUsage: 'பயன்பாட்டு பகுப்பாய்வைப் பகிரவும்',
    deviceTracking: 'சாதன கண்காணிப்பு',
    crossDevice: 'சாதனங்கள் முழுவதும் கண்காணிக்க பயன்பாட்டை அனுமதிக்கவும்',
    downloadData: 'எனது தரவைப் பதிவிறக்கவும்',
    dataCopy: 'உங்கள் தரவின் நகலைப் பெறவும்',
    backupSettings: 'காப்பு அமைப்புகள்',
    lastBackup: 'கடைசி காப்பு: நேற்று',
    clearCache: 'கேச் அழிக்கவும்',
    freeStorage: 'சேமிப்பு இடத்தை விடுவிக்கவும்',
    deactivateAccount: 'கணக்கை முடக்கு',
    temporaryDisable: 'உங்கள் கணக்கை தற்காலிகமாக முடக்கவும்',
    deleteAccount: 'கணக்கை நீக்கு',
    permanentDelete: 'உங்கள் கணக்கை நிரந்தரமாக நீக்கவும்',
    privacyMatters: '🔒 உங்கள் தனியுரிமை முக்கியமானது',
    privacyDescription: 'உங்கள் தனியுரிமையைப் பாதுகாப்பதற்கும் உங்கள் தரவைப் பாதுகாப்பதற்கும் நாங்கள் அர்ப்பணிப்புடன் உள்ளோம். உங்கள் தகவல் எவ்வாறு பயன்படுத்தப்படுகிறது என்பதைக் கட்டுப்படுத்த கீழே உங்கள் தனியுரிமை அமைப்புகளை மறுஆய்வு செய்து தனிப்பயனாக்கவும்.',
  },
  payment: {
    title: 'கட்டணம் முறைகள்',
    summary: '💳 கட்டணம் சுருக்கம்',
    totalSpent: 'இந்த மாதம் மொத்த செலவு',
    activePayments: 'செயலில் உள்ள கட்டணம் முறைகள்',
    nextBilling: 'அடுத்த பில்லிங் தேதி',
    addPayment: 'கட்டணம் முறையைச் சேர்க்கவும்',
    creditCard: 'கிரெடிட்/டெபிட் கார்டு',
    bankAccount: 'வங்கிக் கணக்கு',
    digitalWallet: 'டிஜிட்டல் வால்லெட்',
    default: 'இயல்புநிலை',
    lastUsed: 'கடைசியாக பயன்படுத்தப்பட்டது',
    expires: 'காலாவதியாகிறது',
    recentTransactions: 'சமீபத்திய பரிவர்த்தனைகள்',
    completed: 'முடிக்கப்பட்டது',
    pending: 'நிலுவையில்',
    failed: 'தோல்வியுற்றது',
    removePayment: 'கட்டணம் முறையை அகற்று',
    confirmRemove: 'இந்த கட்டணம் முறையை நீக்க விரும்புகிறீர்களா?',
    droneSpray: 'ட்ரோன் தெளிப்பு சேவை',
    premiumSub: 'பிரீமியம் சந்தா',
    weatherAlert: 'வானிலை எச்சரிக்கை சேவை',
    soilReport: 'மண் பகுப்பாய்வு அறிக்கை',
    equipmentRental: 'உபகரண வாடகை',
  },
  settings: {
    title: 'அமைப்புகள்',
    account: 'கணக்கு',
    notifications: 'அறிவிப்புகள்',
    automation: 'தானியங்கு',
    preferences: 'பயன்பாட்டு விருப்பத்தேர்வுகள்',
    support: 'ஆதரவு',
    accountActions: 'கணக்கு செயல்கள்',
    profileInfo: 'சுயவிவர தகவல்',
    updateDetails: 'உங்கள் தனிப்பட்ட விவரங்களைப் புதுப்பிக்கவும்',
    privacySec: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    managePrivacy: 'உங்கள் தனியுரிமை அமைப்புகளை நிர்வகிக்கவும்',
    paymentMethods: 'கட்டணம் முறைகள்',
    managePayments: 'கட்டணம் விருப்பங்களை நிர்வகிக்கவும்',
    pushNotifications: 'புஷ் அறிவிப்புகள்',
    importantUpdates: 'முக்கியமான புதுப்பிப்புகளைப் பெறவும்',
    weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
    weatherNotifications: 'வானிலை அறிவிப்புகளைப் பெறவும்',
    autoWatering: 'தானியங்கு நீர்ப்பாசனம்',
    automaticWatering: 'தானியங்கு நீர் அமைப்பை இயக்கவும்',
    smartMonitoring: 'ஸ்மார்ட் கண்காணிப்பு',
    aiMonitoring: 'AI-இயங்கும் செடி கண்காணிப்பு',
    language: 'மொழி',
    locationServices: 'இடம் சேவைகள்',
    weatherLocation: 'வானிலை தரவுக்கு இடத்தை இயக்கவும்',
    helpFaq: 'உதவி மற்றும் FAQ',
    getHelp: 'உதவி மற்றும் ஆதரவைப் பெறவும்',
    contactSupport: 'ஆதரவைத் தொடர்பு கொள்ளவும்',
    reachTeam: 'எங்கள் குழுவைத் தொடர்பு கொள்ளவும்',
    rateApp: 'பயன்பாட்டை மதிப்பிடவும்',
    shareFeeback: 'உங்கள் கருத்தைப் பகிரவும்',
    about: 'பற்றி',
    appVersion: 'பயன்பாட்டு பதிப்பு மற்றும் தகவல்',
    signOut: 'வெளியேறு',
    logOut: 'உங்கள் கணக்கிலிருந்து வெளியேறவும்',
    appearance: 'தோற்றம்',
    theme: 'தீம்',
  },
  dashboard: {
    goodMorning: 'காலை வணக்கம்!',
    goodAfternoon: 'மதிய வணக்கம்!',
    goodEvening: 'மாலை வணக்கம்!',
    todayOverview: 'இன்றைய மேலோட்டம்',
    fieldStatus: 'வயல் நிலைமை',
    droneServices: 'ட்ரோன் சேவைகள்',
    quickActions: 'விரைவு செயல்கள்',
    seeAll: 'அனைத்தையும் பார்க்கவும்',
    viewHistory: 'வரலாற்றைப் பார்க்கவும்',
    gardenZones: 'தோட்ட மண்டலங்கள்',
    waterSaved: 'தண்ணீர் சேமிப்பு',
    nextWatering: 'அடுத்த நீர்ப்பாசனம்',
    healthyPlants: 'ஆரோக்கியமான செடிகள்',
    manageZones: 'உங்கள் மண்டலங்களை நிர்வகிக்கவும்',
    waterSchedule: 'நீர் அட்டவணை',
    plantCareReminders: 'செடி பராமரிப்பு நினைவூட்டல்கள்',
    weatherTips: 'வானிலை குறிப்புகள்',
    nextIrrigation: '2 மணி நேரத்தில் அடுத்த நீர்ப்பாசனம்',
    irrigationProgress: 'நீர்ப்பாசனம் நடந்து கொண்டிருக்கிறது',
    wellIrrigated: 'நன்கு நீர்ப்பாசனம் செய்யப்பட்டது',
    professionalSpray: 'தொழில்முறை ட்ரோன் தெளிப்பு',
    fertilizers: 'உரங்கள்',
    pesticides: 'பூச்சிக்கொல்லிகள்',
    nutrients: 'ஊட்டச்சத்துக்கள்',
    startingFrom: 'இல் தொடங்கி',
    book: 'பதிவு செய்',
  },
  messages: {
    comingSoon: 'விரைவில் வருகிறது',
    featureAvailable: 'இந்த அம்சம் விரைவில் கிடைக்கும்',
    confirmSignOut: 'வெளியேறு',
    signOutMessage: 'நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?',
    successSaved: 'வெற்றிகரமாக சேமிக்கப்பட்டது!',
    errorOccurred: 'ஒரு பிழை ஏற்பட்டது',
    noDataFound: 'தரவு எதுவும் கிடைக்கவில்லை',
    loadingData: 'தரவு ஏற்றப்படுகிறது...',
  },
};

// Add Bengali, Telugu, Punjabi, and Kannada translations (abbreviated for brevity)
// For the full implementation, you would add complete translations for each language

const bengaliTranslations: Translations = {
  // Bengali translations would go here - abbreviated for space
  common: {
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    add: 'যোগ করুন',
    remove: 'সরান',
    confirm: 'নিশ্চিত করুন',
    back: 'ফিরে যান',
    next: 'পরবর্তী',
    done: 'সম্পন্ন',
    yes: 'হ্যাঁ',
    no: 'না',
    ok: 'ঠিক আছে',
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    success: 'সফল',
    warning: 'সতর্কতা',
    info: 'তথ্য',
  },
  navigation: {
    profile: 'প্রোফাইল',
    privacySecurity: 'গোপনীয়তা ও নিরাপত্তা',
    paymentMethods: 'পেমেন্ট পদ্ধতি',
    settings: 'সেটিংস',
    dashboard: 'ড্যাশবোর্ড',
    droneService: 'ড্রোন সেবা',
    soilAnalysis: 'মাটি বিশ্লেষণ',
    plantCare: 'গাছের যত্ন',
    weather: 'আবহাওয়া',
    community: 'সম্প্রদায়',
    store: 'স্টোর',
  },
  // ... other sections would be here
  profile: englishTranslations.profile, // Using English as fallback for brevity
  privacy: englishTranslations.privacy,
  payment: englishTranslations.payment,
  settings: englishTranslations.settings,
  dashboard: englishTranslations.dashboard,
  messages: englishTranslations.messages,
};

const teluguTranslations: Translations = {
  common: {
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    add: 'జోడించండి',
    remove: 'తీసివేయండి',
    confirm: 'ధృవీకరించండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    done: 'పూర్తి',
    yes: 'అవును',
    no: 'లేదు',
    ok: 'సరే',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    warning: 'హెచ్చరిక',
    info: 'సమాచారం',
  },
  navigation: {
    profile: 'ప్రొఫైల్',
    privacySecurity: 'గోప్యత & భద్రత',
    paymentMethods: 'చెల్లింపు పద్ధతులు',
    settings: 'సెట్టింగులు',
    dashboard: 'డాష్‌బోర్డ్',
    droneService: 'డ్రోన్ సేవ',
    soilAnalysis: 'మట్టి విశ్లేషణ',
    plantCare: 'మొక్క సంరక్షణ',
    weather: 'వాతావరణం',
    community: 'సమాజం',
    store: 'దుకాణం',
  },
  // Using English as fallback for other sections for brevity
  profile: englishTranslations.profile,
  privacy: englishTranslations.privacy,
  payment: englishTranslations.payment,
  settings: englishTranslations.settings,
  dashboard: englishTranslations.dashboard,
  messages: englishTranslations.messages,
};

const punjabiTranslations: Translations = {
  common: {
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    delete: 'ਮਿਟਾਓ',
    edit: 'ਸੰਪਾਦਨ',
    add: 'ਜੋੜੋ',
    remove: 'ਹਟਾਓ',
    confirm: 'ਤਸਦੀਕ ਕਰੋ',
    back: 'ਵਾਪਸ',
    next: 'ਅਗਲਾ',
    done: 'ਪੂਰਾ',
    yes: 'ਹਾਂ',
    no: 'ਨਹੀਂ',
    ok: 'ਠੀਕ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
    warning: 'ਚੇਤਾਵਨੀ',
    info: 'ਜਾਣਕਾਰੀ',
  },
  navigation: {
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    privacySecurity: 'ਗੁਪਤਤਾ ਅਤੇ ਸੁਰੱਖਿਆ',
    paymentMethods: 'ਭੁਗਤਾਨ ਦੇ ਤਰੀਕੇ',
    settings: 'ਸੈਟਿੰਗਜ਼',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    droneService: 'ਡਰੋਨ ਸੇਵਾ',
    soilAnalysis: 'ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ',
    plantCare: 'ਪੌਧੇ ਦੀ ਦੇਖਭਾਲ',
    weather: 'ਮੌਸਮ',
    community: 'ਕਮਿਊਨਿਟੀ',
    store: 'ਸਟੋਰ',
  },
  // Using English as fallback for other sections for brevity
  profile: englishTranslations.profile,
  privacy: englishTranslations.privacy,
  payment: englishTranslations.payment,
  settings: englishTranslations.settings,
  dashboard: englishTranslations.dashboard,
  messages: englishTranslations.messages,
};

const kannadaTranslations: Translations = {
  common: {
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡು',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    add: 'ಸೇರಿಸಿ',
    remove: 'ತೆಗೆದುಹಾಕಿ',
    confirm: 'ದೃಢೀಕರಿಸಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    done: 'ಮುಗಿದಿದೆ',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    ok: 'ಸರಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    error: 'ದೋಷ',
    success: 'ಯಶಸ್ಸು',
    warning: 'ಎಚ್ಚರಿಕೆ',
    info: 'ಮಾಹಿತಿ',
  },
  navigation: {
    profile: 'ಪ್ರೊಫೈಲ್',
    privacySecurity: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಭದ್ರತೆ',
    paymentMethods: 'ಪಾವತಿ ವಿಧಾನಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    droneService: 'ಡ್ರೋನ್ ಸೇವೆ',
    soilAnalysis: 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
    plantCare: 'ಸಸ್ಯ ಆರೈಕೆ',
    weather: 'ಹವಾಮಾನ',
    community: 'ಸಮುದಾಯ',
    store: 'ಅಂಗಡಿ',
  },
  // Using English as fallback for other sections for brevity
  profile: englishTranslations.profile,
  privacy: englishTranslations.privacy,
  payment: englishTranslations.payment,
  settings: englishTranslations.settings,
  dashboard: englishTranslations.dashboard,
  messages: englishTranslations.messages,
};

// All translations
const translations: Record<Language, Translations> = {
  en: englishTranslations,
  hi: hindiTranslations,
  ta: tamilTranslations,
  bn: bengaliTranslations,
  te: teluguTranslations,
  pa: punjabiTranslations,
  kn: kannadaTranslations,
};

// Language Context
interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@soilsathi_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && savedLanguage in translations) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleSetLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: keyof Translations) => {
    return translations[language][key] || translations.en[key];
  };

  const value: LanguageContextType = {
    language,
    translations: translations[language],
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
