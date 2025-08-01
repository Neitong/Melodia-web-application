import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import spotifyLogo from '../assets/spotify_logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    // const [sampleAccounts, setSampleAccounts] = useState([]);
    
    // Remove sample accounts logic
    // const { login, signup, getSampleAccounts } = useAuth();
    const { login, signup } = useAuth();

    // useEffect(() => {
    //     Remove fetching sample accounts
    //     const fetchSampleAccounts = async () => {
    //         const accounts = await getSampleAccounts();
    //         setSampleAccounts(accounts);
    //     };
    //     fetchSampleAccounts();
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        let result;
        if (showSignup) {
            result = await signup(username, email, password, 'user');
        } else {
            result = await login(email, password);
        }

        if (!result.success) {
            setError(result.message);
        }
        setIsLoading(false);
    };

    // Remove fillSampleAccount and sample accounts display

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src={spotifyLogo} alt="Spotify" className="h-12 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800">
                        {showSignup ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {showSignup ? 'Sign up to start listening' : 'Sign in to your account'}
                    </p>
                </div>

                {/* Sample Accounts Info */}
                {/* Removed sample accounts display */}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {showSignup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                {showSignup ? 'Creating Account...' : 'Signing In...'}
                            </div>
                        ) : (
                            showSignup ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                {/* Toggle between login and signup */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {showSignup ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setShowSignup(!showSignup)}
                            className="ml-1 text-green-600 hover:text-green-700 font-semibold"
                        >
                            {showSignup ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 