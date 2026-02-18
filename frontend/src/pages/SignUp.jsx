import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uucms, setUucms] = useState('');
  const [stream, setStream] = useState('BCA');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (!uucms.trim()) {
      setError('UUCMS No is required.');
      return;
    }

    setLoading(true);

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('ramadan_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    const newUser = { name, email, password, uucms, stream, year, gender, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('ramadan_users', JSON.stringify(users));

    setTimeout(() => {
      // Auto sign in after registration
      localStorage.setItem('ramadan_current_user', JSON.stringify(newUser));
      // Redirect based on gender
      navigate(gender === 'female' ? '/girls' : '/boys');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Stars pattern */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🌙</div>
          <h1 className="text-3xl font-bold text-white mb-1">Ramadan Tracker</h1>
          <p className="text-emerald-200/80 text-sm">Create your account and start tracking</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-5 text-center">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* UUCMS No */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">UUCMS No</label>
              <input
                type="text"
                value={uucms}
                onChange={(e) => setUucms(e.target.value)}
                required
                placeholder="Enter your UUCMS number"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Stream & Year Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stream Toggle */}
              <div>
                <label className="block text-emerald-200 text-sm font-medium mb-1.5">Stream</label>
                <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setStream('BBA')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                      stream === 'BBA'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    BBA
                  </button>
                  <button
                    type="button"
                    onClick={() => setStream('BCA')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                      stream === 'BCA'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    BCA
                  </button>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-emerald-200 text-sm font-medium mb-1.5">Year</label>
                <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                  {['1', '2', '3'].map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(y)}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                        year === y
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-white/60 hover:text-white/80'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">Gender</label>
              <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    gender === 'male'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  🧔 Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    gender === 'female'
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  🧕 Female
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-emerald-200 text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-emerald-200/70 text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-emerald-200/40 text-xs mt-5">
          رمضان مبارک — May this Ramadan bring you closer to Allah ☪️
        </p>
      </div>
    </div>
  );
}

export default SignUp;
