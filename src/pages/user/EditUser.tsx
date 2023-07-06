import { Fragment, useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { StatusCodes } from "../../enum/index.ts";

interface MyComponentProps {
    show: boolean;
    onCloseEditUser: any;
    dataForEditUser: any;
    statusEditUser: boolean;
}

function EditUser(props: MyComponentProps) {
    const { show, onCloseEditUser, dataForEditUser, statusEditUser } = props;
    console.log("this :", statusEditUser)

    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [requiredUsername, setRequiredUsername] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(statusEditUser === true ? false : true);
    console.log("this  EditUser  enabled:", enabled)
    // const status = statusEditUser
    // console.log("this  EditUser  status:", status)
    // if (dataForEditUser.activate === 0) {
    //     setEnabled(false);
    // }

    const nameRef = useRef<any>(null);
    const usernameRef = useRef<any>(null);

    const handleSubmitEdit = async () => {
        const name = nameRef.current?.value;
        const username = usernameRef.current?.value;
        const id = dataForEditUser?.id;
        const status = enabled ? 1 : 0;
        if (!name || !username) {
            if (!name) setRequiredName(true);
            if (!username) setRequiredUsername(true);
            return;
        }
        const data = {
            name: nameRef?.current.value,
            username: usernameRef?.current.value,
            activate: status
        }
        APIService.put(`users/${id}`, data).then((response: any) => {
            console.log("this  APIService.put  response:", response)
            if (response.status === StatusCodes.OK) {
                // setIsOpenEdit(!isOpenEdit);
                // setUser(response.data);
                return;
            }
        }
        ).catch((error: any) => {
            console.log(error);
        }
        );
    }
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={onCloseEditUser}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                                    Edit User
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
                                                defaultValue={dataForEditUser?.name}
                                                onChange={() => setRequiredName(false)}
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


                                        <div>
                                            <div className="flex justify-between">
                                                <label className="font-medium text-black dark:text-white">
                                                    Username <span className="text-meta-1">*</span>
                                                </label>
                                                <label className="font-medium text-black dark:text-white">
                                                    Status
                                                </label>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="relative w-5/6">
                                                    <input
                                                        type="text"
                                                        placeholder="Username"
                                                        ref={usernameRef}
                                                        defaultValue={dataForEditUser?.username}
                                                        onChange={() => setRequiredUsername(false)}
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
                                                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${ !enabled ? dataForEditUser?.activate === 1 ? '' : '' : '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center">
                                            <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={onCloseEditUser}>
                                                Cancel
                                            </button>
                                            <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmitEdit}>
                                                Update User
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
    )
}

export default EditUser