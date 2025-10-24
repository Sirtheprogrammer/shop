import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
  apiKey: "AIzaSyCeEfQ3_XCjN3YOdWUhFBLvyXyfUrDTVtk",

  authDomain: "anagroupsupplies.firebaseapp.com",

  projectId: "anagroupsupplies",

  storageBucket: "anagroupsupplies.firebasestorage.app",

  messagingSenderId: "203969283827",

  appId: "1:203969283827:web:09e5532f842eaff2b35986",

  measurementId: "G-93FN4Q8433"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 
