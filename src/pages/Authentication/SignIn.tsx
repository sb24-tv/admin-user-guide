import {FaRegEyeSlash, FaRegEye} from "react-icons/fa6";
import Logo from '../../images/logo/sb24.png';
import {useState} from "react";
import APIService from "../../service/APIService.ts";
import {LocalStorageKey} from "../../enum";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [requiredUserName, setRequiredUsername] = useState<boolean>(false);
    const [requiredPassword, setRequiredPassword] = useState<boolean>(false);

    const handleLogin = async () => {
        setMessage('');
        if (!username || !password) {
            if (!username) setRequiredUsername(true);
            if (!password) setRequiredPassword(true);
            return;
        }
        APIService.post('users/login', {username, password}).then((res: any) => {
            if ('user' in res.data) {
                localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data.user));
                window.location.href = '/';
            }
        }).catch(() => {
            setRequiredUsername(false);
            setRequiredPassword(false);
            setMessage('Username or password is incorrect!');
        })
    };
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleLogin().then();
        }
    }

    const onClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <div className="flex flex-wrap items-center justify-center h-[100vh] ">
                <div
                    className="border-stroke dark:border-strokedark xl:w-1/4 sm:w-2/4 md:w-2/4 bg-white dark:bg-boxdark rounded-xl box-shadow-custom-2">
                    <div className="w-full p-10 flex items-center flex-col justify-center">
                        <img src={Logo} alt="logo" className="w-20"/>
                        <span
                            className="my-5 block font-normal  text-base justify-center text-center leading-6 text-gray-4">Thank you for get back to Admin User Guide, lets access our the best recommendation for your</span>
                        <div className="w-full">
                            <div className="mb-6 relative">
                                <label className="mb-2.5 block font-medium text-gray-5 text-base dark:text-white">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Enter usrename"
                                        name="email"
                                        value={username}
                                        onKeyPress={handleKeyPress}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full rounded-lg bg-input py-3 pl-4.5 border pr-10 outline-none focus-visible:shadow-none ${requiredUserName ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                    />
                                </div>
                                {requiredUserName &&
                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Username is required</span>}
                            </div>
                            <div className="mb-8 relative">
                                <label className="mb-2.5 block font-medium text-gray-5 text-base dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Password"
                                        name="password"
                                        value={password}
                                        onKeyPress={handleKeyPress}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full rounded-lg bg-input py-3 border pl-4 pr-10 outline-none focus-visible:shadow-none ${requiredPassword ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                    />
                                    <span className="absolute right-2 top-4 cursor-pointer"
                                          onClick={onClickShowPassword}>
                                        {
                                            showPassword
                                                ?
                                                <FaRegEye className="w-10"/>
                                                :
                                                <FaRegEyeSlash className="w-10"/>
                                        }
                                    </span>
                                </div>
                                {requiredPassword &&
                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Password is required</span>}
                            </div>

                            <div className="mb-5 flex">
                                <button
                                    onClick={handleLogin}
                                    className="w-full cursor-pointer rounded-lg border-transparent focus:border-transparent bg-orange-dark p-3 text-white transition hover:bg-opacity-90"
                                >
                                    Login
                                </button>

                            </div>
                            <div className="mb-4 relative">
                                {
                                    message && <span className="text-meta-1 absolute">  {message}  </span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
