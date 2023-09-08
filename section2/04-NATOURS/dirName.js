import url from 'url';

const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const dirName1 = url.fileURLToPath(new URL('.', import.meta.url));
export const dirName2 = url.fileURLToPath(new URL('.', import.meta.url));
export { dirName1 };
export default dirName;
