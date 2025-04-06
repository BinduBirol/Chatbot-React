import Swal from 'sweetalert2';

export const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    showCancelButton: false,
    confirmButtonText: 'Close',
    confirmButtonColor: '#d33',
  });
};
