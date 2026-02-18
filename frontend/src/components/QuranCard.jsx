import React, { useState, useEffect, useRef } from 'react';
import { calculateQuranScore, TARGETS } from '../utils/scoring';

const QuranCard = ({ quran, onChange, currentDay, allData, isLocked = false }) => {
  const score = calculateQuranScore(quran);
  const [error, setError] = useState('');
  const [manualEdit, setManualEdit] = useState(false);
  const lastDayRef = useRef(currentDay);
  const initializedRef = useRef(false);

// Choose ONE: 'backward' | 'global' | 'hybrid'
const TRACKING_STRATEGY = 'hybrid'; 

useEffect(() => {
  // Reset initialized flag when day changes
  if (lastDayRef.current !== currentDay) {
    lastDayRef.current = currentDay;
    initializedRef.current = false;
  }

  // Skip if already initialized or user is manually editing
  if (manualEdit || initializedRef.current) return;

  // Day 1: Always start at page 2
  if (currentDay === 1) {
    if (quran.startPage !== 2) {
      onChange({ ...quran, startPage: 2 });
    }
    initializedRef.current = true;
    return;
  }

  // Day 2+: Find where to start
  let nextStartPage = null;

  // PRIORITY 1: Backward tracking - find last day with reading
  if (allData?.days) {
    for (let day = currentDay - 1; day >= 1; day--) {
      const dayData = allData.days[day];
      if (dayData?.quran?.endPage > 0) {
        nextStartPage = dayData.quran.endPage;
        break;
      }
    }
  }

  // PRIORITY 2: Fallback to global currentPage if no previous day found
  if (nextStartPage === null && quran.currentPage > 0) {
    nextStartPage = quran.currentPage;
  }

  // PRIORITY 3: Ultimate fallback to page 2
  if (nextStartPage === null) {
    nextStartPage = 2;
  }

  // KHATM RESET: If reached end of Quran (612 or 604), loop back to page 2
  const LAST_QURAN_PAGE = 612; // or 604 depending on your Mushaf
  if (nextStartPage >= LAST_QURAN_PAGE) {
    nextStartPage = 2;
  }

  // Only update if different
  if (quran.startPage !== nextStartPage) {
    onChange({ ...quran, startPage: nextStartPage });
  }
  
  initializedRef.current = true;

}, [currentDay, manualEdit]);


  // Calculate pages read whenever start/end changes (can be negative if going backward)
  useEffect(() => {
    if (quran.startPage && quran.endPage) {
      const pagesRead = quran.endPage - quran.startPage;
      if (pagesRead !== quran.pagesRead) {
        onChange({ ...quran, pagesRead });
      }
    }
  }, [quran.startPage, quran.endPage]);

  const handleStartPageChange = (value) => {
    const page = parseInt(value) || 0;
    setError('');

    if (page < 0) return;
    if (page > 0 && page < 2) {
      setError('Start page must be at least 2');
      return;
    }
    if (page > 612) {
      setError('Start page cannot exceed 612');
      return;
    }

    onChange({ ...quran, startPage: page });
  };

  const handleEndPageChange = (value) => {
    let page = parseInt(value) || 0;
    setError('');

    if (page < 0) return;
    
    // Clamp to max 612
    if (page > 612) {
      page = 612;
      setError('End page cannot exceed 612');
    }

    onChange({ ...quran, endPage: page });
  };

  // Calculate progress percentage (2 to 612 = 610 total pages)
  const progressPercent = Math.min(((quran.currentPage - 2) / 610) * 100, 100);

  const getProgressColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
      {isLocked && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
          🔒 <strong>View Only:</strong> This is a past day. You cannot edit this data.
        </div>
      )}
      
      <div className={isLocked ? "pointer-events-none opacity-60" : ""}>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
          📖 Quran Reading Tracker
        </h2>

        {/* Daily Reading Input */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700">
            Daily Reading
          </h3>
          {currentDay > 1 && (
            <button
              onClick={() => setManualEdit(!manualEdit)}
              className="text-xs md:text-sm px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              {manualEdit ? '🔒 Lock Auto' : '✏️ Manual Edit'}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Page {!manualEdit && currentDay > 1 && <span className="text-xs text-gray-500">(Auto)</span>}
            </label>
            <input
              type="number"
              min="2"
              max="612"
              value={quran.startPage > 0 ? quran.startPage : ''}
              onChange={(e) => handleStartPageChange(e.target.value)}
              readOnly={!manualEdit && currentDay > 1}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                !manualEdit && currentDay > 1
                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Page <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="2"
              max="612"
              value={quran.endPage > 0 ? quran.endPage : ''}
              onChange={(e) => handleEndPageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder={quran.startPage > 0 ? String(quran.startPage + 20) : "22"}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs md:text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        {/* Pages Read Today */}
        {quran.pagesRead !== 0 && (
          <div className={`mt-3 p-3 rounded-lg ${
            quran.pagesRead > 0 ? 'bg-emerald-50' : 'bg-orange-50'
          }`}>
            <p className={`text-sm md:text-base font-semibold ${
              quran.pagesRead > 0 ? 'text-emerald-700' : 'text-orange-700'
            }`}>
              📄 Pages Read Today: <span className="text-lg">{quran.pagesRead}</span>
              {quran.pagesRead < 0 && <span className="text-xs ml-2">(Backward)</span>}
            </p>
          </div>
        )}

        {/* Continuation Info */}
        {currentDay > 1 && quran.startPage > 2 && !manualEdit && allData && allData.days && (() => {
          return null;
        })()}
      </div>

      {/* Overall Progress (2 → 612) */}
      <div className="border-t border-gray-200 pt-4 md:pt-6 mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">
          Overall Progress (Page 2 → 612)
        </h3>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Current Position</span>
            <span className="text-sm font-bold text-blue-600">
              Page {quran.currentPage} / 612
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 10 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(progressPercent)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Khatam Counter */}
      <div className="border-t border-gray-200 pt-4 md:pt-6 mb-4 md:mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">🎉 Khatam Completed</p>
          <p className="text-3xl md:text-4xl font-bold text-yellow-600">
            {quran.khatamCount}
          </p>
        </div>
      </div>

      {/* Daily Target & Score */}
      <div className="border-t border-gray-200 pt-4 md:pt-6">
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Daily Target:</span> {TARGETS.quranPages} pages
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Reading {TARGETS.quranPages} pages daily = 100% score
          </p>
        </div>

        {/* Score Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Score</span>
            <span className="text-sm font-bold text-emerald-600">
              {score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(score, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuranCard;