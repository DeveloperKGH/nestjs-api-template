export const ValidationMessage: { [key: string]: any } = {
  email: {
    isEmpty: '이메일을 입력해주세요.',
    isEmail: '이메일 형식에 맞지 않습니다.',
  },
  password: {
    isPassword: '영문+숫자+기호 조합으로 8자 이상 입력해 주세요.',
  },
  page: {
    min: 'page는 1 이상이어야 합니다.',
  },
  size: {
    min: 'size는 1 이상이어야 합니다.',
  },
};
