import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextField from '@/components/common/TextField/TextField';
import { H2, H3 } from '@/components/common/Typography';
import useBooleanState from '@/hooks/useBooleanState';
import useDebounceValidator from '@/hooks/useDebounceValidator';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { OnNextProps } from '../page';
import * as styles from './../styles.css';

type SingleCheckedKeys = 'over14' | 'terms' | 'privacy' | 'marketing';
type SingleCheckedState = Record<SingleCheckedKeys, boolean>;

export default function Account({ onNext }: OnNextProps) {
  const [isSheet, isOpenSheet, isCloseSheet] = useBooleanState();
  const {
    register,
    formState: { errors },
    watch,
    setError
  } = useFormContext();

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');

  const debouncedValidator = useDebounceValidator({
    fieldName: 'email',
    setError: setError,
    message: '이미 등록된 이메일입니다. 다시 한번 확인해주세요.'
  });

  useEffect(() => {
    if (emailValue?.length > 0) {
      debouncedValidator(emailValue, 'EMAIL');
    }
  }, [emailValue, debouncedValidator]);

  const areInputsFilled =
    Boolean(emailValue?.trim()) &&
    Boolean(passwordValue?.trim()) &&
    Boolean(passwordConfirmValue?.trim());

  const isInputError =
    Boolean(errors.email) ||
    Boolean(errors.password) ||
    Boolean(errors.passwordConfirm);

  const handleBottomSheet = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      isOpenSheet();
    },
    [isOpenSheet]
  );

  const [allChecked, setAllChecked] = useState(false);
  const [singleChecked, setsingleChecked] = useState<SingleCheckedState>({
    over14: false,
    terms: false,
    privacy: false,
    marketing: false
  });

  const handleAllChecked = useCallback(() => {
    setAllChecked(!allChecked);
    setsingleChecked({
      over14: !allChecked,
      terms: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked
    });
  }, [allChecked]);

  const handleSingleChecked = useCallback(
    (key: keyof SingleCheckedState) => {
      setsingleChecked({
        ...singleChecked,
        [key]: !singleChecked[key]
      });
    },
    [singleChecked]
  );

  const isButtonDisabled =
    !singleChecked.over14 || !singleChecked.terms || !singleChecked.privacy;

  return (
    <>
      <div className={styles.titleWrapper} style={{ marginBottom: '124px' }}>
        <EmphasizedTitle>
          <Line>파트너 활동을 위한</Line>
          <Line>계정을 생성해주세요.</Line>
        </EmphasizedTitle>
      </div>
      <TextField
        label="이메일"
        placeholder="이메일을 입력해주세요."
        {...register('email')}
        onBlur={() => {
          if (emailValue?.length > 0) {
            debouncedValidator(emailValue, 'EMAIL');
          }
        }}
        error={errors.email}
      />
      <TextField
        label="비밀번호"
        placeholder="영문, 숫자, 특수문자 2가지 조합 8~15자"
        type="password"
        {...register('password')}
        error={errors.password}
      />
      <TextField
        label="비밀번호 확인"
        placeholder="비밀번호를 한번 더 입력해주세요."
        type="password"
        {...register('passwordConfirm')}
        error={errors.passwordConfirm}
      />
      <Button
        disabled={isInputError || !areInputsFilled}
        onClick={handleBottomSheet}
        style={{ marginTop: '40px' }}
      >
        다음
      </Button>

      <BottomSheet isOpened={isSheet} onClose={isCloseSheet}>
        <div className={styles.bottomContent}>
          <H2>약관에 동의해주세요.</H2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.allCheck}>
              <CheckBox value={allChecked} onClick={handleAllChecked} />
              <H3>모두 동의</H3>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.checkBox}>
              <CheckBox
                value={singleChecked.over14}
                onClick={() => handleSingleChecked('over14')}
                label="(필수) 만 14세 이상 이용입니다."
              />

              <CheckBox
                value={singleChecked.terms}
                onClick={() => handleSingleChecked('terms')}
                label="(필수) 서비스 이용약관에 동의"
              />
              <CheckBox
                value={singleChecked.privacy}
                onClick={() => handleSingleChecked('privacy')}
                label="(필수) 개인정보 처리방침 동의"
              />
              <CheckBox
                value={singleChecked.marketing}
                onClick={() => handleSingleChecked('marketing')}
                label="(선택) 마케팅 수신 동의"
              />
            </div>
          </div>
          <Button
            disabled={isButtonDisabled}
            onClick={onNext}
            style={{ marginTop: '101px' }}
          >
            회원가입
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
