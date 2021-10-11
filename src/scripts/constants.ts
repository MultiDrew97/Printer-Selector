export const PRINTER_SCRIPT = '\\\\ad-fs01\\it\\apps\\scripts\\printers\\printers.ps1'
export const PRINTER_LOCATION = `'\\\\ad-vps-01\\{0}'`
export const SCRIPT = `powershell -ExecutionPolicy Bypass -Command "& '${PRINTER_SCRIPT}' -A -P @({0})"`
export const BATCH_NAME = 'Add_Printer.bat'
