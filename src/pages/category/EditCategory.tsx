import { Fragment, useState, useRef, useEffect } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { useSearchParams } from "react-router-dom";
import { StatusCodes } from "../../enum";
import { toast } from 'react-toastify';
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import NoImage from "../../images/logo/black-and-white.png"
interface MyComponentProps {
    show: boolean;
    onCloseEditCategory: any;
    dataForEditCategory: any;
    updateCategory: () => void;
}
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
export default function EditCategory(props: MyComponentProps) {
    const { show, onCloseEditCategory, dataForEditCategory } = props;
    const [categorySelected, setCategorySelected] = useState<any>({});
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const getSecondCategory = searchParams.get('c2');
    const getLastCategory = searchParams.get('c3');
    const nameRef = useRef<any>(null);
    const slugRef = useRef<any>(null);
    const orderingRef = useRef<any>(null);
    const imageRef = useRef<any>(null);
    const [onLoading, setOnLoading] = useState<boolean>(false);
    const [messageSlugExist, setMessageSlugExist] = useState<string>('');
    const [messageSlugAvailable, setMessageSlugAvailable] = useState<string>('');
    const [disableButton, setDisableButton] = useState<boolean>(false);

    let typingTimeout: NodeJS.Timeout;
    const delay = 1500;
    useEffect(() => {
        setCategorySelected(dataForEditCategory);
    }, [dataForEditCategory]);

    const notify = () => {
        toast.success('Category updated successfully', {
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
    const notifyError = () => {
        toast.error('Something went wrong', {
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
    const notifyErrorImage = () => {
        toast.error('Allowed only png file', {
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

    const onClose = () => {
        onCloseEditCategory();
        setSelectedFile(null);
        setPreviewURL(null);
        setRequiredName(false);
        setCategorySelected(dataForEditCategory);
        setRequiredImage(false);
        setDisableButton(false);
        setOnLoading(false);
        setMessageSlugExist('');
        setMessageSlugAvailable('');
    }

    const handleSubmit = async () => {
        const nameValue = nameRef.current?.value
        const imageValue = imageRef.current?.value
        if (!nameValue || !imageValue && !getFirstCategory && !getSecondCategory && !getLastCategory && !dataForEditCategory.catphoto) {
            if (!nameValue) setRequiredName(true);
            if (!imageValue && !getFirstCategory && !getSecondCategory && !getLastCategory && !dataForEditCategory.catphoto) setRequiredImage(true);
            return;
        };
        if (selectFile || dataForEditCategory.catphoto) {
            const formData = new FormData();
            const statusCategory = categorySelected.status;
            const id = dataForEditCategory.id;
            const data = {
                name: nameRef.current?.value,
                slug: slugRef.current?.value,
                parentCategoryId: null,
                ordering: orderingRef.current?.value,
                status: statusCategory ? 1 : 0
            }

            formData.append('catphoto', selectFile || dataForEditCategory.catphoto);
            formData.append('name', data.name);
            formData.append('slug', data.slug);
            formData.append('parentCategoryId', data.parentCategoryId as any);
            formData.append('ordering', data.ordering);
            formData.append('status', data.status as any);

            APIService.updateFormData(`category/${id}`, formData).then((response: any) => {
                if (response.status === StatusCodes.OK) {
                    notify();
                    onCloseEditCategory();
                    props.updateCategory();
                    setSelectedFile(null);
                    setPreviewURL(null);
                    setRequiredName(false);
                    setCategorySelected(dataForEditCategory);
                    setMessageSlugAvailable('');
                    setMessageSlugExist('');
                }
            }
            );
        } else {
            const id = dataForEditCategory.id;
            const statusCategory = categorySelected.status;
            const data = {
                name: nameRef.current?.value,
                slug: null,
                ordering: orderingRef.current?.value,
                status: statusCategory
            }
            APIService.put(`category/${id}`, data).then((response: any) => {
                if (response.status === StatusCodes.OK) {
                    notify();
                    onCloseEditCategory();
                    props.updateCategory();
                    setSelectedFile(null);
                    setPreviewURL(null);
                    setRequiredName(false);
                    setCategorySelected(dataForEditCategory);
                    setMessageSlugAvailable('');
                    setMessageSlugExist('');
                }
            }
            ).catch(() => {
                notifyError();
            }
            );
        }

    }
    const handleFileChange = (event: any) => {
        setRequiredImage(false);
        const file = event.target.files && event.target.files[0];
        if (file) {
            const fileName = file.name;
            const lastDot = fileName.lastIndexOf('.');
            const ext = fileName.substring(lastDot + 1);
            if (ext === 'png') {
                setSelectedFile(file);
                setPreviewURL(URL.createObjectURL(file));
            } else {
                notifyErrorImage();
            }
        }
    };
    const handleNameChange = (event: any) => {
        setMessageSlugExist('');
        setMessageSlugAvailable('');
        setDisableButton(true);
        setOnLoading(true);
        const newValue = event.target.value;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            APIService.get(`category/slug?slugname=${newValue}`).then((response: any) => {
                if (response.status === StatusCodes.OK) {
                    setOnLoading(false);
                    setDisableButton(false);
                    setMessageSlugExist('');
                    setMessageSlugAvailable(response.data.message);
                }
                else if (response.status === StatusCodes.CONFLICT) {
                    if (dataForEditCategory?.slug === slugRef.current?.value) {
                        setOnLoading(false);
                        setDisableButton(false);
                        setMessageSlugAvailable('');
                        setMessageSlugExist('');
                    } else {
                        setOnLoading(false);
                        setDisableButton(true);
                        setMessageSlugAvailable('');
                        setMessageSlugExist(response.data.message);
                    }
                }
            });
        }, delay);

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
    const onError = (e: any) => {
        e.target.src = NoImage;
    }
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
                            <Dialog.Panel className="w-[700px] max-h-[900px] max-xl:w-[600px] max-lg:w-[500px] max-md:w-[400px] transform overflow-hidden rounded-2xl bg-white dark:bg-boxdark p-6 text-left align-middle shadow-xl transition-all">
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
                                                defaultValue={dataForEditCategory?.name}
                                                onChange={handleNameChange}
                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredName ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
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
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">
                                                    Slug
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Slug"
                                                        ref={slugRef}
                                                        defaultValue={dataForEditCategory?.slug}
                                                        disabled
                                                        className="mt-3 w-full rounded-lg bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-default border-2 border-white3 disabled:bg-white3 dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white"
                                                    />

                                                    {
                                                        onLoading &&
                                                        <div role="status" className="absolute right-2 top-7">
                                                            <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                                        </div>
                                                    }
                                                    {
                                                        messageSlugExist &&
                                                        <div role="status" className="absolute right-2 top-6.5">
                                                            <FaCircleExclamation className="fill-meta-1 w-6 h-6" />
                                                        </div>
                                                    }
                                                    {
                                                        messageSlugAvailable &&
                                                        <div role="status" className="absolute right-2 top-6.5">
                                                            <FaCircleCheck className="fill-success w-6 h-6" />
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                    messageSlugExist &&
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem] capitalize">
                                                        {messageSlugExist}
                                                    </span>
                                                }
                                                {
                                                    messageSlugAvailable &&
                                                    <span className="text-success text-sm absolute left-0 bottom-[-1.5rem] capitalize">
                                                        {messageSlugAvailable}
                                                    </span>
                                                }
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
                                                    defaultValue={dataForEditCategory?.ordering}
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
                                                                    setCategorySelected({ ...categorySelected, status: categorySelected?.status === true ? false : true });
                                                                }}
                                                            />
                                                            <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                                            <div className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${categorySelected?.status === false ? '' : '!right-1 !translate-x-full !bg-primary dark:!bg-white'}`} ></div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            !getFirstCategory && !getSecondCategory && !getLastCategory &&
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">Image <span className="text-meta-1">*</span></label>
                                                <div className={`relative mt-3 mb-2 block w-full duration-150 transition-all cursor-pointer appearance-none rounded border-2 border-dashed bg-input py-4 px-4 dark:bg-meta-4 sm:py-7.5 ${requiredImage ? 'border-meta-1' : 'border-bodydark hover:border-primary'} ${previewURL ? 'border-primary' : ''}`} >
                                                    <input
                                                        type="file"
                                                        accept="image/png"
                                                        ref={imageRef}
                                                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        {
                                                            dataForEditCategory?.catphoto && !previewURL && (
                                                                <img
                                                                    src={getURL() + '/public/images/' + dataForEditCategory?.catphoto}
                                                                    alt="Uploaded Image Preview"
                                                                    className="h-30 w-30 object-contain rounded-lg"
                                                                    onError={onError}
                                                                />
                                                            )
                                                        }
                                                        {
                                                            previewURL && (
                                                                <img
                                                                    src={previewURL}
                                                                    alt="Uploaded Image Preview"
                                                                    className="h-30 w-30 object-contain rounded-lg"
                                                                />
                                                            )
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
                                            {
                                                disableButton && !getFirstCategory && !getSecondCategory && !getLastCategory ?
                                                    <button className="flex justify-center bg-primary/60 px-8 py-2 rounded-md font-medium text-gray" disabled>
                                                        Update
                                                    </button>
                                                    :
                                                    <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmit}>
                                                        Update
                                                    </button>
                                            }
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


