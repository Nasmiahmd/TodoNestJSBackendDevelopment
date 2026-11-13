
const AuthPage = () => {
    return (
        <div className="outer-card bg-violet-100">
            <div className="inner-card">
                <div className="top-portion w-full h-35 bg-indigo-600 font-semibold px-11">
                    <h1 className="mt-9">Welcome Back</h1>
                    <p className="text-blue-950 text-md mt-1 ps-2 ">Please enter your details</p>
                </div>
                <div className="auth-input-card">
                    <input className="auth-inputs" type="text" placeholder="Email Address" />
                    <input className="auth-inputs" type="text" placeholder="Password" />
                </div>
                <div className=" flex justify-center items-center mt-12">
                    <button className="auth-btn">Sign In</button>
                </div>
                <div className="auth-choice">
                    <p className="text-md text-black">Don't you have an account? <a  href="#"></a></p>
                </div>
            </div>
        </div >
    )
}

export default AuthPage