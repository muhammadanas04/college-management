/**
 * Abstract platform APIs so Tauri can swap implementations later.
 */

export const platform = {
  /**
   * Download a blob as a file. On the web, creates a temporary <a> and clicks it.
   * In Tauri, this will use the native save dialog.
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Storage abstraction. Uses localStorage on web.
   */
  storage: {
    get(key: string): string | null {
      return localStorage.getItem(key);
    },
    set(key: string, value: string): void {
      localStorage.setItem(key, value);
    },
    remove(key: string): void {
      localStorage.removeItem(key);
    },
  },
};
