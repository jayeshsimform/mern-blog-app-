import React, { useEffect, useRef, useState } from 'react';

import Button from '../Button/Button';
import './ImageUpload.scss';

const ImageUpload = ({
    id,
    center,
    onInput = () => { }
}) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])

    const pickedHandler = event => {
        let pickFile;
        let fileIsValid = isValid
        if (event.target.files && event.target.files.length !== 0) {
            pickFile = event.target.files[0];
            setFile(pickFile);
            setIsValid(true);
            fileIsValid = true;
        }
        else {
            setIsValid(false)
        }

        onInput(id, pickFile, fileIsValid)
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form--control">
            <input
                id={id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please Pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
        </div>
    );
};

export default ImageUpload;