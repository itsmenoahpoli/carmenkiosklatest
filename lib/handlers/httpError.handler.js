import Swal from "sweetalert2";

const capitalizeStr = (str) => str[0].toUpperCase() + str.slice(1);

export const httpErrorHandler = (error) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Oooops, something went wrong. Please try again.",
    confirmButtonText: "Okay",
  });
  // if (error.response) {
  //   const { data } = error.response;

  //   if (Object.keys(data.errors).length > 0) {
  //     let errorsList = "";
  //     for (let e in data.errors) {
  //       errorsList += `<p className="text-muted">${capitalizeStr(e)} - ${
  //         data.errors[e]
  //       }</p>`;
  //     }

  //     Swal.fire({
  //       icon: "error",
  //       title: data.message,
  //       html: errorsList,
  //       confirmButtonText: "Okay",
  //     });
  //   }
  // }
};
