'use client';
import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/TextField/TextField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import * as styles from './styles.css';
import { Caption1 } from '@/components/common/Typography';
import TextArea from '@/components/common/TextField/TextArea';
import useShelterInfo from '@/api/shelter/admin/useShelterInfo';
import { isEmpty } from 'lodash';
import useUpdateEssentialInfo from '@/api/shelter/admin/useUpdateEssentialInfo';
import { useRouter } from 'next/navigation';
import AddressSearchBar from '@/components/shelter-edit/AddressSearchBar/AddressSearchBar';
import {
  ShelterEssentialInfoPayload,
  Address
} from '@/api/shelter/admin/essential-info';
import { formatPhone, removeDash } from '@/utils/formatInputs';

type FormValues = {
  name: string;
  phoneNumber: string;
  addressDetail: string;
  description: string;
};

const schema: yup.ObjectSchema<Partial<FormValues>> = yup
  .object()
  .shape({
    name: yup.string().required('보호소 이름을 입력해주세요'),
    phoneNumber: yup
      .string()
      .required('연락처를 입력해주세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, '유효한 연락처 형식이 아닙니다.'),
    addressDetail: yup.string().required('주소를 입력해주세요'),
    description: yup.string().max(300)
  })
  .required();

export default function ShelterEditRequiredPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  });

  const router = useRouter();
  const shelterQuery = useShelterInfo();
  const { mutateAsync: update } = useUpdateEssentialInfo();
  const [searchedAddress, setSearchedAddress] =
    useState<Omit<Address, 'addressDetail'>>();

  useEffect(() => {
    if (shelterQuery.isSuccess) {
      const data = shelterQuery.data;
      reset({
        name: data.name,
        phoneNumber: formatPhone(data.phoneNumber),
        addressDetail: data.address.addressDetail,
        description: data.description
      });
      setSearchedAddress(data.address);
    }
  }, [reset, shelterQuery.data, shelterQuery.isSuccess]);

  const handlePhoneNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      event.target.value = formatPhone(value);
    },
    []
  );

  const onSubmit = (data: FormValues) => {
    console.log('🔸 → onSubmit → data:', data);
    if (!shelterQuery.isSuccess || !searchedAddress) return;
    const payload: ShelterEssentialInfoPayload = {
      ...data,
      phoneNumber: removeDash(data.phoneNumber),
      address: {
        ...searchedAddress,
        addressDetail: data.addressDetail
      }
    };
    update({ payload }).then(() => router.back());
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <TextField
          label="보호소 이름"
          {...register('name')}
          error={errors.name}
        />
        <TextField
          label="보호소 연락처"
          {...register('phoneNumber', { onChange: handlePhoneNumberChange })} //onChange Register에 추가
          error={errors.phoneNumber}
        />
        <div>
          <Caption1 element={'label'} color="gray600">
            보호소 주소
          </Caption1>
          <AddressSearchBar />
          <TextField
            {...register('addressDetail')}
            error={errors.addressDetail}
          />
        </div>
        <TextArea
          height="128px"
          maxLength={300}
          label="보호소 소개 문구"
          {...register('description')}
          error={errors.description}
        />
      </div>
      <Button
        className={styles.button}
        disabled={!isEmpty(errors)}
        itemType="submit"
      >
        저장하기
      </Button>
    </form>
  );
}
