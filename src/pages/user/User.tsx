import { Fragment, useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import {FaRegEyeSlash, FaRegEye} from "react-icons/fa6";


const User = () => {
    const [users, setUser] = useState<any>([]);
    const [enabled, setEnabled] = useState<boolean>(true);
    let [isOpen, setIsOpen] = useState<boolean>(false);
    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [requiredUsername, setRequiredUsername] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [requiredPassword, setRequiredPassword] = useState<boolean>(false);


    const nameRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);

    useEffect(() => {
        APIService.get('users').then((response: any) => {
            if (response.status === 200) {
                setUser(response.data);
            }
        });
    }, []);
    const onClose = () => {
        setIsOpen(!isOpen);
    }
    const handleSubmit = async () => {

    }
    const onClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-999" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[700px] max-h-[900px] transform overflow-hidden rounded-2xl bg-white dark:bg-boxdark p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-[20px] font-medium leading-6 text-black-box text-center dark:text-white2"
                                    >
                                        Create User
                                    </Dialog.Title>
                                    <div className="rounded-sm dark:border-strokedark dark:bg-boxdark">
                                        <div className="flex flex-col gap-5.5 p-6.5">
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">
                                                    Name <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    ref={nameRef}
                                                    className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredName ? 'border-meta-1 border-2' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                                />
                                                {
                                                    requiredName && (
                                                        <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                            Name is required
                                                        </span>
                                                    )
                                                }
                                            </div>
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">
                                                    Username <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    ref={nameRef}
                                                    className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredUsername ? 'border-meta-1 border-2' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                                />
                                                {
                                                    requiredUsername && (
                                                        <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                            Username is required
                                                        </span>
                                                    )
                                                }
                                            </div>

                                            <div>
                                                <div className="flex justify-between">
                                                    <label className="font-medium text-black dark:text-white">
                                                        Password <span className="text-meta-1">*</span>
                                                    </label>
                                                    <label className="font-medium text-black dark:text-white">
                                                        Status
                                                    </label>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="relative w-5/6 ">
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter Password"
                                                                name="password"
                                                                ref={passwordRef}
                                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition${requiredPassword ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                                            />
                                                            <span className="absolute right-2 top-7 cursor-pointer"
                                                                onClick={onClickShowPassword}>
                                                                {
                                                                    showPassword
                                                                        ?
                                                                        <FaRegEye className="w-10" />
                                                                        :
                                                                        <FaRegEyeSlash className="w-10" />
                                                                }
                                                            </span>
                                                        </div>
                                                        {requiredPassword &&
                                                            <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Password is required</span>}
                                                    </div>
                                                    <div className="mt-3">
                                                        <label htmlFor="toggle1"
                                                            className="flex cursor-pointer select-none items-center"
                                                        >
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    id="toggle1"
                                                                    className="sr-only"
                                                                    onChange={() => {
                                                                        setEnabled(!enabled);
                                                                    }}
                                                                />
                                                                <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                                                <div
                                                                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${enabled && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                                                        }`}
                                                                ></div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center">
                                                <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={onClose}>
                                                    Cancel
                                                </button>
                                                <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmit}>
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Users
                </h2>
            </div>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-end mb-3">
                        <div className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 cursor-pointer"
                            onClick={() => setIsOpen(true)}
                        >
                            Create New
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Created
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user: any, index: number) => (
                                    <tr key={index} className="border-b border-[#eee] last:border-b-0">
                                        <td className="py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <p className="text-sm text-black dark:text-white">
                                                {user.username}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {
                                                    new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 dark:border-strokedark">
                                            {
                                                user.activate === 1 ? (
                                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                        Active
                                                    </p>
                                                ) : (
                                                    <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                                                        Disable
                                                    </p>
                                                )
                                            }
                                        </td>
                                        <td className="py-4 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button className="hover:text-primary">
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default User;
