export class Utils {
  /**
   * Format the given string using the arguments passed
   * @param formatString The string to use for the format
   * @param args The format arguments to use
   * @returns The formatted string
   */
  static format(formatString: string, ...args: any[]): string {
    for (let i = 0; i < args.length; i++) {
      formatString = formatString.replace(`{${i}}`, args[i])
    }

    return formatString
  }
}
