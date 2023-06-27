import styled from "styled-components";
import { ToastContainer } from "react-toastify";

const StyledToastContainer = styled(ToastContainer)`
  // https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
  &&&.Toastify__toast-container {
  }
  .Toastify__toast {

  }
  .Toastify__toast-body {
  }
  .Toastify__toast-body::before {
    color: purple;
  }
  .Toastify__progress-bar {
    background-color: #c35cf7;
  }
`;

export default StyledToastContainer;