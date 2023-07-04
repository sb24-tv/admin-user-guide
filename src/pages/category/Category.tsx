import Breadcrumb from '../../components/Breadcrumb.tsx';
// import ProductOne from "../../images/product/product-01.png";
import {useEffect, useState} from "react";
import APIService from "../../service/APIService.ts";
import {Link, useSearchParams} from "react-router-dom";
import NoImage from "../../images/logo/black-and-white.png"
import {FaRegPenToSquare, FaTrash} from "react-icons/fa6";

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

const Category = () => {
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const getSecondCategory = searchParams.get('c2');
    const getThirdCategory = searchParams.get('c3');
    const getLastCategory = searchParams.get('c4');


    const [category, setCategory] = useState([]);
    useEffect(() => {
        APIService.get('subcat').then((response: any) => {
            if (response.status == 200) {
                setCategory(response.data.data);
            }
        });
    }, []);
    const onError = (e: any) => {
        e.target.src = NoImage;
    }
    return (
        <>
            <Breadcrumb pageName="Category"/>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-end mb-3">
                        <Link
                            to="create"
                            className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6"
                        >
                            Create New
                        </Link>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
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
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            category.map((category: any, key: number) => (
                                    <tr className="border-b border-[#eee] last:border-b-0" key={key}>
                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <Link to={`?c1=${category.id}`}>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <div className="h-12.5 w-15 rounded-md">
                                                        <img
                                                            src={category.catphoto ? getURL() + '/public/images/' + category.catphoto : NoImage}
                                                            alt={category.name} className="w-20" onError={onError}/>
                                                    </div>
                                                    <p className="text-base text-black dark:text-white">
                                                        {category.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-5 px-4 dark:border-strokedark">
                                            <Link to={`?c1=${category.id}`}>
                                                <p className="text-base text-black dark:text-white">
                                                    {category.slug}
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="py-5 px-4 dark:border-strokedark">
                                            <p className="text-base text-black dark:text-white">
                                                {category.ordering}
                                            </p>
                                        </td>
                                        <td className="py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {new Date(category.createdAt).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                }
                                            </p>
                                        </td>
                                        <td className="py-5 px-4 dark:border-strokedark">
                                            <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                Active
                                            </p>
                                        </td>
                                        <td className="py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button className="hover:text-primary">
                                                    <FaTrash/>
                                                </button>
                                                <button className="hover:text-primary">
                                                    <FaRegPenToSquare/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )

                            )
                        }

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default Category;
