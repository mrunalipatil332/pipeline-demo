import React, { useState, useEffect, useRef } from 'react';
import { Form, ProgressBar, Badge, Image } from 'react-bootstrap';
import AWS from 'aws-sdk';
import axios from 'axios';
import swal from 'sweetalert';


export default function FileComponent(props) {
  const {
    label,
    id,
    onSelectFile,
    custom,
    title,
    inputClass,
    containerClass,
    errorMessage,
    showUploadProgress,
    multiple,
    isS3,
    s3config,
    uploadUrl,
    accept,
    payloadKey,
    optionalLabel,
    allowedFileSize,
    disabled,
    asterisk,
  } = props;

  const [fileUploadCount, updateFileUploadCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const ref = useRef();
  const S3_BUCKET = s3config.s3bucketName;
  const REGION = s3config.s3region;

  AWS.config.update({
    accessKeyId: s3config.s3accessId,
    secretAccessKey: s3config.s3secretKey,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  useEffect(() => {
    setSelectedFiles([]);
  }, [showUploadProgress]);

  const uploadFile = (file, index) => {
    if (isS3) {
      const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name,
      };

      myBucket
        .upload(params)
        .on('httpUploadProgress', (evt) => {
          const fileProgress = Math.round((evt.loaded / evt.total) * 100);
          selectedFiles[index].progress = fileProgress;
          setSelectedFiles([...selectedFiles]);
        })
        .send((err, data) => {
          selectedFiles[index].response = err ? err : data; // eslint-disable-line
          selectedFiles[index].error = err ? true : false; // eslint-disable-line
          setSelectedFiles([...selectedFiles]);
        });
    } else {
      if (!uploadUrl || !payloadKey) return;
      const formData = new FormData();
      formData.append(payloadKey, file);
      axios
        .post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (data) => {
            // Set the progress value to show the progress bar
            const fileProgress = Math.round((data.loaded / data.total) * 100);
            selectedFiles[index].progress = fileProgress;
            setSelectedFiles([...selectedFiles]);
          },
        })
        .then(
          (response) => {
            selectedFiles[index].response = response.data;
            setSelectedFiles([...selectedFiles]);
          },
          (err) => {
            selectedFiles[index].response = err.response.data;
            selectedFiles[index].error = true;
            setSelectedFiles([...selectedFiles]);
          }
        );
    }
  };

  const handleMultiFileInput = async (e) => {
    const allFiles = e.target.files;
    const arrFiles = [];
    for (let i = 0; i < allFiles.length; i++) { // eslint-disable-line
      arrFiles.push({
        file: allFiles[i],
        filename: allFiles[i].name,
        progress: 0,
      });
    }
    if (onSelectFile) onSelectFile({ status: 'pending', files: arrFiles });
    setSelectedFiles([...arrFiles]);
    updateFileUploadCount(fileUploadCount + 1);
  };

  const uploadFiles = () => {
    selectedFiles.map((file, index) => {
      uploadFile(file.file, index);
      return file;
    });
  };

  const returnResponse = () => {
    const pendingFiles = selectedFiles.filter(
      (file) => file.response === undefined
    );
    if (!pendingFiles.length && onSelectFile)
      onSelectFile({ status: 'success', files: selectedFiles });
  };

  useEffect(() => {
    uploadFiles();
  }, [fileUploadCount]); // eslint-disable-line

  useEffect(() => {
    returnResponse();
  }, [selectedFiles]); // eslint-disable-line

  const onError = () => {
    if (props.onError)
      props.onError(
        'file size is greater than specified size please upload less than given file size'
      );
  };

  const onDeleteHandler = (index) => {
    const deletedFiles = [];
    const ind = selectedFiles.splice(index, 1);
    selectedFiles &&
      selectedFiles.map((file) => {
        deletedFiles.push(file);
        return file;
      });
    if (ind) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this record?',
        icon: 'warning',
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then((result) => {
        if (result) {
          if (Number(deletedFiles.length) === 0) {
            ref.current.value = null;
          }
          setSelectedFiles(deletedFiles);
        }
      });
    }
  };

  return (
    <>
      <Form.Group className={containerClass}>
        <Form.Label>
          {title} <small>{optionalLabel}</small>{' '}
          <span style={{ color: 'red' }}>{asterisk}</span>{' '}
        </Form.Label>
        <Form.File
          id={id}
          ref={ref}
          disabled={disabled}
          className={`form-control ${inputClass}`}
          type="file"
          onChange={(e) => {
            let isValid = true;
            e &&
              e.files &&
              e.files.map((file) => {
                if (file.size > allowedFileSize) {
                  isValid = false;
                  return false;
                }

                return file;
              });
            if (!isValid) {
              ref.current.value = null;
              onError();
              return;
            }
            if (onSelectFile && !showUploadProgress) onSelectFile(e);
            if (showUploadProgress) handleMultiFileInput(e);
          }}
          label={label}
          custom={custom}
          multiple={multiple}
          accept={accept}
        />
        <p style={{ color: 'red' }}> {errorMessage} </p>
        {showUploadProgress && (
          <div className="upload-progress-container">
            {selectedFiles.map((file, fileIndex) => (
              <>
                <React.Fragment key={`upload-${fileIndex}`}>
                  <div className="file-progress-done d-flex align-items-start">
                    <div className="file-progress">
                      <span className="file-progress-name">
                        {file.filename}
                      </span>
                      <span>
                        <ProgressBar now={file.progress} striped />
                      </span>
                    </div>
                    <div className="progress-btn-wrapper">
                      {file.progress === 100 && file.response && (
                        <div className="file-progress-sucess">
                          {file.error ? (
                            <Badge variant="danger">Failed</Badge>
                          ) : (
                            <Badge variant="success">Success</Badge>
                          )}
                        </div>
                      )}
                      <Image
                        src="/images/delete.png"
                        className="ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteHandler(fileIndex);
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
               
              </>
            ))}
          </div>
        )}
      </Form.Group>
    </>
  );
}
