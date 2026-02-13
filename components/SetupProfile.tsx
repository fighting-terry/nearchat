"use client";
import React, { useState, useEffect } from 'react';
import { UserProfile, Gender } from '../types';
import { INTEREST_OPTIONS, LANGUAGES, RANDOM_NICKNAMES } from '../constants';

interface SetupProfileProps {
  onComplete?: (profile: UserProfile) => void;
}

const AGE_GROUPS = ['20s', '30s', '40s', '50s', '60s+'];

const SetupProfile: React.FC<SetupProfileProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/200/200');
  const [gender, setGender] = useState<Gender>('Non-binary');
  const [age, setAge] = useState<string | number>('20s');
  const [language, setLanguage] = useState('Korean');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Agreement States
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showModal, setShowModal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    handleRandomize();
  }, []);

  const handleRandomize = () => {
    const randomNick = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const randomAgeGroup = AGE_GROUPS[Math.floor(Math.random() * 2)]; // Bias towards 20s-30s for demo
    const randomGender: Gender = ['Male', 'Female', 'Non-binary'][Math.floor(Math.random() * 3)] as Gender;
    const randomLang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const shuffledInterests = [...INTEREST_OPTIONS].sort(() => 0.5 - Math.random());
    const randomInterests = shuffledInterests.slice(0, 3);
    const randomSeed = Math.floor(Math.random() * 1000);

    setNickname(randomNick);
    setAge(randomAgeGroup);
    setGender(randomGender);
    setLanguage(randomLang);
    setSelectedInterests(randomInterests);
    setPhotoUrl(`https://picsum.photos/seed/${randomSeed}/400/400`);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !agreeTerms || !agreePrivacy) return;
	if (onComplete) {
	  onComplete({
		nickname,
		photoUrl,
		gender,
		age,
		language,
		interests: selectedInterests
	  });
	}
  };

  const LegalModal = ({ type }: { type: 'terms' | 'privacy' }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl max-h-[70vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">
            {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </h3>
          <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          {type === 'terms' ? (
            <>
              <p className="font-bold text-gray-800">[Service Usage & Liability]</p>
              <p>1. NearChat does not maintain persistent user accounts. All information entered is temporary and exists only during your browser session.</p>
              <p>2. Location Data: We may request location permissions to display distances between users. This data is not stored permanently.</p>
              <p>3. Content Liability: NearChat is not responsible for any disputes or legal consequences arising from photos, contact information, or messages shared by users.</p>
              <p>4. Advertisements: This service may include third-party ads from Google AdSense or Coupang Partners.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-gray-800">[Privacy Policy]</p>
              <p>1. Data Collected: Nickname, age group, gender, interests, and temporary profile photo.</p>
              <p>2. Purpose: Providing a virtual dating experience and social interaction within NearChat.</p>
              <p>3. Retention: All data is instantly deleted when the app is closed or the browser is refreshed.</p>
              <p>4. Location Information: Current location coordinates may be used for real-time distance calculations but are not collected or stored on our servers.</p>
            </>
          )}
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <button 
            onClick={() => {
              if(type === 'terms') setAgreeTerms(true);
              else setAgreePrivacy(true);
              setShowModal(null);
            }}
            className="bg-rose-500 text-white font-bold py-3 px-8 rounded-xl w-full"
          >
            Agree & Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md bg-white min-h-screen md:min-h-0 md:my-10 md:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 relative">
      {showModal && <LegalModal type={showModal} />}
      
      <div className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Start your journey with NearChat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={handleRandomize}>
              <img 
                src={photoUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-rose-50 ring-offset-2 transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Click to randomize your info</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nickname</label>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 outline-none transition-all"
                placeholder="Enter nickname"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Age</label>
              <select 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 outline-none appearance-none cursor-pointer"
              >
                {AGE_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 outline-none appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300 outline-none appearance-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Interests (Max 5)</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedInterests.includes(interest) 
                      ? 'bg-rose-500 text-white shadow-md scale-105' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button
              type="submit"
              disabled={!agreeTerms || !agreePrivacy || !nickname.trim()}
              className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                agreeTerms && agreePrivacy && nickname.trim()
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Start NearChat</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Legal Agreements Row */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-300"
                />
                <span className="text-[11px] font-medium text-gray-400 group-hover:text-rose-400 transition-colors" onClick={(e) => { e.preventDefault(); setShowModal('terms'); }}>
                  Terms of Service
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreePrivacy} 
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-300"
                />
                <span className="text-[11px] font-medium text-gray-400 group-hover:text-rose-400 transition-colors" onClick={(e) => { e.preventDefault(); setShowModal('privacy'); }}>
                  Privacy Policy
                </span>
              </label>
            </div>
            <p className="text-[10px] text-gray-300 text-center leading-tight">
              NearChat may include ads from Coupang Partners and Google AdSense.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;
