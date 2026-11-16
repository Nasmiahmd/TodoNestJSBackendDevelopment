import { useEffect, useState } from "react"
import api from "../api/axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const AuthPage = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/todo', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // dynamic selection
            const endpoint = isSignIn ? '/auth/login' : '/auth/register';
            const payload = isSignIn ? { email, password } : { name, email, password };

            const response = await api.post(endpoint, payload);

            // Save JWT token
            localStorage.setItem('token', response.data.access_token);
            toast.success(isSignIn ? 'Login successful!' : 'Registration successful!');

            navigate('/todo')
        } catch (err: unknown) {
            const errorData = (err as any).response?.data?.message;

            let errorMessage = isSignIn ? 'Login failed' : 'Registration failed';

            if (Array.isArray(errorData)) {
                // Join multiple custom DTO sentences with a comma or space
                errorMessage = errorData.join('. ');
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }

            // Trigger the toast once with the final formatted message
            toast.error(errorMessage);
        }
    };



    return (
        <div className="outer-card bg-violet-100">
            <div className="inner-card">
                <div className="top-portion w-full h-35 bg-indigo-600 font-semibold px-11">
                    <h1 className="mt-9">{isSignIn == true ? "Welcome Back" : "Welcome!"}</h1>
                    <p className="text-blue-950 text-md mt-1 ps-2 ">Please enter your details</p>
                </div>
                <div className="auth-input-card">
                    <form onSubmit={handleSubmit}>
                        <div className="auth-input-card p-4 space-y-1">
                            {/* Show Name input only when signing up */}
                            {!isSignIn && (
                                <input
                                    className="auth-inputs w-full p-3 border rounded-md"
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                className="auth-inputs w-full p-3 border rounded-md"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                className="auth-inputs w-full p-3 border rounded-md"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-center items-center my-2">
                            <button
                                type="submit"
                                className="auth-btn px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 cursor-pointer"
                            >
                                {isSignIn ? "Sign In" : "Sign Up"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="auth-choice">
                    <p className="text-md text-black">{isSignIn === true ? "Don't you have an account? " : "Already have an account? "}<a className="sign-text" href="#" onClick={() => { setIsSignIn(!isSignIn) }}>{isSignIn === false ? "Sign In" : "Sign Up"}</a></p>
                </div>
            </div>
        </div >
    )
}

export default AuthPage