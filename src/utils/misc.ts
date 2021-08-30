export const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    const result = await callback(array[i], i, array);
    if (result === false) {
      break;
    }
  }
};

export const isNumber = (value: any) => !isNaN(Number(value));

export const createKey = () => '_' + Math.random().toString(36).substr(2, 9);
