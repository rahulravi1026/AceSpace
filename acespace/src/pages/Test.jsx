import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/test-styles.css';

// function Test() {
//     useEffect(() => { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;});

//     const [selectedFile, setSelectedFile] = useState(null);
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
  
//     const onDrop = (acceptedFiles) => {
//       setSelectedFile(acceptedFiles[0]);
//     };

//     const goToPrevPage = () =>
//         setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

//     const goToNextPage = () =>
//         setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1, );

  
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//       onDrop,
//       accept: 'application/pdf',
//     });
  
//     const onDocumentLoadSuccess = ({ numPages }) => {
//       setNumPages(numPages);
//     };
  
//     return (
//       <div>
//         <div {...getRootProps()} className="dropzone">
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>Drop the PDF file here...</p>
//           ) : (
//             <p>Drag and drop a PDF file here, or click to select a file</p>
//           )}
//           {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//         </div>
//         {selectedFile && (
//           <div>
//             <nav>
// 				<button onClick={goToPrevPage}>Prev</button>
// 				<button onClick={goToNextPage}>Next</button>
// 				<p>
// 					Page {pageNumber} of {numPages}
// 				</p>
// 			</nav>
//               <Document
//                 file={this.file}
//                 onLoadSuccess={onDocumentLoadSuccess}
//               >
//                 <Page pageNumber={pageNumber} />
//               </Document>
//             </div>
//         )}
//       </div>
//     );
//   }

//   export default Test;

  function Test() {
    const [selectedFile, setSelectedFile] = useState(null);
  
    const onDrop = (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: '.pdf',
    });
  
    const openPdfFile = () => {
      if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        window.open(url, '_blank');
      }
    };
  
    return (
      <div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF file here...</p>
          ) : (
            <p>Drag and drop a PDF file here, or click to select a file</p>
          )}
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>
        {selectedFile && (
          <div>
            <button onClick={openPdfFile}>Open PDF</button>
          </div>
        )}
      </div>
    );
  }

  export default Test;