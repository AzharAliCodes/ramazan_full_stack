import React from 'react';

const FinalSummary = ({ scores }) => {
  const getFinalScoreColor = () => {
    if (scores.final >= 70) return 'text-green-600';
    if (scores.final >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFinalMessage = () => {
    if (scores.final >= 80) return '🌟 Excellent Performance!';
    if (scores.final >= 60) return '✨ Good Progress!';
    if (scores.final >= 40) return '💪 Keep Going!';
    return '🤲 Stay Committed!';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        🧮 Final Performance Summary
      </h2>

      <div className="border-t border-gray-300 pt-4 md:pt-6 mb-4 md:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-base font-medium text-gray-700">🕌 Salah:</span>
            <span className="text-lg font-bold text-emerald-600">{scores.salah}%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-base font-medium text-gray-700">📖 Quran:</span>
            <span className="text-lg font-bold text-emerald-600">{scores.quran}%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-base font-medium text-gray-700">📿 Dhikr:</span>
            <span className="text-lg font-bold text-emerald-600">{scores.dhikr}%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-base font-medium text-gray-700">📵 Discipline:</span>
            <span className="text-lg font-bold text-emerald-600">{scores.discipline}%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg sm:col-span-2">
            <span className="text-base font-medium text-gray-700">❤️ Good Deeds:</span>
            <span className="text-lg font-bold text-emerald-600">{scores.goodDeeds}%</span>
          </div>
        </div>
      </div>

      {/* Final Score Display */}
      <div className="border-t-4 border-yellow-400 pt-4 md:pt-6">
        <div className="text-center">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">
            FINAL SCORE
          </p>
          <div className={`text-5xl md:text-6xl lg:text-7xl font-bold ${getFinalScoreColor()} mb-3`}>
            {scores.final}%
          </div>
          <p className="text-base md:text-lg font-semibold text-gray-700">
            {getFinalMessage()}
          </p>
        </div>
      </div>

      {/* Weight Info */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-amber-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Weights: Salah 40% • Quran 20% • Dhikr 15% • Discipline 15% • Good Deeds 10%
        </p>
      </div>
    </div>
  );
};

export default FinalSummary;
