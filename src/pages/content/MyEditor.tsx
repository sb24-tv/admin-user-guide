import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from "react";
import APIService from "../../service/APIService.ts";
import { toast } from 'react-toastify';

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
class MyEditor extends React.Component<any,any> {
     notifyError = () => {
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
     notifyErrorImage = () => {
        toast.error('Allowed only image file', {
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
    private quill: any;
    
    handleImageSelect = () => {
        const input: any = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop();
            if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                const reader = new FileReader();
                const formData = new FormData();
                formData.append('image', file);
                try {
                    const response = await APIService.insertFormData('photo', formData);
                    const imageUrl = response.data.filenames[0];
                    reader.onload = () => {
                        const range = this.quill.getSelection();
                        this.quill.insertEmbed(range.index, 'image', `${getURL()}/public/images/${imageUrl}`);
                        this.quill.setSelection(range.index + 1);
                    };
                    
                    reader.readAsDataURL(file);
                } catch (error) {
                    this.notifyError();
                }
            }
            else {
                this.notifyErrorImage();
            }
        };
    };

    render() {
        return (
            <div>
                <ReactQuill
                    {...this.props}
                    modules={{
                        toolbar: {
                            container: [
                                [{ header: [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [
                                    { list: 'ordered' },
                                    { list: 'bullet' },
                                    { indent: '-1' },
                                    { indent: '+1' },
                                ],
                                ['link', 'image','video'],
                            ],
                            handlers: {
                                image: this.handleImageSelect,
                            },
                        },
                    }}
                    formats={[
                        'header',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'blockquote',
                        'list',
                        'bullet',
                        'indent',
                        'link',
                        'image',
                        "video",
                    ]}
                    ref={(el) => {
                        this.quill = el && el.getEditor();
                    }}
                />
            </div>
        );
    }
}

export default MyEditor;
