/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Generates an SVG string based on the user's prompt.
 * key: Calls the server-side API to protect the API key.
 */
export const generateSvgFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate SVG.");
    }

    const data = await response.json();
    return data.svg;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate SVG.");
  }
};
