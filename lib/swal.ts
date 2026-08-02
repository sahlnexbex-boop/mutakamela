import Swal, { type SweetAlertIcon, type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2'

/** Brand-aligned defaults for admin CMS dialogs */
const base: SweetAlertOptions = {
  buttonsStyling: false,
  reverseButtons: true,
  focusCancel: true,
  heightAuto: false,
  customClass: {
    popup: 'swal-muta-popup',
    title: 'swal-muta-title',
    htmlContainer: 'swal-muta-html',
    confirmButton: 'swal-muta-confirm',
    cancelButton: 'swal-muta-cancel',
    denyButton: 'swal-muta-deny',
    actions: 'swal-muta-actions',
    icon: 'swal-muta-icon',
  },
}

export type ConfirmOptions = {
  title?: string
  text?: string
  confirmText?: string
  cancelText?: string
  /** Danger-style confirm (delete / destructive) */
  danger?: boolean
  icon?: SweetAlertIcon
}

/** Confirm dialog — resolves true if user confirmed */
export async function swalConfirm(options: ConfirmOptions = {}): Promise<boolean> {
  const {
    title = 'Are you sure?',
    text,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    icon = danger ? 'warning' : 'question',
  } = options

  const result: SweetAlertResult = await Swal.fire({
    ...base,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      ...base.customClass,
      confirmButton: danger ? 'swal-muta-confirm swal-muta-confirm-danger' : 'swal-muta-confirm',
    },
  })

  return result.isConfirmed
}

/** Simple info / success / error alert */
export async function swalAlert(options: {
  title?: string
  text?: string
  icon?: SweetAlertIcon
  confirmText?: string
}): Promise<void> {
  const {
    title = 'Notice',
    text,
    icon = 'info',
    confirmText = 'OK',
  } = options

  await Swal.fire({
    ...base,
    title,
    text,
    icon,
    confirmButtonText: confirmText,
    showCancelButton: false,
  })
}

/** Toast-style lightweight feedback */
export function swalToast(
  title: string,
  icon: SweetAlertIcon = 'success',
): void {
  void Swal.fire({
    ...base,
    toast: true,
    position: 'bottom',
    title,
    icon,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: {
      ...base.customClass,
      popup: 'swal-muta-popup swal-muta-toast',
    },
  })
}

export { Swal }
