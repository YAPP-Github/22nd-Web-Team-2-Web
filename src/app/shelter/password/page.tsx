'use client';

import Button from '@/components/common/Button/Button';
import EmphasizedTitle from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextField from '@/components/common/TextField/TextField';
import { H2 } from '@/components/common/Typography';
import useHeader from '@/hooks/useHeader';
import useToast from '@/hooks/useToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { passWordFindValidation } from '../utils/shelterValidaion';
import * as styles from './styles.css';
import useDebounceValidator from '@/hooks/useDebounceValidator';

const helperMessage = `등록한 파트너 계정의 이메일을 입력해주세요.
비밀번호를 재설정할 수 있는 링크를 보내드립니다.`;

interface findPassFormValue {
  email: string;
}

export default function ShelterPassword() {
  const {
    register,
    formState: { errors },
    setError
  } = useForm<findPassFormValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(passWordFindValidation)
  });

  const setHeader = useHeader({ title: '비밀번호 찾기' });
  const toastOn = useToast();

  useEffect(() => {
    setError('email', {
      type: 'focus',
      message: '필수항목 입니다.'
    });
  }, [setError]);

  const debouncedValidator = useDebounceValidator({
    boolVal: false,
    fieldName: 'email',
    setError: setError,
    message: '입력하신 이메일 계정이 없습니다. 다시 한번 확인해주세요.'
  });

  const handleSendPassLink = async () => {
    try {
      toastOn('비밀번호 재설정 링크가 전송되었습니다.');
    } catch (error) {
      toastOn('비밀번호 재설정 링크를 전송하는 데 실패했습니다.');
    }
  };

  return (
    <>
      <div className={styles.titleWrapper}>
        <EmphasizedTitle>
          <H2>비밀번호를 잊으셨나요?</H2>
          <H2>등록하신 이메일을 입력해주세요</H2>
        </EmphasizedTitle>
      </div>
      <TextField
        maxLength={10}
        helper={helperMessage}
        placeholder="등록하신 이메일을 입력해주세요."
        {...register('email')}
        error={errors.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          register('email').onChange(e);
          debouncedValidator?.(e.target.value, 'EMAIL');
        }}
      />
      <Button
        style={{ marginTop: '47px' }}
        disabled={!isEmpty(errors)}
        onClick={handleSendPassLink}
      >
        비밀번호 재설정 링크 보내기
      </Button>
    </>
  );
}