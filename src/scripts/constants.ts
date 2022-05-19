export const PRINTER_SCRIPT = '\\\\GIATXFILES\\AG\\Apps\\scripts\\printers\\printers.ps1'
export const PRINTER_LOCATION = `'\\\\GIATXPRINT01\\{0}'`
export const SCRIPT = `powershell -ExecutionPolicy Bypass -Command "& '${PRINTER_SCRIPT}' -A -P @({0})"`
export const BATCH_NAME = 'Add_Printer.bat'
