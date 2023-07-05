import {Editor} from '@tinymce/tinymce-react';
import {useEffect, useRef, useState} from "react";
import APIService from "../../service/APIService.ts";
import {Navigate} from "react-router-dom";


const CreateContent = () => {
        // const editorRef = useRef(null);
        const titleRef = useRef<any>(null);
        const bodyRef = useRef<any>(null);
        const categoryRef = useRef<any>(null);
        const [requiredTitle, setRequiredTitle] = useState<boolean>(false);
        // const sizeLimit = limit ?? 50;
        // const [value, setValue] = useState('');
        // const [length, setLength] = useState(0);
        // const log = () => {
        //     if (editorRef.current) {
        //         console.log(editorRef.current.getContent());
        //     }
        // };
        const [category, setCategory] = useState([]);
        // const [title, setTitle] = useState<any>();

        useEffect(() => {
            APIService.get(`subcat`).then((response: any) => {
                if (response.status === 200) {
                    setCategory(response.data.data);
                }
            });
        }, []);

        console.log('this category', requiredTitle)
        const handleSubmit = async () => {
            console.log('this title', titleRef.current?.value)
            console.log('this category', categoryRef.current?.value)
            console.log('this body', bodyRef.current?.value)
            if (titleRef.current?.value === '') {
                setRequiredTitle(true);
                return;
            }
            const data = {
                title: titleRef.current?.value,
                categoryId: categoryRef.current?.value,
                body: bodyRef.current?.value
            };
            console.log('this data', data);
            APIService.post(`content`, data).then((response: any) => {
                if (response.data) {
                    // @ts-ignore
                    Navigate('/content');
                }
            }).catch(() => {
                console.log('create unsuccessful')
            })
        }

        return (
            <>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Create Content
                    </h2>
                </div>
                <div className="flex justify-between gap-5">
                    <div className="flex flex-col w-full">
                        <div
                            className="rounded-xl bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Title <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            name="title"
                                            ref={titleRef}
                                            className={`w-full rounded-md border bg-input py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input ${requiredTitle ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                        />
                                        {
                                            requiredTitle && <span className="text-meta-1 text-sm">Title is required</span>
                                        }
                                    </div>
                                    <div className="mb-6">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Content Detail
                                        </label>
                                        {/*<textarea*/}
                                        {/*    rows={6}*/}
                                        {/*    placeholder="Type your message"*/}
                                        {/*    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"*/}
                                        {/*></textarea>*/}
                                        <Editor
                                            // onInit={(evt, editor) => editorRef.current = editor}
                                            // value={value}
                                            // onInit={handleInit}
                                            // onEditorChange={handleUpdate}
                                            // onBeforeAddUndo={handleBeforeAddUndo}
                                            ref={bodyRef}
                                            initialValue="<p>This is the initial content of the editor.</p>"
                                            init={{
                                                height: 500,
                                                apiKey: 'jt1r00t0c59ovwybqzihrm9ubvrvmu55z4qgn9as0anqfs41',
                                                menubar: false,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar: 'undo redo | formatselect | ' +
                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-6/12">
                        <div
                            className="rounded-xl bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                            <div className="p-6.5">

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Select Category
                                    </label>
                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <select
                                            name="value"
                                            ref={categoryRef}
                                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                                            {
                                                category.map((item: any, index: number) => {
                                                    return (
                                                        <option value={item.id} key={index}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                              <svg
                                                  className="fill-current"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g opacity="0.8">
                                                  <path
                                                      fillRule="evenodd"
                                                      clipRule="evenodd"
                                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                      fill=""
                                                  ></path>
                                                </g>
                                              </svg>
                                            </span>
                                    </div>
                                </div>
                                <button
                                    className="flex justify-center bg-primary px-8 py-2 rounded-xl font-medium text-gray"
                                    onClick={handleSubmit}
                                >
                                    Create
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
;

export default CreateContent;
