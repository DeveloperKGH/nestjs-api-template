/*
    존재여부 체크 string, number, null, undefined, array, map, object
    [] => true
    {} => true
    '' => true
    null => true
    undefined => true
*/
export const isEmpty = (value: unknown): boolean => {
  if (value === null) return true;
  if (typeof value === 'undefined') return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length < 1) return true;
  if (typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1) return true;
  if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) return true;
  return false;
};

export const isNotEmpty = (value: any): boolean => !isEmpty(value);

export const sleep = (ms: number) => {
  return new Promise(r => {
    setTimeout(r, ms);
  });
};
