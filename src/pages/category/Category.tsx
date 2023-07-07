import { Fragment, useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import NoImage from "../../images/logo/black-and-white.png"
import { FaRegPenToSquare, FaTrash, FaAngleLeft, FaUpload } from "react-icons/fa6";
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CreateCategory from "./CreateCategory.tsx";

function getURL() {
    // @ts-ignore
    if (import.meta.env.MODE === "production") {
        // @ts-ignore
        return import.meta.env.VITE_API_PROD
    } else {
        // @ts-ignore
        return import.meta.env.VITE_API_DEV
    }
}
// function getCategoryValue(getFirstCategory: unknown, getSecondCategory: unknown, getLastCategory: unknown) {
//     switch (true) {
//         case !!getLastCategory:
//             return getLastCategory;
//         case !!getSecondCategory:
//             return getSecondCategory;
//         case !!getFirstCategory:
//             return getFirstCategory;
//         default:
//             return null
//     }
// }

function TableRow({ data, onSelect }: any) {
    const onError = (e: any) => {
        e.target.src = NoImage;
    }
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const getSecondCategory = searchParams.get('c2');
    const getLastCategory = searchParams.get('c3');
    return data.map((item: any, index: number) => (
        <tr className="border-b border-[#eee] dark:border-graydark last:border-b-0" key={index}>
            <td className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                {
                    data.length > 0
                    &&
                    <p className="text-sm text-black dark:text-white">
                        {index + 1}
                    </p>
                }
            </td>
            <td onClick={() => item.subcategories && onSelect(item)}
                className={`py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 ${item.subcategories && 'cursor-pointer'}`}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {
                        !getFirstCategory && !getSecondCategory && !getLastCategory &&
                        <div className="h-12.5 w-15 rounded-md">
                            <img
                                src={item.catphoto ? getURL() + '/public/images/' + item.catphoto : NoImage}
                                alt={item.name} className="w-20" onError={onError} />
                        </div>
                    }
                    <p className="text-base text-black dark:text-white">
                        {item.name}
                    </p>
                </div>

            </td>
            <td className="py-5 px-4 dark:border-strokedark">
                <p className="text-base text-black dark:text-white">
                    {item.slug}
                </p>
            </td>
            <td className="py-5 px-4 dark:border-strokedark">
                <p className="text-base text-black dark:text-white">
                    {item.ordering}
                </p>
            </td>
            <td className="py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })
                    }
                </p>
            </td>
            <td className="py-5 px-4 dark:border-strokedark">
                {
                    item.status === true ? (
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
            <td className="py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                        <FaTrash />
                    </button>
                    <button className="hover:text-primary">
                        <FaRegPenToSquare />
                    </button>
                </div>
            </td>
        </tr>
    ))
}

const Category = () => {
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const getSecondCategory = searchParams.get('c2');
    const getLastCategory = searchParams.get('c3');
    const nameRef = useRef<any>(null);
    const slugRef = useRef<any>(null);
    const orderingRef = useRef<any>(null);
    const imageRef = useRef<any>(null);
    const [category, setCategory] = useState([]);
    const [selectFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);
    // console.log('this select file',selectFile.name)
    let [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const fetchData = () => {
        APIService.get('subcat').then((response: any) => {
            if (response.status == 200) {
                if (getFirstCategory && !getSecondCategory && !getLastCategory) {
                    response.data.data.map((item: any) => item.id === parseInt(getFirstCategory)
                        &&
                        setCategory(item.subcategories));

                } else if (getFirstCategory && getSecondCategory && !getLastCategory) {

                    response.data.data.map((item: any) => item.id === parseInt(getFirstCategory)
                        &&
                        item.subcategories.map((subItem: any) => subItem.id === parseInt(getSecondCategory)
                            &&
                            setCategory(subItem.subcategories)));
                }
                else if (getFirstCategory && getSecondCategory && getLastCategory) {
                    response.data.data.map((item: any) => item.id === parseInt(getFirstCategory)
                        &&
                        item.subcategories.map((subItem: any) => subItem.id === parseInt(getSecondCategory)
                            &&
                            subItem.subcategories.map((lastItem: any) => lastItem.id === parseInt(getLastCategory)
                                &&
                                setCategory(lastItem.subcategories))));
                }
                else {
                    setCategory(response.data.data);
                }
            }
        });
    }
    useEffect(() => {
        fetchData();
    }, [getFirstCategory, getSecondCategory, getLastCategory]);

    const onCloseEdiCategory = () => {
        setOpen(false);
    }
    return (
        <>
            <CreateCategory show={open} onCloseEdiCategory={onCloseEdiCategory} createCategory={() => fetchData()} />
            <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center">
                {
                    getFirstCategory &&
                    <Link to="/category" className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-3 text-center font-medium text-white">
                        <FaAngleLeft className="fill-white" />
                    </Link>
                }
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Category
                </h2>
            </div>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-gray-box-2 sm:px-7.5 xl:pb-1 ">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-end mb-3">
                        <div className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 cursor-pointer"
                            onClick={() => setOpen(true)}
                        >
                            Create New
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-black-2 rounded-t-xl">
                                <th className="py-4 px-4 min-w-[10px] font-medium text-black dark:text-white xl:pl-11 rounded-tl-lg rounded-bl-lg">
                                    No
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Category Name
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Slug
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Order
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Created Date
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Active
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white rounded-tr-lg rounded-br-lg">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow

                                data={category}
                                onSelect={(item: any) => {
                                    if (!getFirstCategory) {
                                        navigate(`/category/?c1=${item.id}`);
                                    } else if (!getSecondCategory) {
                                        navigate(`/category/?c1=${getFirstCategory}&c2=${item.id}`);
                                    } else if (!getLastCategory) {
                                        navigate(`/category/?c1=${getFirstCategory}&c2=${getSecondCategory}&c3=${item.id}`);
                                    } else {
                                        navigate(`/category/?c1=${item.id}`);
                                    }

                                    setCategory(item.subcategories)
                                }}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default Category;
