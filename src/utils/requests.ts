export const requestOCRReader = async (queue: string[]) => {
  if (!process.env.REACT_APP_OCR_READER_URL) throw 'OCR reader url not defined';

  const response = await fetch(process.env.REACT_APP_OCR_READER_URL, {
    method: 'POST',
    referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images: queue })
  });

  const data = await response.json();
  return data.text;
};
