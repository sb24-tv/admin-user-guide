import { useEffect, useState } from "react";
import APIService from "../../service/APIService.ts";
import Pagination from "../../components/Pagination.tsx";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import { StatusCodes } from '../../enum/index.ts';
import NoArticle from "../../images/logo/article.png"
const Content = () => {
    const [searchParams] = useSearchParams();
    const [content, setContent] = useState([]);
    const [pages, setPage] = useState<any>([]);
    const page = searchParams.get('page');
    const searchKey = searchParams.get('search');

    useEffect(() => {
        APIService.get(`content?page=${page}`).then((response: any) => {
            if (response.status === StatusCodes.OK) {
                setContent(response.data.data);
                setPage(response.data.pagination);
            }
        });
    }, [page]);
    // @ts-ignore
    const handlePagination = (currents: any) => {
        setPage({ ...pages, current_page: currents });
    };
    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Content
                </h2>
            </div>
            <div className="flex flex-col gap-10">
                <div
                    className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-gray-box-2 sm:px-7.5 xl:pb-1 ">
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
                                <tr className="bg-gray-2 text-left dark:bg-black-2 rounded-t-xl">
                                    <th className="py-4 font-medium text-black dark:text-white xl:pl-11 rounded-tl-lg rounded-bl-lg">
                                        No
                                    </th>
                                    <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Title
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Category
                                    </th>
                                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        User
                                    </th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Created
                                    </th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                        Status
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white rounded-tr-lg rounded-br-lg">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    content.length > 0 ?
                                        content.map((item: any, index: number) => (
                                            <tr key={index} className="border-b border-[#eee] dark:border-graydark last:border-b-0">
                                                <td className="py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    {
                                                        pages.current_page === 1 ? (
                                                            <p className="text-sm text-black dark:text-white">
                                                                {index + 1}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm text-black dark:text-white">
                                                                {(pages.current_page - 1) * pages.limit + index + 1}
                                                            </p>
                                                        )
                                                    }
                                                </td>
                                                <td className="py-5 px-4 pl-9 max-w-[300px] dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {item.title}
                                                    </h5>
                                                </td>
                                                <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <span className="font-medium dark:text-white text-orange-dark ">
                                                        {item.category.name}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <span className="font-semibold dark:text-white capitalize">
                                                        {item.user ? item.user.name : "N/A"}
                                                    </span>
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
                                                        item.allowPublic === true ? (
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
                                                        <Link to={`edit/${item.id}`}
                                                            className="hover:text-primary">
                                                            <FaRegPenToSquare />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                                <div className="w-full flex flex-col items-center justify-center">
                                                    <img src={NoArticle} alt="No Category" className="w-25 my-4 text-center" />
                                                    <p className="text-sm text-black dark:text-white text-center">
                                                        No Content
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mb-3
                    ">
                        <span>
                            {
                                content.length === 0 && pages.total === 0 ?
                                    null
                                    :
                                    pages.total < pages.limit
                                        ?
                                        <>
                                            Showing all
                                            {
                                                pages ? ' ' + pages.total + ' ' : 0
                                            }
                                            results
                                        </>
                                        :
                                        <>
                                            Showing
                                            {
                                                pages.total === 0
                                                    ?
                                                    ` 0 - 0 `
                                                    :
                                                    ` ${(pages.current_page - 1) * pages.limit + 1} - ${(pages.current_page - 1) * pages.limit + content.length} `

                                            }
                                            of
                                            {
                                                pages ? ' ' + pages.total + ' ' : 0
                                            }
                                            results
                                        </>
                            }
                        </span>
                        <Pagination
                            pages={pages}
                            pagination={handlePagination}
                            searchKey={searchKey}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;
