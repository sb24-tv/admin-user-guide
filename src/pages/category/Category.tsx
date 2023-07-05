import { Fragment, useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import NoImage from "../../images/logo/black-and-white.png"
import { FaRegPenToSquare, FaTrash, FaAngleLeft, FaUpload } from "react-icons/fa6";
import { Dialog, Transition } from '@headlessui/react'

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
function getCategoryValue(getFirstCategory: unknown, getSecondCategory: unknown, getLastCategory: unknown) {
    switch (true) {
        case !!getLastCategory:
            return getLastCategory;
        case !!getSecondCategory:
            return getSecondCategory;
        case !!getFirstCategory:
            return getFirstCategory;
        default:
            return null
    }
}
const onError = (e: any) => {
    e.target.src = NoImage;
}

function TableRow({ data, onSelect }: any) {
    return data.map((item: any, index: number) => (
        <tr onClick={() => item.subcategories.length && onSelect(item)} className="border-b border-[#eee] last:border-b-0" key={index}>
            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">


                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                        <img
                            src={item.catphoto ? getURL() + '/public/images/' + item.catphoto : NoImage}
                            alt={item.name} className="w-20" onError={onError} />
                    </div>
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
                <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    Active
                </p>
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
    const getParamsCategory = getCategoryValue(getFirstCategory, getSecondCategory, getLastCategory);

    const [category, setCategory] = useState([]);
    const [selectFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);
    // console.log('this select file',selectFile.name)
    let [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        APIService.get('subcat').then((response: any) => {
            if (response.status == 200) {
                if (getFirstCategory) {
                    response.data.data.filter((item: any) => {
                        if (item.id === parseInt(getFirstCategory)) {
                            setCategory(item.subcategories);
                        }
                    });
                } else if (getFirstCategory && getSecondCategory ) {
                    response.data.data.filter((item: any) => {
                        if (item.id === parseInt(getSecondCategory)) {
                            setCategory(item.subcategories);
                        }
                    });
                } else if (getFirstCategory && getSecondCategory && getLastCategory) {
                    response.data.data.filter((item: any) => {
                        if (item.id === parseInt(getLastCategory)) {
                            setCategory(item.subcategories);
                        }
                    });
                }
                else {
                    setCategory(response.data.data);
                }
            }
        });
    }, []);


    const onClose = () => {
        setIsOpen(!isOpen);
        setSelectedFile(null);
        setPreviewURL(null);
        setRequiredName(false);
        setEnabled(true);
    }

    const handleSubmit = async () => {
        if (!nameRef.current?.value) {
            setRequiredName(true);
            return;
        }
        if (selectFile) {
            const formData = new FormData();

            const data = {
                name: nameRef.current?.value,
                slug: slugRef.current?.value,
                parentCategoryId: getParamsCategory ? getParamsCategory : null,
                ordering: orderingRef.current?.value,
                status: enabled ? 1 : 0,
            }

            formData.append('catphoto', selectFile);
            formData.append('name', data.name);
            formData.append('slug', data.slug);
            formData.append('parentCategoryId', data.parentCategoryId as any);
            formData.append('ordering', data.ordering);
            formData.append('status', data.status as any);

            APIService.insertFormData('category', formData).then((response: any) => {
                console.log(response);
                if (response.status == 200) {
                    // alert('Category created successfully');
                    window.location.reload();
                }
            }
            );
        }

    }

    const handleFileChange = (event: any) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };
    const handleNameChange = () => {
        const nameValue = nameRef.current?.value || '';
        setRequiredName(false);
        const slugValue = generateSlug(nameValue);
        if (slugRef.current) {
            slugRef.current.value = slugValue;
        }
    };
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace whitespace with hyphens
            .replace(/[^\w-]+/g, '')// Remove non-word characters except hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/_+/g, '');
    };

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
                                        Create Category
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
                                                    onChange={handleNameChange}
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
                                                <label className="font-medium text-black dark:text-white">
                                                    Slug
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Slug"
                                                    ref={slugRef}
                                                    disabled
                                                    className="mt-3 w-full rounded-lg bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-default border-2 border-white3 disabled:bg-white3 dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between">
                                                    <label className="font-medium text-black dark:text-white">
                                                        Ordering
                                                    </label>
                                                    <label className="font-medium text-black dark:text-white">
                                                        Status
                                                    </label>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <input
                                                        type="number"
                                                        ref={orderingRef}
                                                        defaultValue={1}
                                                        className="mt-3 w-5/6 border-2 border-input rounded-lg bg-input py-3 px-5 font-medium outline-none transition focus:border-transparent active:border-transparent disabled:cursor-default dark:bg-meta-4  dark:text-white"
                                                    />
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
                                            {
                                                !getFirstCategory && !getSecondCategory && !getLastCategory &&
                                                <div>
                                                    <label className="font-medium text-black dark:text-white">Image</label>
                                                    <div
                                                        className={`relative mt-3 mb-2 block w-full duration-150 transition-all cursor-pointer appearance-none rounded border-2 border-dashed bg-input py-4 px-4 dark:bg-meta-4 sm:py-7.5 ${previewURL ? 'border-primary' : 'border-bodydark hover:border-primary'}`}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={imageRef}
                                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                                            onChange={handleFileChange}
                                                        />
                                                        <div className="flex flex-col items-center justify-center space-y-3">
                                                            {previewURL ? (
                                                                <img
                                                                    src={previewURL}
                                                                    alt="Uploaded Image Preview"
                                                                    className="h-30 w-30 object-contain rounded-lg"
                                                                />
                                                            ) : (
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                    <FaUpload />
                                                                </span>
                                                            )}
                                                            {
                                                                !previewURL &&
                                                                <p>
                                                                    <span className="text-primary">Click to upload</span> or drag and drop image here
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            }
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
                            <TableRow

                                data={category}
                                onSelect={(item: any) => {
                                    if (!getFirstCategory) {
                                        navigate(`/category/?c1=${item.id}`);
                                    } else if (!getSecondCategory) {
                                        navigate(`/category/?c1=${getFirstCategory}&c2=${item.id}`);
                                    } else if (!getLastCategory) {
                                        navigate(`/category/?c1=${getFirstCategory}&c2=${getSecondCategory}&c3=${item.id}`);
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
