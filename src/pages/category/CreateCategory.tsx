import { Fragment, useState, useRef } from "react";
import APIService from "../../service/APIService.ts";
import { FaUpload } from "react-icons/fa6";
import { Dialog, Transition } from '@headlessui/react'
import { useSearchParams } from "react-router-dom";
import { StatusCodes } from "../../enum/index.ts";
import { toast } from 'react-toastify';
interface MyComponentProps {
    show: boolean;
    onCloseCreateCategory: any;
    createCategory: () => void;
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
export default function CreateCategory(props: MyComponentProps) {
    const { show, onCloseCreateCategory } = props;
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const getSecondCategory = searchParams.get('c2');
    const getLastCategory = searchParams.get('c3');
    const nameRef = useRef<any>(null);
    const slugRef = useRef<any>(null);
    const orderingRef = useRef<any>(null);
    const imageRef = useRef<any>(null);
    const getParamsCategory = getCategoryValue(getFirstCategory, getSecondCategory, getLastCategory);

    const notify = () => {
        toast.success('Category created successfully', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const [selectFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [requiredImage, setRequiredImage] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);

    const onClose = () => {
        onCloseCreateCategory();
        setSelectedFile(null);
        setPreviewURL(null);
        setRequiredName(false);
        setEnabled(true);
        setRequiredImage(false);
    }

    // setTimeout(() => {
    // }, 500); // Delay of 2000 milliseconds (2 seconds)
    // const getSlug = APIService.get(`category/slug?slugname=${slugRef.current?.value}`).then((response: any) => {
    //     if (response.status === StatusCodes.OK) {
    //         // Process the response data here
    //         console.log('response', response);
    //         // setRequiredName(true);
    //     } else if (response.status === StatusCodes.CONFLICT) {
    //         // Process the response data here
    //         console.log('response', response);
    //         setRequiredName(true);
    //         return;
    //     }
    // });
    const handleSubmit = async () => {
        // getSlug
        const nameValue = nameRef.current?.value
        const imageValue = imageRef.current?.value
        if (!nameValue || !imageValue && !getFirstCategory && !getSecondCategory && !getLastCategory) {
            if (!nameValue) setRequiredName(true);
            if (!imageValue && !getFirstCategory && !getSecondCategory && !getLastCategory) setRequiredImage(true);
            return;
        };
        if (selectFile) {
            const formData = new FormData();
            const data = {
                name: nameRef.current?.value,
                slug: slugRef.current?.value,
                parentCategoryId: null,
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
                if (response.status === StatusCodes.OK) {
                    notify();
                    onCloseCreateCategory();
                    props.createCategory();
                    setSelectedFile(null);
                    setPreviewURL(null);
                    setRequiredName(false);
                    setEnabled(true);
                }
            }
            );
        } else {
            const data = {
                name: nameRef.current?.value,
                slug: null,
                parentCategoryId: getParamsCategory ? getParamsCategory : null,
                ordering: orderingRef.current?.value,
                status: enabled ? 1 : 0,
            }
            APIService.post('category', data).then((response: any) => {
                if (response.status === StatusCodes.OK) {
                    notify();
                    onCloseCreateCategory();
                    props.createCategory();
                    setSelectedFile(null);
                    setPreviewURL(null);
                    setRequiredName(false);
                    setEnabled(true);
                }
            }
            );
        }

    }

    const handleFileChange = (event: any) => {
        setRequiredImage(false);
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
        <Transition appear show={show} as={Fragment}>
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
                                        {
                                            !getFirstCategory && !getSecondCategory && !getLastCategory &&
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
                                        }
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
                                                    className="mt-3 w-5/6 rounded-lg bg-input py-3 px-5 font-medium outline-none transition border-2 border-input dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white"
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
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">Image</label>
                                                <div className={`relative mt-3 mb-2 block w-full duration-150 transition-all cursor-pointer appearance-none rounded border-2 border-dashed bg-input py-4 px-4 dark:bg-meta-4 sm:py-7.5 ${requiredImage ? 'border-meta-1' : 'border-bodydark hover:border-primary'} ${previewURL ? 'border-primary' : ''}`} >
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
                                                {
                                                    requiredImage &&
                                                    <span className="text-meta-1 text-sm absolute">
                                                        Image is required
                                                    </span>
                                                }
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
    );
};


