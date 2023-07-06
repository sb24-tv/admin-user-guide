import { Fragment, useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { FaRegEyeSlash, FaRegPenToSquare, FaKey, FaRegEye } from "react-icons/fa6";
import { StatusCodes } from "../../enum/index.ts";
import ChangePassword from "./ChangePassword.tsx";
import CreateUser from "./CreateUser.tsx";
import EditUser from "./EditUser.tsx";


const User = () => {
    const [users, setUser] = useState<any>([]);
    let [isOpenCreateUser, setIsOpenCreateUser] = useState<boolean>(false);
    let [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
    let [isOpenChangePassword, setIsOpenChangePassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [requiredUsername, setRequiredUsername] = useState<boolean>(false);
    

    // const [requiredPassword, setRequiredPassword] = useState<boolean>(false);
    // const [requiredNewPassword, setRequiredNewPassword] = useState<boolean>(false);
    // const [requiredConfirmPassword, setRequiredConfirmPassword] = useState<boolean>(false);
    // const [matchPassword, setMatchPassword] = useState<boolean>(false);
    // const [notMatchPassword, setNotMatchPassword] = useState<boolean>(false);

    const [userEdit, setUserEdit] = useState<any>([]);
    const [dataForEdit, setDataForEdit] = useState<any>([]);
    const [statusEdit, setStatusEdit] = useState<boolean>(true);
    // console.log("this  User  statusEdit:", statusEdit)


    const nameRef = useRef<any>(null);
    const usernameRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    // const newPasswordRef = useRef<any>(null);
    // const confirmPasswordRef = useRef<any>(null);

    useEffect(() => {
        APIService.get('users').then((response: any) => {
            if (response.status === 200) {
                setUser(response.data);
            }
        });
    }, []);
    // const onClose = () => {
    //     setIsOpen(!isOpen);
    //     setRequiredName(false);
    //     setRequiredUsername(false);
    //     setRequiredPassword(false);
    //     setEnabled(true);
    // }
    // const onCloseEdit = () => {
    //     setIsOpenEdit(!isOpenEdit);
    //     setRequiredName(false);
    //     setRequiredUsername(false);
    //     setEnabled(true);
    // }
   

    const handleEditUser = (user: any) => {
        if (user.activate === 0) {
            setStatusEdit(false);
        }
        setDataForEdit(user);
    }
    const handleChangePassword = (user: any) => {
        setUserEdit(user);
    }
    return (
        <>
            <CreateUser show={isOpenCreateUser} onCloseCreateUser={() => setIsOpenCreateUser(false)} />
            <EditUser show={isOpenEdit} onCloseEditUser={() => setIsOpenEdit(false)} dataForEditUser={dataForEdit} statusEditUser={statusEdit} />
            <ChangePassword show={isOpenChangePassword} onCloseChangePass={() => setIsOpenChangePassword(false)} dataForPassword={userEdit} />
           
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
                            onClick={() => setIsOpenCreateUser(true)}
                        >
                            Create New
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    No
                                </th>
                                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Username
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
                                            {
                                                users.length > 0
                                                &&
                                                <p className="text-sm text-black dark:text-white">
                                                    {index + 1}
                                                </p>
                                            }
                                        </td>
                                        <td className="py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <p className="text-sm text-black dark:text-white">
                                                {user.name ? user.name : "---"}
                                            </p>
                                        </td>
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
                                                <div className="flex items-center space-x-3.5">
                                                    <button className="hover:text-primary" onClick={() => {
                                                        handleChangePassword(user);
                                                        setIsOpenChangePassword(true);
                                                    }} >
                                                        <FaKey />
                                                    </button>
                                                    <button className="hover:text-primary" onClick={() => {
                                                        handleEditUser(user);
                                                        setIsOpenEdit(true);
                                                    }
                                                    }>
                                                        <FaRegPenToSquare />
                                                    </button>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            </div >

        </>
    );
};

export default User;
